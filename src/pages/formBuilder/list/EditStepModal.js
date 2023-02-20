// ** React Import
import { useState } from "react"

// ** Reactstrap Import
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

// ** Translation
import { T } from "@localization"
import { useDispatch } from "react-redux"
import { addStepItem } from "../store"

const EditStepModal = ({modalOpen, setModalOpen}) => {

  const dispatch = useDispatch()

  // ** State Vars
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const handleCreateStep = () => {
    dispatch(addStepItem({name, description}))
    setName("")
    setDescription("")
    setModalOpen(false)
  }

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }
  
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      className="modal-dialog-centered"
      size="md"
    >
      <ModalHeader toggle={toggleModal}>
        {T("Add Step")}
      </ModalHeader>
      <ModalBody>
        <div className="mt-2">
          <Label className='form-label me-auto'>
              Name
          </Label>
          <Input type='text' value={name} onChange={handleChangeName} />
        </div>
        <div className="my-2">
          <Label className='form-label me-auto'>
              Description
          </Label>
          <Input type='text' value={description} onChange={handleChangeDescription} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button.Ripple color="primary" onClick={handleCreateStep}>
          Update
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default EditStepModal