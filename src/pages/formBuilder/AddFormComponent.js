// ** Drag and Drop Import
import { Draggable, Droppable } from "react-beautiful-dnd"

// ** Reactstrap Import
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"

// ** Translation
import { T } from "@localization"

const AddFormComponent = ({formAddList}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-bottom">
        <CardTitle tag="h4" className="m-25">{T("Add Form")}</CardTitle>
      </CardHeader>
      <CardBody className="p-2">
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