/* eslint-disable object-shorthand */

// ** React Imports
import React, { useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// Translation
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Select, { components } from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ResizeObserver from 'resize-observer-polyfill'

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

// ** React draggable Import
import Draggable from 'react-draggable'


import { useForm, Controller } from 'react-hook-form'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  sendEmail,
  updateEmailLoader,
  createEmailAttachment,
  deleteEmailAttachment,
  clearEmailMessage,
  toggleCompose,
  setCCOpen,
  setBCCOpen,
  setModalMaximize,
  setUserOptions,
  setEditorHtmlContent
} from '../store'

// import {navbarColor} from '../../../redux/layout'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

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
import { 
  MODAL_LG_WIDTH_FOR_1600, 
  MODAL_MD_WIDTH_FOR_1600, 
  MODAL_LG_WIDTH_FOR_1280, 
  MODAL_MD_WIDTH_FOR_1280, 
  MODAL_LG_WIDTH_FOR_992, 
  MODAL_MD_WIDTH_FOR_992, 
  MODAL_LG_WIDTH_FOR_768, 
  MODAL_MD_WIDTH_FOR_768, 
  MODAL_MIN_MD_WIDTH,
  MODAL_MIN_LG_WIDTH } from '../Constants'

const ModalComposeMail = () => {
  // ** Hooks
  const { t } = useTranslation()
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
      placeholder: `Select...`,
      required: `To email is required!`
    },
    email_cc: {
      placeholder: `Select...`,
      required: false
    },
    email_bcc: {
      placeholder: `Select...`,
      required: false
    },
    subject: {
      placeholder: "Subject",
      required: false
    },
    body: {
      placeholder: t("Message"),
      required: false
    }
  }

  // ** States
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [resized, setResized] = useState(false)

  // ** CC Toggle Function
  const toggleCC = (event) => {
    event.preventDefault()
    dispatch(setCCOpen(!store.ccOpen))
  }

  // ** BCC Toggle Function
  const toggleBCC = (event) => {
    event.preventDefault()
    dispatch(setBCCOpen(!store.bccOpen))
  }

  // ** Toggles Compose POPUP
  const togglePopUp = (event) => {
    if (event) {
      event.preventDefault()
    }
    dispatch(setModalMaximize(false))
    dispatch(setEditorHtmlContent(''))
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
      dispatch(setModalMaximize(!store.modalMaximize))
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
        onAlertMessage('File limit exceeded!', `Please upload max ${process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE} mb files!`, 'warning')
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

  const handleEditorStateChange = (state) => {
    // console.log("handleEditorStateChange >>>> ", state)
    dispatch(setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent()))))
  }

  // ** Compose Modal Resize Observer
  const ro = new ResizeObserver((entries) => {
    console.log('------ resize --------')
    for (const entry of entries) {
        const {left, top, width, height} = entry.contentRect
        console.log('Element:', entry.target)
        console.log(`Element's size: ${ width }px x ${ height }px`)
        console.log(`Element's paddings: ${ top }px ; ${ left }px`)   
        
          console.log(' set store modal maximize: ', store.modalMaximize)
        const modalContents = document.getElementsByClassName('modal-content')
        if (modalContents.length > 0 && modalContents[0].getAttribute('style') && modalContents[0].getAttribute('style') !== "") {
          setResized(true)
        } else {
          setResized(false)
        }
    }
  })
 
  const onModalOpened = () => {
    const modalContents = document.getElementsByClassName('modal-content')
    if (modalContents.length > 0) {
      ro.observe(modalContents[0])
    }
  }

  // ** UseEffect: GET initial data on Mount
  useEffect(() => {
    let list1 = []
    if (store.userItems && store.userItems.length) {
      list1 = store.userItems.map(item => {
        return {
          value: item.id,
          label: item.name,
          img: item.profile_photo_path
        }
      })
    }
    dispatch(setUserOptions(list1))

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearEmailMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "MAIL_SENT") {
      togglePopUp(event)
    }

    /* Updating uploaded files */
    if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
      setUploadedFiles(store.attachments)
    }

  }, [dispatch, store.userItems, store.success, store.error, store.actionFlag])

  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          {data && data.img ? <>
            <Avatar className='my-0 me-50' size='sm' img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${data.img}`} />
          </> : <>
            <Avatar color={getRandColorClass()} className='me-50' content={data ? data.label : 'John Doe'} initials />
          </>}
          {data.label}
        </div>
      </components.Option>
    )
  }

  const onSubmit = async (values) => {
    if (values) {
      const mailData = {
        subject: values.subject
      }

      if (store.editorHtmlContent) {
        mailData.message = store.editorHtmlContent
      }

      if (values.email_to && values.email_to.length) {
        mailData.email_to = values.email_to.map((t) => t.value)
      }

      if (values.email_cc && values.email_cc.length) {
        mailData.email_cc = values.email_cc.map((t) => t.value)
      }

      if (values.email_bcc && values.email_bcc.length) {
        mailData.email_bcc = values.email_bcc.map((t) => t.value)
      }

      if (uploadedFiles && uploadedFiles.length) {
        mailData.attachment_ids = uploadedFiles.map((t) => t.id)
      }

      // console.log("onSubmit >>> ", mailData)
      dispatch(updateEmailLoader(false))
      dispatch(sendEmail(mailData))
    }
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
        className={`compose-modal ${  store.modalMaximize ? 'modal-large' : 'modal-medium'}`}
        isOpen={store.composeOpen}
        contentClassName='p-0'
        toggle={toggleCompose}
        modalClassName='compose-mask-modal'
        onOpened={onModalOpened}
      >
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <div className='modal-header modal-movable'>
          <h5 className='modal-title'>Compose Mail</h5>
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
              </> : !store.modalMaximize ? <>
                <Maximize2 size={14} />
              </> : <>
                <Minimize2 size={14} />
              </>}
            </a>

            <a
              href='/'
              className='text-body'
              onClick={togglePopUp}
            >
              <X size={14} />
            </a>
          </div>
        </div>

        <ModalBody className='flex-grow-1 p-0'>
          <Form className='compose-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='compose-mail-form-field'>
              <Label for='email_to' className='form-label'>To:</Label>
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
                      options={store.userOptions}
                      placeholder={ValidationSchema.email_to && ValidationSchema.email_to.placeholder}
                      className='react-select select-borderless'
                      classNamePrefix='select'
                      components={{ Option: SelectComponent }}
                    />
                  )}
                />
              </div>
              {errors && errors.email_to ? (
                <div className="invalid-feedback d-block">{errors.email_to?.message}</div>
              ) : null}
              <div>
                <a href='/' className='toggle-cc text-body me-1' onClick={toggleCC}>Cc</a>
                <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>Bcc</a>
              </div>
            </div>

            {store.ccOpen === true ? (
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
                        options={store.userOptions}
                        placeholder={ValidationSchema.email_cc && ValidationSchema.email_cc.placeholder}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{ Option: SelectComponent }}
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

            {store.bccOpen === true ? (
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
                        options={store.userOptions}
                        placeholder={ValidationSchema.email_bcc && ValidationSchema.email_bcc.placeholder}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{ Option: SelectComponent }}
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
              <Label for='subject' className='form-label'>Subject:</Label>
              <Controller
                defaultValue=""
                id='subject'
                name='subject'
                control={control}
                rules={ValidationSchema.subject}
                render={({ field }) => <Input
                  {...field}
                  placeholder={ValidationSchema.subject && ValidationSchema.subject.placeholder}
                  invalid={errors.subject && true}
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
                    Send
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
                <Trash className='cursor-pointer' size={18} onClick={() => dispatch(toggleCompose())} />
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Draggable>
  ) : null
}

export default React.memo(ModalComposeMail)
