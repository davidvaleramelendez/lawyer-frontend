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
  ModalHeader
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

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

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.contact)

  /* Yup validation schema */
  const NoteSchema = yup.object({
    Notes: yup.object().shape({
      blocks: yup.array().of(yup.object().shape({
        text: yup.string().required(T(`Notes is required!`))
      }).required(`Notes is required!`).nullable()).required(`Notes is required!`).nullable()
    }).required(`Notes is required!`).nullable()
  }).required()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: contactNoteItem,
    resolver: yupResolver(NoteSchema)
  })

  // ** States
  const [editorHtmlContent, setEditorHtmlContent] = useState("")

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
    if (values) {
      const noteData = {
        ContactID: ContactID
        // Notes: values.Notes
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
          <Spinner
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
              <div className="invalid-feedback d-block">{errors.Notes?.message || (errors.Notes?.blocks && errors.Notes.blocks[0]?.text?.message)}</div>
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
