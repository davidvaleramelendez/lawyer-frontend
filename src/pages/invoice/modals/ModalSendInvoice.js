/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  sendInvoiceItem,
  clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Modal,
  Badge,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// Constant
import {
  invoiceItem
} from '@constant/reduxConstant'

// ** Icons Import
import { X } from 'react-feather'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Images
import pdfImage from '@src/assets/images/icons/pdf.png'

const ModalSendInvoice = ({
  open,
  toggleModal,
  invoiceData,
  setInvoiceRowData
}) => {
  /* Hook */
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.invoice)

  const SendSchema = yup.object({
    to: yup.string().required('To email is required!'),
    subject: yup.string().required('Subject is required!')
  }).required()

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    shouldUnregister: true,
    resolver: yupResolver(SendSchema)
  })

  const handleReset = () => {
    if (setInvoiceRowData) {
      setInvoiceRowData(invoiceItem)
    }
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "INVOICE_SENT") {
      handleReset()
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearInvoiceMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("ModalSendInvoice >>>> ", invoiceData)

  const handleSidebarClosed = () => {
    setValue('to', (invoiceData && invoiceData.customer && invoiceData.customer.email) || "")
    setValue('subject', `${t("Your")} ${t("bill")}# ${(invoiceData && invoiceData.invoice_no) || ""}`)
    setValue('message', `€ ${(invoiceData && invoiceData.total_price) || 0}
    ${(invoiceData && invoiceData.invoice_due_date) || ""}`)
  }

  /* Submitting data */
  const onSubmit = (values) => {
    if (values) {
      const sendData = {
        invoice_id: invoiceData.id,
        to: values.to,
        subject: values.subject,
        message: values.message
      }

      // console.log("onSubmit >>> ", values, sendData)
      dispatch(sendInvoiceItem(sendData))
    }
  }

  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleReset} />

  return store ? (
    <Modal
      isOpen={open}
      backdrop="static"
      className="sidebar-lg send-invoice-modal"
      toggle={handleReset}
      onClosed={handleSidebarClosed}
      contentClassName="p-0 overflow-hidden"
      modalClassName="modal-slide-in"
      backdropClassName="send-invoice-backdrop-modal"
    >
      <ModalHeader className="mb-1" toggle={handleReset} close={CloseBtn} tag="div">
        <h5 className="modal-title">
          {`${t("Send")} ${t("Invoice")}`}
        </h5>
      </ModalHeader>
      <PerfectScrollbar
        className="media-list scrollable-container"
        options={{ wheelPropagation: true }}
      >
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="mb-1">
              <Label className="form-label" for="total_price">
                {t("To")}
              </Label>
              <Controller
                defaultValue={(invoiceData && invoiceData.customer && invoiceData.customer.email) || ""}
                id="to"
                name="to"
                control={control}
                render={({ field }) => <Input
                  {...field}
                  placeholder="company@email.com"
                  invalid={errors.to && true} />}
              />
              <FormFeedback className="invalid-feedback">{errors.to?.message}</FormFeedback>
            </div>

            <div className="mb-1">
              <Label className="form-label" for="subject">
                {t("Subject")}
              </Label>
              <Controller
                defaultValue={`${t("Your")} ${t("bill")}# ${(invoiceData && invoiceData.invoice_no) || ""}`}
                id="subject"
                name="subject"
                control={control}
                render={({ field }) => <Input
                  {...field}
                  placeholder="Invoice regarding goods"
                  invalid={errors.subject && true}
                />}
              />
              <FormFeedback className="invalid-feedback">{errors.subject?.message}</FormFeedback>
            </div>

            <div className="mb-1">
              <Label className="form-label" for="message">
                {t("Message")}
              </Label>
              <Controller
                defaultValue={
                  `€ ${(invoiceData && invoiceData.total_price) || 0}
${(invoiceData && invoiceData.invoice_due_date) || ""}`
                }
                id="message"
                name="message"
                control={control}
                render={({ field }) => <Input
                  {...field}
                  type="textarea"
                  placeholder="Message..."
                  cols={3}
                  rows={11}
                  invalid={errors.note && true} />}
              />
              <FormFeedback className="invalid-feedback">{errors.note?.message}</FormFeedback>
            </div>

            <div className='mb-1'>
              <Badge color='light-primary'>
                <img
                  className="me-1"
                  src={pdfImage}
                  alt="pdf-icon"
                  height="18"
                />
                <span className='align-middle'>{t("Invoice")} {t("automatically")} {t("attached")}</span>
              </Badge>
            </div>

            <div className="d-flex flex-wrap mb-0">
              <Button
                type="submit"
                color="primary"
                className="me-1"
                disabled={!store.loading}
              >
                {t("Send")}
              </Button>

              <Button
                outline
                type="button"
                color="secondary"
                disabled={!store.loading}
                onClick={handleReset}
              >
                {t("Abort")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  ) : null
}

export default ModalSendInvoice
