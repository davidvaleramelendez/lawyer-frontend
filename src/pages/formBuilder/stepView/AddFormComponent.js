// ** Drag and Drop Import
import { Draggable, Droppable } from "react-beautiful-dnd"

// ** Reactstrap Import
import { Button, Card, CardBody, CardHeader, CardTitle } from "reactstrap"

// ** Translation
import { T } from "@localization"

const AddFormComponent = ({formAddList, onAddRow}) => {

  const handleAddRow = (number) => () => {
    onAddRow(number)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-bottom">
        <CardTitle tag="h4" className="m-25">{T("Add Form")}</CardTitle>
      </CardHeader>
      <CardBody className="p-2">
        <div>Add Row</div>
        <div className="pb-75 mb-75">
          <div className="add-row-btn" onClick={handleAddRow(1)}>Row with 1 Column</div>
          <div className="add-row-btn" onClick={handleAddRow(2)}>Row with 2 Columns</div>
          <div className="add-row-btn" onClick={handleAddRow(3)}>Row with 3 Columns</div>
        </div>
        <div>Add Form Item</div>
        <Droppable droppableId="add-form" type="droppableItem" isDropDisabled={true}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {formAddList.map((formItem, index) => (
                <Draggable
                  key={formItem.handle}
                  draggableId={formItem.handle}
                  index={index}
                >
                  {(provided) => (
                    <div>
                      <div
                        className="py-50"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div
                          className="draggable-btn"
                          {...provided.dragHandleProps}
                        >
                          <div className="d-flex text-start align-items-center">
                            {formItem.icon}
                            <span className="ms-75">
                              {formItem.title}
                            </span>
                          </div>
                        </div>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardBody>
    </Card>
  )
}

export default AddFormComponent