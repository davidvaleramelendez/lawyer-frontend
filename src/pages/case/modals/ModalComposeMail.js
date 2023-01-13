/* eslint-disable object-shorthand */

// ** React Imports
import React, { useEffect, useState } from 'react'

// ** Store & Actions
import {
  toggleCompose,
  setComposeMailTo,
  resetComposeModal,
  setComposeSubject,
  setComposeMaximize,
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
  Trash,
  Maximize2,
  Minimize2
} from 'react-feather'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** React draggable Import
import Draggable from 'react-draggable'

// ** Constant
import {
  emailItem
} from '@constant/reduxConstant'

// ** Third Party Components
import ResizeObserver from 'resize-observer-polyfill'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'

// ** Styles
import '@styles/react/apps/app-email.scss'
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const ModalComposeMail = ({
  caseData
}) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  // ** States
  const [resized, setResized] = useState(false)
  const [editorState, setEditorState] = useState(null)
  const [mailToValid, setMailToValid] = useState(true)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: store.composeModal
  })

  // ** close compose modal
  const closeModal = () => {
    setEditorState(null)
    dispatch(resetComposeModal())
  }

  // ** delete draft and close compose modal
  const deleteAndClose = () => {
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
      email_to: store.composeModal.mailTo
    }

    if (store.composeModal && store.composeModal.subject) {
      mailData.subject = store.composeModal.subject
    }

    if (store.composeModal.editorHtmlContent) {
      mailData.message = store.composeModal.editorHtmlContent
    }

    console.log("onSubmit mailData >>> ", mailData)
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
                    // placeholder={ValidationSchema.body && ValidationSchema.body.placeholder}
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
              </div>

              <div className='footer-action d-flex align-items-center'>
                <Trash className='cursor-pointer' size={18} onClick={deleteAndClose} />
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Draggable>
  )
}

export default React.memo(ModalComposeMail)
