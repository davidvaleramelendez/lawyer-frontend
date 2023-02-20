// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { setDeleteItem, updateStepDetails } from "../store"

// ** Route Import
import { useParams } from "react-router-dom"

// ** Reactstrap Import
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

// ** Third Party Module Import
import _ from "lodash"

// ** Icon Import
import { AlertCircle } from "react-feather"

// ** Translation
import { T } from "@localization"

const AlertModal = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  const deleteItem = useSelector((state) => state.formBuilder.deleteItem)
  const stepDetails = useSelector((state) => state.formBuilder.stepDetails)

  // ** Hook
  const stepId = useParams()

  const toggleModal = () => {
    dispatch(setDeleteItem())
  }

  const handleDelete = () => {
    const { rowIndex, colIndex } = deleteItem
    if (rowIndex === null) return
    if (colIndex === null) {
      // Delete Row
      const newStepDetails = [...stepDetails]
      newStepDetails.splice(rowIndex, 1)
      dispatch(updateStepDetails({
        data: newStepDetails, id: stepId
      }))
    } else {
      // Delete Item
      const newStepDetails = _.cloneDeep(stepDetails)
      newStepDetails[rowIndex][colIndex] = {}
      dispatch(updateStepDetails({
        data: newStepDetails, id: stepId
      }))
    }
    dispatch(setDeleteItem())
  }

  return (
    <Modal
      isOpen={deleteItem.rowIndex !== null}
      toggle={toggleModal}
      className="modal-dialog-centered edit-form-modal"
      modalClassName="modal-danger"
    >
      <ModalHeader toggle={toggleModal}>
        {T("Confirm")}
      </ModalHeader>
      <ModalBody>
        <div className="text-center my-75 py-75">
          <div className="mb-75 pb-75">
            <AlertCircle size={50} />
          </div>
          <div>{T("Are you sure to delete it?")}</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete}>Yes</Button>
        <Button color="secondary" onClick={toggleModal}>No</Button>
      </ModalFooter>
    </Modal>
  )
}

export default AlertModal