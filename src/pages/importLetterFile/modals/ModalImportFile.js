/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Store & Actions
import {
  updateImportLetterFileLoader,
  createMultipleImportLetterFile,
  clearImportLetterFileMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Modal,
  Input,
  ModalBody,
  InputGroup,
  ModalHeader
} from 'reactstrap'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Translation
import { T } from '@localization'

const ModalImportFile = ({ open, toggleModal }) => {
  // ** Hook
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.importLetterFile)

  /* Swal Alert */
  const onAlertMessage = (title, text, icon) => {
    MySwal.fire({
      title: title ?? T('File limit exceeded!'),
      text: text ?? T('File uploading size exceeded!'),
      icon: icon ?? 'warning',
      showCancelButton: false,
      confirmButtonText: T('Okay'),
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
      }
    })
  }
  /* /Swal Alert */

  const handleReset = () => {
    toggleModal()
  }

  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearImportLetterFileMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "IMPORT_FILES_CREATED") {
      handleReset()
    }
  }, [store.success, store.error, store.actionFlag])

  /* File uploading */
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
        event.target.value = ""
        onAlertMessage(T('File limit exceeded!'), `${T('Please upload max')} ${process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE} mb ${T('files')}!`, 'warning')
        return
      }

      result.map(((file, index) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onloadend = async () => {
          const res = await fileReader.result
          const name = file.name || ""
          let fileName = file.name || ""
          let extension = ""
          if (fileName) {
            fileName = fileName.split('.')
            if (fileName && fileName.length > 0) {
              extension = fileName[fileName.length - 1]
            }
          }

          fileArray.push({ name: name, extension: extension, file: res })
          fileFlag = false

          if (result.length - 1 === index) {
            fileFlag = true
          }

          if (fileFlag) {
            event.target.value = ""
            const fileData = {
              attachments: fileArray
            }

            dispatch(updateImportLetterFileLoader(false))
            dispatch(createMultipleImportLetterFile(fileData))
          }
        }
      }))
    }
  }
  /* /File uploading */

  return store ? (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        backdrop="static"
        toggle={handleReset}
        className="modal-dialog-centered modal-md"
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Import Files")}</ModalHeader>

        <ModalBody>
          <div className="mb-1">
            <InputGroup>
              <Input
                multiple
                type="file"
                name="attachments"
                autoComplete="off"
                accept="application/pdf"
                onChange={(event) => onFileChange(event)}
              />
            </InputGroup>
          </div>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalImportFile
