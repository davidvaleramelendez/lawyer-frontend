/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  createCaseLetter,
  updateCaseLetter,
  deleteCaseLetter,
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
  letterItem
} from '@constant/reduxConstant'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Utils
import {
  getTransformDate
} from '@utils'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const ModalCaseLetter = ({
  open,
  caseData,
  toggleModal,
  fighterData,
  letterRowData,
  setLetterRowData
}) => {
  // ** Hooks
  const { t } = useTranslation()
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

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
    defaultValues: letterRowData
  })

  const handleReset = () => {
    reset(letterItem)
    setLetterRowData(letterItem)
    toggleModal()
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

    if (letterRowData && letterRowData.id) {
      reset(letterRowData)
    }
  }, [dispatch, letterRowData, store.success, store.error, store.actionFlag])
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

  /* Delete case document */
  const onDeleteDocument = (docId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
        dispatch(deleteCaseLetter(docId))
      }
    })
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

        <ModalHeader toggle={handleReset}>{t("Write letter")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <div className='mb-1'>
                <Label className='form-label' for='subject'>
                  Subject
                </Label>
                <Controller
                  defaultValue={letterRowData && letterRowData.subject ? letterRowData.subject : `Case ID: ${caseData.CaseID}${caseData && caseData.type && caseData.type.CaseTypeID ? `, Case Type: ${caseData.type.CaseTypeName}` : ''}${fighterData && fighterData.name ? `, fighting Against: ${fighterData.name} ${fighterData.last_name}` : ''}`}
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
                  render={({ field }) => <Input {...field} type="textarea" rows={6} placeholder={ValidationSchema.message && ValidationSchema.message.placeholder} invalid={errors.message && true} />}
                />
                <FormFeedback>{errors.message?.message}</FormFeedback>
              </div>

              {letterRowData && !letterRowData.id ? (
                <div className='mb-1'>
                  <Label className='form-label' for='frist_date'>
                    Date
                  </Label>
                  <Controller
                    defaultValue={letterRowData.frist_date ? new Date(letterRowData.frist_date) : new Date()}
                    id='fristDate'
                    name='fristDate'
                    control={control}
                    render={({ field }) => <Flatpickr
                      {...field}
                      id='fristDate'
                      className='form-control'
                      options={{
                        enableTime: false,
                        dateFormat: "Y-m-d"
                      }}
                    />}
                  />
                  <FormFeedback>{errors.fristDate?.message}</FormFeedback>
                </div>
              ) : null}
            </Row>

            <Row className='mb-2 mt-2'>
              <div className="d-flex justify-content-end">
                {letterRowData && letterRowData.id ? (<>
                  <Button
                    type='submit'
                    color="primary"
                    className="me-1"
                    disabled={!store.loading}
                  >
                    {t("Update")}
                  </Button>

                  <Button
                    tag="a"
                    type='button'
                    target="_blank"
                    color="success"
                    className="me-1"
                    disabled={!store.loading}
                    href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${letterRowData.pdf_path}`}
                    onClick={(event) => !letterRowData.pdf_path && event.preventDefault()}
                  >
                    {t("Download")} {t("PDF")}
                  </Button>

                  <Button
                    type='button'
                    color="danger"
                    disabled={!store.loading}
                    onClick={() => onDeleteDocument(letterRowData.id)}
                  >
                    {t("Delete")}
                  </Button>
                </>) : (
                  <Button
                    type='submit'
                    color="primary"
                    disabled={!store.loading}
                  >
                    {t("Create")}
                  </Button>
                )}
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalCaseLetter
