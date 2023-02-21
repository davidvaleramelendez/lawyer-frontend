// ** React Import
import React from "react"

// ** Drag and Drop Import
import { Draggable, Droppable } from "react-beautiful-dnd"

// ** Redux Import
import { useDispatch } from "react-redux"
import { setDeleteItem } from "../store"

// ** Icon Import
import { Edit3, Trash } from "react-feather"

// ** Reactstrap Import
import { FormText, Label } from "reactstrap"

// ** Custom Components
import FormItem from "./FormItem"

const PreviewColItem = (props) => {
  
  const {rowIndex, colIndex, item, width, onSelectItem} = props

  // ** Store Vars
  const dispatch = useDispatch()

  const handleDeleteItem = () => {
    dispatch(setDeleteItem({
      rowIndex,
      colIndex
    }))
  }

  const handleEditItem = () => {
    onSelectItem(rowIndex, colIndex)
  }

  return (
    <Droppable droppableId={`colpreview-${rowIndex}-${colIndex}`} type="droppableItem">
      {(provided, snapshot) => (
        <div className={`form-col-item ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}>
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Draggable
              draggableId={`col-${rowIndex}-${colIndex}`}
              index={1}
              isDragDisabled={item.title === undefined}
            >
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.draggableProps}
                  className={`bg-white ${snapshot.isDragging ? 'dragging' : 'nodragging'}`}
                >
                  {item.title ? (
                    <div {...provided.dragHandleProps} className="form-preview-item">
                      <div className="d-flex align-items-center text-muted mb-50">
                        <Label className="form-label me-auto">
                          {item.title}
                        </Label>
                        <span className="cursor-pointer me-50" onClick={handleEditItem}>
                          <Edit3 size={14} />
                        </span>
                        <span className="cursor-pointer ms-50" onClick={handleDeleteItem}>
                          <Trash size={14} />
                        </span>
                      </div>
                      <FormItem item={item} width={width} />
                      <FormText className="text-muted">{item.description}</FormText>
                    </div>
                  ) : (
                    <div {...provided.dragHandleProps} className="form-preview-item">
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default PreviewColItem