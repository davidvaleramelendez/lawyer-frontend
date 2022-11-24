/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  createNoteCaseRecord,
  clearCaseMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Row,
  Form,
  Input,
  Label,
  Modal,
  Button,
  ModalBody,
  ModalHeader
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalCaseAddNoteText = ({
  open,
  caseId,
  toggleModal,
  recordRowData
}) => {
  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const ValidationSchema = {
    subject: {
      placeholder: "Subject",
      required: "Subject is required!"
    },
    content: {
      placeholder: "Textarea",
      required: "Content is required!"
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: recordRowData, mode: 'all' })

  const handleReset = () => {
    reset(recordRowData)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "NOTE_RECORD_ADDED") {
      handleReset()
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("recordRowData Model >>>> ", recordRowData)

  /* Submitting data */
  const onSubmit = async (values) => {
    if (values) {
      const recordData = {
        CaseID: caseId,
        type: "Text",
        Subject: values.Subject,
        Content: values.Content,
        IsShare: 0
      }

      if (recordData && recordData.CaseID) {
        dispatch(createNoteCaseRecord(recordData))
      }
      // console.log("onSubmit Text >>> ", recordData)
    }
  }

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{t("Add")} {t("Record")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <div className='mb-1'>
                <Label className='form-label' for='Subject'>
                  Subject
                </Label>
                <Controller
                  defaultValue=""
                  id='Subject'
                  name='Subject'
                  control={control}
                  rules={ValidationSchema.subject}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.subject && ValidationSchema.subject.placeholder} invalid={errors.Subject && true} />}
                />
                <div className="invalid-feedback">{errors.Subject?.message}</div>
              </div>

              <div className='mb-1'>
                <Label className='form-label' for='Content'>
                  Content
                </Label>
                <Controller
                  defaultValue=""
                  id='Content'
                  name='Content'
                  control={control}
                  rules={ValidationSchema.content}
                  render={({ field }) => <Input {...field} type="textarea" placeholder={ValidationSchema.content && ValidationSchema.content.placeholder} invalid={errors.Content && true} />}
                />
                <div className="invalid-feedback">{errors.Content?.message}</div>
              </div>
            </Row>

            <Row className='mb-2 mt-2'>
              <div className="d-flex justify-content-end">
                <Button type='submit' color='primary'>
                  {t("Add")}
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseAddNoteText
