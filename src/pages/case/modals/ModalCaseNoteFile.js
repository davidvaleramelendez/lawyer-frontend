/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import { clearCaseMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'

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

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalCaseNoteFile = ({
  open,
  caseId,
  toggleModal
}) => {
  //** State Constant */
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [fileModalOpen, setFileModalOpen] = useState(false)

  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const handleReset = () => {
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("caseId Model >>>> ", caseId)

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered'
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{t("Add notes or file")}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6} md={6} lg={6}>
              <Button
                color='primary'
                className="btn btn-primary w-100"
                onClick={() => setNoteModalOpen(true)}
              >
                {t("Add notes")}
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
                {t("Add file")}
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
