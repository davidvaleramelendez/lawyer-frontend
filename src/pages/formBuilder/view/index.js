// ** React Import
import React, { useEffect, useState } from "react"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { 
  getStepDetails,
  setDeleteItem,
  setLoading,
  setSelectedItem, 
  updateStepDetails
} from "../store"

// ** Router Import
import { Link, useParams } from "react-router-dom"

// ** Reactstrap Import
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row
} from "reactstrap"

// ** Icon Import
import { ChevronsLeft } from "react-feather"

// ** Translation
import { T } from "@localization"

// ** Constants Import
import { formAddItems } from "../constants"

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

const FormBuilderView = () => {

  // ** Store Vars
  const dispatch = useDispatch()
  const stepDetails = useSelector((state) => state.formBuilder.stepDetails)
  const loading = useSelector((state) => state.formBuilder.loading)

  // ** Route Param
  const { stepId } = useParams()

  // ** State
  const [formAddList, setFormAddList] = useState(formAddItems)
  
  useEffect(() => {
    dispatch(setLoading(false))
    dispatch(getStepDetails(stepId))
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
      const newItem = stepDetails[result.source.index]
      const newStepDetails = [...stepDetails]
      newStepDetails.splice(result.source.index, 1)
      newStepDetails.splice(result.destination.index, 0, newItem)
      dispatch(updateStepDetails({
        data: newStepDetails, id: stepId
      }))
    
    } else if (sourceId === "add-form" && destinationId.startsWith("colpreview")) {

      // Add new item
      const rowIndex = Number(destinationId.split('-')[1])
      const colIndex = Number(destinationId.split('-')[2])
      const item = formAddList.find(item => item.handle === result.draggableId)
      const newStepDetails = _.cloneDeep(stepDetails)
      
      newStepDetails[rowIndex][colIndex] = {
        id: uuidv4(),
        ...item.default,
        handle: item.handle,
        name: uuidv4()
      }
      dispatch(updateStepDetails({
        data: newStepDetails, id: stepId
      }))

    } else if (sourceId.startsWith("colpreview") && destinationId.startsWith("colpreview")) {

      // Change order of item
      const sRowIndex = Number(sourceId.split('-')[1])
      const sColIndex = Number(sourceId.split('-')[2])
      const dRowIndex = Number(destinationId.split('-')[1])
      const dColIndex = Number(destinationId.split('-')[2])
      const sItem = stepDetails[sRowIndex][sColIndex]
      const dItem = stepDetails[dRowIndex][dColIndex]
      
      const newStepDetails = _.cloneDeep(stepDetails)
      newStepDetails[dRowIndex][dColIndex] = sItem
      newStepDetails[sRowIndex][sColIndex] = dItem
      dispatch(updateStepDetails({
        data: newStepDetails, id: stepId
      }))

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
  
  const handleAddRow = (number) => {
    const newRow = Array.apply(null, Array(number)).map(() => ({}))
    const newStepDetails = [newRow, ...stepDetails]
    dispatch(updateStepDetails({
      data: newStepDetails, id: stepId
    }))
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
                  <CardTitle tag="h4">
                    <span>{T("Form Preview")}</span>
                  </CardTitle>
                  <Link
                    className='ms-auto btn btn-outline-primary btn-sm'
                    color='primary'
                    to='/apps/form-builder'
                  >
                    <ChevronsLeft size={17} /> Back
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="form-preview-wrapper">
                  <Droppable droppableId="form-preview" type="droppableContainer">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="form-preview">
                        {stepDetails.map((rowItem, rowIndex) => (
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
            <AddFormComponent formAddList={formAddList} onAddRow={handleAddRow} />
          </Col>
        </Row>
      </DragDropContext>
      <EditFormModal />
      <AlertModal />
    </div>
  )
}

export default FormBuilderView
