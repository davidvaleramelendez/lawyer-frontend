/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Store & Actions
import {
  payInvoiceItem,
  updateInvoiceLoader,
  clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Button,
  FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** Third Party Components
import Flatpickr from 'react-flatpickr'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import {
  getTransformDate
} from '@utils'

// Constant
import {
  invoicePaymentItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalInvoicePayment = ({
  open,
  toggleModal,
  invoiceData,
  paymentRowData,
  setPaymentRowData
}) => {

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.invoice)

  const PaymentSchema = yup.object({
    paid_amount: yup.string().required('Amount is required!'),
    date: yup.date().required("Date is required!").nullable()
  }).required()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: paymentRowData,
    resolver: yupResolver(PaymentSchema)
  })

  const handleReset = () => {
    reset(invoicePaymentItem)
    setPaymentRowData(invoicePaymentItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "PAYMENT_CREATED") {
      handleReset()
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearInvoiceMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("ModalInvoicePayment >>>> ", invoiceData)

  const handleSidebarOpened = () => {
    const paymentItem = { ...invoicePaymentItem }
    paymentItem.paid_amount = (invoiceData && invoiceData.remaining_amount) || 0.00
    reset(paymentItem)
  }

  /* Submitting data */
  const onSubmit = (values) => {
    if (values) {
      const paymentData = {
        invoice_id: invoiceData.id,
        paid_amount: values.paid_amount,
        note: values.note
      }

      if (values.date && typeof values.date !== 'string' && values.date.length) {
        paymentData.date = getTransformDate(new Date(values.date[0], "YYYY-MM-DD"))
      } else if (values.date) {
        paymentData.date = getTransformDate(values.date, "YYYY-MM-DD")
      }

      // console.log("onSubmit >>> ", values, paymentData)
      dispatch(updateInvoiceLoader(false))
      dispatch(payInvoiceItem(paymentData))
    }
  }

  return (
    <Sidebar
      size="lg"
      open={open}
      title={T("Add payment")}
      headerClassName="mb-1"
      contentClassName="p-0"
      toggleSidebar={handleReset}
      handleSidebarOpened={handleSidebarOpened}
    >
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mb-1">
          <Label className="form-label" for="total_price">
            {T("Total")}
          </Label>
          <Controller
            defaultValue={(invoiceData && invoiceData.total_price) || 0.00}
            id="total_price"
            name="total_price"
            control={control}
            render={({ field }) => <Input
              {...field}
              readOnly
              placeholder=""
              invalid={errors.total_price && true} />}
          />
          <FormFeedback className="invalid-feedback">{errors.total_price?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="paid_amount">
            {T("Amount for payment")}
          </Label>
          <Controller
            defaultValue={(invoiceData && invoiceData.remaining_amount) || 0.00}
            id="paid_amount"
            name="paid_amount"
            control={control}
            render={({ field }) => <Input
              {...field}
              step="0.01"
              type="number"
              min={0.01}
              max={(invoiceData && invoiceData.remaining_amount) || 0.00}
              placeholder=""
              invalid={errors.paid_amount && true}
            />}
          />
          <FormFeedback className="invalid-feedback">{errors.paid_amount?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="date">
            {T("Payment Date")}
          </Label>
          <Controller
            defaultValue={null}
            id="date"
            name="date"
            control={control}
            render={({ field }) => <Flatpickr
              {...field}
              id="date"
              className="form-control"
              placeholder="YYYY-MM-DD"
              options={{
                enableTime: false,
                dateFormat: "Y-m-d"
              }}
            />}
          />
          <FormFeedback className="invalid-feedback d-block">{errors.date?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="note">
            {T('Internal Payment Note')}
          </Label>
          <Controller
            defaultValue=""
            id="note"
            name="note"
            control={control}
            render={({ field }) => <Input {...field} type="textarea" placeholder="Internal Payment Note" rows={5} invalid={errors.note && true} />}
          />
          <FormFeedback className="invalid-feedback">{errors.note?.message}</FormFeedback>
        </div>

        <div className="d-flex flex-wrap mb-0">
          <Button
            type="submit"
            color="primary"
            className="me-1"
            disabled={!store.loading}
          >
            {T("Add")}
          </Button>

          <Button
            outline
            type="button"
            color="secondary"
            disabled={!store.loading}
            onClick={handleReset}
          >
            {T("Abort")}
          </Button>
        </div>
      </Form>
    </Sidebar>
  )
}

export default ModalInvoicePayment
