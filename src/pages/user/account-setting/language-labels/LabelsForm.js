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

// ** localization keys
import { L10nKeys, L10nMenuItemIDKeys } from '@localization'

const LabelsForm = (props) => {
  const { category, originKeys, translation, formId, isVisibleMenuItem, onSubmitParent, onChangeTranslation } = props

  const [errors, setErrors] = useState([])

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
    console.log('translation: ', translation)
    onSubmitParent(category, translation)
  }

  const onChangeValue = (origin, value) => {
    onChangeTranslation(origin, value)
    const errs = {...errors}
    if (value === '') {
      errs[category + origin] = true
    } else {
      errs[category + origin] = false
    }

    setErrors(errs)
  }

  const getValue = (origin) => {
    if (translation === undefined) {
      return origin
    }

    if (translation) {
      if (translation[origin] === undefined || translation[origin] === null) {
        return origin
      }
      return translation[origin]
    }
    
    return ''
  }

  return (translation || translation === undefined) ? (
    <div style={{margin: '20px'}}>
      <Form id={formId} onSubmit={onSubmit} autoComplete="off" className="pl-2 pr-2">
        <Row>
          {originKeys.map((key) => {
            return isVisibleMenuItem(L10nMenuItemIDKeys[key]) ? (
              <Row key={category + key}>
                <Col xl={6} md={6} sm={6} className="mb-1">
                  <Label className="form-label">
                    {L10nKeys[key]}
                  </Label>
                </Col>

                <Col xl={6} md={6} sm={6} className="mb-1">
                  <Input id={key} name={origin[key]} 
                      value={getValue(L10nKeys[key])} 
                      onChange={event => onChangeValue(L10nKeys[key], event.target.value)}
                      invalid={errors[category + key] && true}/>
                  <div className="invalid-feedback">{errors[key] ? 'Translation is required!' : ''}</div>
                </Col>
              </Row>
            ) : null
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