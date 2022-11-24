// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Table,
  Button,
  CardBody,
  CardText,
  CardHeader
} from 'reactstrap'

// ** Store & Actions
import {
  getInvoiceItem,
  resetCalculationVatPrice,
  clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  isUserLoggedIn,
  getDecimalFormat,
  getTransformDate
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-spinner'
import Notification from '@components/toast/notification'

// Constant
import {
  root,
  adminRoot
} from '@constant/defaultValues'
import {
  invoicePaymentItem
} from '@constant/reduxConstant'

// Modal
import ModalSendInvoice from '../modals/ModalSendInvoice'
import ModalInvoicePayment from '../modals/ModalInvoicePayment'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const InvoiceView = () => {
  // ** HooksVars
  const { id } = useParams()
  const { t } = useTranslation()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector((state) => state.invoice)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [sendInvoiceModalOpen, setSendInvoiceModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentRowData, setPaymentRowData] = useState(invoicePaymentItem)

  // ** Get invoice on mount based on id
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
      dispatch(resetCalculationVatPrice({}))
      dispatch(getInvoiceItem(id))
      setLoadFirst(false)
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
  }, [dispatch, store.success, store.error, store.actionFlag, loadFirst])
  console.log("View store >>> ", store)

  const onNetValueCost = (total = 0, vat = 0) => {
    return getDecimalFormat(total - vat)
  }

  return store ? (
    <div className="invoice-preview-wrapper">
      {!store.loading ? (
        <Spinner
          className="d-flex justify-content-center position-absolute top-50 w-50 zindex-1"
        />
      ) : null}

      <Row className="invoice-preview">
        <Col xl={8} md={8} sm={12}>
          <Card className="invoice-preview-card">
            <CardBody className="invoice-padding pb-0">
              {/* Header */}
              <div
                className={`d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder-glow'}`}
              >
                <div>
                  <div className="logo-wrapper">
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
                  <CardText
                    className={`mb-25 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.user_data && store.invoiceItem.user_data.name}
                  </CardText>

                  <CardText
                    className={`mb-25 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.user_data && store.invoiceItem.user_data.id ? <>
                      {store.invoiceItem.user_data.Address},
                      {store.invoiceItem.user_data.State}
                    </> : "N/A"}
                  </CardText>

                  <CardText
                    className={`mb-0 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.user_data && store.invoiceItem.user_data.Contact ? store.invoiceItem.user_data.Contact : "N/A"}
                  </CardText>
                </div>

                <div className="mt-md-0 mt-2">
                  <h4 className="invoice-title">
                    {t("Invoice")} <span className={`invoice-number ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}>
                      #{store.invoiceItem && store.invoiceItem.invoice_no}
                    </span>
                  </h4>

                  <div className="invoice-date-wrapper">
                    <p className="invoice-date-title">{t("Created")}:</p>
                    <p
                      className={`invoice-date ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                    >
                      {store.invoiceItem && store.invoiceItem.invoice_date && getTransformDate(store.invoiceItem.invoice_date, "DD.MM.YYYY")}
                    </p>
                  </div>

                  <div className="invoice-date-wrapper">
                    <p className="invoice-date-title">{t("Maturity")}:</p>
                    <p
                      className={`invoice-date ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                    >
                      {store.invoiceItem && store.invoiceItem.invoice_due_date && getTransformDate(store.invoiceItem.invoice_due_date, "DD.MM.YYYY")}
                    </p>
                  </div>

                  <div className="invoice-date-wrapper">
                    <p className="invoice-date-title">{t("Status")}:</p>
                    <p
                      className={`invoice-date text-capitalize ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                    >
                      {store.invoiceItem && store.invoiceItem.status}
                    </p>
                  </div>
                </div>
              </div>
              {/* /Header */}
            </CardBody>

            <hr className="invoice-spacing" />

            {/* Address and Contact */}
            <CardBody className="invoice-padding pt-0">
              <Row
                className={`invoice-spacing ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder-glow'}`}
              >
                <Col
                  xl={8}
                  className="p-0"
                >
                  <h6 className="mb-2">{t("Invoice to")}:</h6>
                  <h6
                    className={`mb-25 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-50'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.customer && store.invoiceItem.customer.name}
                  </h6>

                  <CardText
                    className={`mb-25 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-75'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.customer && store.invoiceItem.customer.email}
                  </CardText>

                  <CardText
                    className={`mb-25 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-75'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.customer && store.invoiceItem.customer.Address}
                  </CardText>

                  <CardText
                    className={`mb-25 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-50'}`}
                  >
                    {store.invoiceItem && store.invoiceItem.customer && store.invoiceItem.customer.Postcode}
                  </CardText>
                </Col>

                <Col
                  xl={4}
                  className="p-0 mt-xl-0 mt-2"
                >
                  <h6 className="mb-2">{t("Payment details")}:</h6>
                  <table>
                    <tbody>
                      <tr>
                        <td>{t("Total")}:</td>
                        <td>
                          <span
                            className={`fw-bold ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                          >
                            € {store.invoiceItem && store.invoiceItem.total_price && getDecimalFormat(store.invoiceItem.total_price)}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="">{t("Open amount")}:</td>
                        <td>
                          <span
                            className={`fw-bold ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-100'}`}
                          >
                            € {store.invoiceItem && store.invoiceItem.remaining_amount && getDecimalFormat(store.invoiceItem.remaining_amount)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </CardBody>
            {/* /Address and Contact */}

            {/* Invoice Description */}
            <Table responsive>
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th className="d-flex justify-content-end">{t("Amount")}</th>
                </tr>
              </thead>
              <tbody>
                {store.invoiceItem && store.invoiceItem.items && store.invoiceItem.items.length ? <>
                  {store.invoiceItem.items.map((item, index) => (
                    <tr key={`item_${index}`}>
                      <td>
                        {item.item_detail}
                      </td>

                      <td className="d-flex justify-content-end">
                        € {item.price && getDecimalFormat(item.price)}
                      </td>
                    </tr>
                  ))}
                </> : null}
              </tbody>
            </Table>
            {/* /Invoice Description */}

            {/* Total & Sales Person */}
            <CardBody className="invoice-padding pb-0">
              <Row
                className={`invoice-sales-total-wrapper ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder-glow'}`}
              >
                <Col className="mt-md-0 mt-3" md={6} order={{ md: 1, lg: 2 }} />
                <Col className="d-flex justify-content-end" md={6} order={{ md: 2, lg: 1 }}>
                  <div className="invoice-total-wrapper">
                    <div className="invoice-total-item">
                      <p className="invoice-total-title">{t("Net")}:</p>
                      <p
                        className={`invoice-total-amount ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-50'}`}
                      >
                        € {onNetValueCost(store.invoiceItem && store.invoiceItem.total_price, store.invoiceItem && store.invoiceItem.vat)}
                      </p>
                    </div>

                    <div className="invoice-total-item">
                      <p className="invoice-total-title text-uppercase">{t("Vat")} 19 %</p>
                      <p
                        className={`invoice-total-amount ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-50'}`}
                      >
                        € {store.invoiceItem && store.invoiceItem.vat && getDecimalFormat(store.invoiceItem.vat)}
                      </p>
                    </div>
                    <hr className="my-50" />

                    <div className="invoice-total-item">
                      <p className="invoice-total-title">{("Total")}:</p>
                      <p
                        className={`invoice-total-amount ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder w-50'}`}
                      >
                        € {store.invoiceItem && store.invoiceItem.total_price && getDecimalFormat(store.invoiceItem.total_price)}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>

            <hr className="invoice-spacing" />

            <CardBody className="invoice-padding pt-0">
              <Row className="invoice-preview">
                <Col xl={12} md={12} sm={12} />
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col xl={4} md={4} sm={12}>
          <Card className="invoice-action-wrapper">
            <CardBody
              className={`${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder-glow'}`}
            >
              <Button
                block
                color="primary"
                className={`mb-75 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder'}`}
                onClick={() => setSendInvoiceModalOpen(true)}
              >
                {t("Send invoice by e-mail")}
              </Button>

              <Button
                block
                outline
                tag="a"
                target="_blank"
                color="secondary"
                rel="noopener noreferrer"
                className={`mb-75 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder'}`}
                href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.invoiceItem.pdf_path}`}
                onClick={(event) => store.invoiceItem && !store.invoiceItem.pdf_path && event.preventDefault()}
              >
                {t("Download")}
              </Button>

              <Button
                block
                outline
                tag="a"
                target="_blank"
                color="secondary"
                rel="noopener noreferrer"
                className={`mb-75 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder'}`}
                href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.invoiceItem.pdf_path}`}
                onClick={(event) => store.invoiceItem && !store.invoiceItem.pdf_path && event.preventDefault()}
              >
                {t("Print out")}
              </Button>

              <Button
                block
                outline
                tag={Link}
                color="secondary"
                className={`mb-75 ${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder'}`}
                to={`${adminRoot}/invoice/edit/${store.invoiceItem.id}`}
              >
                {t("Edit")}
              </Button>

              {store.invoiceItem && parseFloat(store.invoiceItem.remaining_amount) ? (
                <Button
                  block
                  color="success"
                  className={`${store.invoiceItem && store.invoiceItem.id ? '' : 'placeholder'}`}
                  onClick={() => setPaymentModalOpen(true)}
                >
                  {t("Add")} {t("Payment")}
                </Button>
              ) : null}

              <ModalSendInvoice
                toggleModal={() => setSendInvoiceModalOpen(!sendInvoiceModalOpen)}
                open={sendInvoiceModalOpen}
                invoiceData={store.invoiceItem}
              />

              <ModalInvoicePayment
                toggleModal={() => setPaymentModalOpen(!paymentModalOpen)}
                open={paymentModalOpen}
                invoiceData={store.invoiceItem}
                paymentRowData={paymentRowData}
                setPaymentRowData={setPaymentRowData}
              />
            </CardBody>
          </Card>

          <Card className="invoice-action-wrapper">
            <CardHeader>
              <h4>{t("Payment History")}</h4>
            </CardHeader>

            <CardBody>
              <Table striped responsive>
                <thead>
                  <tr>
                    <th className="text-left">{t("Amount")}</th>
                    <th className="text-center">{t("Note")}</th>
                    <th className="text-center">{t("Date")}</th>
                  </tr>
                </thead>
                {store.invoiceItem && store.invoiceItem.payments && store.invoiceItem.payments.length ? <>
                  <tbody>
                    {store.invoiceItem.payments.map((payment, index) => (
                      <tr key={`payment_${index}`}>
                        <td className="text-left">€ {payment.paid_amount && getDecimalFormat(payment.paid_amount)}</td>
                        <td className="text-center">{payment.note}</td>
                        <td className="text-center">{payment.date && getTransformDate(payment.date, "DD.MM.YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </> : null}
                <tbody>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  ) : null
}

export default InvoiceView
