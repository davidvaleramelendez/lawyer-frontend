/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  createFighter,
  clearCaseMessage
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
  ModalHeader
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalEditCaseOpponent = ({
  open,
  caseId,
  fighterData,
  toggleModal
}) => {
  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const ValidationSchema = {
    name: {
      placeholder: "Name",
      required: "Name is required!"
    },
    lastName: {
      placeholder: "Last Name",
      required: "Last Name is required!"
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
    country: {
      placeholder: "Country",
      required: false
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: fighterData, mode: 'all' })

  const handleReset = () => {
    reset(fighterData)
    toggleModal()
  }

  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "FIGHTER_ADDED") {
      handleReset()
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
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
        dispatch(createFighter(opponentData))
      }
      // console.log("onSubmit >>> ", opponentData)
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
        <ModalHeader toggle={handleReset}>{t("Opponent")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='name'>
                  Name
                </Label>
                <Controller
                  defaultValue=""
                  id='name'
                  name='name'
                  control={control}
                  rules={ValidationSchema.name}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema && ValidationSchema.name.placeholder} invalid={errors.name && true} />}
                />
                <div className="invalid-feedback">{errors.name?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='last_name'>
                  Surname
                </Label>
                <Controller
                  defaultValue=""
                  id='last_name'
                  name='last_name'
                  control={control}
                  rules={ValidationSchema.lastName}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema && ValidationSchema.lastName.placeholder} invalid={errors.last_name && true} />}
                />
                <div className="invalid-feedback">{errors.last_name?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='email'>
                  {t("Email")}
                </Label>
                <Controller
                  defaultValue=""
                  name='email'
                  id='email'
                  control={control}
                  rules={ValidationSchema.email}
                  render={({ field }) => (
                    <Input {...field} type='email' placeholder={ValidationSchema.email && ValidationSchema.email.placeholder} invalid={errors.email && true} />
                  )}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='telefone'>
                  {t("Telephone")}
                </Label>
                <Controller
                  defaultValue=""
                  id='telefone'
                  name='telefone'
                  control={control}
                  rules={ValidationSchema.contact}
                  render={({ field }) => <Input {...field} type="number" placeholder={ValidationSchema.contact && ValidationSchema.contact.placeholder} invalid={errors.telefone && true} />}
                />
                <div className="invalid-feedback">{errors.telefone?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='address'>
                  Address
                </Label>
                <Controller
                  defaultValue=""
                  id='address'
                  name='address'
                  control={control}
                  rules={ValidationSchema.address}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.address && ValidationSchema.address.placeholder} invalid={errors.address && true} />}
                />
                <div className="invalid-feedback">{errors.address?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='city'>
                  {t("City")}
                </Label>
                <Controller
                  defaultValue=""
                  id='city'
                  name='city'
                  control={control}
                  rules={ValidationSchema.city}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.city && ValidationSchema.city.placeholder} invalid={errors.city && true} />}
                />
                <div className="invalid-feedback">{errors.city?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='zip_code'>
                  Postal code
                </Label>
                <Controller
                  defaultValue=""
                  id='zip_code'
                  name='zip_code'
                  control={control}
                  rules={ValidationSchema.pincode}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.pincode && ValidationSchema.pincode.placeholder} invalid={errors.zip_code && true} />}
                />
                <div className="invalid-feedback">{errors.zip_code?.message}</div>
              </Col>

              <Col md={6} sm={12} className='mb-1'>
                <Label className='form-label' for='country'>
                  {t("Country")}
                </Label>
                <Controller
                  defaultValue=""
                  name='country'
                  id='country'
                  control={control}
                  rules={ValidationSchema.country}
                  render={({ field }) => (
                    <Input {...field} placeholder={ValidationSchema.country && ValidationSchema.country.placeholder} invalid={errors.country && true} />
                  )}
                />
                <div className="invalid-feedback">{errors.country?.message}</div>
              </Col>
            </Row>

            <div className='d-flex flex-wrap mb-2 mt-2'>
              <Button
                type='submit'
                className='me-1'
                color='primary'
              >
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

export default ModalEditCaseOpponent
