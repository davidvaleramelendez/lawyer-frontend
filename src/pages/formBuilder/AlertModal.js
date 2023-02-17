// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { setDeleteItem, updatePreviewList } from "./store"

// ** Reactstrap Import
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

// ** Third Party Module Import
import _ from "lodash"

// ** Translation
import { T } from "@localization"
import { AlertCircle } from "react-feather"

const AlertModal = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  const deleteItem = useSelector((state) => state.formBuilder.deleteItem)
  const formPreviewList = useSelector((state) => state.formBuilder.formPreviewList)

  const toggleModal = () => {
    dispatch(setDeleteItem())
  }

  const handleDelete = () => {
    const { rowIndex, colIndex } = deleteItem
    if (rowIndex === null) return
    if (colIndex === null) {
      // Delete Row
      const newFormPreviewList = [...formPreviewList]
      newFormPreviewList.splice(rowIndex, 1)
      dispatch(updatePreviewList(newFormPreviewList))
    } else {
      // Delete Item
      const newFormPreviewList = _.cloneDeep(formPreviewList)
      newFormPreviewList[rowIndex][colIndex] = {}
      dispatch(updatePreviewList(newFormPreviewList))
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