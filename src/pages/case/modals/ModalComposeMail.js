/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import {
  createCaseLetter,
  updateCaseLetter,
  updateCaseLoader,
  clearCaseMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'

// ** Reactstrap Imports
import {
  Row,
  Form,
  Input,
  Label,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// Constant
import {
  recordItem
} from '@constant/reduxConstant'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Utils
import {
  getTransformDate
} from '@utils'

// ** Office Editor Component
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { EditorState, ContentState, convertToRaw } from 'draft-js'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const ModalComposeMail = ({
  open,
  caseData,
  toggleModal,
  fighterData,
  messageRowData,
  setMessageRowData
}) => {
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  // ** States
  const [editorStateContent, setEditorStateContent] = useState(messageRowData.Content)
  const [editorHtmlContent, setEditorHtmlContent] = useState(messageRowData.Content)

  const getInitialHTML = (value) => {
    const contentBlock = htmlToDraft(value)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorStateContent(editorState)
      return editorState
    }
    return value
  }

  const ValidationSchema = {
    subject: {
      placeholder: "Subject",
      required: "Subject is required!"
    },
    message: {
      placeholder: "Message",
      required: "Message is required!"
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: messageRowData
  })

  const handleReset = async () => {
    setEditorHtmlContent('')
    if (recordItem && recordItem.Content) {
      recordItem.Content = await getInitialHTML(recordItem.Content)
    }
    reset(recordItem)
    setMessageRowData(recordItem)
    toggleModal()
  }

  const handleEditorStateChange = (state) => {
    // console.log("handleEditorStateChange >>> ", state)
    setEditorStateContent(state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }
  // ** Get contact on mount based on id
  useEffect(() => {
    
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && (store.actionFlag === "LETTER_CREATED" || store.actionFlag === "LETTER_UPDATED" || store.actionFlag === "LETTER_DELETED")) {
      handleReset()
    }

    if (messageRowData && messageRowData.id) {
      reset(messageRowData)
    }
    getInitialHTML(messageRowData.Content)
  }, [dispatch, messageRowData, store.success, store.error, store.actionFlag])
  // console.log("store >>> ", store)

  /* Submitting data */
  const onSubmit = async (values) => {
    if (values) {
      const letterData = {
        id: values.id,
        case_id: caseData.CaseID,
        subject: values.Subject,
        message: values.message
      }

      if (editorHtmlContent) {
          letterData.message = editorHtmlContent
      }

      if (values.fristDate && values.fristDate.length) {
        letterData.frist_date = getTransformDate(values.fristDate[0], "YYYY-MM-DD")
      } else if (values.fristDate) {
        letterData.frist_date = getTransformDate(values.fristDate, "YYYY-MM-DD")
      }

      // console.log("onSubmit File >>> ", letterData, values)
      if (letterData && letterData.case_id) {
        if (letterData.id) {
          dispatch(updateCaseLetter(letterData))
        } else {
          dispatch(createCaseLetter(letterData))
        }
        dispatch(updateCaseLoader(false))
      }
    }
  }


  return store ? (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
        backdrop="static"
      >
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Write e-mail")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <div className='mb-1'>
                <Label className='form-label' for='subject'>
                  Subject
                </Label>
                <Controller
                  defaultValue={`[Ticket#:${(new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)}]Case ID: ${caseData.CaseID}${caseData && caseData.type && caseData.type.CaseTypeID ? `, Case Type: ${caseData.type.CaseTypeName}` : ''}${fighterData && fighterData.name ? `, fighting Against: ${fighterData.name} ${fighterData.last_name}` : ''}`}
                  id='Subject'
                  name='Subject'
                  control={control}
                  rules={ValidationSchema.subject}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.subject && ValidationSchema.subject.placeholder} invalid={errors.Subject && true} />}
                />
                <FormFeedback>{errors.Subject?.message}</FormFeedback>
              </div>

              <div className='mb-1'>
                <Label className='form-label' for='message'>
                  Message
                </Label>
                <Controller
                  defaultValue=""
                  id='message'
                  name='message'
                  control={control}
                  rules={ValidationSchema.message}
                  render={({ field }) => <Editor
                    {...field}
                    editorState={editorStateContent}
                    onEditorStateChange={handleEditorStateChange}
                    placeholder={ValidationSchema.message && ValidationSchema.message.placeholder}
                />
                }
                />
                <FormFeedback>{errors.message?.message}</FormFeedback>
              </div>


            </Row>

            <Row className='mb-2 mt-2'>
              <div className="d-flex justify-content-end">
                  <Button
                    type='submit'
                    color="primary"
                    disabled={!store.loading}
                  >
                    {T("Send E-Mail")}
                  </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalComposeMail
