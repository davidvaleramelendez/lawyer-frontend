/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  createCaseDocument,
  updateCaseDocument,
  deleteCaseDocument,
  updateCaseLoader,
  clearCaseMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Reactstrap Imports
import {
  Row,
  Form,
  Input,
  Label,
  Modal,
  Button,
  ModalBody,
  InputGroup,
  ModalHeader,
  FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// Constant
import {
  caseDocItem
} from '@constant/reduxConstant'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalCaseDocument = ({
  open,
  userId,
  caseId,
  toggleModal,
  documentRowData,
  setDocumentRowData
}) => {
  // ** Hooks
  const { t } = useTranslation()
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const ValidationSchema = {
    title: {
      placeholder: "Title",
      required: "Title is required!"
    },
    description: {
      placeholder: "Description",
      required: "Description is required!"
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: documentRowData
  })

  // * State Constant
  const [docFileUrl, setDocFileUrl] = useState('')

  const handleReset = () => {
    reset(caseDocItem)
    setDocFileUrl('')
    setDocumentRowData(caseDocItem)
    toggleModal()
  }


  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && (store.actionFlag === "DOCUMENT_CREATED" || store.actionFlag === "DOCUMENT_UPDATED" || store.actionFlag === "DOCUMENT_DELETED")) {
      handleReset()
    }

    if (documentRowData && documentRowData.id) {
      reset(documentRowData)
    }
  }, [dispatch, documentRowData, store.success, store.error, store.actionFlag])
  // console.log("documentRowData >>> ", documentRowData)

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

  /* Doc file uploading */
  const onDocFileChange = (event) => {
    const fileReader = new FileReader()
    const files = event.target.files

    if (files && files.length > 0) {
      if (files[0].size) {
        const fileSizeKiloBytes = files[0].size / 1024
        const uploadLimit = process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE * 1024
        if (fileSizeKiloBytes > uploadLimit) {
          onAlertMessage('File limit exceeded!', `Please upload max ${process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE} mb files!`, 'warning')
          return
        }
      }

      if (files && files[0] && files[0].type) {
        if (!files[0].type.includes("doc")) {
          onAlertMessage('Uploading file', `Please upload document file!`, 'warning')
          return
        }
      }

      fileReader.onloadend = async () => {
        setDocFileUrl(fileReader.result)
      }
      fileReader.readAsDataURL(files[0])
    }
  }

  /* Submitting data */
  const onSubmit = async (values) => {
    if (!docFileUrl && !values.id) {
      onAlertMessage('Upload file', `Please attach a document!`, 'warning')
    }

    if (values) {
      const docsData = {
        id: values.id,
        user_id: userId,
        case_id: caseId,
        title: values.title,
        description: values.description
      }

      if (docFileUrl) {
        docsData.attachment = docFileUrl
      }

      if (docsData && docsData.case_id) {
        dispatch(updateCaseLoader(false))
        if (docsData.id) {
          dispatch(updateCaseDocument(docsData))
        } else {
          dispatch(createCaseDocument(docsData))
        }
      }
      // console.log("onSubmit File >>> ", docsData)
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
        dispatch(deleteCaseDocument(docId))
      }
    })
  }

  return (
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

        <ModalHeader toggle={handleReset}>{documentRowData.id ? t("View") : t("Upload")} {t("document")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <div className='mb-1'>
                <Label className='form-label' for='title'>
                  Title
                </Label>
                <Controller
                  defaultValue=""
                  id='title'
                  name='title'
                  control={control}
                  rules={ValidationSchema.title}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.title && ValidationSchema.title.placeholder} invalid={errors.title && true} />}
                />
                <FormFeedback>{errors.title?.message}</FormFeedback>
              </div>

              <div className='mb-1'>
                <Label className='form-label' for='description'>
                  Description
                </Label>
                <Controller
                  defaultValue=""
                  id='description'
                  name='description'
                  control={control}
                  rules={ValidationSchema.description}
                  render={({ field }) => <Input {...field} type="textarea" placeholder={ValidationSchema.description && ValidationSchema.description.placeholder} invalid={errors.description && true} />}
                />
                <FormFeedback>{errors.description?.message}</FormFeedback>
              </div>

              {documentRowData && !documentRowData.id ? (
                <div className='mb-1'>
                  <InputGroup>
                    <Input
                      name="attachment"
                      type="file"
                      accept=".doc, .docx"
                      onChange={(event) => onDocFileChange(event)}
                      invalid={!docFileUrl && !documentRowData.id && true}
                    />
                  </InputGroup>
                </div>
              ) : null}
            </Row>

            <Row className='mb-2 mt-2'>
              <div className="d-flex justify-content-end">
                {documentRowData && documentRowData.id ? (<>
                  <Button
                    type="submit"
                    color="primary"
                    className="me-1"
                    disabled={!store.loading}
                  >
                    {t("Update")}
                  </Button>

                  <Button
                    type="button"
                    color="danger"
                    disabled={!store.loading}
                    onClick={() => onDeleteDocument(documentRowData.id)}
                  >
                    {t("Delete")}
                  </Button>
                </>) : (
                  <Button
                    type="submit"
                    color="primary"
                    disabled={!store.loading}
                  >
                    {t("Upload")}
                  </Button>
                )}
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseDocument
