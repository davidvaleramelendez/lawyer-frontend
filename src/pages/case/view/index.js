/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import {
  handleContentWidth
} from '@store/layout'

import moment from "moment"

// ** Store & Actions
import {
  closeCase,
  getCaseView,
  getCaseEmails,
  toggleCompose,
  replyCaseEmail,
  getCaseLetters,
  shareCaseRecord,
  getCaseDocuments,
  clearCaseMessage,
  deleteCaseLetter,
  statusCaseLetter,
  updateCaseLoader,
  getNoteCaseRecords,
  getTimeCaseRecords,
  statusCaseDocument,
  createTimeCaseRecord,
  updateSelectedDetails,
  createEmailAttachment,
  deleteEmailAttachment,
  setComposeAttachments,
  updateCaseEmailItemsData
} from '../store'
import {
  getVoiceRecordingList,
  markDoneVoiceRecording
} from '@src/pages/voiceRecording/store'
import { getMailDetail } from '@src/pages/email/store'
import { getLetterTemplateList } from '@src/pages/letterTemplate/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Constants
import {
  adminRoot,
  CONTINUE_MODAL
} from '@constant/defaultValues'
import {
  letterItem,
  caseDocItem
} from '@constant/reduxConstant'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Input,
  Table,
  Button,
  CardBody,
  Collapse,
  ListGroup,
  CardTitle,
  CardHeader,
  DropdownMenu,
  ListGroupItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Icons Import
import {
  X,
  Eye,
  Flag,
  Home,
  Mail,
  Star,
  User,
  Type,
  Edit,
  Send,
  Check,
  Phone,
  Trash2,
  EyeOff,
  Calendar,
  Paperclip,
  ChevronDown,
  CornerUpRight
} from 'react-feather'

// ** Utils
import {
  setInnerHtml,
  getTimeCounter,
  setTimeCounter,
  isUserLoggedIn,
  getWebPreviewUrl,
  getTransformDate,
  getCaseRecordedVoice,
  setCaseRecordedVoice
} from '@utils'

// ** Custom Components
import CardDetails from './CaseDetails'
import Avatar from '@components/avatar'
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import classnames from 'classnames'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

// Modals
import ModalCaseLetter from '../modals/ModalCaseLetter'
import ModalComposeMail from '../modals/ModalComposeMail'
import ModalCaseDocument from '../modals/ModalCaseDocument'
import ModalCaseNoteFile from '../modals/ModalCaseNoteFile'
import ModalEditCaseClient from '../modals/ModalEditCaseClient'
import ModalEditCaseOpponent from '../modals/ModalEditCaseOpponent'
import ModalCaseTimeTracking from '../modals/ModalCaseTimeTracking'
import TerminalVoiceRecording from '../modals/TerminalVoiceRecording'
import ModalCaseVoiceRecording from '../modals/ModalCaseVoiceRecording'
import TerminalVoiceRecordedDetail from '../modals/TerminalVoiceRecordedDetail'
import TerminalCaseTimeTrackingCounter from '../modals/TerminalCaseTimeTrackingCounter'

// ** Image icons
import pdfPng from '@src/assets/images/icons/pdf.png'

// ** Translation
import { T } from '@localization'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/libs/editor/editor.scss'

const CaseView = () => {
  // ** Hooks
  const { id } = useParams()
  const dispatch = useDispatch()

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const navigate = useNavigate()
  const store = useSelector((state) => state.cases)
  const voiceRecordingStore = useSelector((state) => state.voiceRecording)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [opponentModalOpen, setOpponentModalOpen] = useState(false)
  const [noteFileModalOpen, setNoteFileModalOpen] = useState(false)
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false)
  const [documentRowData, setDocumentRowData] = useState(caseDocItem)
  const [letterModalOpen, setLetterModalOpen] = useState(false)
  const [letterRowData, setLetterRowData] = useState(letterItem)
  const [timeTrackModalOpen, setTimeTrackModalOpen] = useState(false)
  const [timeCounterTerminalOpen, setTimeCounterTerminalOpen] = useState(false)
  const [voiceRecordingModalOpen, setVoiceRecordingModalOpen] = useState(false)
  const [voiceRecorderTerminalOpen, setVoiceRecorderTerminalOpen] = useState(false)
  const [voiceRecordedTerminalOpen, setVoiceRecordedTerminalOpen] = useState(false)

  /* Collapse toggle */
  const [isCollapseOpen, setIsCollapseOpen] = useState('')
  const [mailCollapse, setMailCollapse] = useState('')
  const [replyToggleCollapse, setReplyToggleCollapse] = useState('')
  /* /Collapse toggle */

  /* Reply editor */
  const [editorHtmlContent, setEditorHtmlContent] = useState("")
  const [editorStateContent, setEditorStateContent] = useState(null)
  /* /Reply editor */
  const [uploadedFiles, setUploadedFiles] = useState([])

  /* Table collapse */
  const handleCollapseAction = (value) => {
    if (isCollapseOpen === value) {
      setIsCollapseOpen('')
      return false
    }

    setIsCollapseOpen(value)
  }
  /* /Table collapse */

  /* Email history collapse */
  const handleMailCollapseAction = (value, mailData = null) => {
    setReplyToggleCollapse('')
    setEditorStateContent(null)
    setEditorHtmlContent('')
    if (mailCollapse === value) {
      setMailCollapse('')
      return false
    }

    setMailCollapse(value)
    if (mailData && mailData.id && !mailData.is_read) {
      const caseEmailItems = [...store.caseEmailItems]
      const index = caseEmailItems.findIndex((x) => x.id === mailData.id)
      if (index !== -1) {
        caseEmailItems[index] = { ...caseEmailItems[index], is_read: true }
      }

      dispatch(updateCaseEmailItemsData(caseEmailItems))
      dispatch(getMailDetail({ id: mailData.id, payload: { email_group_id: mailData.email_group_id, type: "email" } }))
    }
  }

  /* Reply collapse */
  const handleReplyCollapseAction = (value) => {
    if (replyToggleCollapse === value) {
      setReplyToggleCollapse('')
      setEditorStateContent(null)
      setEditorHtmlContent('')
      return false
    }

    setReplyToggleCollapse(value)
  }
  /* /Reply collapse */
  /* /Email history collapse */

  const handleEditorStateChange = (state) => {
    setEditorStateContent(state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }

  /* Detail view of case voice recording in terminal */
  const terminalDetailVoiceRecording = (data) => {
    setCaseRecordedVoice({ ...data, terminal: "DETAIL_VIEW" })
    setVoiceRecordedTerminalOpen(true)
  }

  const onCheckVoiceRecordedItem = (key) => {
    const voiceItem = getCaseRecordedVoice()
    if (voiceItem && (voiceItem.terminal === key)) {
      setVoiceRecordedTerminalOpen(true)
      return true
    }

    return false
  }

  const closeRecordedDetailViewTerminal = () => {
    setVoiceRecordedTerminalOpen(false)
    setCaseRecordedVoice()
  }
  /* /Detail view of case voice recording in terminal */


  // Check TimeCounterModal 
  useEffect(() => {
    const time_modal_status = getTimeCounter().status
    const time_completed_status = getTimeCounter().completed
    if (time_modal_status === true) {
      setTimeCounterTerminalOpen(true)
    }
    if (time_completed_status === true) {
      setTimeCounterTerminalOpen(true)
    }
  }, [])

  /* Format Details of record */
  const onRecordCloseClick = () => {
    dispatch(handleContentWidth('boxed'))
    dispatch(updateSelectedDetails(null))
  }
  /* /Format Details of record */

  // ** Get mount
  useEffect(() => {
    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/case`)
    }

    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getCaseView(id))
      dispatch(getLetterTemplateList({}))
      onCheckVoiceRecordedItem("DETAIL_VIEW")
      dispatch(getCaseLetters({ case_id: id }))
      dispatch(getCaseDocuments({ case_id: id }))
      dispatch(getNoteCaseRecords({ CaseID: id }))
      dispatch(getVoiceRecordingList({ case_id: id }))
      dispatch(getCaseEmails({ case_id: id }))
      dispatch(getTimeCaseRecords(id))
      setLoadFirst(false)
    }

    if (store && store.actionFlag && (store.actionFlag === "LETTER_DELETED")) {
      onRecordCloseClick()
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearCaseMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }

    /* If contact deleted then redirected */
    if (store.actionFlag && store.actionFlag === "DELETED") {
      navigate(`${adminRoot}/case`)
    }

    /* Updating uploaded files */
    if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
      setUploadedFiles(store.attachments)
    }

    /* Updating editor data in detail page files */
    if (store && store.actionFlag && store.actionFlag === "CASE_MAIL_REPLIED") {
      setReplyToggleCollapse('')
      setEditorHtmlContent("")
      setEditorStateContent(null)
      setUploadedFiles(store.attachments)
      dispatch(setComposeAttachments([]))
    }
  }, [store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>>> ", store)

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  /* Delete case */
  const onDeleteFile = (caseId) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Close this Case?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(closeCase(caseId))
      }
    })
  }

  /* Case Compose Mail */
  const onSendCaseMail = () => {
    dispatch(toggleCompose())
  }
  /* /Case Compose Mail */

  /* Change note history done status */
  const onShareCaseRecord = (id) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Share this case record?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(shareCaseRecord(id))
      }
    })
  }

  /* Change document done status */
  const onDocumentDone = (id) => {
    // console.log("onDocumentDone >>> ", id)
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Done this document?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(statusCaseDocument(id))
      }
    })
  }

  /* Change letter done status */
  const onLetterDone = (id) => {
    // console.log("onLetterDone >>> ", id)
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Done this letter?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(statusCaseLetter(id))
      }
    })
  }

  /* Delete case letter */
  const onDeleteLetter = (lttrId) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You won't be able to revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteCaseLetter(lttrId))
      }
    })
  }
  /* /Delete case letter */

  /* Mark done voice recording */
  const handleMarkDone = (id) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to done this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes, done it!'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(markDoneVoiceRecording(id))
      }
    })
    /* Mark done voice recording */
  }

  /* Details of record at the right side */
  // const onRecordClick = (details, typeOf = "") => () => {
  //   details = { ...details, typeOf }
  //   dispatch(handleContentWidth('full'))
  //   dispatch(updateSelectedDetails(details))
  // }

  const handleTimeRecordStart = (values, caseId) => {
    const timeData = {
      CaseID: caseId,
      Subject: values.Subject,
      interval_time: values.interval_time * 60
    }
    const startTime = moment(new Date()).format('hh:mm:ss')

    setTimeCounter({
      ...timeData,
      current_time: 0,
      start_time: startTime,
      manual: CONTINUE_MODAL.INITIAL_STATE,
      status: true
    })
    dispatch(createTimeCaseRecord({
      ...timeData,
      IsShare: 0
    }))
    setTimeCounterTerminalOpen(true)
  }

  /* Check case permission */
  const checkPermissionAccess = (id) => {
    if (store) {
      if (store.authUserItem && store.authUserItem.id) {
        if (store.authUserItem.permission && store.authUserItem.permission.length) {
          const index = store.authUserItem.permission.findIndex((x) => x.permission_id === id)
          if (index !== -1) {
            return true
          }
        }

        if (store.caseItem && store.caseItem.LaywerID === store.authUserItem.id) {
          return true
        }

        return false
      }
      return false
    }

    return false
  }
  /* /Check case permission */

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

  /* Files converting to base64 */
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
            dispatch(updateCaseLoader(false))
            dispatch(createEmailAttachment({ attachment: fileArray, type: "email", ids: ids }))
          }
        }
      }))
    }
  }
  /* /Files converting to base64 */

  const handleCaseSendReply = (values) => {
    if (values) {
      const replyData = {
        id: values.id,
        case_id: id,
        email_group_id: values.email_group_id
      }

      if (store && store.caseItem && store.caseItem.user && store.caseItem.user.id) {
        replyData.email_to = store.caseItem.user.id
      }

      if (editorHtmlContent) {
        replyData.message = editorHtmlContent
      }

      if (uploadedFiles && uploadedFiles.length) {
        replyData.attachment_ids = uploadedFiles.map((t) => t.id)
      }

      if (replyData && replyData.id && editorHtmlContent) {
        dispatch(updateCaseLoader(false))
        dispatch(replyCaseEmail(replyData))
      }
    }
  }

  /* Renders Attachments */
  const renderAttachments = (attachments) => {
    if (attachments && attachments.length) {
      return attachments.map((item, index) => {
        return (
          <a
            key={`${index}_${item.name}`}
            href={renderFileWebUrlPreview(item.path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`} target="_blank"
            className={classnames({
              'mb-50': index + 1 !== attachments.length
            })}
          >
            <span className='text-muted fw-bolder align-text-top'>{item.name}</span>
          </a>
        )
      })
    }
  }
  /* /Renders Attachments */

  /* Renders email history */
  const renderEmailHistory = () => {
    if (store.caseEmailItems && store.caseEmailItems.length) {
      return (
        <ul className="timeline email-application">
          {store.caseEmailItems.map((mail, index) => (
            <li
              key={`mail-history-${index}`}
              className="timeline-item"
            >
              <span
                className="timeline-point timeline-point-primary cursor-pointer"
                onClick={() => handleMailCollapseAction(`parent-${mail.id}`, mail)}
              >
                <Mail size={14} />
              </span>
              <Card className={`${!mail.is_read ? 'bg-light' : ''}`}>
                <CardBody className="pb-0">
                  <div className='timeline-event'>
                    <div
                      className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1 cursor-pointer"
                      onClick={() => handleMailCollapseAction(`parent-${mail.id}`, mail)}
                    >
                      <h6 className="font-weight-bolder text-dark">
                        {(mail && mail.subject) || ""} {mail && mail.email_group && mail.email_group.length ? (
                          <span className="text-primary">({mail.email_group.length})</span>
                        ) : null}
                      </h6>


                      <span className="timeline-event-time" align="right">
                        {mail && mail.attachment && mail.attachment.length ? (
                          <span className="me-50">
                            <Paperclip size={16} />
                          </span>
                        ) : null}
                        {(mail && mail.date && getTransformDate(mail.date, "DD-MM-YYYY HH:mm:ss")) || ""}
                      </span>
                    </div>

                    <Collapse
                      className="pb-1"
                      isOpen={(mailCollapse === `parent-${mail.id}`) || false}
                    >
                      {mail && mail.email_group && mail.email_group.length ? (
                        <div className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                          <ListGroup className="w-100 mt-1" flush>
                            {mail.email_group.map((mailGroup, grpIndex) => (
                              <Fragment key={`mail-group-${grpIndex}`}>
                                <ListGroupItem className="list-group-item border-0">
                                  <div
                                    className={`case-card-collapse pb-1 ${grpIndex % 2 === 1 ? 'odd-even-reply' : ''}`}
                                  >
                                    <div className="border-bottom py-1">
                                      {grpIndex === mail.email_group.length - 1 ? (
                                        <CornerUpRight
                                          size={17}
                                          className="cursor-pointer float-end"
                                          onClick={() => handleReplyCollapseAction(`parent-child-reply-${mailGroup.id}`)}
                                        />
                                      ) : null}
                                      <h5 className="mb-0">{(mailGroup && mailGroup.sender && mailGroup.sender.name) || ""}</h5>
                                      <UncontrolledDropdown className='email-info-dropup'>
                                        <DropdownToggle className='font-small-3 text-muted cursor-pointer' tag='span'>
                                          <span className='me-25'>{(mailGroup && mailGroup.sender && mailGroup.sender.email) || ""}</span>
                                          <ChevronDown size={17} />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          <Table className='font-small-3' size='sm' borderless>
                                            <tbody>
                                              <tr>
                                                <td className='text-end text-muted align-top'>From:</td>
                                                <td>{(mailGroup && mailGroup.sender && mailGroup.sender.email) || ""}</td>
                                              </tr>

                                              <tr>
                                                <td className='text-end text-muted align-top'>To:</td>
                                                <td>{(mailGroup && mailGroup.receiver && mailGroup.receiver.email) || ""}</td>
                                              </tr>

                                              <tr>
                                                <td className='text-end text-muted align-top'>Date:</td>
                                                {mailGroup && mailGroup.date ? (
                                                  <td>
                                                    {getTransformDate(mailGroup.date, "DD-MM-YYYY HH:mm:ss")}
                                                  </td>
                                                ) : null}
                                              </tr>
                                            </tbody>
                                          </Table>
                                        </DropdownMenu>
                                      </UncontrolledDropdown>
                                    </div>

                                    <div className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1 mt-1 cursor-pointer">
                                      {mailGroup && mailGroup.body ? (setInnerHtml(mailGroup.body, "mail-message")) : null}
                                    </div>

                                    {mailGroup && mailGroup.attachment && mailGroup.attachment.length ? (
                                      <div className="border-top my-2">
                                        <div className='mail-attachments'>
                                          <div className='d-flex align-items-center my-1'>
                                            <Paperclip size={16} />
                                            <h5 className='fw-bolder text-body mb-0 ms-50'>{mailGroup.attachment.length} Attachment</h5>
                                          </div>

                                          <div className='d-flex flex-column'>
                                            {renderAttachments(mailGroup.attachment)}
                                          </div>
                                        </div>
                                      </div>
                                    ) : null}

                                  </div>
                                </ListGroupItem>

                                <Collapse
                                  className="pb-1"
                                  isOpen={(replyToggleCollapse === `parent-child-reply-${mailGroup.id}`) || false}
                                >
                                  <ListGroupItem
                                    id={`parent-child-reply-${mailGroup.id}`}
                                    className="list-group-item border-0"
                                  >
                                    <div className="case-card-collapse pb-1">
                                      {!store.loading ? (
                                        <DotPulse
                                          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                                        />
                                      ) : null}

                                      <h4 className="mb-1">Answers</h4>
                                      <div id="message-editor">
                                        <Editor
                                          id={`parent-child-reply-editor-${mailGroup.id}`}
                                          name={`parent-child-reply-editor-${mailGroup.id}`}
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
                                          defaultEditorState={editorStateContent}
                                          onEditorStateChange={handleEditorStateChange}
                                        />
                                      </div>

                                      {uploadedFiles && uploadedFiles.length ? (
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
                                                  href={`${adminRoot}/case/view/${id}`}
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
                                      ) : null}

                                      <div className="d-flex justify-content-between mt-2">
                                        <h5 className="mb-0">
                                          <Button
                                            type="button"
                                            color="primary"
                                            disabled={!store.loading}
                                            onClick={() => handleCaseSendReply(mailGroup)}
                                          >
                                            Send
                                          </Button>

                                          <Button
                                            type="button"
                                            color="warning"
                                            className="ms-1"
                                            onClick={() => handleReplyCollapseAction(`parent-child-reply-${mailGroup.id}`)}
                                            disabled={!store.loading}
                                          >
                                            Cancel
                                          </Button>

                                          <Label className="mb-0 ms-1" for="attach-email-item">
                                            <Paperclip className="cursor-pointer" size={17} />
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
                                    </div>
                                  </ListGroupItem>
                                </Collapse>
                              </Fragment>
                            ))}
                          </ListGroup>
                        </div>
                      ) : null}
                    </Collapse>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )
    }
  }
  /* /Renders email history */

  return (
    <div className='invoice-preview-wrapper case-detail-view'>
      <Row className='match-height'>
        <Col xl={`${store.selectedItem ? '7' : '12'}`} md={12} sm={12}>
          {/* Header */}
          <Row
            className={`invoice-preview ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder-glow'}`}
          >
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding'>
                  <Row>
                    <Col xl={6} md={6} sm={6} className='d-flex flex-column justify-content-between border-container-lg'>
                      <div>
                        <h4
                          className={`mb-25 ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                        >
                          {T('Details on file')} {store.caseItem && store.caseItem.CaseID}
                        </h4>
                      </div>
                    </Col>

                    <Col xl={6} md={6} sm={6}>
                      <div className='mt-md-0 mt-2'>
                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className="ms-1 invoice-date-title">{T("Lawyer")}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.laywer && store.caseItem.laywer.name}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Header */}

          {/* Client && Opponent detail */}
          <Row className='invoice-preview'>
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding'>
                  <Row>
                    {/* Client detail */}
                    <Col xl={6} md={6} sm={6} className={`${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder-glow'}`}
                    >
                      <div className='mt-md-0 mt-2'>
                        <div className="user-info">
                          <h4 className='mb-10'>{T("Client")}</h4>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>{T('Name')}</p>
                          <p
                            className={`me-2 invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.name}
                          </p>

                          {checkPermissionAccess(5) ? (
                            <Button.Ripple
                              color="flat-primary"
                              className={`btn-icon rounded-circle ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                              onClick={() => setEditModalOpen(true)}
                            >
                              <Edit size={16} />
                            </Button.Ripple>
                          ) : null}

                          <ModalEditCaseClient
                            open={editModalOpen}
                            toggleModal={() => setEditModalOpen(!editModalOpen)}
                            lawyers={store.laywerItems}
                            groups={store.typeItems}
                            caseData={store.caseItem}
                          />
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Check size={14} />
                          <p className='invoice-date-title ms-1'>{T('Stadium')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.Status}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Star size={14} />
                          <p className='invoice-date-title ms-1'>{T('Group')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.type && store.caseItem.type.CaseTypeName}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Flag size={14} />
                          <p className='invoice-date-title ms-1'>{T('Land')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.Country}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Phone size={14} />
                          <p className='invoice-date-title ms-1'>{T('Telephone')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.Contact}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Mail size={14} />
                          <p className='invoice-date-title ms-1'>{T('E-Mail')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.email}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Calendar size={14} />
                          <p className='invoice-date-title ms-1'>{T('Date')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.Date && getTransformDate(store.caseItem.Date, "DD.MM.YYYY")}
                          </p>
                        </div>

                        <div className="d-flex flex-wrap mt-1">
                          <Button.Ripple
                            outline
                            color="danger"
                            className={`btn-icon rounded-circle me-1 mb-1 ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                            onClick={() => onDeleteFile(id)}
                          >
                            <Trash2 size={16} />
                          </Button.Ripple>

                          <Button.Ripple
                            outline
                            color="primary"
                            className={`btn-icon rounded-circle mb-1 ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                            onClick={() => onSendCaseMail(store.caseItem)}
                          >
                            <Send size={16} />
                          </Button.Ripple>
                        </div>
                      </div>

                      <div className="d-flex align-items-center user-total-numbers">
                        <div className="d-flex align-items-center mr-2">
                          <div className="color-box bg-light-primary rounded-circle">
                            <Home size={32} />
                          </div>

                          <div className="ml-1 ms-1">
                            <h5 className="mb-0">{T("Address")}</h5>
                            <small
                              className={`${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-100'}`}
                            >
                              {store.caseItem && store.caseItem.user ? <>
                                {store.caseItem.user.Address ? `${store.caseItem.user.Address}, ` : ''}
                                {store.caseItem.user.Postcode ? `${store.caseItem.user.Postcode} ` : ''}
                                {store.caseItem.user.City}
                              </> : null}
                            </small>
                          </div>
                        </div>
                      </div>

                      <ModalComposeMail
                        caseId={id}
                        caseData={store.caseItem}
                        fighterData={store.fighterItem}
                      />
                    </Col>
                    {/* /Client detail */}

                    {/* Opponent detail */}
                    <Col xl={3} md={3} sm={3}>
                      <div className='mt-md-0 mt-2'>
                        <div className="user-info">
                          <h4 className='mb-10'>{T("Opponent")}</h4>
                        </div>
                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>{T('Name')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.name}</p>
                          <Button.Ripple
                            color="flat-primary"
                            className={`btn-icon rounded-circle ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                            onClick={() => setOpponentModalOpen(true)}
                          >
                            <Edit size={16} />
                          </Button.Ripple>
                          <ModalEditCaseOpponent
                            open={opponentModalOpen}
                            toggleModal={() => setOpponentModalOpen(!opponentModalOpen)}
                            caseId={store.caseItem.CaseID}
                            fighterData={store.fighterItem}
                          />
                        </div>

                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>{T('Surname')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.last_name}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Phone size={14} />
                          <p className='invoice-date-title ms-1'>{T('Telephone')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.telefone}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Mail size={14} />
                          <p className='invoice-date-title ms-1'>{T('E-Mail')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.email}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Calendar size={14} />
                          <p className='invoice-date-title ms-1'>{T('Updated')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.created_at && getTransformDate(store.fighterItem.created_at, "DD.MM.YYYY")}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Flag size={14} />
                          <p className='invoice-date-title ms-1'>{T('Land')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.country}</p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center user-total-numbers mt-1">
                        <div className="d-flex align-items-center mr-2">
                          <div className="color-box bg-light-primary rounded-circle">
                            <Home size={32} />
                          </div>

                          <div className="ml-1 ms-1">
                            <h5 className="mb-0">{T("Address")}</h5>
                            <small>
                              {store.fighterItem && store.fighterItem.id ? <>
                                {store.fighterItem.address ? `${store.fighterItem.address}, ` : ''}
                                {store.fighterItem.zip_code ? `${store.fighterItem.zip_code} ` : ''}
                                {store.fighterItem.city}
                              </> : null}
                            </small>
                          </div>
                        </div>
                      </div>
                    </Col>
                    {/* /Opponent detail */}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Client && Opponent detail */}

          {/* Time tracking terminal */}
          <Row>
            {/* <Col xl={5} md={6} sm={8} className="mx-auto"> */}
            <TerminalCaseTimeTrackingCounter
              open={timeCounterTerminalOpen}
              caseId={store.caseItem.CaseID}
              closeTerminal={() => setTimeCounterTerminalOpen(false)}
            />
            {/* </Col> */}
          </Row>
          {/* /Time tracking terminal */}

          {/* Voice recording terminal */}
          <Row>
            <TerminalVoiceRecording
              open={voiceRecorderTerminalOpen}
              caseId={store.caseItem.CaseID}
              closeTerminal={() => setVoiceRecorderTerminalOpen(false)}
            />
          </Row>
          {/* /Voice recording terminal */}

          {/* Notes && Time Recording && Letter && Document History */}
          <Row className='invoice-preview'>
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding pb-0'>
                  <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                    <div className="d-flex flex-wrap">
                      <Button className="mt-50" color="primary" onClick={() => setNoteFileModalOpen(true)}>
                        {T("Add a note")}
                      </Button>

                      <ModalCaseNoteFile
                        open={noteFileModalOpen}
                        toggleModal={() => setNoteFileModalOpen(!noteFileModalOpen)}
                        caseId={store.caseItem.CaseID}
                      />

                      <Button className="ms-50 mt-50" color="primary" onClick={() => setTimeTrackModalOpen(true)}>
                        {T("Add Time Tracking")}
                      </Button>

                      <ModalCaseTimeTracking
                        open={timeTrackModalOpen}
                        toggleModal={() => setTimeTrackModalOpen(!timeTrackModalOpen)}
                        caseId={store.caseItem.CaseID}
                        onTimeRecordStart={handleTimeRecordStart}
                      />

                      <Button className="ms-50 mt-50" color="primary" onClick={() => setLetterModalOpen(true)}>
                        {T("Write a letter now")}
                      </Button>

                      <ModalCaseLetter
                        open={letterModalOpen}
                        toggleModal={() => setLetterModalOpen(!letterModalOpen)}
                        caseData={store.caseItem}
                        fighterData={store.fighterItem}
                        letterRowData={letterRowData}
                        setLetterRowData={setLetterRowData}
                      />

                      <Button className="ms-50 mt-50" color="primary" onClick={() => setDocUploadModalOpen(true)}>
                        {T("Upload document")}
                      </Button>

                      <ModalCaseDocument
                        open={docUploadModalOpen}
                        toggleModal={() => setDocUploadModalOpen(!docUploadModalOpen)}
                        userId={store.caseItem && store.caseItem.UserID}
                        caseId={store.caseItem && store.caseItem.CaseID}
                        documentRowData={documentRowData}
                        setDocumentRowData={setDocumentRowData}
                      />

                      <Button className="ms-50 mt-50" color="primary" onClick={() => setVoiceRecordingModalOpen(true)}>
                        {T("Voice Recording")}
                      </Button>

                      <ModalCaseVoiceRecording
                        open={voiceRecordingModalOpen}
                        toggleModal={() => setVoiceRecordingModalOpen(!voiceRecordingModalOpen)}
                        caseId={(store.caseItem && store.caseItem.CaseID) || ""}
                        setVoiceRecorderTerminalOpen={setVoiceRecorderTerminalOpen}
                      />
                    </div>

                    <div className="d-flex flex-wrap mt-1">
                      <h3 className="invoice-date">{T("History")}</h3>
                    </div>
                  </div>

                  <Row className='mb-2'>
                    <Col xl={12} md={12} sm={12}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th />
                            <th>{T('Date')}</th>
                            <th>{T('Subject')}</th>
                            <th>{T('Done')}?</th>
                            <th>{T('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {store.timeCaseRecord.map((record, index) => (
                            record.end_time !== null ? (
                              <Fragment key={`case_time_track_${index}`}>
                                <tr
                                  className={`cursor-pointer ${(isCollapseOpen === `case_time_track_${record.RecordID}` ? 'background-highlight-color' : '')}`}
                                  onClick={() => handleCollapseAction(`case_time_track_${record.RecordID}`)}
                                >
                                  <td />

                                  <td>{record.CreatedAt && getTransformDate(record.CreatedAt, "DD.MM.YYYY")}</td>

                                  <td>{record.Subject}</td>

                                  <td>
                                    <div className='form-switch form-check-primary'>
                                      <Input
                                        type='switch'
                                        checked={record.IsShare}
                                        id={`record_${index}_${record.IsShare}`}
                                        name={`record_${index}_${record.IsShare}`}
                                        className="cursor-pointer"
                                        onChange={() => onShareCaseRecord(record.RecordID)}
                                      />
                                      <Label className='form-check-label' htmlFor="icon-primary">
                                        <span className='switch-icon-left'>
                                          <Check size={14} />
                                        </span>
                                        <span className='switch-icon-right'>
                                          <X size={14} />
                                        </span>
                                      </Label>
                                    </div>
                                  </td>

                                  <td>
                                    <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_time_track_${record.RecordID}`)} />
                                  </td>
                                </tr>

                                {(isCollapseOpen === `case_time_track_${record.RecordID}`) ? (
                                  <tr>
                                    <td colSpan={5} className={`px-0 w-100 ${(isCollapseOpen === `case_time_track_${record.RecordID}` ? '' : 'border-0 py-0')}`}>
                                      <Collapse
                                        className="case-card-collapse"
                                        isOpen={(isCollapseOpen === `case_time_track_${record.RecordID}`) || false}
                                      >
                                        <Row>
                                          <div className="w-25">
                                            <strong>{T("Date")}: </strong>
                                          </div>
                                          {(record && record.CreatedAt) && (
                                            <div className="w-75">
                                              {getTransformDate(record.CreatedAt, "DD.MM.YYYY")}
                                            </div>
                                          )}
                                        </Row>

                                        {(record && record.interval_time) && (
                                          <Row className="mt-1">
                                            <div className="w-25">
                                              <strong>{T("Interval Time")}: </strong>
                                            </div>
                                            <div className="w-75">
                                              {record.interval_time} S
                                            </div>
                                          </Row>
                                        )}

                                        {(record && record.start_time) && (
                                          <Row className="mt-1">
                                            <div className="w-25">
                                              <strong>{T("Start Time")}: </strong>
                                            </div>
                                            <div className="w-75">
                                              {record.start_time}
                                            </div>
                                          </Row>
                                        )}

                                        {(record && record.end_time) && (
                                          <Row className="mt-1">
                                            <div className="w-25">
                                              <strong>{T("End Time")}: </strong>
                                            </div>
                                            <div className="w-75">
                                              {record.end_time}
                                            </div>
                                          </Row>
                                        )}
                                      </Collapse>
                                    </td>
                                  </tr>
                                ) : null}
                              </Fragment>
                            ) : null
                          ))}

                          {store.caseRecords.map((record, index) => (
                            <Fragment key={`case_record_${index}`}>
                              <tr
                                className={`cursor-pointer ${(isCollapseOpen === `case_record_${record.RecordID}` ? 'background-highlight-color' : '')}`}
                                onClick={() => handleCollapseAction(`case_record_${record.RecordID}`)}
                              >
                                <td>
                                  {record.Type === "File" ? <>
                                    <Paperclip size={14} />
                                  </> : <>
                                    <Type size={14} />
                                  </>}
                                </td>

                                <td>{record.CreatedAt && getTransformDate(record.CreatedAt, "DD.MM.YYYY")}</td>

                                <td>{record.Subject}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={record.IsShare}
                                      id={`record_${index}_${record.IsShare}`}
                                      name={`record_${index}_${record.IsShare}`}
                                      className="cursor-pointer"
                                      onChange={() => onShareCaseRecord(record.RecordID)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_record_${record.RecordID}`)} />
                                </td>
                              </tr>

                              {(isCollapseOpen === `case_record_${record.RecordID}`) ? (
                                <tr>
                                  <td colSpan={5} className={`px-0 w-100 ${(isCollapseOpen === `case_record_${record.RecordID}` ? '' : 'border-0 py-0')}`}>
                                    <Collapse
                                      className="case-card-collapse"
                                      isOpen={(isCollapseOpen === `case_record_${record.RecordID}`) || false}
                                    >
                                      <Row>
                                        <div className="w-25">
                                          <strong>{T("Content")}: </strong>
                                        </div>
                                        <div className="w-75">
                                          {(record && record.Content) || ""}
                                        </div>
                                      </Row>

                                      {(record && record.CreatedAt) && (
                                        <Row className="mt-1">
                                          <div className="w-25">
                                            <strong>{T("Date")}: </strong>
                                          </div>
                                          <div className="w-75">
                                            {getTransformDate(record.CreatedAt, "DD.MM.YYYY")}
                                          </div>
                                        </Row>
                                      )}

                                      {record && record.attachment && record.attachment.length > 0 && (
                                        <Row className="mt-1">
                                          <div className="col-3">
                                            <strong>{T("Files")}: </strong>
                                          </div>
                                          <div className="col-9">
                                            {record.attachment.map((item, index) => {
                                              return (
                                                <div className="inline" key={`attachment_${index}`}>
                                                  <Paperclip className='cursor-pointer me-1' size={17} />
                                                  {item && item.path ? (
                                                    <a
                                                      target="_blank"
                                                      className="me-1"
                                                      href={renderFileWebUrlPreview(item.path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                                                    >
                                                      {item.name}
                                                    </a>
                                                  ) : null}
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </Row>
                                      )}
                                    </Collapse>
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          ))}

                          {store.caseLetters.map((letter, index) => (
                            <Fragment key={`case_letters_${index}`}>
                              <tr
                                className={`cursor-pointer ${(isCollapseOpen === `case_letters_${letter.id}` ? 'background-highlight-color' : '')}`}
                                onClick={() => handleCollapseAction(`case_letters_${letter.id}`)}
                              >
                                <td />
                                <td>{letter.created_date && getTransformDate(letter.created_date, "DD.MM.YYYY")}</td>

                                <td>{letter.subject}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={letter.isErledigt}
                                      id={`letter_${index}_${letter.isErledigt}`}
                                      name={`letter_${index}_${letter.isErledigt}`}
                                      className="cursor-pointer"
                                      onChange={() => onLetterDone(letter.id)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_letters_${letter.id}`)} />
                                </td>
                              </tr>

                              {(isCollapseOpen === `case_letters_${letter.id}`) ? (
                                <tr>
                                  <td colSpan={5} className={`px-0 w-100 ${(isCollapseOpen === `case_letters_${letter.id}` ? '' : 'border-0 py-0')}`}>
                                    <Collapse
                                      className="case-card-collapse"
                                      isOpen={(isCollapseOpen === `case_letters_${letter.id}`) || false}
                                    >
                                      <Row>
                                        <div className="w-25">
                                          <strong>{T("Message")}: </strong>
                                        </div>
                                        {(letter && letter.message) && (
                                          <div className="w-75">
                                            {setInnerHtml(letter.message)}
                                          </div>
                                        )}
                                      </Row>

                                      <div className="mt-1">
                                        {(letter && letter.pdf_path) && (
                                          <Button.Ripple
                                            outline
                                            tag="a"
                                            target="_blank"
                                            color="primary"
                                            className={`btn-icon rounded-circle me-50`}
                                            href={renderFileWebUrlPreview(letter.pdf_path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                                          >
                                            <Avatar
                                              img={pdfPng}
                                              imgWidth={16}
                                              imgHeight={16}
                                              className="bg-transparent"
                                            />
                                          </Button.Ripple>
                                        )}

                                        <Button.Ripple
                                          outline
                                          tag={Link}
                                          color="primary"
                                          to={`${adminRoot}/case/letter-template/edit/${id}/${letter.id}`}
                                          className={`btn-icon rounded-circle me-50`}
                                        >
                                          <Edit size={16} />
                                        </Button.Ripple>

                                        <Button.Ripple
                                          outline
                                          color="danger"
                                          className={`btn-icon rounded-circle`}
                                          onClick={() => onDeleteLetter(letter.id)}
                                        >
                                          <Trash2 size={16} />
                                        </Button.Ripple>
                                      </div>
                                    </Collapse>
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          ))}

                          {store.caseDocs.map((doc, index) => (
                            <Fragment key={`case_docs_${index}`}>
                              <tr
                                className={`cursor-pointer ${(isCollapseOpen === `case_docs_${doc.id}` ? 'background-highlight-color' : '')}`}
                                onClick={() => handleCollapseAction(`case_docs_${doc.id}`)}
                              >
                                <td />
                                <td>{doc.created_at && getTransformDate(doc.created_at, "DD.MM.YYYY")}</td>

                                <td>{doc.title}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={doc.isErledigt}
                                      id={`docs_${index}_${doc.isErledigt}`}
                                      name={`docs_${index}_${doc.isErledigt}`}
                                      className="cursor-pointer"
                                      onChange={() => onDocumentDone(doc.id)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_docs_${doc.id}`)} />
                                </td>
                              </tr>

                              {(isCollapseOpen === `case_docs_${doc.id}`) ? (
                                <tr>
                                  <td colSpan={5} className={`px-0 w-100 ${(isCollapseOpen === `case_docs_${doc.id}` ? '' : 'border-0 py-0')}`}>
                                    <Collapse
                                      className="case-card-collapse"
                                      isOpen={(isCollapseOpen === `case_docs_${doc.id}`) || false}
                                    >
                                      <Row>
                                        <div className="w-25">
                                          <strong>{T("Content")}: </strong>
                                        </div>
                                        <div className="w-75">
                                          {(doc && doc.description) || ""}
                                        </div>
                                      </Row>

                                      {(doc && doc.created_at) && (
                                        <Row className="mt-1">
                                          <div className="w-25">
                                            <strong>{T("Date")}: </strong>
                                          </div>
                                          <div className="w-75">
                                            {getTransformDate(doc.created_at, "DD.MM.YYYY")}
                                          </div>
                                        </Row>
                                      )}

                                      {(doc && doc.attachment_pdf) && (
                                        <Row className="mt-1">
                                          <div className="w-25">
                                            <strong>{T("File")}: </strong>
                                          </div>
                                          <div className="w-75">
                                            <div className="inline">
                                              <a
                                                target="_blank"
                                                className="me-1"
                                                href={renderFileWebUrlPreview(doc.attachment_pdf) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                                              >
                                                <Paperclip className='cursor-pointer me-1' size={17} />
                                                attachment
                                              </a>
                                            </div>
                                          </div>
                                        </Row>
                                      )}
                                    </Collapse>
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          ))}

                          {voiceRecordingStore && voiceRecordingStore.voiceRecordingItems.map((recordingItem, index) => (
                            <Fragment key={`voice_recording_${index}`}>
                              <tr
                                className={`cursor-pointer`}
                                onClick={() => terminalDetailVoiceRecording(recordingItem)}
                              >
                                <td />
                                <td>{recordingItem.created_at && getTransformDate(recordingItem.created_at, "DD.MM.YYYY")}</td>

                                <td>{recordingItem.subject}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={recordingItem.isErledigt}
                                      id={`recording_done_${index}_${recordingItem.isErledigt}`}
                                      name={`recording_done_${index}_${recordingItem.isErledigt}`}
                                      className="cursor-pointer"
                                      onChange={() => handleMarkDone(recordingItem.id)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => terminalDetailVoiceRecording(recordingItem)} />
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Notes && Time Recording && Letter && Document History */}

          {/* Voice recording detail view terminal */}
          <Row>
            <TerminalVoiceRecordedDetail
              open={voiceRecordedTerminalOpen}
              getTransformDate={getTransformDate}
              recordedVoiceItem={getCaseRecordedVoice()}
              renderFileWebUrlPreview={renderFileWebUrlPreview}
              closeTerminal={() => closeRecordedDetailViewTerminal()}
            />
          </Row>
          {/* Voice recording detail view terminal */}

          {/* Email History */}
          <Row>
            <Col xl={12} md={12} sm={12}>
              <Card>
                <CardHeader>
                  <CardTitle tag='h4'>{T("Email History")}</CardTitle>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          {store && store.caseEmailItems && store.caseEmailItems.length ? (
            renderEmailHistory()
          ) : null}
          {/* /Email History */}
        </Col>

        <Col xl={5} md={12} sm={12}>
          {store.selectedItem ? (
            <Card className='case-details-card'>
              <CardBody className='invoice-padding pb-0'>
                <div className='d-flex justify-content-between' >
                  <h3 className='mt-1'>{T("Details")}</h3>
                  <div>
                    {store.selectedItem && store.selectedItem.typeOf === "letter" ? (
                      <Fragment>
                        {store.selectedItem.pdf_path ? (
                          <Button.Ripple
                            outline
                            tag="a"
                            target="_blank"
                            color="primary"
                            className={`btn-icon rounded-circle me-50`}
                            href={renderFileWebUrlPreview(store.selectedItem.pdf_path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                          >
                            <Avatar
                              img={pdfPng}
                              imgWidth={16}
                              imgHeight={16}
                              className="bg-transparent"
                            />
                          </Button.Ripple>
                        ) : null}

                        <Button.Ripple
                          outline
                          tag={Link}
                          color="primary"
                          to={`${adminRoot}/case/letter-template/edit/${id}/${store.selectedItem.id}`}
                          className={`btn-icon rounded-circle me-50`}
                        >
                          <Edit size={16} />
                        </Button.Ripple>

                        <Button.Ripple
                          outline
                          color="danger"
                          className={`btn-icon rounded-circle`}
                          onClick={() => onDeleteLetter(store.selectedItem.id)}
                        >
                          <Trash2 size={16} />
                        </Button.Ripple>
                      </Fragment>
                    ) : null}

                    <Button.Ripple className='btn-icon rounded-circle' color='flat-grey' onClick={() => onRecordCloseClick()}>
                      <EyeOff size={16} />
                    </Button.Ripple>
                  </div>
                </div>
                <hr />
                <CardDetails details={store.selectedItem} />
              </CardBody>
            </Card>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default CaseView
