// ** React Import
import { useEffect, useState } from "react"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { setFormPreviewList, setSelectedItem } from "./store"

// ** Reactstrap Import
import { Alert, Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"

// ** Translation
import { T } from "@localization"

// ** Third Party Module Import
import _ from "lodash"
import { AlertCircle, Plus, Trash } from "react-feather"

const EditFormModal = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.formBuilder)
  const {formPreviewList, selectedItem} = store

  // ** State Vars
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [placeholder, setPlaceholder] = useState(null)
  const [list, setList] = useState(null)
  const [alert, setAlert] = useState(null)

  let formDetails = {}
  if (selectedItem.rowIndex !== undefined) {
    formDetails = formPreviewList[selectedItem.rowIndex][selectedItem.colIndex]
  }

  useEffect(() => {
    if (selectedItem.rowIndex === undefined) return
    setTitle(formDetails.title)
    setName(formDetails.name)
    setDescription(formDetails.description)
    setPlaceholder(formDetails.placeholder ?? null)
    setList(formDetails.list ?? null)
  }, [selectedItem])

  const toggleModal = () => {
    dispatch(setSelectedItem({}))
  }

  const getErrorMessage = () => {
    const flattenPreviewList = formPreviewList.flat(1)
    if (title.trim() === "") {
      return 'The title is required.'
    } else if (flattenPreviewList.find(item => item.title === title && item.id !== formDetails.id)) {
      return 'The title should be unique'
    } else if (name.trim() === "") {
      return 'The name is required.'
    } else if (flattenPreviewList.find(item => item.name === name && item.id !== formDetails.id)) {
      return 'The name should be unique'
    } else if (list && list.length === 0) {
      return 'The list is required.'
    } else if (list) {
      // List value and label check
      const emptyItem = list.find(item => item.value === "" || item.label === "")
      if (emptyItem) return 'One of label or value in list is empty.'
      // Unique check
      const values = list.map(item => item.value)
      if (values.length !== [...new Set(values)].length) return 'The value in list should be unique.'
      const labels = list.map(item => item.label)
      if (labels.length !== [...new Set(labels)].length) return 'The label in list should be unique.'
    }
    return null
  }

  const handleUpdate = () => {
    const error = getErrorMessage()
    if (error) {
      setAlert(error)
      return
    }
    setAlert(null)
    const newFormPreviewList = _.cloneDeep(formPreviewList)
    const {rowIndex, colIndex} = selectedItem
    let newForm = newFormPreviewList[rowIndex][colIndex]
    newForm = {
      ...newForm,
      title,
      name,
      description,
      placeholder,
      list
    }
    newFormPreviewList[rowIndex][colIndex] = newForm
    dispatch(setFormPreviewList(newFormPreviewList))
    dispatch(setSelectedItem({}))
  }

  const handleAddList = () => {
    setList([
      ...list,
      { value: '', label: '' }
    ])
  }

  const handleDeleteList = (index) => () => {
    const newList = [...list]
    newList.splice(index, 1)
    setList(newList)
  }

  const handleUpdateList = (index, key) => (e) => {
    const newList = _.cloneDeep(list)
    newList[index][key] = e.target.value
    setList(newList)
  }

  return (
    <Modal
      isOpen={selectedItem.rowIndex !== undefined}
      toggle={toggleModal}
      className="modal-dialog-centered edit-form-modal"
      size="lg"
    >
      <ModalHeader toggle={toggleModal}>
        {T("Edit Form")}
      </ModalHeader>
      <ModalBody>
        <div>
          <Alert color='danger' isOpen={alert !== null}>
            <div className='alert-body'>
              <AlertCircle size={15} />
              <span className='ms-1'>
                {alert ?? ""}
              </span>
            </div>
          </Alert>
          {selectedItem.rowIndex !== undefined ? (
            <div>
              <div className="edit-form-item">
                <Label className='form-label me-auto'>
                  Title
                </Label>
                <Input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="edit-form-item">
                <Label className='form-label me-auto'>
                  Name
                </Label>
                <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="edit-form-item">
                <Label className='form-label me-auto'>
                  Description
                </Label>
                <Input type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              {placeholder && 
                <div className="edit-form-item">
                  <Label className='form-label me-auto'>
                    Placeholder
                  </Label>
                  <Input type='text' value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
                </div>
              }
              {list && 
                <div className="edit-form-item">
                  <Label className='form-label me-auto'>
                    List
                  </Label>
                  <Row className="my-25 text-muted" style={{fontSize: 11}}>
                    <Col xs={5}>Label</Col>
                    <Col xs={5}>Value</Col>
                  </Row>
                  {list.map((item, index) => (
                    <Row className="my-50" key={index}>
                      <Col xs={5}>
                        <Input type='text' value={item.label} bsSize="sm" onChange={handleUpdateList(index, 'label')} />
                      </Col>
                      <Col xs={5}>
                        <Input type='text' value={item.value} bsSize="sm" onChange={handleUpdateList(index, 'value')} />
                      </Col>
                      <Col xs={2}>
                        <Button.Ripple outline block color='danger' size="sm" onClick={handleDeleteList(index)}>
                          <Trash size={14} />
                        </Button.Ripple>
                      </Col>
                    </Row>
                  ))}
                  <Row>
                    <Col xs={{ offset: 10, size: 2 }}>
                      <Button.Ripple outline block color='primary' size="sm" onClick={handleAddList}>
                        <Plus size={14} />
                      </Button.Ripple>
                    </Col>
                  </Row>
                </div>
              }
            </div>
          ) : null}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button.Ripple color="primary" onClick={handleUpdate}>
          Update
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default EditFormModal