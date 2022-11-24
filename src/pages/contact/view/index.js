// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  deleteContact,
  getContactView,
  clearContactMessage
} from '../store'
import {
  getContactNotification
} from '@store/navTopNotification'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Button,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap'

// ** Icons Import
import {
  User,
  Mail,
  Phone,
  MessageSquare
} from 'react-feather'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  setInnerHtml,
  isUserLoggedIn,
  getTransformDate
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Modals
import ModalAddNotes from '../modals/ModalAddNotes'
import ModalAcceptRequest from '../modals/ModalAcceptRequest'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ContactView = () => {
  // ** Hooks
  const { id } = useParams()
  const { t } = useTranslation()

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.contact)

  /* State */
  const [loadFirst, setLoadFirst] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [acceptModalOpen, setAcceptModalOpen] = useState(false)

  // ** Get contact on mount based on id
  useEffect(() => {
    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/contact`)
    }

    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getContactView(id))
      dispatch(getContactNotification())
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearContactMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }

    /* If contact deleted then redirect */
    if (store.actionFlag && store.actionFlag === "DELETED") {
      navigate(`${adminRoot}/contact`)
    }

    /* If contact converted to case then redirect */
    if (store.contactItem && store.contactItem.IsCase && store.contactItem.case && store.contactItem.case.CaseID) {
      navigate(`${adminRoot}/case/view/${store.contactItem.case.CaseID}`)
    }
  }, [store.contactItem, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>>> ", store)

  const onDeleteContact = (contId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteContact(contId))
      }
    })
  }

  return store ? (
    <div className="invoice-preview-wrapper">
      <Row className="invoice-preview">
        <Col xl={12} md={12} sm={12}>
          <Card>
            <CardBody className="invoice-padding pb-1">
              {/* Header */}
              <Row>
                <Col
                  xl={6}
                  md={6}
                  sm={6}
                  className="d-flex flex-column justify-content-between border-container-lg"
                >
                  <div
                    className={`${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder-glow'}`}
                  >
                    <h4
                      className={`mb-25 ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder w-50'}`}
                    >
                      {(store.contactItem && store.contactItem.Name)}
                    </h4>
                    <span
                      className={`mb-25 ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder w-75'}`}
                    >
                      {(store.contactItem && store.contactItem.Email)}
                    </span>
                    {/* Buttons */}
                    <div className="mt-1 mb-25">
                      <Button
                        color="success"
                        className={`me-1 mb-1 ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder'}`}
                        onClick={() => setAcceptModalOpen(true)}
                      >
                        {t("Accept")}
                      </Button>

                      <Button
                        color="primary"
                        className={`me-1 mb-1 ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder'}`}
                        onClick={() => setModalOpen(true)}
                      >
                        {t("Notes")}
                      </Button>

                      <Button
                        color="danger"
                        className={`mb-1 ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder'}`}
                        onClick={() => onDeleteContact(id)}
                      >
                        {t("Clear")}
                      </Button>
                    </div>
                    {/* /Buttons */}

                    <ModalAddNotes
                      toggleModal={() => setModalOpen(!modalOpen)}
                      open={modalOpen}
                      ContactID={id}
                    />

                    <ModalAcceptRequest
                      toggleModal={() => setAcceptModalOpen(!acceptModalOpen)}
                      open={acceptModalOpen}
                      ContactID={id}
                      lawyers={store.laywerItems}
                      groups={store.typeItems}
                      contactData={store.contactItem}
                    />
                  </div>
                </Col>

                <Col
                  xl={6}
                  md={6}
                  sm={6}
                >
                  <div
                    className={`mt-md-0 mt-2 ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder-glow'}`}
                  >
                    <div className="invoice-date-wrapper">
                      <User size={14} />
                      <p className="invoice-date-title fw-bold ms-1">Name</p>
                      <p
                        className={`invoice-date fw-normal ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder w-50'}`}
                      >
                        {(store.contactItem && store.contactItem.Name)}
                      </p>
                    </div>

                    <div className="invoice-date-wrapper">
                      <Phone size={14} />
                      <p className="invoice-date-title fw-bold ms-1">Telephone</p>
                      <p
                        className={`invoice-date fw-normal ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder w-50'}`}
                      >
                        {(store.contactItem && store.contactItem.PhoneNo)}
                      </p>
                    </div>

                    <div className="invoice-date-wrapper">
                      <Mail size={14} />
                      <p className="invoice-date-title fw-bold ms-1">E-Mail</p>
                      <p
                        className={`invoice-date fw-normal ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder w-50'}`}
                      >
                        {(store.contactItem && store.contactItem.Email)}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* /Header */}
            </CardBody>
          </Card>

          {/* News */}
          <Card>
            <CardHeader>
              <CardTitle>{t("News")}</CardTitle>
            </CardHeader>

            <CardBody>
              <Row
                className={`${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder-glow px-1'}`}
              >
                <span
                  className={`${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder'}`}
                >
                  {store.contactItem && setInnerHtml(store.contactItem.Subject)}
                </span>
              </Row>
            </CardBody>
          </Card>
          {/* /News */}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Notes")}</CardTitle>
            </CardHeader>

            <CardBody
              className={`${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder-glow'}`}
            >
              {store.noteItems && store.noteItems.length ? <>
                <ul className="timeline">
                  {store.noteItems.map((note, index) => (<Fragment key={`note_${index}`}>
                    <li className="timeline-item">
                      <span className="timeline-point">
                        <MessageSquare size={14} />
                      </span>

                      <div className="timeline-event">
                        <Row
                          className={`flex-column align-items-center justify-content-between ${store.contactItem && store.contactItem.ContactID ? '' : 'placeholder'}`}
                        >
                          {setInnerHtml(note.Notes)}
                          <span
                            className="timeline-event-time"
                          >
                            {getTransformDate(note.CreatedAt, "DD.MM.YYYY HH:MM")}
                          </span>
                        </Row>
                        <hr />
                      </div>
                    </li>
                  </Fragment>))}
                </ul>
              </> : null}
            </CardBody>
          </Card>
          {/* /Notes */}
        </Col>
      </Row>
    </div>
  ) : null
}

export default ContactView
