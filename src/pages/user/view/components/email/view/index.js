/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  getMailItem,
  clearEmailMessage,
  resetMailDetailItem
} from '@src/pages/email/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'

// ** Icons Import
import {
  Paperclip,
  ChevronDown
} from 'react-feather'

// ** Reactstrap Imports
import {
  Card,
  Badge,
  Table,
  CardBody,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// Constant
import {
  root,
  adminRoot
} from '@constant/defaultValues'

// ** Utils
import {
  setInnerHtml,
  isUserLoggedIn,
  getTransformDate
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Styles
import '@styles/react/apps/app-email.scss'

// ** Translation
import { T } from '@localization'

const EmailDetailView = () => {
  // ** Hooks
  const { id } = useParams()
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.email)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)

  // ** Variables
  const labelColors = {
    personal: 'success',
    company: 'primary',
    important: 'warning',
    private: 'danger'
  }

  // ** Renders Labels
  const renderLabels = (labels) => {
    if (labels && labels.length) {
      return labels.map(label => (
        <Badge key={label} color={`light-${labelColors[label]}`} className='me-50 text-capitalize' pill>
          {label}
        </Badge>
      ))
    }
  }

  // ** Renders Attachments
  const renderAttachments = (attachments) => {
    return attachments.map((item, index) => {
      return (
        <a
          key={`${index}_${item.name}`}
          href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.path}`} target="_blank"
          className={classnames({
            'mb-50': index + 1 !== attachments.length
          })}
        >
          <span className='text-muted fw-bolder align-text-top'>{item.name}</span>
        </a>
      )
    })
  }

  // ** Get email on mount based on id
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/email`)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(resetMailDetailItem())
      dispatch(getMailItem(id))
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearEmailMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }
  }, [dispatch, store.success, store.error, store.actionFlag, loadFirst])

  return store ? (
    <div className="d-flex justify-content-center p-4">
      <div className="email-app-details w-75">
        {store.separateMailItem && store.separateMailItem.id ? (
          <Fragment>
            <Card>
              <CardHeader className="email-detail-head">
                <div className="user-details d-flex justify-content-between align-items-center flex-wrap">
                  <div className="mail-items">
                    <h5 className="mb-0">{store.separateMailItem && store.separateMailItem.sender && store.separateMailItem.sender.name}</h5>
                    <UncontrolledDropdown className="email-info-dropup">
                      <DropdownToggle className="font-small-3 text-muted cursor-pointer text-break" tag="span">
                        <span className="me-25">{store.separateMailItem && store.separateMailItem.sender && store.separateMailItem.sender.email}</span>
                        <ChevronDown size={17} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <Table className="font-small-3" size="sm" borderless>
                          <tbody>
                            <tr>
                              <td className="text-end text-muted align-top">From:</td>
                              <td>{store.separateMailItem && store.separateMailItem.sender && store.separateMailItem.sender.email}</td>
                            </tr>

                            <tr>
                              <td className="text-end text-muted align-top">To:</td>
                              <td>{store.separateMailItem && store.separateMailItem.receiver && store.separateMailItem.receiver.email}</td>
                            </tr>

                            <tr>
                              <td className="text-end text-muted align-top">Date:</td>
                              {store.separateMailItem && store.separateMailItem.date ? (<td>
                                {getTransformDate(store.separateMailItem.date, "DD-MM-YYYY HH:mm:ss")}
                              </td>) : null}

                              {store.separateMailItem && store.separateMailItem.created_at ? (<td>
                                {getTransformDate(store.separateMailItem.created_at, "DD-MM-YYYY HH:mm:ss")}
                              </td>) : null}
                            </tr>
                          </tbody>
                        </Table>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>

                <div className="mail-meta-item d-flex align-items-center">
                  <small className="mail-date-time text-muted">
                    {store.separateMailItem && store.separateMailItem.date ? getTransformDate(store.separateMailItem.date, "DD-MM-YYYY HH:mm:ss") : null}
                    {store.separateMailItem && store.separateMailItem.created_at ? getTransformDate(store.separateMailItem.created_at, "DD-MM-YYYY HH:mm:ss") : null}
                  </small>
                  <div className="email-label ms-1">{store.separateMailItem && store.separateMailItem.label ? renderLabels(store.separateMailItem.label.split(",")) : null}</div>
                </div>
              </CardHeader>

              <CardHeader className="email-detail-head">
                <div className="email-header-left d-flex align-items-center">
                  <h4 className="email-subject">{store.separateMailItem && store.separateMailItem.subject}</h4>
                </div>
              </CardHeader>

              <CardBody className="mail-message-wrapper pt-2">
                {store.separateMailItem && store.separateMailItem.body ? (setInnerHtml(store.separateMailItem.body, "mail-message")) : null}
                {store.separateMailItem && store.separateMailItem.data && store.separateMailItem.data.data && store.separateMailItem.data.data.display_message ? (setInnerHtml(store.separateMailItem.data.data.display_message, "mail-message")) : null}
              </CardBody>

              {store.separateMailItem && store.separateMailItem.attachment && store.separateMailItem.attachment.length ? (
                <CardFooter>
                  <div className="mail-attachments">
                    <div className="d-flex align-items-start mb-1 text-break">
                      <div className="d-flex d-inline-block">
                        <Paperclip size={16} />
                        <h5 className="fw-bolder text-body mb-0 ms-50">{store.separateMailItem.attachment.length} Attachment</h5>
                      </div>
                    </div>
                    <div className="d-flex flex-column">{renderAttachments(store.separateMailItem.attachment)}</div>
                  </div>
                </CardFooter>
              ) : null}
            </Card>
          </Fragment>
        ) : null}
      </div>
    </div>
  ) : null
}

export default EmailDetailView
