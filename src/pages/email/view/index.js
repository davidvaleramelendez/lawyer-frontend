/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

// ** Store & Actions
import {
  getMailDetail,
  markEmailTrash,
  createEmailReply,
  clearEmailMessage,
  updateEmailLoader,
  resetMailDetailItem,
  setComposeAttachments,
  createEmailAttachment,
  deleteEmailAttachment,
  deleteMultipleEmailAttachment
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
  X,
  Paperclip,
  ChevronDown
} from 'react-feather'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Table,
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Utils
import {
  setInnerHtml,
  isUserLoggedIn,
  getWebPreviewUrl,
  getTransformDate
} from '@utils'

// ** Constant
import {
  root,
  adminRoot
} from '@constant/defaultValues'

// ** Third Party Components
import classnames from 'classnames'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

// ** Custom Components
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'

// ** Styles
import '@styles/react/apps/app-email.scss'
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const EmailDetailView = () => {
  // ** Hooks
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  const { id } = useParams()
  const search = useLocation().search
  const emailGroupId = new URLSearchParams(search).get('emailGroupId')

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.email)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [showReplies, setShowReplies] = useState(false)
  const [replySection, setReplySection] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [editorHtmlContent, setEditorHtmlContent] = useState("")
  const [editorStateContent, setEditorStateContent] = useState(null)

  // ** Handle show replies, go back and reply section  click functions
  const handleShowReplies = (event) => {
    event.preventDefault()
    setShowReplies(true)
  }

  /* show, hide reply section */
  const handleReplySection = (event) => {
    if (event) {
      event.preventDefault()
    }

    setEditorHtmlContent("")
    setEditorStateContent(null)
    setReplySection(!replySection)
    if (uploadedFiles && uploadedFiles.length) {
      const attchIds = uploadedFiles.map((t) => t.id)
      setUploadedFiles([])
      dispatch(setComposeAttachments([]))
      dispatch(deleteMultipleEmailAttachment({ ids: attchIds }))
    }
  }

  // ** Get email on mount based on id
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/email`)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(resetMailDetailItem())
      dispatch(getMailDetail({ id: id, payload: { email_group_id: emailGroupId, type: "email" } }))
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearEmailMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }

    /* Updating uploaded files */
    if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
      setUploadedFiles(store.attachments)
    }

    /* Updating editor data in detail page files */
    if (store && store.actionFlag && store.actionFlag === "REPLIED") {
      setEditorHtmlContent("")
      setUploadedFiles(store.attachments)
      setEditorStateContent(null)
      dispatch(setComposeAttachments([]))
    }

    /* Navigate to email list */
    if (store && store.actionFlag && store.actionFlag === "TRASH_MAIL") {
      navigate(`${adminRoot}/email`)
    }
  }, [store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

  /* Swal Alert */
  const onAlertMessage = (title, text, icon) => {
    MySwal.fire({
      title: title ?? 'File limit exceeded!',
      text: text ?? 'File uploading size exceeded!',
      icon: icon ?? 'warning',
      showCancelButton: false,
      confirmButtonText: 'Okay',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
      }
    })
  }

  /* Deleting uploaded files */
  const onFileRemove = (event, id) => {
    if (event) {
      event.preventDefault()
    }

    const fileArray = [...uploadedFiles]
    const index = fileArray.findIndex(x => x.id === id)
    if (index !== -1) {
      fileArray.splice(index, 1)
      dispatch(deleteEmailAttachment({ id: id }))
    }

    setUploadedFiles([...fileArray])
  }

  // Files converting to base64
  const onFileChange = (event) => {
    event.preventDefault()
    const result = [...event.target.files]
    let fileFlag = false
    const fileArray = []

    if (result && result.length) {
      const fileSize = result.reduce(function (prev, file) { return prev + file.size }, 0)
      const fileSizeKiloBytes = fileSize / 1024
      const uploadLimit = process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE * 1024
      if (fileSizeKiloBytes > uploadLimit) {
        event.target.value = ""
        onAlertMessage(T('File limit exceeded!'), `${T('Please upload max')} ${process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE} mb ${T('files')}!`, 'warning')
        return
      }

      result.map(((file, index) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onloadend = async () => {
          const res = await fileReader.result
          let fileName = file.name || ""
          let extension = ""
          if (fileName) {
            fileName = fileName.split('.')
            if (fileName && fileName.length > 0) {
              extension = fileName[fileName.length - 1]
            }
          }
          fileArray.push({ extension: extension, file: res })
          fileFlag = false

          if (result.length - 1 === index) {
            fileFlag = true
          }

          let ids = []
          if (uploadedFiles && uploadedFiles.length) {
            ids = uploadedFiles.map((t) => t.id)
          }

          if (fileFlag) {
            event.target.value = ""
            dispatch(updateEmailLoader(false))
            dispatch(createEmailAttachment({ attachment: fileArray, type: "email", ids: ids }))
          }
        }
      }))
    }
  }

  const handleEditorStateChange = (state) => {
    setEditorStateContent(state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  // ** Renders Attachments
  const renderAttachments = (attachments) => {
    return attachments.map((item, index) => {
      return (
        <a
          key={`${index}_${item.name}`}
          href={renderFileWebUrlPreview(item.path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
          target="_blank"
          className={classnames({
            'mb-50': index + 1 !== attachments.length
          })}
        >
          {/* <img src={item.thumbnail} alt={item.fileName} width='16' className='me-50' /> */}
          <span className='text-muted fw-bolder align-text-top'>{item.name}</span>
        </a>
      )
    })
  }

  // ** Renders Messages
  const renderMessage = (obj, index) => {
    return (
      <Row>
        <Col sm={12}>
          <Card className={`${index % 2 === 1 ? 'odd-even-reply' : ''}`}>
            <CardHeader className='email-detail-head border-bottom'>
              <div className='user-details d-flex justify-content-between align-items-center flex-wrap'>
                <div className='mail-items'>
                  <h5 className='mb-0'>{obj.sender && obj.sender.name}</h5>
                  <UncontrolledDropdown className='email-info-dropup'>
                    <DropdownToggle className='font-small-3 text-muted cursor-pointer' tag='span'>
                      <span className='me-25'>{obj.sender && obj.sender.email}</span>
                      <ChevronDown size={17} />
                    </DropdownToggle>
                    <DropdownMenu>
                      <Table className='font-small-3' size='sm' borderless>
                        <tbody>
                          <tr>
                            <td className='text-end text-muted align-top'>From:</td>
                            <td>{obj.sender && obj.sender.email}</td>
                          </tr>

                          <tr>
                            <td className='text-end text-muted align-top'>To:</td>
                            <td>{obj.receiver && obj.receiver.email}</td>
                          </tr>

                          <tr>
                            <td className='text-end text-muted align-top'>Date:</td>
                            {obj && obj.date ? (
                              <td>
                                {getTransformDate(obj.date, "DD-MM-YYYY HH:mm:ss")}
                              </td>
                            ) : null}
                          </tr>
                        </tbody>
                      </Table>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>

              <div className='mail-meta-item d-flex align-items-center'>
                <small className='mail-date-time text-muted'>
                  {obj && obj.date ? getTransformDate(obj.date, "DD-MM-YYYY HH:mm:ss") : null}
                </small>
              </div>
            </CardHeader>

            <CardBody className='mail-message-wrapper pt-2'>
              {obj && obj.body ? (setInnerHtml(obj.body, "mail-message")) : null}
            </CardBody>

            {obj.attachment && obj.attachment.length ? (
              <CardFooter>
                <div className='mail-attachments'>
                  <div className='d-flex align-items-center mb-1'>
                    <Paperclip size={16} />
                    <h5 className='fw-bolder text-body mb-0 ms-50'>{obj.attachment.length} Attachment</h5>
                  </div>
                  <div className='d-flex flex-column'>{renderAttachments(obj.attachment)}</div>
                </div>
              </CardFooter>
            ) : null}
          </Card>
        </Col>
      </Row>
    )
  }

  // ** Renders Replies
  const renderReplies = (replies) => {
    if (replies && replies.length) {
      return replies.map((item, index) => (
        <Fragment key={`replies_${index}`}>
          {(index === replies.length - 1 || showReplies) ? (
            renderMessage(item, showReplies ? index : 0)
          ) : null}
        </Fragment>
      ))
    }
  }

  /* Mail move to trash */
  const handleDeleteMail = (event) => {
    if (event) {
      event.preventDefault()
    }

    MySwal.fire({
      title: 'Are you sure?',
      text: "You can restore from trash!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(markEmailTrash({ emailIds: [{ id: store.currentMailItem.mail, type: 'both' }] }))
      }
    })
  }

  /* Send reply with attachment */
  const handleSendReply = (event) => {
    if (event) {
      event.preventDefault()
    }

    if (store.currentMailItem && store.currentMailItem.mail.id) {
      const replyData = {
        id: store.currentMailItem.mail.id,
        email_group_id: store.currentMailItem.mail.email_group_id,
        type: "email"
      }

      if (editorHtmlContent) {
        replyData.message = editorHtmlContent
      }

      if (uploadedFiles && uploadedFiles.length) {
        replyData.attachment_ids = uploadedFiles.map((t) => t.id)
      }

      if (replyData && replyData.id && editorHtmlContent) {
        dispatch(updateEmailLoader(false))
        dispatch(createEmailReply(replyData))
      }
    }
  }

  return store ? (
    <div className="d-flex justify-content-center p-4">
      <div className="email-app-details w-75">
        {store.currentMailItem && store.currentMailItem.mail ? (
          <Fragment>
            <Card>
              <CardHeader className="email-detail-head">
                <div className="email-header-left d-flex align-items-center">
                  <h4 className="email-subject">{(store.currentMailItem.mail && store.currentMailItem.mail.subject) || ""}</h4>
                </div>
              </CardHeader>
            </Card>

            {/* <CardBody> */}
            {store.currentMailItem && store.currentMailItem.replies && store.currentMailItem.replies.length ? (
              <Fragment>
                {(store.currentMailItem.replies && store.currentMailItem.replies.length - 1) && showReplies === false ? (
                  <Row className="mb-1">
                    <Col sm={12}>
                      <a className="fw-bold" href="/" onClick={handleShowReplies}>
                        View {store.currentMailItem.replies.length - 1} Earlier Messages
                      </a>
                    </Col>
                  </Row>
                ) : null}

                {renderReplies(store.currentMailItem.replies)}
              </Fragment>
            ) : null}

            {store.currentMailItem && store.currentMailItem.mail ? (
              renderMessage(store.currentMailItem.mail, showReplies ? (store.currentMailItem.replies && store.currentMailItem.replies.length) || 0 : 1)
            ) : null}

            {!replySection ? (
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-0">
                          <Button
                            type="button"
                            color="primary"
                            className="me-1"
                            onClick={handleReplySection}
                          >
                            Reply
                          </Button>

                          {store.currentMailItem && store.currentMailItem.mail && !store.currentMailItem.mail.is_trash ? (
                            <Button
                              type="button"
                              color="danger"
                              onClick={handleDeleteMail}
                            >
                              Delete
                            </Button>
                          ) : null}
                        </h5>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : null}

            {replySection ? (
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      {!store.loading ? (
                        <DotPulse
                          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                        />
                      ) : null}

                      <Col sm={12}>
                        <Row>
                          <h2 className="mb-1">Answers</h2>
                          <div id="message-editor">
                            <Editor
                              toolbarClassName="rounded-0"
                              wrapperClassName="toolbar-bottom"
                              editorClassName="rounded-0 border-1"
                              toolbar={{
                                options: ["inline", "textAlign"],
                                inline: {
                                  inDropdown: false,
                                  options: ["bold", "italic", "underline", "strikethrough"]
                                }
                              }}
                              editorState={editorStateContent}
                              onEditorStateChange={handleEditorStateChange}
                            />
                          </div>
                        </Row>
                      </Col>

                      {uploadedFiles && uploadedFiles.length ? <>
                        <Col sm={12}>
                          <div className="email-attachments mt-1 mb-1">
                            {uploadedFiles.map((item, index) => {
                              return (
                                <div className="inline" key={`attachment_${index}`}>
                                  <Paperclip className="cursor-pointer ms-50 me-1" size={17} />

                                  {item && item.path ? (
                                    <a
                                      target="_blank"
                                      className="me-1"
                                      href={renderFileWebUrlPreview(item.path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                                    >
                                      {item.name}
                                    </a>
                                  ) : null}

                                  <a
                                    href={`${adminRoot}/email`}
                                    onClick={(event) => onFileRemove(event, item.id)}
                                  >
                                    <X
                                      size={17}
                                      color="#FF0000"
                                      className="cursor-pointer ms-50"
                                    />
                                  </a>
                                </div>
                              )
                            })}
                          </div>
                        </Col>
                      </> : null}

                      <Col sm={12}>
                        <Row className="mt-2">
                          <div className="d-flex justify-content-between">
                            <h5 className="mb-0">
                              <Button
                                type="button"
                                color="primary"
                                className="me-1"
                                disabled={!store.loading}
                                onClick={handleSendReply}
                              >
                                Send
                              </Button>

                              <Button
                                type="button"
                                color="warning"
                                className="me-1"
                                onClick={handleReplySection}
                                disabled={!store.loading}
                              >
                                Cancel
                              </Button>

                              <Label className="mb-0" for="attach-email-item">
                                <Paperclip className="cursor-pointer ms-50" size={17} />
                                <input
                                  hidden
                                  multiple
                                  type="file"
                                  name="attach-email-item"
                                  id="attach-email-item"
                                  disabled={!store.loading}
                                  onChange={(event) => onFileChange(event)}
                                />
                              </Label>
                            </h5>
                          </div>
                        </Row>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : null}
            {/* </CardBody> */}
            {/* </Card> */}
          </Fragment>
        ) : null}
      </div>
    </div>
  ) : null
}

export default EmailDetailView
