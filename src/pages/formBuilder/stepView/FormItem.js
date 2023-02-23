// ** React Import
import React from "react"

// ** Reactstrap Import
import { Button, Input, Label } from "reactstrap"

// ** Third Party Components
import Select from 'react-select'

const InputItem = (props) => {
  const { name, value, placeholder } = props
  return (
    <Input type='text' placeholder={placeholder} name={name} defaultValue={value} />
  )
}

const TextAreaItem = (props) => {
  const { name, value, placeholder } = props
  return (
    <Input type='textarea' placeholder={placeholder} name={name} defaultValue={value} rows='3' />
  )
}

const RadioItem = (props) => {

  const { name, value, list, width } = props

  return (
    <div className={width < 12 ? "" : "d-flex"}>
      {list.map(item => (
        <div className='form-check' key={`${name}_${item.value}`}>
          <Input type='radio' name={name} id={`${name}_${item.value}`} defaultChecked={value === item.value} />
          <Label className='form-check-label' for={`${name}_${item.value}`}>
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  )
}

const CheckBoxItem = (props) => {

  const { name, value, list, width } = props

  return (
    <div className={width < 12 ? "" : "d-flex"}>
      {list.map(item => (
        <div className='form-check' key={`${name}_${item.value}`}>
          <Input type='checkbox' name={name} id={`${name}_${item.value}`} defaultChecked={value.includes(item.value)} />
          <Label className='form-check-label' for={`${name}_${item.value}`}>
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  )
}

const SelectItem = (props) => {

  const { name, value, list } = props

  return (
    <Select
      theme="primary"
      className='react-select'
      name={name}
      classNamePrefix='select'
      defaultValue={list.find(item => item.value === value)}
      options={list}
      isClearable={false}
    />
  )
}

const DefaultFormItem = () => {
  return null
}

const FormItem = ({item, width}) => {
  let ItemComponent = null
  switch (item.handle) {
    case 'input':
      ItemComponent = <InputItem {...item} />
      break
    case 'textarea':
      ItemComponent = <TextAreaItem {...item} />
      break
    case 'radio':
      ItemComponent = <RadioItem {...item} width={width} />
      break
    case 'checkbox':
      ItemComponent = <CheckBoxItem {...item} width={width} />
      break
    case 'select':
      ItemComponent = <SelectItem {...item} />
      break
    default:
      ItemComponent = <DefaultFormItem {...item} />
      break
  }

  return ItemComponent
}

export default FormItem