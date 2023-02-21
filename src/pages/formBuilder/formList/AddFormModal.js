// ** React Import
import { useState } from "react"

// ** Reactstrap Import
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

// ** Translation
import { T } from "@localization"

// ** Redux Import
import { useDispatch } from "react-redux"
import { createForm } from "../store"

const AddFormModal = ({modalOpen, setModalOpen}) => {

  const dispatch = useDispatch()

  // ** State Vars
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [type, setType] = useState(false)

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const handleCreateForm = () => {
    dispatch(createForm({name, description, link, type}))
    setName("")
    setDescription("")
    setLink("")
    setType(false)
    setModalOpen(false)
  }

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleChangeLink = (e) => {
    setLink(e.target.value)
  }

  const handleChangeType = (e) => {
    setType(e.target.checked)
  }
  
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      className="modal-dialog-centered"
      size="md"
    >
      <ModalHeader toggle={toggleModal}>
        {T("Add Form")}
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
        <div className="my-2">
          <Label className='form-label me-auto'>
              Link
          </Label>
          <Input type='text' value={link} onChange={handleChangeLink} />
        </div>
        <div className='form-check my-2'>
          <Input type='checkbox' id="is_public" checked={type} onChange={handleChangeType} />
          <Label className='form-check-label' for="is_public">
            Public
          </Label>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button.Ripple color="primary" onClick={handleCreateForm}>
          Create
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default AddFormModal