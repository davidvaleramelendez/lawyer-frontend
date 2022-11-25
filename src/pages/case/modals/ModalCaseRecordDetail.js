/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Store & Actions
import { clearCaseMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Row,
  Modal,
  Button,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// ** Icons Import
import {
  Paperclip
} from 'react-feather'

// Constant
import {
  recordItem
} from '@constant/reduxConstant'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalCaseRecordDetail = ({
  open,
  toggleModal,
  caseRecordRowData,
  setCaseRecordRowData
}) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const handleReset = () => {
    setCaseRecordRowData(recordItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("caseRecordRowData Model >>>> ", caseRecordRowData)

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        backdrop="static"
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
      >
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>Email</ModalHeader>
        <ModalBody>
          <Row>
            <div className='mb-1'>
              <p>{caseRecordRowData && caseRecordRowData.Subject}</p>
            </div>
            <div className='mb-1'>
              <p>{caseRecordRowData && caseRecordRowData.Content}</p>
            </div>

            <div className="mb-1">
              {caseRecordRowData && caseRecordRowData.attachment && caseRecordRowData.attachment.length ? <>
                <div className="case-note-attachments mt-1 mb-1">
                  {caseRecordRowData.attachment.map((item, index) => {
                    return (
                      <div className="inline" key={`attachment_${index}`}>
                        <Paperclip className='cursor-pointer ms-50 me-1' size={17} />

                        {item && item.path ? (<a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.path}`} target="_blank" className="me-1">{item.name}</a>) : null}
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
                type="button"
                color="primary"
                disabled={!store.loading}
              >
                Send E-Mail
              </Button>
            </div>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseRecordDetail
