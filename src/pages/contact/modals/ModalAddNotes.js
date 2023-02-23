/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Constant
import {
  contactNoteItem
} from '@constant/reduxConstant'

// ** Store & Actions
import {
  addContactNote,
  updateContactLoader,
  clearContactMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Row,
  Form,
  Label,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// ** Utils
import {
  htmlToString
} from '@utils'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const ModalAddNotes = ({
  open,
  ContactID,
  toggleModal
}) => {
  // ** Hooks
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.contact)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: contactNoteItem
  })

  // ** States
  const [editorHtmlContent, setEditorHtmlContent] = useState("")

  const onAlertMessage = (message, title, icon) => {
    MySwal.fire({
      title: title || 'Warning',
      text: message || 'Something went wrong!',
      icon: icon || 'warning',
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

  const handleReset = () => {
    setEditorHtmlContent("")
    reset(contactNoteItem)
    toggleModal()
  }

  const handleEditorStateChange = (state) => {
    // console.log("handleEditorStateChange >>>> ", state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearContactMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "NOTE_ADDED") {
      handleReset()
    }
  }, [store.success, store.error, store.actionFlag])

  /* Submitting data */
  const onSubmit = async (values) => {
    if (!htmlToString(editorHtmlContent.trim())) {
      onAlertMessage("Content is required!", "Warning", 'warning')
      return
    }

    if (values) {
      const noteData = {
        ContactID: ContactID
      }

      if (editorHtmlContent) {
        noteData.Notes = editorHtmlContent
      }

      /* Calling api */
      dispatch(updateContactLoader(false))
      dispatch(addContactNote(noteData))
    }
  }

  return store ? (
    <div className="disabled-backdrop-modal">
      <Modal
        isOpen={open}
        toggle={handleReset}
        className="modal-dialog-centered modal-lg"
        backdrop="static"
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Add Notes")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="mb-1">
              <Label className="form-label" for="Notes" />
              <Controller
                defaultValue=""
                control={control}
                id='Notes'
                name='Notes'
                render={({ field }) => (
                  <Editor
                    {...field}
                    toolbar={{
                      options: ['blockType', 'inline', 'list'],
                      blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
                      },
                      inline: {
                        inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                      }
                    }}
                    onEditorStateChange={handleEditorStateChange}
                    placeholder={T("Add Comment")}
                  />
                )}
              />
              {!htmlToString(editorHtmlContent.trim()) ? (
                <FormFeedback className="d-block">{T(`Notes is required!`)}</FormFeedback>
              ) : (
                <FormFeedback className="d-block">{errors.Notes?.message}</FormFeedback>
              )}
            </div>

            <Row className="mt-2 mb-2">
              <div className="d-flex justify-content-end">
                <Button
                  type="submit"
                  color="primary"
                  disabled={!store.loading}
                >
                  {T("Submit")}
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalAddNotes
