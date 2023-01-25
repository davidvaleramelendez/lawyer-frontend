/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Store & Actions
import {
  deleteInvoice,
  clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Modal,
  Table,
  ModalBody,
  ModalHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledButtonDropdown
} from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Icons Import
import {
  Eye,
  Edit,
  Copy,
  Send,
  Trash2,
  Download,
  MoreVertical
} from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Utils
import {
  getDecimalFormat,
  getWebPreviewUrl,
  getTransformDate,
  getRandColorClass
} from '@utils'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'
import {
  invoiceItem
} from '@constant/reduxConstant'

// Modal
import ModalSendInvoice from './ModalSendInvoice'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalInvoiceDetail = ({
  open,
  toggleModal,
  invoiceStatus,
  invoiceRowData,
  setInvoiceRowData
}) => {

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.invoice)

  // ** States
  const [sendInvoiceModalOpen, setSendInvoiceModalOpen] = useState(false)

  const handleReset = () => {
    setInvoiceRowData(invoiceItem)
    if (open) {
      toggleModal()
    }
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "DELETED") {
      handleReset()
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearInvoiceMessage())
    }
  }, [store.success, store.error, store.actionFlag])
  // console.log("invoiceItem Model >>>> ", invoiceRowData)

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  // ** Renders invoice Columns
  const renderCustomer = (row) => {
    if (row && row.profile_photo_path && row.profile_photo_path.length) {
      return (
        <Avatar
          width='32'
          height='32'
          className='me-1'
          img={renderFileWebUrlPreview(row.profile_photo_path) || defaultAvatar}
        />
      )
    } else {
      return (
        <Avatar
          initials
          className='me-1'
          color={getRandColorClass()}
          content={(row && row.name) || 'John Doe'}
        />
      )
    }
  }

  const onDeleteInvoice = (id) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You won't be able to revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes, delete it!'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteInvoice(id))
      }
    })
  }

  const color = invoiceStatus[invoiceRowData.status] ? invoiceStatus[invoiceRowData.status].color : 'primary',
    Icon = invoiceStatus[invoiceRowData.status] ? invoiceStatus[invoiceRowData.status].icon : Edit

  return (
    <div className="disabled-backdrop-modal">
      <Modal
        isOpen={open}
        toggle={handleReset}
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{T("Details")} {T("of")} {invoiceRowData && invoiceRowData.customer && invoiceRowData.customer.name}</ModalHeader>
        {invoiceRowData && invoiceRowData.id ? <>
          <ModalBody>
            <Table striped responsive>
              <tbody>
                <tr>
                  <td>{T("Invoice number")}:</td>
                  <td>
                    <Link to={`${adminRoot}/invoice/view/${invoiceRowData && invoiceRowData.id}`} className="font-weight-bold">
                      #{invoiceRowData.invoice_no}
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>Status:</td>
                  <td>
                    <Fragment>
                      <Avatar color={color} icon={<Icon size={14} />} id={`av-tooltip-${invoiceRowData.id}`} />
                      <UncontrolledTooltip placement="top" target={`av-tooltip-${invoiceRowData.id}`}>
                        <span className="fw-bold text-capitalize">{invoiceRowData && invoiceRowData.status}</span>
                        <br />
                        <span className="fw-bold">{T('Balance')}:</span> {invoiceRowData && invoiceRowData.remaining_amount && getDecimalFormat(invoiceRowData.remaining_amount)}
                        <br />
                        <span className="fw-bold">{T('Due Date')}:</span> {invoiceRowData.invoice_due_date && getTransformDate(invoiceRowData.invoice_due_date, "DD/MM/YYYY")}
                      </UncontrolledTooltip>
                    </Fragment>
                  </td>
                </tr>

                <tr>
                  <td>{T("Client")}:</td>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      {renderCustomer(invoiceRowData && invoiceRowData.customer)}
                      <div className="d-flex flex-column">
                        <h6 className="user-name text-truncate mb-0">{invoiceRowData && invoiceRowData.customer && invoiceRowData.customer.name}</h6>
                        <small className="text-truncate text-muted mb-0">{invoiceRowData && invoiceRowData.customer && invoiceRowData.customer.email}</small>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>{T("Total")}:</td>
                  <td>€ {invoiceRowData && invoiceRowData.total_price && getDecimalFormat(invoiceRowData.total_price)}</td>
                </tr>

                <tr>
                  <td>{T("Due date")}:</td>
                  <td>{invoiceRowData && invoiceRowData.invoice_due_date && getTransformDate(invoiceRowData.invoice_due_date, "DD MMM YYYY")}</td>
                </tr>

                <tr>
                  <td>{T("Balance")}:</td>
                  <td>€ {invoiceRowData && invoiceRowData.remaining_amount && getDecimalFormat(invoiceRowData.remaining_amount)}</td>
                </tr>

                <tr>
                  <td>{T("Invoice status")}:</td>
                  <td className="text-capitalize">{invoiceRowData && invoiceRowData.status}</td>
                </tr>

                <tr>
                  <td>Actions:</td>
                  <td>
                    <div className="column-action d-flex align-items-center">
                      <Send className="cursor-pointer" size={17} id={`send-tooltip-${invoiceRowData.id}`} onClick={() => setSendInvoiceModalOpen(true)} />
                      <UncontrolledTooltip placement="top" target={`send-tooltip-${invoiceRowData.id}`}>
                        {T('Send Mail')}
                      </UncontrolledTooltip>

                      <Link to={`${adminRoot}/invoice/view/${invoiceRowData.id}`} id={`pw-tooltip-${invoiceRowData.id}`}>
                        <Eye size={17} className="mx-1" />
                      </Link>
                      <UncontrolledTooltip placement="top" target={`pw-tooltip-${invoiceRowData.id}`}>
                        {T('Preview Invoice')}
                      </UncontrolledTooltip>

                      <UncontrolledButtonDropdown>
                        <DropdownToggle color="#FFFFFF" tag="span">
                          <MoreVertical size={17} className="cursor-pointer" />
                        </DropdownToggle>
                        <DropdownMenu end>
                          <DropdownItem
                            tag="a"
                            target="_blank"
                            className="w-100"
                            rel="noopener noreferrer"
                            href={renderFileWebUrlPreview(invoiceRowData.pdf_path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                          >
                            <Download size={17} className="me-50" />
                            <span className="align-middle">{T('Download')}</span>
                          </DropdownItem>

                          <DropdownItem
                            tag={Link}
                            to={`${adminRoot}/invoice/edit/${invoiceRowData.id}`}
                            className="w-100"
                          >
                            <Edit size={17} className="me-50" />
                            <span className="align-middle">{T('Edit')}</span>
                          </DropdownItem>

                          <DropdownItem
                            tag="a"
                            href="/"
                            className="w-100"
                            onClick={(event) => {
                              event.preventDefault()
                              onDeleteInvoice(invoiceRowData.id)
                            }}
                          >
                            <Trash2 size={17} className="me-50" />
                            <span className="align-middle">{T('Delete')}</span>
                          </DropdownItem>

                          <DropdownItem
                            tag={Link}
                            to={`${adminRoot}/invoice/add?copyId=${invoiceRowData.id}`}
                            className="w-100"
                          >
                            <Copy size={17} className="me-50" />
                            <span className="align-middle">{T('Duplicate')}</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>

                      <ModalSendInvoice
                        toggleModal={() => setSendInvoiceModalOpen(!sendInvoiceModalOpen)}
                        open={sendInvoiceModalOpen}
                        invoiceData={invoiceRowData}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
        </> : null}
      </Modal>
    </div>
  )
}

export default ModalInvoiceDetail
