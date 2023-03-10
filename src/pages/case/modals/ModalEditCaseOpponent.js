/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Store & Actions
import {
  createFighter,
  updateCaseLoader
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

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
import DotPulse from '@components/dotpulse'

// ** Translation
import { T } from '@localization'

const ModalEditCaseOpponent = ({
  open,
  caseId,
  fighterData,
  toggleModal
}) => {

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  /* Yup validation schema */
  const FighterSchema = yup.object({
    name: yup.string().required(T('Name is required!')),
    last_name: yup.string().required(T('Last Name is required!')),
    email: yup.string().required(T('Email is required!')).email(T('Invalid email address!')),
    telefone: yup.string().required(T(`Telephone is required!`)).min(10, T(`Telephone must be 10 digit!`)).max(10, T(`Telephone must be 10 digit!`))
  }).required()

  const PlaceholderSchema = {
    name: T("Name"),
    lastName: T("Last Name"),
    contact: "+4915901766553",
    email: "john.doe@example.com",
    address: T("Address"),
    city: T(`City`),
    pincode: T("Postal code"),
    country: T("Country")
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: fighterData,
    resolver: yupResolver(FighterSchema)
  })

  const handleReset = () => {
    reset(fighterData)
    toggleModal()
  }

  const handleModalOpened = () => {
    const caseFighterData = { ...fighterData }
    reset(caseFighterData)
  }

  // ** Set Modal fields
  const handleModalClosed = () => {
    // console.log("handleModalClosed >>> ")
  }

  useEffect(() => {
    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "FIGHTER_ADDED") {
      handleReset()
    }
  }, [store.actionFlag])
  // console.log("fighterData >>> ", fighterData)

  /* Submitting data */
  const onSubmit = async (values) => {
    if (values) {
      const opponentData = {
        id: values.id,
        CaseID: caseId,
        name: values.name,
        last_name: values.last_name,
        email: values.email,
        contact: values.telefone,
        address: values.address,
        city: values.city,
        country: values.country,
        zipcode: values.zip_code
      }

      /* Calling api */
      if (opponentData && opponentData.CaseID) {
        dispatch(updateCaseLoader(false))
        dispatch(createFighter(opponentData))
      }
      // console.log("onSubmit >>> ", opponentData)
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
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Opponent")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Controller
                  defaultValue=""
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.name} invalid={errors.name && true} />}
                />
                <FormFeedback>{errors.name?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="last_name">
                  Surname
                </Label>
                <Controller
                  defaultValue=""
                  id="last_name"
                  name="last_name"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.lastName} invalid={errors.last_name && true} />}
                />
                <FormFeedback>{errors.last_name?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="email">
                  {T("Email")}
                </Label>
                <Controller
                  defaultValue=""
                  name="email"
                  id="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.email} invalid={errors.email && true} />
                  )}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="telefone">
                  {T("Telephone")}
                </Label>
                <Controller
                  defaultValue=""
                  id="telefone"
                  name="telefone"
                  control={control}
                  render={({ field }) => <Input {...field} type="number" placeholder={PlaceholderSchema && PlaceholderSchema.contact} invalid={errors.telefone && true} />}
                />
                <FormFeedback>{errors.telefone?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="address">
                  Address
                </Label>
                <Controller
                  defaultValue=""
                  id="address"
                  name="address"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.address} invalid={errors.address && true} />}
                />
                <FormFeedback>{errors.address?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="city">
                  {T("City")}
                </Label>
                <Controller
                  defaultValue=""
                  id="city"
                  name="city"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.city} invalid={errors.city && true} />}
                />
                <FormFeedback>{errors.city?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="zip_code">
                  Postal code
                </Label>
                <Controller
                  defaultValue=""
                  id="zip_code"
                  name="zip_code"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.pincode} invalid={errors.zip_code && true} />}
                />
                <FormFeedback>{errors.zip_code?.message}</FormFeedback>
              </Col>

              <Col md={6} sm={12} className="mb-1">
                <Label className="form-label" for="country">
                  {T("Country")}
                </Label>
                <Controller
                  defaultValue=""
                  name="country"
                  id="country"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.country} invalid={errors.country && true} />
                  )}
                />
                <FormFeedback>{errors.country?.message}</FormFeedback>
              </Col>
            </Row>

            <div className="d-flex flex-wrap mb-2 mt-2">
              <Button
                type="submit"
                color="primary"
                className="me-1"
                disabled={!store.loading}
              >
                {T("Submit")}
              </Button>

              <Button
                outline
                color="secondary"
                disabled={!store.loading}
                onClick={handleReset}
              >
                {T("Cancel")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalEditCaseOpponent
