/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import {
  updateCaseLoader,
  createCaseAttachment,
  deleteCaseAttachment,
  createNoteCaseRecord
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
  X,
  Paperclip
} from 'react-feather'

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

// ** Custom Components
import DotPulse from '@components/dotpulse'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'

const ModalCaseAddNoteFile = ({
  open,
  caseId,
  toggleModal,
  recordRowData
}) => {
  // * State Constant
  const [uploadedFiles, setUploadedFiles] = useState([])

  const MySwal = withReactContent(Swal)

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
  } = useForm({
    mode: 'all',
    defaultValues: recordRowData
  })

  const handleReset = () => {
    reset(recordRowData)
    toggleModal()
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
      dispatch(deleteCaseAttachment({ id: id }))
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
            dispatch(updateCaseLoader(false))
            dispatch(createCaseAttachment({ attachment: fileArray, type: 'case_record', ids: ids }))
          }
        }
      }))
    }
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* Updating uploaded files */
    if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
      setUploadedFiles(store.attachments)
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "FILE_RECORD_ADDED") {
      setUploadedFiles(store.attachments)
      handleReset()
    }
  }, [store.actionFlag])

  /* Submitting data */
  const onSubmit = async (values) => {
    if (!uploadedFiles.length) {
      onAlertMessage('Please upload files', `File is required!`, 'warning')
      return
    }

    if (values) {
      const recordData = {
        CaseID: caseId,
        type: "File",
        Subject: values.Subject,
        Content: values.Content,
        IsShare: 0
      }

      if (uploadedFiles && uploadedFiles.length) {
        recordData.attachment_ids = uploadedFiles.map((t) => t.id)
      }

      if (recordData && recordData.CaseID) {
        dispatch(updateCaseLoader(false))
        dispatch(createNoteCaseRecord(recordData))
      }
      // console.log("onSubmit File >>> ", recordData)
    }
  }

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        backdrop="static"
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Add")} {T("Record")}</ModalHeader>
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
                <FormFeedback>{errors.Subject?.message}</FormFeedback>
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
                <FormFeedback>{errors.Content?.message}</FormFeedback>
              </div>

              <div className='mb-1'>
                <Controller
                  defaultValue=""
                  id='File'
                  name='File'
                  control={control}
                  render={({ field }) => <InputGroup>
                    <Input
                      {...field}
                      type="file"
                      multiple
                      onChange={(event) => onFileChange(event)}
                      invalid={!uploadedFiles.length && true}
                    />
                  </InputGroup>}
                />
              </div>

              <div className="mb-1">
                {uploadedFiles && uploadedFiles.length ? <>
                  <div className="case-note-attachments mt-1 mb-1">
                    {uploadedFiles.map((item, index) => {
                      return (
                        <div className="inline" key={`attachment_${index}`}>
                          <Paperclip className='cursor-pointer ms-50 me-1' size={17} />

                          {item && item.path ? (<a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.path}`} target="_blank" className="me-1">{item.name}</a>) : null}

                          <a
                            href={`${adminRoot}/case/view/${caseId}`}
                            onClick={(event) => onFileRemove(event, item.id)}
                          >
                            <X className='cursor-pointer ms-50' size={17} />
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </> : null}
              </div>
            </Row>

            <Row className='mb-2 mt-2'>
              <div className="d-flex justify-content-end">
                <Button
                  type='submit'
                  color='primary'
                  disabled={!store.loading}
                >
                  {T("Add")}
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseAddNoteFile
