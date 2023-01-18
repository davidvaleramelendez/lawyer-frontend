/* eslint-disable object-shorthand */

// ** React Imports
import React, { useEffect, useState } from 'react'

// ** Store & Actions
import {
  toggleCompose,
  sendCaseEmail,
  updateCaseLoader,
  setComposeMailTo,
  resetComposeModal,
  setComposeSubject,
  setComposeMaximize,
  setComposeAttachments,
  createEmailAttachment,
  deleteEmailAttachment,
  setComposeEditorHtmlContent
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  FormFeedback,
  UncontrolledButtonDropdown
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// ** Icons Import
import {
  X,
  Disc,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip
} from 'react-feather'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** React draggable Import
import Draggable from 'react-draggable'

// ** Constant
import {
  adminRoot
} from '@constant/defaultValues'
import {
  emailItem
} from '@constant/reduxConstant'

// ** Third Party Components
import ResizeObserver from 'resize-observer-polyfill'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Styles
import '@styles/react/apps/app-email.scss'
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const ModalComposeMail = ({
  caseId,
  caseData
}) => {
  // ** Hooks
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  // ** States
  const [resized, setResized] = useState(false)
  const [editorState, setEditorState] = useState(null)
  const [mailToValid, setMailToValid] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: store.composeModal
  })

  const PlaceholderSchema = {
    subject: T("Subject"),
    editorHtmlContent: T("Message")
  }

  // ** close compose modal
  const closeModal = () => {
    setEditorState(null)
    dispatch(resetComposeModal())
  }

  // ** Toggles Compose POPUP
  const togglePopUp = (event) => {
    if (event) {
      event.preventDefault()
    }
    dispatch(setComposeMaximize(false))
    dispatch(setComposeEditorHtmlContent(''))
    reset(emailItem)
    dispatch(toggleCompose())
  }

  // ** Minimize and maximize size of modal
  const onToggleMinMaxSize = (event) => {
    event.preventDefault()

    const modalContents = document.getElementsByClassName('modal-content')
    if (modalContents.length > 0 && modalContents[0].getAttribute('style') && modalContents[0].getAttribute('style') !== "") {
      modalContents[0].setAttribute('style', '')
      setResized(false)
    } else {
      dispatch(setComposeMaximize(!store.composeModal.maximize))
    }
  }

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
    dispatch(setComposeAttachments([...fileArray]))
  }

  /* convert from html to editor state */
  const htmlToEditorState = (html) => {
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      return editorState
    }

    return null
  }

  // Files converting to base64
  const onComposeFileChange = (event) => {
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
            dispatch(createEmailAttachment({ attachment: fileArray, type: 'email', ids: ids, from: "COMPOSE" }))
          }
        }
      }))
    }
  }

  // ** message editor state change
  const handleEditorStateChange = (state) => {
    dispatch(setComposeEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent()))))
    setEditorState(state)
  }

  // ** Compose Modal Resize Observer
  const ro = new ResizeObserver(() => {
    const modalContents = document.getElementsByClassName('modal-content')
    if (modalContents.length > 0 && modalContents[0].getAttribute('style') && modalContents[0].getAttribute('style') !== "") {
      setResized(true)
    } else {
      setResized(false)
    }
  })

  // ** modal open event
  const onModalOpened = () => {
    const modalContents = document.getElementsByClassName('modal-content')
    if (modalContents.length > 0) {
      ro.observe(modalContents[0])
    }

    if (caseData && caseData.user && caseData.user.email) {
      dispatch(setComposeMailTo(caseData.user.email))
    }

    if (store.composeModal.editorHtmlContent !== '') {
      const state = htmlToEditorState(store.composeModal.editorHtmlContent)
      setEditorState(state)
    } else {
      setEditorState(null)
    }
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* Updating editor state */
    if (store && store.composeModal.htmlToEditorState !== "") {
      const state = htmlToEditorState(store.composeModal.editorHtmlContent)
      setEditorState(state)
    } else {
      setEditorState(null)
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "CASE_MAIL_SENT") {
      dispatch(resetComposeModal())
    }

    /* Updating uploaded files */
    if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
      setUploadedFiles(store.composeModal.attachments)
    }
  }, [store.actionFlag])
  // console.log("store >>> ", store)

  const handleSubjectChange = (event) => {
    dispatch(setComposeSubject(event.target.value))
  }

  // ** submit the email form
  const onSubmit = async () => {
    if (store.composeModal.mailTo.length === 0) {
      setMailToValid(false)
      return
    }

    const mailData = {
      case_id: caseId,
      subject: store.composeModal.subject ?? ""
    }

    if (caseData && caseData.user && caseData.user.id) {
      mailData.email_to = [caseData.user.id]
    }

    if (store.composeModal.editorHtmlContent) {
      mailData.message = store.composeModal.editorHtmlContent
    }

    if (uploadedFiles && uploadedFiles.length) {
      mailData.attachment_ids = uploadedFiles.map((t) => t.id)
    }

    // console.log("onSubmit mailData >>> ", mailData)
    dispatch(updateCaseLoader(false))
    dispatch(sendCaseEmail(mailData))
  }


  return (
    <Draggable handle=".modal-header">
      <Modal
        scrollable
        fade={false}
        keyboard={true}
        backdrop={false}
        id="compose-mail"
        container=".case-detail-view"
        className={`compose-modal ${store.composeModal.maximize ? "modal-large" : "modal-medium"}`}
        isOpen={store.composeModal.open}
        contentClassName="p-0"
        toggle={toggleCompose}
        modalClassName="compose-mask-modal email-application"
        onOpened={onModalOpened}
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <div className="modal-header modal-movable">
          <h5 className="modal-title">{T("Write e-mail")}</h5>
          <div className="modal-actions">
            <a
              href="/"
              className="text-body me-75"
              onClick={togglePopUp}
            >
              <Minus size={14} />
            </a>

            <a
              href="/"
              className="text-body me-75"
              onClick={onToggleMinMaxSize}
            >
              {resized ? <>
                <Disc size={12} />
              </> : !store.composeModal.maximize ? <>
                <Maximize2 size={14} />
              </> : <>
                <Minimize2 size={14} />
              </>}
            </a>

            <a
              className="text-body"
              onClick={closeModal}
            >
              <X size={14} />
            </a>
          </div>
        </div>

        <ModalBody className="flex-grow-1 p-0">
          <Form className="compose-form" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="compose-mail-form-field">
              <Label for="mailTo" className="form-label">{T("To")}:</Label>
              <div className='flex-grow-1 w-100'>
                <Controller
                  defaultValue=""
                  id="mailTo"
                  name="mailTo"
                  control={control}
                  render={({ field }) => <Input
                    {...field}
                    autoComplete="off"
                    readOnly
                    value={store.composeModal.mailTo}
                    invalid={errors.mailTo && true}
                  />}
                />
              </div>
              {!mailToValid ? (
                <div className="invalid-feedback d-block">{T('To email is required!')}</div>
              ) : null}
            </div>

            <div className="compose-mail-form-field">
              <Label for="subject" className="form-label">{T("Subject")}:</Label>
              <Controller
                defaultValue=""
                id="subject"
                name="subject"
                control={control}
                render={({ field }) => <Input
                  {...field}
                  autoComplete="off"
                  placeholder={PlaceholderSchema && PlaceholderSchema.subject}
                  value={store.composeModal.subject}
                  invalid={errors.subject && true}
                  onChange={handleSubjectChange}
                />}
              />
              {errors && errors.subject ? (
                <FormFeedback className="d-block">{errors.subject?.message}</FormFeedback>
              ) : null}
            </div>

            <div id='editorHtmlContent' className='message-editor'>
              <Controller
                defaultValue=""
                control={control}
                id='editorHtmlContent'
                name='editorHtmlContent'
                render={({ field }) => (
                  <Editor
                    {...field}
                    placeholder={PlaceholderSchema && PlaceholderSchema.editorHtmlContent}
                    toolbarClassName='rounded-0'
                    wrapperClassName='toolbar-bottom'
                    editorClassName='rounded-0 border-0'
                    toolbar={{
                      options: ['inline', 'textAlign'],
                      inline: {
                        inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                      }
                    }}
                    onEditorStateChange={handleEditorStateChange}
                    editorState={editorState}
                  />
                )}
              />
              {errors && errors.editorHtmlContent ? (
                <FormFeedback className="d-block">{errors.editorHtmlContent?.message}</FormFeedback>
              ) : null}
            </div>

            {uploadedFiles && uploadedFiles.length ? <>
              <div className="email-attachments mt-1 mb-1">
                {uploadedFiles.map((item, index) => {
                  return (
                    <div className="inline" key={`attachment_${index}`}>
                      <Paperclip
                        size={17}
                        className="cursor-pointer ms-1 me-1"
                      />

                      {item && item.path ? (<a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.path}`} target="_blank" className="me-1">{item.name}</a>) : null}

                      <a
                        href={`${adminRoot}/case/view/${caseId}`}
                        onClick={(event) => onFileRemove(event, item.id)}
                      >
                        <X
                          size={17}
                          color="#FF0000"
                          className="cursor-pointer"
                        />
                      </a>
                    </div>
                  )
                })}
              </div>
            </> : null}

            <div className='compose-footer-wrapper'>
              <div className='btn-wrapper d-flex align-items-center'>
                <UncontrolledButtonDropdown direction='up' className='me-1'>
                  <Button
                    type="submit"
                    color='primary'
                    disabled={!store.loading}
                  >
                    {T('Send')}
                  </Button>
                </UncontrolledButtonDropdown>

                <div className='email-attachement'>
                  <Label className='mb-0' for='compose-attach-email-item'>
                    <Paperclip className='cursor-pointer ms-50' size={18} />
                    <input
                      hidden
                      multiple
                      type='file'
                      name='compose-attach-email-item'
                      id='compose-attach-email-item'
                      onChange={(event) => onComposeFileChange(event)}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Draggable>
  )
}

export default React.memo(ModalComposeMail)
