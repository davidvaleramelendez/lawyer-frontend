/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  updateCase,
  updateCaseLoader,
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
  ModalHeader,
  FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

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

  /* Yup validation schema */
  const CaseClientSchema = yup.object({
    Name: yup.string().required('Name is required!'),
    Email: yup.string().required('Email is required!').email('Invalid email address!'),
    Contact: yup.string().required(`${t("Telephone")} is required!`).min(10, `${t("Telephone")} Must be 10 digit!`).max(10, `${t("Telephone")} Must be 10 digit!`),
    laywerID: yup.object().required(`${t("Attorney")} is required!`).nullable(),
    caseTypeID: yup.object().required(`${t("Group")} is required!`).nullable(),
    status: yup.object().required(`Status is required!`).nullable()
  }).required()

  const PlaceholderSchema = {
    name: "John Doe",
    contact: "+4915901766553",
    email: "john.doe@example.com",
    laywerId: `Select ${t("Attorney")}...`,
    address: "Address",
    city: `${t("City")}`,
    pincode: "Postal code",
    caseTypeID: `Select ${t("Group")}...`,
    status: `Select Status...`
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: caseData,
    resolver: yupResolver(CaseClientSchema)
  })

  const handleReset = () => {
    reset(caseData)
    toggleModal()
  }

  const handleModalOpened = () => {
    const caseClientData = { ...caseData }
    if (caseClientData && caseClientData.CaseID) {
      if (caseClientData.user && caseClientData.user.id) {
        if (caseClientData.user.email) {
          caseClientData.Email = caseClientData.user.email
        }

        if (caseClientData.user.Contact) {
          caseClientData.Contact = caseClientData.user.Contact
        }

        if (caseClientData.user.Address) {
          caseClientData.Address = caseClientData.user.Address
        }

        if (caseClientData.user.City) {
          caseClientData.City = caseClientData.user.City
        }

        if (caseClientData.user.Postcode) {
          caseClientData.Pincode = caseClientData.user.Postcode
        }
      }

      if (caseClientData.laywer && caseClientData.laywer.id) {
        caseClientData.laywerID = { value: caseClientData.laywer.id, label: `${caseClientData.laywer.name} (${caseClientData.laywer.email})` }
      }

      if (caseClientData.type && caseClientData.type.CaseTypeID) {
        caseClientData.caseTypeID = { value: caseClientData.type.CaseTypeID, label: caseClientData.type.CaseTypeName }
      }

      if (caseClientData.Status) {
        caseClientData.status = { value: caseClientData.Status, label: caseClientData.Status }
      }
    }

    reset(caseClientData)
  }

  const handleModalClosed = () => {
    // console.log("handleModalClosed >>> ")
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
  }, [store.success, store.error, store.actionFlag, lawyers, groups])
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
        dispatch(updateCaseLoader(false))
        dispatch(updateCase(casesData))
      }
      // console.log("onSubmit >>> ", casesData)
    }
  }

  return (
    <div className="disabled-backdrop-modal">
      <Modal
        isOpen={open}
        backdrop="static"
        toggle={handleReset}
        onOpened={handleModalOpened}
        onClosed={handleModalClosed}
        className="modal-dialog-centered modal-lg"
      >
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{t("Update")} {t("file")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Name">
                  Name
                </Label>
                <Controller
                  defaultValue=""
                  id="Name"
                  name="Name"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.name} invalid={errors.Name && true} />}
                />
                <FormFeedback>{errors.Name?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Contact">
                  {t("Telephone")}
                </Label>
                <Controller
                  defaultValue=""
                  id="Contact"
                  name="Contact"
                  control={control}
                  render={({ field }) => <Input {...field} type="number" placeholder={PlaceholderSchema && PlaceholderSchema.contact} invalid={errors.Contact && true} />}
                />
                <FormFeedback>{errors.Contact?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Email">
                  {t("Email")}
                </Label>
                <Controller
                  defaultValue={caseData && caseData.user && caseData.user.email}
                  name="Email"
                  id="Email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.email} invalid={errors.Email && true} />
                  )}
                />
                <div className="invalid-feedback">{errors.Email?.message}</div>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="laywerID">
                  {t("Attorney")}
                </Label>
                <Controller
                  defaultValue={null}
                  name="laywerID"
                  id="laywerID"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      name="laywerID"
                      placeholder={PlaceholderSchema && PlaceholderSchema.laywerId}
                      options={lawyerOptions}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable={false}
                    />
                  )}
                />
                <FormFeedback className="d-block">{errors.laywerID?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Address">
                  Address
                </Label>
                <Controller
                  defaultValue=""
                  id="Address"
                  name="Address"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.address} invalid={errors.Address && true} />}
                />
                <FormFeedback>{errors.Address?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="City">
                  {t("City")}
                </Label>
                <Controller
                  defaultValue=""
                  id="City"
                  name="City"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.city} invalid={errors.City && true} />}
                />
                <FormFeedback>{errors.City?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="Pincode">
                  Postal code
                </Label>
                <Controller
                  defaultValue=""
                  id="Pincode"
                  name="Pincode"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.pincode} invalid={errors.Pincode && true} />}
                />
                <FormFeedback>{errors.Pincode?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="caseTypeID">
                  {t("Group")}
                </Label>
                <Controller
                  defaultValue={null}
                  name="caseTypeID"
                  id="caseTypeID"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable={false}
                      name="caseTypeID"
                      placeholder={PlaceholderSchema && PlaceholderSchema.caseTypeID}
                      options={typeOptions}
                      className="react-select"
                      classNamePrefix="select"
                    />
                  )}
                />
                <FormFeedback className="d-block">{errors.caseTypeID?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="status">
                  Status
                </Label>
                <Controller
                  defaultValue={null}
                  name="status"
                  id="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable={false}
                      name="status"
                      placeholder={PlaceholderSchema && PlaceholderSchema.status}
                      options={caseStatus}
                      className="react-select"
                      classNamePrefix="select"
                    />
                  )}
                />
                <FormFeedback className="d-block">{errors.status?.message}</FormFeedback>
              </Col>
            </Row>

            <div className="d-flex flex-wrap mb-2 mt-2">
              <Button
                type="submit"
                color="primary"
                className="me-1"
                disabled={!store.loading}
              >
                {t("Submit")}
              </Button>

              <Button
                outline
                color="secondary"
                disabled={!store.loading}
                onClick={handleReset}
              >
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
