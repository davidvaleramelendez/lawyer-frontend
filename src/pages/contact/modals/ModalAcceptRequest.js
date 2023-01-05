/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import {
  convertContactToCase,
  updateContactLoader,
  clearContactMessage
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
  ModalHeader,
  FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalAcceptRequest = ({
  open,
  groups,
  lawyers,
  ContactID,
  toggleModal,
  contactData
}) => {
  /* Contant variables */
  const [lawyerOptions, setLawyerOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.contact)

  const AcceptSchema = yup.object({
    Name: yup.string().required('Name is required!'),
    Email: yup.string().required('Email is required!').email('Invalid email address!'),
    PhoneNo: yup.string().required(T('Mobile is required!')).min(6, T("Mobile Must be 6 digit!")).max(16, T("Mobile Must be 16 digit!")),
    LaywerID: yup.object().required(`${T("Attorney")} is required!`).nullable(),
    CaseTypeID: yup.object().required(`${T("Group")} is required!`).nullable()
  }).required()

  /* Placeholder texts */
  const PlaceholderSchema = {
    Name: "John Doe",
    PhoneNo: "+4915901766553",
    Email: "john.doe@example.com",
    LaywerID: `${T("Select Attorney")}...`,
    Address: T("Address"),
    City: T("City"),
    Pincode: T("Postal code"),
    CaseTypeID: `${T("Select Group")}...`
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: contactData,
    resolver: yupResolver(AcceptSchema)
  })

  const handleSidebarOpened = () => {
    reset(contactData)
  }

  const handleReset = () => {
    reset(contactData)
    toggleModal()
  }

  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearContactMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "CASE_ADDED") {
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
  }, [store.success, store.error, store.actionFlag, lawyers, groups])

  /* Submitting data */
  const onSubmit = async (values) => {
    if (values) {
      const caseData = {
        ContactID: ContactID,
        name: values.Name,
        email: values.Email,
        contact: values.PhoneNo,
        address: values.Address,
        city: values.City,
        pincode: values.Pincode
      }

      if (values.LaywerID && values.LaywerID.value) {
        caseData.LaywerID = values.LaywerID.value
      }

      if (values.CaseTypeID && values.CaseTypeID.value) {
        caseData.CaseTypeID = values.CaseTypeID.value
      }

      /* Calling api */
      dispatch(updateContactLoader(false))
      dispatch(convertContactToCase(caseData))
    }
  }

  return store ? (
    <div className="disabled-backdrop-modal">
      <Modal
        isOpen={open}
        toggle={handleReset}
        backdrop="static"
        className="modal-dialog-centered modal-lg"
        onOpened={handleSidebarOpened}
      >
        {!store.loading ? (
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader
          toggle={handleReset}
          className="bg-transparent"
        />

        <ModalBody className="px-5 pb-5">
          <div className='text-center mb-4'>
            <h1>{T("Accept the request")}</h1>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Name">
                  {T("Name")}
                </Label>
                <Controller
                  defaultValue={contactData.Name || ""}
                  id="Name"
                  name="Name"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.Name} invalid={errors.Name && true} />}
                />
                <FormFeedback>{errors.Name?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="PhoneNo">
                  {T("Telephone")}
                </Label>
                <Controller
                  defaultValue={contactData.PhoneNo || ""}
                  id="PhoneNo"
                  name="PhoneNo"
                  control={control}
                  render={({ field }) => <Input {...field} type="number" placeholder={PlaceholderSchema && PlaceholderSchema.PhoneNo} invalid={errors.PhoneNo && true} />}
                />
                <FormFeedback>{errors.PhoneNo?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Email">
                  {T("Email")}
                </Label>
                <Controller
                  defaultValue={contactData.Email || ""}
                  name="Email"
                  id="Email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.Email} invalid={errors.Email && true} />
                  )}
                />
                <FormFeedback>{errors.Email?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="LaywerID">
                  {T("Attorney")}
                </Label>
                <Controller
                  defaultValue={null}
                  name="LaywerID"
                  id="LaywerID"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      name="LaywerID"
                      placeholder={PlaceholderSchema && PlaceholderSchema.LaywerID}
                      options={lawyerOptions}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable={false}
                    />
                  )}
                />
                <FormFeedback className="d-block">{errors.LaywerID?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Address">
                  {T("Address")}
                </Label>
                <Controller
                  defaultValue=""
                  id="Address"
                  name="Address"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.Address} invalid={errors.Address && true} />}
                />
                <FormFeedback>{errors.Address?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="City">
                  {T("City")}
                </Label>
                <Controller
                  defaultValue=""
                  id="City"
                  name="City"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.City} invalid={errors.City && true} />}
                />
                <FormFeedback>{errors.City?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Pincode">
                  {T("Postal code")}
                </Label>
                <Controller
                  defaultValue=""
                  id="Pincode"
                  name="Pincode"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.Pincode} invalid={errors.Pincode && true} />}
                />
                <FormFeedback>{errors.Pincode?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="CaseTypeID">
                  {T("Group")}
                </Label>
                <Controller
                  defaultValue={null}
                  name="CaseTypeID"
                  id="CaseTypeID"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable={false}
                      name="CaseTypeID"
                      placeholder={PlaceholderSchema && PlaceholderSchema.CaseTypeID}
                      options={typeOptions}
                      className="react-select"
                      classNamePrefix="select"
                    />
                  )}
                />
                <FormFeedback className="d-block">{errors.CaseTypeID?.message}</FormFeedback>
              </Col>
            </Row>

            <Row className="mt-2 mb-2">
              <div className="text-center">
                <Button
                  type="submit"
                  color="primary"
                  disabled={!store.loading}
                >
                  {T("Create")}
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalAcceptRequest
