// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Col,
  Row
} from 'reactstrap'

// ** Store & Actions
import {
  getInvoiceItem,
  resetCalculationVatPrice,
  clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import {
  isUserLoggedIn,
  getDecimalFormat,
  getTransformDate
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'
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

/* Invoice view components */
import ViewCard from './ViewCard'
import ViewActions from './ViewActions'
import PaymentHistory from './PaymentHistory'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const InvoiceView = () => {
  // ** HooksVars
  const { id } = useParams()
  const navigate = useNavigate()

  // ** Store vars
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
  // console.log("View store >>> ", store)

  return store ? (
    <div className="invoice-preview-wrapper">
      {!store.loading ? (
        <Spinner
          className="d-flex justify-content-center position-absolute top-50 w-50 zindex-1"
        />
      ) : null}

      <Row className="invoice-preview">
        <Col xl={8} md={8} sm={12}>
          <ViewCard
            invoiceItem={store.invoiceItem}
            getDecimalFormat={getDecimalFormat}
            getTransformDate={getTransformDate}
          />
        </Col>

        <Col xl={4} md={4} sm={12}>
          <ViewActions
            invoiceItem={store.invoiceItem}
            setPaymentModalOpen={setPaymentModalOpen}
            setSendInvoiceModalOpen={setSendInvoiceModalOpen}
          />

          <PaymentHistory
            invoiceItem={store.invoiceItem}
            getDecimalFormat={getDecimalFormat}
            getTransformDate={getTransformDate}
          />

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
        </Col>
      </Row>
    </div>
  ) : null
}

export default InvoiceView
