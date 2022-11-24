/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  updateCase,
  clearCaseMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** React Dropdown Import
import Select from 'react-select'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Form,
  Label,
  Modal,
  Input,
  Button,
  ModalBody,
  ModalHeader
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// Constant
import {
  caseStatus
} from '@constant/defaultValues'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalEditCaseClient = ({
  open,
  groups,
  lawyers,
  caseData,
  toggleModal
}) => {
  /* Contant variables */
  const [lawyerOptions, setLawyerOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])

  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const ValidationSchema = {
    name: {
      placeholder: "John Doe",
      required: "Name is required!",
      pattern: {
        value: /^([a-zA-Z]+ [a-zA-Z]+)$/i,
        message: "Invalid name!"
      }
    },
    contact: {
      placeholder: "+4915901766553",
      required: `${t("Telephone")} is required!`,
      minLength: {
        value: 10,
        message: `${t("Telephone")} Must be 10 digit!`
      }
    },
    email: {
      placeholder: "john.doe@example.com",
      required: "Email is required!",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address!"
      }
    },
    laywerId: {
      placeholder: `Select ${t("Attorney")}...`,
      required: `${t("Attorney")} is required!`
    },
    address: {
      placeholder: "Address",
      required: false
    },
    city: {
      placeholder: `${t("City")}`,
      required: false
    },
    pincode: {
      placeholder: "Postal code",
      required: false
    },
    caseTypeID: {
      placeholder: `Select ${t("Group")}...`,
      required: `${t("Group")} is required!`
    },
    status: {
      placeholder: `Select Status...`,
      required: `Status is required!`
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: caseData, mode: 'all' })

  const handleReset = () => {
    reset(caseData)
    toggleModal()
  }

  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "UPDATED_CASE") {
      handleReset()
    }

    /* ** To set lawyers option in react dropdown with lable and value */
    let list1 = []
    if (lawyers && lawyers.length) {
      list1 = lawyers.map(lawyer => {
        return {
          value: lawyer.id,
          label: `${lawyer.name} (${lawyer.email})`
        }
      })
    }
    setLawyerOptions(list1)

    /* ** To set groups option in react dropdown with lable and value */
    let list2 = []
    if (groups && groups.length) {
      list2 = groups.map(group => {
        return {
          value: group.CaseTypeID,
          label: group.CaseTypeName
        }
      })
    }
    setTypeOptions(list2)
  }, [dispatch, store.success, store.error, store.actionFlag, lawyers, groups])
  // console.log("caseData >>> ", caseData)

  /* Submitting data */
  const onSubmit = async (values) => {
    if (values) {
      const casesData = {
        CaseID: caseData.CaseID,
        name: values.Name,
        email: values.Email,
        contact: values.Contact,
        address: values.Address,
        city: values.City,
        pincode: values.Pincode
      }

      if (caseData && caseData.user && caseData.user.id) {
        casesData.UserID = caseData.user.id
      }

      if (values.laywerID && values.laywerID.value) {
        casesData.LaywerID = values.laywerID.value
      }

      if (values.caseTypeID && values.caseTypeID.value) {
        casesData.CaseTypeID = values.caseTypeID.value
      }

      if (values.status && values.status.value) {
        casesData.Status = values.status.value
      }

      /* Calling api */
      if (casesData && casesData.CaseID) {
        dispatch(updateCase(casesData))
      }
      // console.log("onSubmit >>> ", casesData)
    }
  }

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{t("Update")} {t("file")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='Name'>
                  Name
                </Label>
                <Controller
                  defaultValue={caseData.Name}
                  id='Name'
                  name='Name'
                  control={control}
                  rules={ValidationSchema.name}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.name && ValidationSchema.name.placeholder} invalid={errors.Name && true} />}
                />
                <div className="invalid-feedback">{errors.Name?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='Contact'>
                  {t("Telephone")}
                </Label>
                <Controller
                  defaultValue={caseData && caseData.user && caseData.user.Contact}
                  id='Contact'
                  name='Contact'
                  control={control}
                  rules={ValidationSchema.contact}
                  render={({ field }) => <Input {...field} type="number" placeholder={ValidationSchema.contact && ValidationSchema.contact.placeholder} invalid={errors.Contact && true} />}
                />
                <div className="invalid-feedback">{errors.Contact?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='Email'>
                  {t("Email")}
                </Label>
                <Controller
                  defaultValue={caseData && caseData.user && caseData.user.email}
                  name='Email'
                  id='Email'
                  control={control}
                  rules={ValidationSchema.email}
                  render={({ field }) => (
                    <Input {...field} type='email' placeholder={ValidationSchema.email && ValidationSchema.email.placeholder} invalid={errors.Email && true} />
                  )}
                />
                <div className="invalid-feedback">{errors.Email?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='laywerID'>
                  {t("Attorney")}
                </Label>
                <Controller
                  defaultValue={caseData && caseData.LaywerID ? { label: `${caseData.laywer.name} (${caseData.laywer.email})`, value: caseData.laywer.id } : null}
                  name='laywerID'
                  id='laywerID'
                  control={control}
                  rules={ValidationSchema.laywerId}
                  render={({ field }) => (
                    <Select
                      {...field}
                      name='laywerID'
                      placeholder={ValidationSchema.laywerId && ValidationSchema.laywerId.placeholder}
                      options={lawyerOptions}
                      className='react-select'
                      classNamePrefix='select'
                      isClearable={false}
                    />
                  )}
                />
                <div className="invalid-feedback d-block">{errors.laywerID?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='Address'>
                  Address
                </Label>
                <Controller
                  defaultValue={caseData && caseData.user && caseData.user.Address ? caseData.user.Address : ""}
                  id='Address'
                  name='Address'
                  control={control}
                  rules={ValidationSchema.address}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.address && ValidationSchema.address.placeholder} invalid={errors.Address && true} />}
                />
                <div className="invalid-feedback">{errors.Address?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='City'>
                  {t("City")}
                </Label>
                <Controller
                  defaultValue={caseData && caseData.user && caseData.user.City ? caseData.user.City : ""}
                  id='City'
                  name='City'
                  control={control}
                  rules={ValidationSchema.city}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.city && ValidationSchema.city.placeholder} invalid={errors.City && true} />}
                />
                <div className="invalid-feedback">{errors.City?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='Pincode'>
                  Postal code
                </Label>
                <Controller
                  defaultValue={caseData && caseData.user && caseData.user.Postcode ? caseData.user.Postcode : ""}
                  id='Pincode'
                  name='Pincode'
                  control={control}
                  rules={ValidationSchema.pincode}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.pincode && ValidationSchema.pincode.placeholder} invalid={errors.Pincode && true} />}
                />
                <div className="invalid-feedback">{errors.Pincode?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='caseTypeID'>
                  {t("Group")}
                </Label>
                <Controller
                  defaultValue={caseData && caseData.CaseTypeID ? { label: caseData.type.CaseTypeName, value: caseData.type.CaseTypeID } : null}
                  name='caseTypeID'
                  id='caseTypeID'
                  control={control}
                  rules={ValidationSchema.caseTypeID}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable={false}
                      name='caseTypeID'
                      placeholder={ValidationSchema.caseTypeID && ValidationSchema.caseTypeID.placeholder}
                      options={typeOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  )}
                />
                <div className="invalid-feedback d-block">{errors.caseTypeID?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='status'>
                  Status
                </Label>
                <Controller
                  defaultValue={caseData && caseData.Status ? { label: caseData.Status, value: caseData.Status } : null}
                  name='status'
                  id='status'
                  control={control}
                  rules={ValidationSchema.status}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable={false}
                      name='status'
                      placeholder={ValidationSchema.status && ValidationSchema.status.placeholder}
                      options={caseStatus}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  )}
                />
                <div className="invalid-feedback d-block">{errors.status?.message}</div>
              </Col>
            </Row>

            <div className='d-flex flex-wrap mb-2 mt-2'>
              <Button type='submit' className='me-1' color='primary'>
                {t("Submit")}
              </Button>
              <Button color='secondary' outline onClick={handleReset}>
                {t("Cancel")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalEditCaseClient
