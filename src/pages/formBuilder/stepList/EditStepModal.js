// ** React Import
import { useEffect, useState } from "react"

// ** Reactstrap Import
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

// ** Translation
import { T } from "@localization"

// ** Redux Import
import { useDispatch } from "react-redux"
import { updateStep } from "../store"

const EditStepModal = ({item, setEditStep}) => {

  const dispatch = useDispatch()

  // ** State Vars
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const toggleModal = () => {
    setEditStep(null)
  }

  useEffect(() => {
    setName(item?.name ?? '')
    setDescription(item?.description ?? '')
  }, [item])

  const handleUpdateStep = () => {
    dispatch(updateStep({
        id: item.id,
        name, 
        description
    }))
    setEditStep(null)
  }

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }
  
  return (
    <Modal
      isOpen={item !== null}
      toggle={toggleModal}
      className="modal-dialog-centered"
      size="md"
    >
      <ModalHeader toggle={toggleModal}>
        {T("Edit Step")}
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
        <Button.Ripple color="primary" onClick={handleUpdateStep}>
          Update
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default EditStepModal