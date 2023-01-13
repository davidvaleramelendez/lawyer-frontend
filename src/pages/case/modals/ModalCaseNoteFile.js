/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import { useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Modal,
  Button,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// Modals
import ModalCaseAddNoteText from './ModalCaseAddNoteText'
import ModalCaseAddNoteFile from './ModalCaseAddNoteFile'

// ** Translation
import { T } from '@localization'

const ModalCaseNoteFile = ({
  open,
  caseId,
  toggleModal
}) => {
  //** State Constant */
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [fileModalOpen, setFileModalOpen] = useState(false)

  // ** Store vars
  const store = useSelector((state) => state.cases)

  const handleReset = () => {
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
  }, [])
  // console.log("caseId Model >>>> ", caseId)

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered'
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{T("Add notes or file")}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6} md={6} lg={6}>
              <Button
                color='primary'
                className="btn btn-primary w-100"
                onClick={() => setNoteModalOpen(true)}
              >
                {T("Add notes")}
              </Button>

              <ModalCaseAddNoteText
                open={noteModalOpen}
                toggleModal={() => setNoteModalOpen(!noteModalOpen)}
                caseId={caseId}
                recordRowData={store.recordItem}
              />
            </Col>

            <Col xl={6} md={6} lg={6}>
              <Button
                color='primary'
                className="btn btn-primary w-100"
                onClick={() => setFileModalOpen(true)}
              >
                {T("Add file")}
              </Button>

              <ModalCaseAddNoteFile
                open={fileModalOpen}
                toggleModal={() => setFileModalOpen(!fileModalOpen)}
                caseId={caseId}
                recordRowData={store.recordItem}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseNoteFile
