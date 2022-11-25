/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Input,
  CardBody,
  CardHeader
} from 'reactstrap'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  isUserLoggedIn,
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

// ** Store & Actions
import {
  getTimelineList,
  changeTimelineStatus,
  clearTimelineMessage
} from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
  X,
  Eye,
  Check,
  FileText
} from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Images
import pdfImage from '@src/assets/images/icons/pdf.png'

const TimelineApp = () => {
  /* Hook */
  const { t } = useTranslation()
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.timeline)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [searchLetterInput, setSearchLetterInput] = useState('')
  const [searchInvoiceInput, setSearchInvoiceInput] = useState('')

  const handleTimelineLists = (letterSearch = searchLetterInput, invoiceSearch = searchInvoiceInput) => {
    // console.log("handleTimelineLists ", letterSearch, invoiceSearch)
    dispatch(
      getTimelineList({
        letter_search: letterSearch || "",
        invoice_search: invoiceSearch || ""
      })
    )
  }

  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      handleTimelineLists()
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearTimelineMessage())
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
  // console.log("store >>> ", store)

  const handleLetterSearch = (value) => {
    setSearchLetterInput(value)
    handleTimelineLists(value, searchInvoiceInput)
  }

  const handleInvoiceSearch = (value) => {
    setSearchInvoiceInput(value)
    handleTimelineLists(searchLetterInput, value)
  }

  const renderInvoice = (invoice) => {
    if (invoice && invoice.id) {
      return (
        <Card>
          <CardHeader />
          <CardBody>
            <ul className="timeline">
              <li className="timeline-item">
                <span className="timeline-point timeline-point-danger">
                  <FileText size={14} />
                </span>
                <div className='timeline-event'>
                  <div className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                    <h6 className="font-weight-bolder text-dark">
                      R.-Nr.# <Link to={`${adminRoot}/invoice/view/${invoice.id}`} target="_blank">{invoice.invoice_no}</Link>
                    </h6>
                    <span className="timeline-event-time" align="right">{t("First anniversary")} : {invoice.invoice_date && getTransformDate(invoice.invoice_date, "DD.MM.YYYY")} </span>
                  </div>

                  <div className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                    <div className="mt-sm-0 mt-1">
                      <p className="text-muted mb-50 font-weight-bolder text-dark">{t("File")}:# {invoice.CaseID ? (<Link to={`${adminRoot}/case/view/${invoice.CaseID}`} target="_blank">{invoice.CaseID}</Link>) : null}</p>
                      <div className="media align-items-center">
                        <a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${invoice.pdf_path}`} target="_blank">
                          <img
                            className="me-1"
                            src={pdfImage}
                            alt="letter"
                            height="23"
                          />
                          <div className="media-body">
                            {invoice && invoice.pdf_file}
                          </div>
                        </a>
                      </div>
                    </div>

                    <div className="mt-sm-0 mt-1">
                      <p className="text-muted mb-50">{t("Deadline Date")}</p>
                      <p className="mb-0 font-weight-bolder text-danger">{invoice.invoice_due_date && getTransformDate(invoice.invoice_due_date, "DD.MM.YYYY")}</p>
                    </div>

                    <div className="mt-sm-0 mt-1">
                      <p className="text-muted mb-50">{t("Amount")}</p>
                      <p className="mb-0">€ {invoice && invoice.remaining_amount}</p>
                    </div>

                    <div className="mt-sm-0 mt-1">
                      <p className="text-muted mb-50">{t("Done")}</p>
                      <p className="mb-0">
                        <Link to={`${adminRoot}/invoice/view/${invoice.id}`} target="_blank"><Eye size={14} /></Link>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </CardBody>
        </Card>
      )
    }
  }

  const onDoneTimelineRecord = (id, type) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You want to Done this timeline?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-warning ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(changeTimelineStatus({ id: id, type: type }))
      }
    })
  }

  return store ? (<>
    {!store.loading ? (
      <Spinner
        className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
      />
    ) : null}

    <Row>
      <Col sm={12} md={6}>
        <h4 className="font-weight-bolder text-dark mb-2">{t("Letter Deadline")}</h4>
        <div className="d-flex align-items-center mb-2">
          <Input
            id="search-letter"
            className="w-100"
            type="text"
            value={searchLetterInput}
            placeholder="Search Letter"
            onChange={(event) => handleLetterSearch(event.target.value)}
          />
        </div>

        {store.letterItems && store.letterItems.length ? <>
          {store.letterItems.map((letter, index) => (
            <Card key={`letter_${index}`}>
              <CardHeader />
              <CardBody>
                <ul className="timeline">
                  <li className="timeline-item">
                    <span className="timeline-point timeline-point-danger timeline-point-indicator"></span>
                    <div className='timeline-event'>
                      <div className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                        <h6>{t("Subject")} : {letter && letter.subject}</h6>
                        <span className="timeline-event-time" align="right">{t("First anniversary")} : {letter && letter.created_at && getTransformDate(letter.created_at, "DD.MM.YYYY")} </span>
                      </div>

                      <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">
                        <div className="mt-sm-0 mt-1">
                          <p className="text-muted mb-50 font-weight-bolder text-dark">{t("PDF documents")}</p>
                          <div className="media align-items-center">
                            <img
                              className="me-1"
                              src={pdfImage}
                              alt="letter"
                              height="23"
                            />
                            <div className="media-body">
                              {letter && letter.pdf_path ? (
                                <a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${letter.pdf_path}`} target="_blank">
                                  {letter && letter.pdf_file}
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="mt-sm-0 mt-1">
                          <p className="text-muted mb-50">{t("Deadline Date")}</p>
                          <p className="mb-0 font-weight-bolder text-danger">{letter && letter.frist_date && getTransformDate(letter.frist_date, "DD.MM.YYYY")}</p>
                        </div>

                        <div className="mt-sm-0 mt-1">
                          <p className="text-muted mb-50">{t("Reference number")}</p>
                          {letter && letter.case_id ? (
                            <Link to={`${adminRoot}/case/view/${letter.case_id}`} target="_blank">
                              {letter.case_id}
                            </Link>
                          ) : null}
                        </div>

                        <div className="mt-sm-0 mt-1">
                          <p className="text-muted mb-50">{t("Done?")}</p>
                          <div className='form-switch form-check-primary'>
                            <Input
                              type='switch'
                              checked={letter.isErledigt}
                              id={`letter_${index}_${letter.isErledigt}`}
                              name={`letter_${index}_${letter.isErledigt}`}
                              className="cursor-pointer"
                              onChange={() => onDoneTimelineRecord(letter.id, 'letter')}
                            />
                            <Label className='form-check-label' htmlFor="icon-primary">
                              <span className='switch-icon-left'>
                                <Check size={14} />
                              </span>
                              <span className='switch-icon-right'>
                                <X size={14} />
                              </span>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>
          ))}
        </> : null}
      </Col>

      <Col sm={12} md={6}>
        <h4 className="font-weight-bolder text-dark mb-2">{t("Invoice Deadline")}</h4>
        <div className="d-flex align-items-center mb-2">
          <Input
            id="search-invoice"
            className="w-100"
            type="text"
            value={searchInvoiceInput}
            placeholder="Search Invoice"
            onChange={(event) => handleInvoiceSearch(event.target.value)}
          />
        </div>

        {store.invoiceItems && store.invoiceItems.length ? <>
          {store.invoiceItems.map((invoice, index) => (<Fragment key={`invoice_${index}`}>
            {invoice && invoice.status === "open" ? <>
              {renderInvoice(invoice)}
            </> : null}

            {invoice && invoice.status === "Zahlungserinnerung" ? <>
              {renderInvoice(invoice)}
            </> : null}

            {invoice && invoice.status === "Mahnung" ? <>
              {renderInvoice(invoice)}
            </> : null}

            {invoice && invoice.status === "3. Mahnung" ? <>
              {renderInvoice(invoice)}
            </> : null}
          </Fragment>))}
        </> : null}
      </Col>
    </Row>
  </>) : null
}

export default TimelineApp
