/* eslint-disable object-shorthand */

// // ** Reactstrap Imports
import { useState } from 'react'
import {
  Col,
  Nav,
  Row,
  Card,
  Form,
  Label,
  Input,
  Button,
  NavLink,
  TabPane,
  NavItem,
  CardBody,
  TabContent
} from 'reactstrap'
// import { useForm, Controller } from 'react-hook-form'

const LabelsForm = (props) => {
  const { category, origin, translation, formId, onSubmitParent, onChangeTranslation } = props

  console.log('----- labels form, category: ', category)
  console.log('----- labels form, translation: ', translation)

  const [errors, setErrors] = useState([])

  // const {
  //   control: labelControl,
  //   handleSubmit: handleSubmit,
  //   formState: { errors: errors }
  // } = useForm({ defaultValues: translation, mode: 'all' })

  /* Validation rules */
  const ValidationSchema = {}

  if (origin !== undefined && origin) {
    Object.keys(origin).map(key => {
      ValidationSchema[key] = {
        required: true
      }
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    for (const key of Object.keys(errors)) {
      console.log('------- KEY: ', key, errors[category + key])
      if (errors[key]) {
        return
      }
    }
    console.log('errors: ', errors)
    onSubmitParent(category, translation)
  }

  const onChangeValue = (key, value) => {
    onChangeTranslation(category, key, value)
    const errs = {...errors}
    if (value === '') {
      errs[category + key] = true
    } else {
      errs[category + key] = false
    }

    setErrors(errs)
  }

  const getValue = (key) => {
    if (translation === undefined) {
      return origin[key]
    }

    if (translation) {
      if (translation[origin[key]] === undefined || translation[origin[key]] === null) {
        return origin[key]
      }
      return translation[origin[key]]
    }
    
    return ''
  }

  return origin && origin !== undefined && (translation || translation === undefined) ? (
    <div style={{margin: '20px'}}>
      <Form id={formId} onSubmit={onSubmit} autoComplete="off" className="pl-2 pr-2">
        <Row>
          {Object.keys(origin).map((key) => {
            return (
              <Row key={category + key}>
                <Col xl={6} md={6} sm={6} className="mb-1">
                  <Label className="form-label">
                    {origin[key]}
                  </Label>
                </Col>

                <Col xl={6} md={6} sm={6} className="mb-1">
                  {/* <Controller
                    id={key}
                    name={origin[key]}
                    control={labelControl}
                    rules={ValidationSchema[key]}
                    defaultValue={defaultValue(key)}
                    render={({ field }) => (
                      <Input {...field} 
                        invalid={errors[key] && true}                    
                      />
                    )}
                  /> */}
                  <Input id={key} name={origin[key]} 
                      value={getValue(key)} 
                      onChange={event => onChangeValue(key, event.target.value)}
                      invalid={errors[category + key] && true}/>
                  <div className="invalid-feedback">{errors[key] ? 'Translation is required!' : ''}</div>
                </Col>
              </Row>
            )
          })}
        </Row>

        <div className="d-flex flex-wrap mb-2 mt-2">
          <Button type="submit" className="me-1" color="primary" onClick={onSubmit}>
            Save Change
          </Button>
        </div>
      </Form>
    </div>
  ) : null
}
export default LabelsForm