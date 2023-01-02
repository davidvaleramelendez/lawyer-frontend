/* eslint-disable object-shorthand */

// ** React Imports
import React, { useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import Select, { components } from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ResizeObserver from 'resize-observer-polyfill'

// ** Idle timer
import { useIdleTimer } from 'react-idle-timer'

// ** Translation
import { T } from '@localization'

// ** Icons Import
import {
  X,
  Minus,
  Trash,
  Paperclip,
  Maximize2,
  Minimize2,
  Disc
} from 'react-feather'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Modal,
  Button,
  ModalBody,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

// ** React draggable Import
import Draggable from 'react-draggable'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getMails,
  sendEmail,
  updateEmailLoader,
  createEmailAttachment,
  deleteEmailAttachment,
  clearEmailMessage,
  toggleCompose,
  setComposeMaximize,
  setComposeUserOptions,
  setComposeMailTo,
  setComposeCCOpen,
  setComposeCC,
  setComposeBCCOpen,
  setComposeBCC,
  setComposeEditorHtmlContent,
  setComposeSubject,
  saveDraftEmail,
  resetComposeModal,
  deleteDrafts
} from '../store'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Utils
import {
  selectThemeColors,
  getRandColorClass
} from '@utils'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'
import {
  emailItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'

const ModalComposeMail = () => {
  // ** Hooks
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.email)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: emailItem, mode: 'all' })

  const ValidationSchema = {
    email_to: {
      placeholder: `${T('Select')}...`,
      required: false
    },
    email_cc: {
      placeholder: `${T('Select')}...`,
      required: false
    },
    email_bcc: {
      placeholder: `${T('Select')}...`,
      required: false
    },
    subject: {
      placeholder: T("Subject"),
      required: false
    },
    body: {
      placeholder: T("Message"),
      required: false
    }
  }

  const timeout = 300000

  // ** States
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [resized, setResized] = useState(false)
  const [editorState, setEditorState] = useState(null)
  const [mailToValid, setMailToValid] = useState(true)

  // ** save draft
  const saveDraft = () => {
    const body = {
      id: store.composeModal.draftId
    }

    if (store.composeModal.mailTo.length) {
      body.to_ids = store.composeModal.mailTo.map((t) => t.value).join(',')
    }

    if (store.composeModal.cc.length) {
      body.cc_ids = store.composeModal.cc.map((t) => t.value).join(',')
    }

    if (store.composeModal.bcc.length) {
      body.bcc_ids = store.composeModal.bcc.map((t) => t.value).join(',')
    }

    body.subject = store.composeModal.subject
    body.body = store.composeModal.editorHtmlContent
    body.attached_ids = store.composeModal.attachments.map((t) => t.id).join(',')

    dispatch(saveDraftEmail(body))
    dispatch(getMails({ ...store.params }))
  }

  const canSave = () => {
    if (!store.composeModal.open) return false
    if (store.composeModal.mailTo.length) return true
    if (store.composeModal.cc.length) return true
    if (store.composeModal.bcc.length) return true
    if (store.composeModal.subject !== '') return true
    if (store.composeModal.editorHtmlContent !== '') return true
    if (store.composeModal.attachments.length) return true

    return false
  }

  const handleOnIdle = () => {
    if (canSave()) {
      saveDraft()
    }
  }

  const handleOnActive = () => {
  }

  const { } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle
  })

  // ** CC Toggle Function
  const toggleCC = (event) => {
    event.preventDefault()
    dispatch(setComposeCCOpen(!store.composeModal.ccOpen))
  }

  // ** BCC Toggle Function
  const toggleBCC = (event) => {
    event.preventDefault()
    dispatch(setComposeBCCOpen(!store.composeModal.bccOpen))
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
            dispatch(updateEmailLoader(false))
            dispatch(createEmailAttachment({ attachment: fileArray, type: 'notification', ids: ids }))
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

    if (store.composeModal.editorHtmlContent !== '') {
      const state = htmlToEditorState(store.composeModal.editorHtmlContent)
      setEditorState(state)
    } else {
      setEditorState(null)
    }
  }

  // ** UseEffect: GET initial data on Mount
  useEffect(() => {
    let list1 = []
    if (store.userItems && store.userItems.length) {
      list1 = store.userItems.map(item => {
        return {
          value: item.id,
          name: item.name,
          label: `${item.name} (${item.email})`,
          img: item.profile_photo_path
        }
      })
    }
    dispatch(setComposeUserOptions(list1))

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearEmailMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "MAIL_SENT") {
      if (store.composeModal.draftId > 0) {
        dispatch(deleteDrafts(store.composeModal.draftId))
      }
      dispatch(resetComposeModal())
    }

    /* Updating uploaded files */
    // if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
    setUploadedFiles(store.composeModal.attachments)
    // }

    /* Updating editor state */
    if (store && store.composeModal.htmlToEditorState !== "") {
      const state = htmlToEditorState(store.composeModal.editorHtmlContent)
      setEditorState(state)

    } else {
      setEditorState(null)
    }

  }, [store.userItems, store.success, store.error, store.actionFlag, store.composeModal.draftId])

  // ** close compose modal
  const closeModal = () => {
    setEditorState(null)
    dispatch(resetComposeModal())
  }

  // ** delete draft and close compose modal
  const deleteAndClose = () => {
    if (store.composeModal.draftId > 0) {
      dispatch(deleteDrafts(store.composeModal.draftId))
      dispatch(getMails({ ...store.params }))
    }
    setEditorState(null)
    dispatch(resetComposeModal())
  }

  // ** submit the email form
  const onSubmit = async () => {
    if (store.composeModal.mailTo.length === 0) {
      setMailToValid(false)
      return
    }

    const mailData = {}

    if (store.composeModal && store.composeModal.subject) {
      mailData.subject = store.composeModal.subject
    }

    if (store.composeModal.editorHtmlContent) {
      mailData.message = store.composeModal.editorHtmlContent
    }

    mailData.email_to = store.composeModal.mailTo.map(t => t.value)

    if (store.composeModal.cc.length) {
      mailData.email_cc = store.composeModal.cc.map(t => t.value)
    }

    if (store.composeModal.bcc.length) {
      mailData.email_bcc = store.composeModal.bcc.map(t => t.value)
    }

    if (uploadedFiles && uploadedFiles.length) {
      mailData.attachment_ids = uploadedFiles.map((t) => t.id)
    }

    dispatch(updateEmailLoader(false))
    await dispatch(sendEmail(mailData))
  }

  const handleMailToSelect = (values) => {
    dispatch(setComposeMailTo(values))
    setMailToValid(values.length)
  }

  const handleCCSelect = (values) => {
    dispatch(setComposeCC(values))
  }

  const handleBCCSelect = (values) => {
    dispatch(setComposeBCC(values))
  }

  const handleSubjectChange = (event) => {
    dispatch(setComposeSubject(event.target.value))
  }

  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          {data && data.img ? <>
            <Avatar className='my-0 me-50' size='sm' img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${data.img}`} />
          </> : <>
            <Avatar color={getRandColorClass()} className='me-50' content={data ? data.name : 'John Doe'} initials />
          </>}
          {data.label}
        </div>
      </components.Option>
    )
  }

  return store ? (
    <Draggable handle='.modal-header'>
      <Modal
        scrollable
        fade={false}
        keyboard={true}
        backdrop={false}
        id='compose-mail'
        container='.content-body'
        className={`compose-modal ${store.composeModal.maximize ? 'modal-large' : 'modal-medium'}`}
        isOpen={store.composeModal.open}
        contentClassName='p-0'
        toggle={toggleCompose}
        modalClassName='compose-mask-modal'
        onOpened={onModalOpened}
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <div className='modal-header modal-movable'>
          <h5 className='modal-title'>{T('Compose Mail')}</h5>
          <div className='modal-actions'>
            <a
              href='/'
              className='text-body me-75'
              onClick={togglePopUp}
            >
              <Minus size={14} />
            </a>

            <a
              href='/'
              className='text-body me-75'
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
              className='text-body'
              onClick={closeModal}
            >
              <X size={14} />
            </a>
          </div>
        </div>

        <ModalBody className='flex-grow-1 p-0'>
          <Form className='compose-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='compose-mail-form-field'>
              <Label for='email_to' className='form-label'>{T('To')}:</Label>
              <div className='flex-grow-1 w-100'>
                <Controller
                  defaultValue={emailItem.email_to}
                  name='email_to'
                  id='email_to'
                  control={control}
                  rules={ValidationSchema.email_to}

                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      id='email_to'
                      isClearable={false}
                      closeMenuOnSelect={false}
                      theme={selectThemeColors}
                      options={store.composeModal.userOptions}
                      value={store.composeModal.mailTo}
                      placeholder={ValidationSchema.email_to && ValidationSchema.email_to.placeholder}
                      className='react-select select-borderless'
                      classNamePrefix='select'
                      components={{ Option: SelectComponent }}
                      onChange={handleMailToSelect}
                    />
                  )}
                />
              </div>
              {!mailToValid ? (
                <div className="invalid-feedback d-block">{T('To email is required!')}</div>
              ) : null}
              <div>
                <a href='/' className='toggle-cc text-body me-1' onClick={toggleCC}>Cc</a>
                <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>Bcc</a>
              </div>
            </div>

            {store.composeModal.ccOpen === true ? (
              <div className='compose-mail-form-field cc-wrapper'>
                <Label for='email_cc' className='form-label'>Cc:</Label>
                <div className='flex-grow-1 w-100'>
                  <Controller
                    defaultValue={emailItem.email_cc}
                    name='email_cc'
                    id='email_cc'
                    control={control}
                    rules={ValidationSchema.email_cc}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        id='email_cc'
                        isClearable={false}
                        closeMenuOnSelect={false}
                        theme={selectThemeColors}
                        options={store.composeModal.userOptions}
                        value={store.composeModal.cc}
                        placeholder={ValidationSchema.email_cc && ValidationSchema.email_cc.placeholder}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{ Option: SelectComponent }}
                        onChange={handleCCSelect}
                      />
                    )}
                  />
                </div>
                {errors && errors.email_cc ? (
                  <div className="invalid-feedback d-block">{errors.email_cc?.message}</div>
                ) : null}
                <div>
                  <a href='/' className='toggle-cc text-body' onClick={toggleCC}>
                    <X size={14} />
                  </a>
                </div>
              </div>
            ) : null}

            {store.composeModal.bccOpen === true ? (
              <div className='compose-mail-form-field cc-wrapper'>
                <Label for='email_bcc' className='form-label'>Bcc:</Label>
                <div className='flex-grow-1 w-100'>
                  <Controller
                    defaultValue={emailItem.email_bcc}
                    name='email_bcc'
                    id='email_bcc'
                    control={control}
                    rules={ValidationSchema.email_bcc}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        id='email_bcc'
                        isClearable={false}
                        closeMenuOnSelect={false}
                        theme={selectThemeColors}
                        options={store.composeModal.userOptions}
                        value={store.composeModal.bcc}
                        placeholder={ValidationSchema.email_bcc && ValidationSchema.email_bcc.placeholder}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{ Option: SelectComponent }}
                        onChange={handleBCCSelect}
                      />
                    )}
                  />
                </div>
                {errors && errors.email_bcc ? (
                  <div className="invalid-feedback d-block">{errors.email_bcc?.message}</div>
                ) : null}
                <div>
                  <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>
                    <X size={14} />
                  </a>
                </div>
              </div>
            ) : null}

            <div className='compose-mail-form-field'>
              <Label for='subject' className='form-label'>{T('Subject')}:</Label>
              <Controller
                defaultValue=""
                id='subject'
                name='subject'
                control={control}
                rules={ValidationSchema.subject}
                render={({ field }) => <Input
                  {...field}
                  autoComplete="off"
                  value={store.composeModal.subject}
                  placeholder={ValidationSchema.subject && ValidationSchema.subject.placeholder}
                  invalid={errors.subject && true}
                  onChange={handleSubjectChange}
                />}
              />
              {errors && errors.subject ? (
                <div className="invalid-feedback d-block">{errors.subject?.message}</div>
              ) : null}
            </div>

            <div id='message-editor' className='message-editor'>
              <Controller
                defaultValue=""
                control={control}
                id='body'
                name='body'
                rules={ValidationSchema.body}
                render={({ field }) => (
                  <Editor
                    {...field}
                    placeholder={ValidationSchema.body && ValidationSchema.body.placeholder}
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
              {errors && errors.body ? (
                <div className="invalid-feedback d-block">{errors.body?.message}</div>
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
                        href={`${adminRoot}/email`}
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

                <UncontrolledButtonDropdown direction='up' className='me-1'>
                  <Button
                    color='primary'
                    disabled={!store.loading || !canSave()}
                    onClick={saveDraft}
                  >
                    {T('Save')}
                  </Button>
                </UncontrolledButtonDropdown>

                <div className='email-attachement'>
                  <Label className='mb-0' for='attach-email-item'>
                    <Paperclip className='cursor-pointer ms-50' size={18} />
                    <input
                      hidden
                      multiple
                      type='file'
                      name='attach-email-item'
                      id='attach-email-item'
                      onChange={(event) => onFileChange(event)}
                    />
                  </Label>
                </div>
              </div>

              <div className='footer-action d-flex align-items-center'>
                <Trash className='cursor-pointer' size={18} onClick={deleteAndClose} />
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Draggable>
  ) : null
}

export default React.memo(ModalComposeMail)
