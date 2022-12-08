// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Col,
  Row,
  Form,
  Card,
  Input,
  Button,
  CardBody,
  CardText,
  InputGroup,
  FormFeedback,
  InputGroupText
} from 'reactstrap'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** React Dropdown Import
import Select from 'react-select'

// ** Store & Actions
import {
  invoiceInfo,
  getInvoiceItem,
  updateInvoiceItem,
  calculateTotalVatPrice,
  resetCalculationVatPrice,
  updateInvoiceLoader,
  clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
  X,
  Hash,
  Plus
} from 'react-feather'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { SlideDown } from 'react-slidedown'

// ** Utils
import {
  getPercentage,
  isUserLoggedIn,
  getTransformDate,
  selectThemeColors
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'
import Notification from '@components/toast/notification'

// Constant
import {
  root,
  adminRoot,
  paymentMethod
} from '@constant/defaultValues'

// ** Styles
import 'react-slidedown/lib/slidedown.css'
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

// ** Translation
import { T } from '@localization'

const InvoiceEdit = () => {
  // ** HooksVars
  const { id } = useParams()
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.invoice)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [caseOptions, setCaseOptions] = useState([])
  const [customerOptions, setCustomerOptions] = useState([])

  /* Status options */
  const status = [
    { value: "Zahlungserinnerung", label: "Zahlungserinnerung" },
    { value: "Mahnung", label: "Mahnung" },
    { value: "3. Mahnung", label: "3. Mahnung" }
  ]

  const InvoiceSchema = yup.object({
    invoice_date: yup.date().required(T("Date is required!")).nullable(),
    invoice_due_date: yup.date().required(T("Maturity date is required!")).nullable(),
    CaseID: yup.object().required(T(`CaseID is required!`)).nullable(),
    customer_id: yup.object().required(T(`Client is required!`)).nullable(),
    items: yup.array().of(yup.object().shape({
      item_detail: yup.string().required(T('Description is required!')),
      price: yup.string().required(T('Price is required!'))
    })).min(1, T('Pick at least 1 Item')).required(T('Items is required!')).nullable(),
    method: yup.object().required(T(`Method is required!`)).nullable(),
    status: yup.object().required(T(`Status is required!`)).nullable()
  }).required()

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: store.invoiceItem,
    resolver: yupResolver(InvoiceSchema)
  })

  const {
    fields,
    remove,
    append
  } = useFieldArray({
    control,
    name: "items"
  })

  const handleReset = () => {
    const invoiceItem = { ...store.invoiceItem }
    if (store && store.invoiceItem) {
      if (store.invoiceItem.customer && store.invoiceItem.customer.id) {
        invoiceItem.customer_id = {
          value: store.invoiceItem.customer.id,
          label: store.invoiceItem.customer.name
        }
      }

      if (store.invoiceItem.case && store.invoiceItem.case.CaseID) {
        invoiceItem.CaseID = {
          value: store.invoiceItem.case.CaseID,
          label: store.invoiceItem.case.CaseID,
          user_id: store.invoiceItem.case.UserID,
          case_type_id: store.invoiceItem.case.CaseTypeID
        }
      }

      if (store.invoiceItem.items && store.invoiceItem.items.length) {
        dispatch(calculateTotalVatPrice(store.invoiceItem.items))
      }

      if (store.invoiceItem.method) {
        const index = paymentMethod.findIndex(x => x.value === store.invoiceItem.method)
        if (index !== -1) {
          invoiceItem.method = paymentMethod[index]
        }
      }

      if (store.invoiceItem.status) {
        const index = status.findIndex(x => x.value === store.invoiceItem.status)
        if (index !== -1) {
          invoiceItem.status = status[index]
        } else {
          invoiceItem.status = status[0]
        }
      }
    }

    reset(invoiceItem)
  }

  useEffect(() => {
    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/invoice`)
    }

    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      dispatch(resetCalculationVatPrice())
      dispatch(invoiceInfo({ from: "Edit" }))
      dispatch(getInvoiceItem(id))
      setLoadFirst(false)
    }

    let list1 = []
    if (store && store.casesItems && store.casesItems.length) {
      list1 = store.casesItems.map(item => {
        return {
          value: item.CaseID,
          label: item.CaseID,
          user_id: item.UserID,
          case_type_id: item.CaseTypeID
        }
      })
    }
    setCaseOptions(list1)

    let list2 = []
    if (store && store.customerItems && store.customerItems.length) {
      list2 = store.customerItems.map(customer => {
        return {
          value: customer.id,
          label: customer.name
        }
      })
    }
    setCustomerOptions(list2)

    /* For reset form data */
    if (store && store.actionFlag && store.actionFlag === "EDIT_ITEM") {
      handleReset()
    }

    /* Redirect to listing */
    if (store && store.actionFlag && store.actionFlag === "UPDATED") {
      navigate(`${adminRoot}/invoice/view/${id}`)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearInvoiceMessage())
    }

    /* Succes toast notification */
    if (store && store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store && store.error) {
      Notification("Error", store.error, "warning")
    }
  }, [dispatch, store.casesItems, store.customerItems, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("Edit store >>> ", store)

  const renderOnSelectCustomer = (customer) => {
    if (customer && customer.value) {
      const index = store.customerItems.findIndex(x => x.id === customer.value)
      if (index !== -1) {
        return (
          <div className='customer-details mt-1'>
            <p className='mb-25'>
              {store.customerItems[index].name}
            </p>
            {store.customerItems[index].Company ? (
              <p className='mb-25'>
                {store.customerItems[index].Company}
              </p>
            ) : null}
            {store.customerItems[index].Address ? (
              <p className='mb-25'>
                {`${store.customerItems[index].Address} ${store.customerItems[index].Address1 ? store.customerItems[index].Address1 : ''}`}
              </p>
            ) : null}
            <p className='mb-25'>
              {store.customerItems[index].Country}
            </p>
            <p className='mb-0'>
              {store.customerItems[index].Contact}
            </p>
            <p className='mb-0'>
              {store.customerItems[index].email}
            </p>
          </div>
        )
      }
      return null
    }
    return null
  }

  const onCustomerChange = (customer) => {
    let userCases = null
    setValue('customer_id', customer)
    if (customer && customer.value) {
      if (caseOptions && caseOptions.length) {
        userCases = caseOptions.filter(x => x.user_id === customer.value).length ? caseOptions.filter(x => x.user_id === customer.value)[0] : null
      }
    }

    setValue('CaseID', userCases)
    // console.log("onCustomerChange >>> ", customer)
  }

  const onInputPriceChange = (name, value, vatName) => {
    let vat = ""
    setValue(name, value)
    if (value) {
      vat = getPercentage(value, 19)
    }
    setValue(vatName, vat)
    dispatch(calculateTotalVatPrice(watch('items')))
  }

  const addInvoiceItem = () => {
    // console.log("addInvoiceItem >>> ")
    append(store.invoiceItemItem)
  }

  const removeInvoiceItem = (index) => {
    // console.log("removeInvoiceItem >>> ", index)
    remove(index)
    dispatch(calculateTotalVatPrice(watch('items')))
  }

  const onSubmit = async (values) => {
    if (values) {
      const invoiceData = {
        id: values.id,
        invoice_no: values.invoice_no
      }

      if (values.invoice_date && values.invoice_date.length) {
        invoiceData.invoice_date = getTransformDate(values.invoice_date[0], "YYYY-MM-DD")
      } else if (values.invoice_date) {
        invoiceData.invoice_date = getTransformDate(values.invoice_date, "YYYY-MM-DD")
      }

      if (values.invoice_due_date && values.invoice_due_date.length) {
        invoiceData.invoice_due_date = getTransformDate(values.invoice_due_date[0], "YYYY-MM-DD")
      } else if (values.invoice_due_date) {
        invoiceData.invoice_due_date = getTransformDate(values.invoice_due_date, "YYYY-MM-DD")
      }

      if (values.CaseID && values.CaseID.value) {
        invoiceData.CaseID = values.CaseID.value
      }

      if (values.customer_id && values.customer_id.value) {
        invoiceData.customer_id = values.customer_id.value
      }

      if (values.items && values.items.length) {
        invoiceData.items = values.items
      }

      if (values.method && values.method.value) {
        invoiceData.method = values.method.value
      }

      if (values.status && values.status.value) {
        invoiceData.status = values.status.value
      }

      // console.log("onSubmit >>> ", values, invoiceData)
      dispatch(updateInvoiceLoader(false))
      dispatch(updateInvoiceItem(invoiceData))
    }
  }

  const Tag = fields && fields.length === 0 ? 'div' : SlideDown
  return store ? (
    <div className="invoice-add-wrapper">
      {!store.loading ? (
        <Spinner
          className="d-flex justify-content-center position-absolute top-50 w-50 zindex-1"
        />
      ) : null}

      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Row className="invoice-add">
          <Col xl={9} md={8} sm={12}>
            {/* <AddCard /> */}
            <Card className="invoice-preview-card">
              {/* Header */}
              <CardBody className="invoice-padding pb-0">
                <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                  <div>
                    <div className='logo-wrapper'>
                      <svg viewBox='0 0 139 95' version='1.1' height='24'>
                        <defs>
                          <linearGradient id='invoice-linearGradient-1' x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%'>
                            <stop stopColor='#000000' offset='0%'></stop>
                            <stop stopColor='#FFFFFF' offset='100%'></stop>
                          </linearGradient>
                          <linearGradient
                            id='invoice-linearGradient-2'
                            x1='64.0437835%'
                            y1='46.3276743%'
                            x2='37.373316%'
                            y2='100%'
                          >
                            <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                            <stop stopColor='#FFFFFF' offset='100%'></stop>
                          </linearGradient>
                        </defs>
                        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                          <g transform='translate(-400.000000, -178.000000)'>
                            <g transform='translate(400.000000, 178.000000)'>
                              <path
                                className='text-primary'
                                d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                                style={{ fill: 'currentColor' }}
                              ></path>
                              <path
                                d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                                fill='url(#invoice-linearGradient-1)'
                                opacity='0.2'
                              ></path>
                              <polygon
                                fill='#000000'
                                opacity='0.049999997'
                                points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                              ></polygon>
                              <polygon
                                fill='#000000'
                                opacity='0.099999994'
                                points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                              ></polygon>
                              <polygon
                                fill='url(#invoice-linearGradient-2)'
                                opacity='0.099999994'
                                points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                              ></polygon>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <h3 className="text-primary invoice-logo">Logo</h3>
                    </div>
                    <p className="card-text mb-25">
                      {store && store.userItem && store.userItem.Address}
                    </p>

                    <p className="card-text mb-25">
                      {store && store.userItem && store.userItem.Postcode} {" "}
                      {store && store.userItem && store.userItem.City}
                    </p>
                    <p className="card-text mb-0" />
                  </div>

                  <div className="invoice-number-date mt-md-0 mt-2">
                    <div className="d-flex align-items-center justify-content-md-end mb-1">
                      <h4 className="title">{T("Number")}</h4>
                      <InputGroup className="input-group-merge invoice-edit-input-group disabled">
                        <InputGroupText>
                          <Hash size={14} />
                        </InputGroupText>

                        <Controller
                          defaultValue=""
                          id="invoice_no"
                          name="invoice_no"
                          control={control}
                          render={({ field }) => <Input
                            {...field}
                            className="invoice-edit-input"
                            placeholder="53634"
                            disabled
                            invalid={errors.invoice_no && true}
                          />}
                        />
                      </InputGroup>
                      <FormFeedback className="invalid-feedback">{errors.invoice_no?.message}</FormFeedback>
                    </div>

                    <div className="d-flex align-items-center mb-1">
                      <span className="title">{T("Date")}:</span>
                      <div>
                        <Controller
                          defaultValue=""
                          id="invoice_date"
                          name="invoice_date"
                          control={control}
                          render={({ field }) => <Flatpickr
                            {...field}
                            id="invoice_date"
                            className="form-control invoice-edit-input date-picker"
                            placeholder="YYYY-MM-DD"
                            options={{
                              enableTime: false,
                              dateFormat: "Y-m-d"
                            }}
                          />}
                        />
                        <FormFeedback className="invalid-feedback d-block">{errors.invoice_date?.message}</FormFeedback>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-1">
                      <span className="title">{T("Maturity")}:</span>
                      <div>
                        <Controller
                          defaultValue=""
                          id="invoice_due_date"
                          name="invoice_due_date"
                          control={control}
                          render={({ field }) => <Flatpickr
                            {...field}
                            id="invoice_due_date"
                            className="form-control invoice-edit-input date-picker"
                            placeholder="YYYY-MM-DD"
                            options={{
                              enableTime: false,
                              dateFormat: "Y-m-d"
                            }}
                          />}
                        />
                        <FormFeedback className="invalid-feedback d-block">{errors.invoice_due_date?.message}</FormFeedback>
                      </div>
                    </div>

                    <div className="form-group">
                      <div>
                        <Controller
                          defaultValue=""
                          name="CaseID"
                          id="CaseID"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="CaseID"
                              placeholder={`${T("Select CaseID")}...`}
                              options={caseOptions}
                              theme={selectThemeColors}
                              className="react-select"
                              classNamePrefix="select"
                              isClearable={false}
                            />
                          )}
                        />
                        <FormFeedback className="invalid-feedback d-block">{errors.CaseID?.message}</FormFeedback>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
              {/* /Header */}

              <hr className="invoice-spacing" />

              {/* Address and Contact */}
              <CardBody className="invoice-padding pt-0">
                <Row className="row-bill-to invoice-spacing">
                  <Col className="mb-lg-1 col-bill-to ps-0" xl={8}>
                    <h6 className="invoice-to-title">{T("Invoice to")}:</h6>
                    <div className="invoice-customer">
                      <Controller
                        defaultValue=""
                        name="customer_id"
                        id="customer_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            id="customer_id"
                            placeholder={`${T("Select Client")}...`}
                            options={customerOptions}
                            theme={selectThemeColors}
                            className="react-select"
                            classNamePrefix="select"
                            isClearable={false}
                            onChange={(value) => onCustomerChange(value)}
                          />
                        )}
                      />
                      <FormFeedback className="invalid-feedback d-block">{errors.customer_id?.message}</FormFeedback>
                      {renderOnSelectCustomer(watch("customer_id"))}
                    </div>
                  </Col>
                </Row>
              </CardBody>
              {/* /Address and Contact */}

              {/* Product Details */}
              <CardBody className="invoice-padding invoice-product-details">
                {fields && fields.length ? <>
                  {fields.map((item, index) => (
                    <Tag className="repeater-wrapper" key={`items_${index}_${item.id}`}>
                      <Row key={`items_${index}_${item.id}`}>
                        <Col className="d-flex product-details-border position-relative pe-0">
                          <Row className="w-100 pe-lg-0 pe-1 py-2">
                            <Col className="mb-lg-0 mb-2 mt-lg-0 mt-2" lg={6}>
                              <CardText className="col-title mb-md-50 mb-0">{T("Description")}</CardText>
                              <Controller
                                defaultValue=""
                                id={`items.${index}.item_detail`}
                                name={`items.${index}.item_detail`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="textarea"
                                    rows={1}
                                    invalid={errors.items?.[index]?.item_detail && true}
                                  />)}
                              />
                              <FormFeedback className="invalid-feedback">{errors.items?.[index]?.item_detail?.message}</FormFeedback>
                            </Col>

                            <Col className="my-lg-0 my-2" lg={3}>
                              <CardText className="col-title mb-md-2 mb-0">{T("Amount")}</CardText>
                              <Controller
                                defaultValue=""
                                id={`items.${index}.price`}
                                name={`items.${index}.price`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    min={0}
                                    type="number"
                                    invalid={errors.items?.[index]?.price && true}
                                    onChange={(event) => onInputPriceChange(`items.${index}.price`, event.target.value, `items.${index}.vat`)}
                                  />)}
                              />
                              <FormFeedback className="invalid-feedback">{errors.items?.[index]?.price?.message}</FormFeedback>
                            </Col>

                            <Col className="my-lg-0 my-2" lg={3}>
                              <CardText className="col-title mb-md-2 mb-0 text-uppercase">{T("Vat")} 19 %</CardText>
                              <Controller
                                defaultValue=""
                                id={`items.${index}.vat`}
                                name={`items.${index}.vat`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    readOnly
                                    min={0}
                                    type="number"
                                    invalid={errors.items?.[index]?.vat && true}
                                  />)}
                              />
                              <FormFeedback className="invalid-feedback">{errors.items?.[index]?.vat?.message}</FormFeedback>
                            </Col>
                          </Row>

                          {index > 0 ? (
                            <div className="d-flex flex-column align-items-center justify-content-between border-start invoice-product-actions py-50 px-25">
                              <X size={14} className="cursor-pointer" onClick={() => removeInvoiceItem(index)} />
                            </div>
                          ) : null}
                        </Col>
                      </Row>
                    </Tag>
                  ))}
                </> : null}
                <Row className="mt-1">
                  <Col sm="12" className="px-0">
                    <Button
                      size="sm"
                      type="button"
                      color="primary"
                      disabled={!store.loading}
                      className="btn-add-new"
                      onClick={addInvoiceItem}
                    >
                      <Plus size={14} className="me-25" /><span className="align-middle">{T("Add invoice item")}</span>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
              {/* /Product Details */}

              {/* Invoice Total */}
              <CardBody className="invoice-padding">
                <Row className="invoice-sales-total-wrapper">
                  <Col className="mt-md-0 mt-3" md={{ size: 6, order: 1 }} xs={{ size: 12, order: 2 }} />
                  <Col className="d-flex justify-content-end" md={{ size: "6", order: 2 }} xs={{ size: 12, order: 1 }}>
                    <div className="invoice-total-wrapper">
                      <div className="invoice-total-item">
                        <p className="invoice-total-title">{T("Net")}:</p>
                        <p className="invoice-total-amount">€ {(store && store.totalPrice) || 0}</p>
                      </div>

                      <div className="invoice-total-item">
                        <p className="invoice-total-title text-uppercase">{T("Vat")} 19 %:</p>
                        <p className="invoice-total-amount">€ {(store && store.totalVat) || 0}</p>
                      </div>

                      <hr className="my-50" />
                      <div className="invoice-total-item">
                        <p className="invoice-total-title">{T("Total")}:</p>
                        <p className="invoice-total-amount">€ {(store && store.finalPrice) || 0}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              {/* /Invoice Total */}

              <hr className="invoice-spacing mt-0" />

              {/* Invoice Note */}
              <CardBody className="invoice-padding py-0">
                <Row>
                  <Col>
                    <div className="mb-2" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xl={3} md={4} sm={12}>
            <Card className="invoice-action-wrapper">
              <CardBody>
                <Button
                  block
                  type="submit"
                  color="primary"
                  className="mb-50"
                  disabled={!store.loading}
                >
                  {T("Update Invoice")}
                </Button>
              </CardBody>
            </Card>

            <div className="mt-2">
              <div className="invoice-payment-option">
                <p className="mb-50">{T("Payment methods")}</p>
                <Controller
                  defaultValue=""
                  name="method"
                  id="method"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="method"
                      placeholder={`${T("Select Method")}...`}
                      options={paymentMethod}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable={false}
                    />
                  )}
                />
                <FormFeedback className="invalid-feedback d-block">{errors.method?.message}</FormFeedback>
              </div>

              <div className="invoice-payment-option mt-1">
                <p className="mb-50">Status</p>
                <Controller
                  defaultValue=""
                  name="status"
                  id="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="status"
                      placeholder={`${T("Select Status")}...`}
                      options={status}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable={false}
                    />
                  )}
                />
                <FormFeedback className="invalid-feedback d-block">{errors.status?.message}</FormFeedback>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  ) : null
}

export default InvoiceEdit
