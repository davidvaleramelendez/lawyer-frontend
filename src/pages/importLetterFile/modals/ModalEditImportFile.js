/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Store & Actions
import {
  updateImportLetterFile,
  updateImportLetterFileLoader,
  clearImportLetterFileMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
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
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Utils
import {
  getTransformDate
} from '@utils'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Constant
import {
  importLetterFileItem
} from '@constant/reduxConstant'

// ** Translation
import { T } from '@localization'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const ModalEditImportFile = ({ open, toggleModal }) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.importLetterFile)

  /* Yup validation schema */
  const ImportSchema = yup.object({
    case_id: yup.string().required(T('CaseID is required!')),
    frist_date: yup.date().required(T("Deadline Date is required!")).nullable(),
    subject: yup.string().required(T('Subject is required!'))
  }).required()
  /* /Yup validation schema */

  const PlaceholderSchema = {
    caseId: "CaseId",
    fristDate: "YYYY-MM-DD",
    subject: "Subject"
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: { ...store.importLetterFileItem },
    resolver: yupResolver(ImportSchema)
  })

  const handleModalOpened = () => {
    const importLetterFileItem = { ...store.importLetterFileItem }
    if (!importLetterFileItem.frist_date) {
      importLetterFileItem.frist_date = new Date()
    }

    reset(importLetterFileItem)
  }

  const handleReset = () => {
    reset(importLetterFileItem)
    toggleModal()
  }

  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearImportLetterFileMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "IMPORT_FILE_UPDATED") {
      handleReset()
    }
  }, [store.success, store.error, store.actionFlag])

  /* Submitting data */
  const onSubmit = (values) => {
    if (values) {
      const importData = {
        id: values.id,
        case_id: values.case_id,
        subject: values.subject
      }

      if (values.frist_date && typeof values.frist_date !== 'string' && values.frist_date.length) {
        importData.frist_date = getTransformDate(values.frist_date[0], "YYYY-MM-DD")
      } else if (values.frist_date) {
        importData.frist_date = getTransformDate(values.frist_date, "YYYY-MM-DD")
      }

      if (importData && importData.id) {
        dispatch(updateImportLetterFileLoader(false))
        dispatch(updateImportLetterFile(importData))

      }
    }
  }

  return store ? (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        backdrop="static"
        toggle={handleReset}
        onOpened={handleModalOpened}
        className="modal-dialog-centered modal-lg"
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Import Letter File")}</ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="mb-1">
              <Label className="form-label" for="case_id">
                {T("CaseId")}
              </Label>
              <Controller
                defaultValue=""
                id="case_id"
                name="case_id"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.caseId} invalid={errors.case_id && true} />
                )}
              />
              <FormFeedback>{errors.case_id?.message}</FormFeedback>
            </div>

            <div className="mb-1">
              <Label className="form-label" for="frist_date">
                {T("Deadline Date")}
              </Label>
              <Controller
                defaultValue={null}
                id="frist_date"
                name="frist_date"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    options={{
                      enableTime: false,
                      dateFormat: "Y-m-d"
                    }}
                    className="form-control"
                    placeholder={PlaceholderSchema && PlaceholderSchema.fristDate}
                  />
                )}
              />
              <FormFeedback className="d-block">{errors.frist_date?.message}</FormFeedback>
            </div>

            <div className="mb-1">
              <Label className="form-label" for="subject">
                {T("Subject")}
              </Label>
              <Controller
                defaultValue=""
                id="subject"
                name="subject"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.subject} invalid={errors.subject && true} />
                )}
              />
              <FormFeedback>{errors.subject?.message}</FormFeedback>
            </div>

            <div className="d-flex justify-content-end mb-2 mt-2">
              <Button
                type="submit"
                className="me-1"
                color="primary"
              >
                {T("Submit")}
              </Button>

              <Button
                outline
                color="secondary"
                onClick={handleReset}
              >
                {T("Cancel")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalEditImportFile
