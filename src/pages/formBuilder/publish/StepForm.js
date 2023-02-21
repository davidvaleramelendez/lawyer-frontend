import React from "react"
import { ArrowLeft, ArrowRight } from "react-feather"
import { useSelector } from "react-redux"
import { Button, Col, Form, FormText, Label, Row } from "reactstrap"
import FormItem from "../stepView/FormItem"

const StepForm = ({stepDetails, stepper}) => {
  const stepContent = stepDetails.content
  
  const stepList = useSelector(state => state.formBuilder.stepList)

  const firstStep = stepList[0].id === stepDetails.id
  const lastStep = stepList[stepList.length - 1].id === stepDetails.id

  return (
    <React.Fragment>
      <div className='content-header px-3 mb-2'>
        <h5 className='mb-0'>{stepDetails.name}</h5>
        <small className='text-muted'>{stepDetails.description}</small>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        {stepContent.map((rowItem, rowIndex) => (
          <div key={rowIndex}>
            <Row className="match-height">
              {rowItem.map((colItem, colIndex) => (
                <Col xs={12 / rowItem.length} key={(rowIndex * 12) + colIndex}>
                  <div className="mb-2 px-3">
                    <Label className="form-label mb-75">
                      {colItem.title}
                    </Label>
                    <FormItem
                      item={colItem}
                      width={12 / rowItem.length}
                    />
                    <div className="mt-50">
                      <FormText className="text-muted">{colItem.description}</FormText>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ))}
        <div className='d-flex px-3'>
          {!firstStep && (
            <Button color='secondary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Previous</span>
            </Button>
          )}
          {lastStep ? (
            <Button color='success' className='btn-submit ms-auto'>
              Submit
            </Button>
          ) : (
            <Button color='primary' className='btn-next ms-auto' onClick={() => stepper.next()}>
              <span className='align-middle d-sm-inline-block d-none'>Next</span>
              <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
            </Button>
          )}
        </div>
      </Form>
    </React.Fragment>
  )
}

export default StepForm