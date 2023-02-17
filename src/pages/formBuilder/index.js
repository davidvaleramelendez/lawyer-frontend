// ** React Import
import React, { useEffect, useState } from "react"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { 
  getPreviewList,
  setDeleteItem,
  setLoading,
  setSelectedItem, 
  updatePreviewList
} from "./store"

// ** Reactstrap Import
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Button
} from "reactstrap"

// ** Icon Import
import { Plus } from "react-feather"

// ** Translation
import { T } from "@localization"

// ** Constants Import
import { formAddItems } from "./constants"

// ** Drag and Drop
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"


// ** Custom Components
import DotPulse from "@components/dotpulse"
import PreviewColItem from "./PreviewColItem"
import AddFormComponent from "./AddFormComponent"
import EditFormModal from "./EditFormModal"
import AlertModal from "./AlertModal"

// ** Style Import
import "@styles/base/pages/app-form-builder.scss"

// ** Third Party Module Import
import _ from "lodash"
import { v4 as uuidv4 } from "uuid"

const FormBuilder = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  const formPreviewList = useSelector((state) => state.formBuilder.formPreviewList)
  const loading = useSelector((state) => state.formBuilder.loading)

  // ** State
  const [formAddList, setFormAddList] = useState(formAddItems)
  
  useEffect(() => {
    dispatch(setLoading(false))
    dispatch(getPreviewList())
  }, [])

  const onDragEnd = (result) => {
    const sourceId = result.source.droppableId
    const destinationId = result.destination?.droppableId ?? ""

    if (sourceId === "add-form" && destinationId === "add-form") {

      const newItem = formAddList.find(item => item.handle === result.draggableId)
      const newFormAddList = formAddList.filter(item => item.handle !== result.draggableId)
      newFormAddList.splice(result.destination.index, 0, newItem)
      setFormAddList(newFormAddList)
    
    } else if (sourceId === "form-preview" && destinationId === "form-preview") {

      // Change order of row
      const newItem = formPreviewList[result.source.index]
      const newFormPreviewList = [...formPreviewList]
      newFormPreviewList.splice(result.source.index, 1)
      newFormPreviewList.splice(result.destination.index, 0, newItem)
      dispatch(updatePreviewList(newFormPreviewList))
    
    } else if (sourceId === "add-form" && destinationId.startsWith("colpreview")) {

      // Add new item
      const rowIndex = Number(destinationId.split('-')[1])
      const colIndex = Number(destinationId.split('-')[2])
      const item = formAddList.find(item => item.handle === result.draggableId)
      const newFormPreviewList = _.cloneDeep(formPreviewList)
      
      newFormPreviewList[rowIndex][colIndex] = {
        id: uuidv4(),
        ...item.default,
        handle: item.handle,
        name: uuidv4()
      }
      dispatch(updatePreviewList(newFormPreviewList))

    } else if (sourceId.startsWith("colpreview") && destinationId.startsWith("colpreview")) {

      // Change order of item
      const sRowIndex = Number(sourceId.split('-')[1])
      const sColIndex = Number(sourceId.split('-')[2])
      const dRowIndex = Number(destinationId.split('-')[1])
      const dColIndex = Number(destinationId.split('-')[2])
      const sItem = formPreviewList[sRowIndex][sColIndex]
      const dItem = formPreviewList[dRowIndex][dColIndex]
      
      const newFormPreviewList = _.cloneDeep(formPreviewList)
      newFormPreviewList[dRowIndex][dColIndex] = sItem
      newFormPreviewList[sRowIndex][sColIndex] = dItem
      dispatch(updatePreviewList(newFormPreviewList))

    } else if (sourceId === "form-preview" && result.destination === null) {

      dispatch(setDeleteItem({
        rowIndex: result.source.index,
        colIndex: null
      }))

    } else if (sourceId.startsWith("colpreview") && result.destination === null) {
      
      const sRowIndex = Number(sourceId.split('-')[1])
      const sColIndex = Number(sourceId.split('-')[2])
      dispatch(setDeleteItem({
        rowIndex: sRowIndex,
        colIndex: sColIndex
      }))
    }
  }
  
  const handleAddRow = (number) => () => {
    const newRow = Array.apply(null, Array(number)).map(() => ({}))
    const newFormPreviewList = [newRow, ...formPreviewList]
    dispatch(updatePreviewList(newFormPreviewList))
  }

  const handleEditItem = (rowIndex, colIndex) => {
    dispatch(setSelectedItem({rowIndex, colIndex}))
  }

  if (!loading) return <DotPulse className="justify-content-center position-fixed top-50 w-75 zindex-1 m-0" />

  return (
    <div className="app-form-builder">
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          <Col xl={9} lg={8} md={8} xs={12}>
            <Card className="overflow-hidden">
              <CardHeader className="border-bottom">
                <div className="d-flex align-items-center w-100">
                  <CardTitle tag="h4">{T("Form Preview")}</CardTitle>
                  <div className="ms-auto">
                    <Button.Ripple color="secondary" outline className="ms-75" size="sm" onClick={handleAddRow(1)}>
                      <Plus size={14} />
                      <span className="align-middle ms-75">Row - 1</span>
                    </Button.Ripple>
                    <Button.Ripple color="secondary" outline className="ms-75" size="sm" onClick={handleAddRow(2)}>
                      <Plus size={14} />
                      <span className="align-middle ms-75">Row - 2</span>
                    </Button.Ripple>
                    <Button.Ripple color="secondary" outline className="ms-75" size="sm" onClick={handleAddRow(3)}>
                      <Plus size={14} />
                      <span className="align-middle ms-75">Row - 3</span>
                    </Button.Ripple>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="form-preview-wrapper">
                  <Droppable droppableId="form-preview" type="droppableContainer">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="form-preview">
                        {formPreviewList.map((rowItem, rowIndex) => (
                          <Draggable
                            key={`row_${rowIndex}`}
                            draggableId={`row_${rowIndex}`}
                            index={rowIndex}
                          >
                            {(provided) => (
                              <div 
                                ref={provided.innerRef} 
                                {...provided.draggableProps}
                                className="py-75"
                              >
                                <div 
                                  className="form-row-item bg-white"
                                  {...provided.dragHandleProps}
                                >
                                  <div className="form-preview-row">
                                    <Row className="match-height">
                                      {rowItem.map((colItem, colIndex) => (
                                        <Col key={(rowIndex * 12) + colIndex} xs={12 / rowItem.length}>
                                          <PreviewColItem
                                            rowIndex={rowIndex}
                                            colIndex={colIndex}
                                            item={colItem}
                                            width={12 / rowItem.length}
                                            onSelectItem={handleEditItem}
                                          />
                                        </Col>
                                      ))}
                                    </Row>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} lg={4} md={4} xs={12}>
            <AddFormComponent formAddList={formAddList} />
          </Col>
        </Row>
      </DragDropContext>
      <EditFormModal />
      <AlertModal />
    </div>
  )
}

export default FormBuilder
