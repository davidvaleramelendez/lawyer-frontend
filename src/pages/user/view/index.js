/* eslint-disable object-shorthand */
/* eslint-disable no-confusing-arrow */

// ** React Imports
import { useEffect, useState, useCallback, Fragment } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  deleteUser,
  getUserView,
  getUserDeviceLogs,
  getUserPermission,
  clearUserMessage
} from '../store'
import {
  getCaseList,
  clearCaseMessage
} from '../../case/store'
// ** Store & Actions
import {
  getInvoiceList,
  clearInvoiceMessage
} from '../../invoice/store'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
  adminRoot,
  roleColors,
  perPageRowItems,
  defaultPerPageRow
} from '@constant/defaultValues'
import {
  caseItem
} from '@constant/reduxConstant'

// ** Reactstrap Imports
import {
  Col,
  Nav,
  Row,
  Card,
  Input,
  Table,
  Badge,
  Button,
  NavLink,
  NavItem,
  TabPane,
  CardBody,
  CardTitle,
  CardHeader,
  TabContent,
  UncontrolledTooltip
} from 'reactstrap'

// ** React Dropdown Import
import Select from "react-select"

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  isUserLoggedIn,
  onImageSrcError,
  getTransformDate,
  getDecimalFormat,
  getRandColorClass,
  capitalizeWordFirstLetter
} from '@utils'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Icons Import
import {
  Eye,
  Edit,
  Info,
  Send,
  Save,
  Unlock,
  Monitor,
  PieChart,
  FileText,
  Briefcase,
  PlusCircle,
  CheckCircle,
  ArrowDownCircle
} from 'react-feather'

// ** Modal
import ModalCaseDetail from '../../case/modals/ModalCaseDetail'

// ** Custom Components
import Avatar from "@components/avatar"
import Notification from '@components/toast/notification'
import DatatablePagination from "@components/datatable/DatatablePagination"

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/apps/app-users.scss'

/* Case header */
const CustomCaseHeader = ({
  searchInput,
  rowsPerPage,
  handleSearch,
  handlePerPage,
  statusFilter,
  handleStatusFilter
}) => {
  return (<div className="invoice-list-table-header w-100 py-2">
    <Row>
      <Col lg={4} className="d-flex align-items-center px-0 px-lg-1">
        <div className="d-flex align-items-center me-2">
          <label htmlFor="rows-per-page">Show</label>
          <Input
            type="select"
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(event) => handlePerPage(event.target.value)}
            className="form-control ms-50 pe-3"
          >
            {perPageRowItems && perPageRowItems.length ? (<>
              {perPageRowItems.map((item, index) => (
                <option key={`row-${index}`} value={item.value}>{item.label}</option>
              ))}
            </>) : null}
          </Input>
        </div>
      </Col>

      <Col lg={8} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
        <div className="d-flex align-items-center">
          <label htmlFor="search-case">Search</label>
          <Input
            id="search-case"
            className="ms-50 me-2 w-100"
            type="text"
            value={searchInput}
            placeholder="Search Case"
            onChange={(event) => handleSearch(event.target.value)}
          />
        </div>

        <div className="status">
          <Select
            id="status-filter"
            placeholder="Select..."
            options={[{ label: "Hold", value: "Hold" }, { label: "Open", value: "Open" }]}
            className="react-select w-100"
            classNamePrefix="select"
            isClearable={true}
            value={statusFilter}
            onChange={(data) => handleStatusFilter(data)}
          />
        </div>
      </Col>
    </Row>
  </div>)
}
/* /Case header */

/* Invoice header */
const CustomInvoiceHeader = ({
  searchInput,
  rowsPerPage,
  handleSearch,
  handlePerPage,
  statusFilter,
  handleStatusFilter
}) => {
  return (<div className="invoice-list-table-header w-100 py-2">
    <Row>
      <Col lg={4} className="d-flex align-items-center px-0 px-lg-1">
        <div className="d-flex align-items-center me-2">
          <label htmlFor="rows-per-page">Show</label>
          <Input
            type="select"
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(event) => handlePerPage(event.target.value)}
            className="form-control ms-50 pe-3"
          >
            {perPageRowItems && perPageRowItems.length ? (<>
              {perPageRowItems.map((item, index) => (
                <option key={`row-${index}`} value={item.value}>{item.label}</option>
              ))}
            </>) : null}
          </Input>
        </div>
      </Col>

      <Col lg={8} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
        <div className="d-flex align-items-center">
          <label htmlFor="search-invoice">Search</label>
          <Input
            id="search-invoice"
            className="ms-50 me-2 w-100"
            type="text"
            value={searchInput}
            placeholder="Search Invoice"
            onChange={(event) => handleSearch(event.target.value)}
          />
        </div>

        <div className="status">
          <Select
            id='status-filter'
            placeholder="Select Status..."
            options={[{ label: "Paid", value: "paid" }]}
            className='react-select'
            classNamePrefix='select'
            isClearable={true}
            value={statusFilter}
            onChange={(data) => handleStatusFilter(data)}
          />
        </div>
      </Col>
    </Row>
  </div>)
}
/* /Invoice header */

/* Device Log History header */
const CustomLogHeader = ({
  rowsPerPage,
  handlePerPage
}) => {
  return (<div className="invoice-list-table-header w-100 py-2">
    <Row>
      <Col lg={4} className="d-flex align-items-center px-0 px-lg-1">
        <div className="d-flex align-items-center me-2">
          <label htmlFor="log-rows-per-page">Show</label>
          <Input
            type="select"
            id="log-rows-per-page"
            value={rowsPerPage}
            onChange={(event) => handlePerPage(event.target.value)}
            className="form-control ms-50 pe-3"
          >
            {perPageRowItems && perPageRowItems.length ? (<>
              {perPageRowItems.map((item, index) => (
                <option key={`row-${index}`} value={item.value}>{item.label}</option>
              ))}
            </>) : null}
          </Input>
        </div>
      </Col>
    </Row>
  </div>)
}
/* /Device Log History header */

const UserView = () => {
  // ** Hooks
  const { id } = useParams()

  /* Transkation Hook */
  const { t } = useTranslation()

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.user)
  const caseStore = useSelector((state) => state.cases)
  const invoiceStore = useSelector((state) => state.invoice)

  // ** States
  const [active, setActive] = useState('1')
  const [loadFirst, setLoadFirst] = useState(true)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [caseRowData, setCaseRowData] = useState(caseItem)

  const toggleTab = (tab) => {
    setActive(tab)
  }

  /* Case pagination */
  const [searchInput, setSearchInput] = useState("")
  const [sort, setSort] = useState("desc")
  const [sortColumn, setSortColumn] = useState("caseId")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)
  const [statusFilter, setStatusFilter] = useState(null)
  /* /Case pagination */

  /* Case Pagination Api */
  const handleCaseList = useCallback((sortBy = sort, sortCol = sortColumn, search = searchInput, page = currentPage, perPage = rowsPerPage, status = "") => {
    dispatch(
      getCaseList({
        sort: sortBy,
        search: search,
        sortColumn: sortCol,
        page: page,
        perPage: parseInt(perPage),
        status,
        UserID: id
      })
    )
  }, [dispatch])

  const handleCasePerPage = (value) => {
    setRowsPerPage(parseInt(value))
    handleCaseList(
      sort,
      sortColumn,
      searchInput,
      currentPage,
      value,
      statusFilter && statusFilter.value ? statusFilter.value : ""
    )
  }

  const handleCaseSearch = (val) => {
    setSearchInput(val)
    handleCaseList(
      sort,
      sortColumn,
      val,
      currentPage,
      rowsPerPage,
      statusFilter && statusFilter.value ? statusFilter.value : ""
    )
  }

  const handleCaseSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    handleCaseList(
      sortDirection,
      column.sortField,
      searchInput,
      currentPage,
      rowsPerPage,
      statusFilter && statusFilter.value ? statusFilter.value : ""
    )
  }

  const handleCasePagination = (page) => {
    // console.log("handleCasePagination >>>>>>> ", page)
    setCurrentPage(page + 1)
    handleCaseList(
      sort,
      sortColumn,
      searchInput,
      page + 1,
      rowsPerPage,
      statusFilter && statusFilter.value ? statusFilter.value : ""
    )
  }

  const handleCaseStatusFilter = (value) => {
    setStatusFilter(value)
    handleCaseList(
      sort,
      sortColumn,
      searchInput,
      currentPage,
      rowsPerPage,
      value && value.value ? value.value : ""
    )
  }
  /* /Case Pagination Api */

  /* Invoice pagination */
  const [invSort, setInvSort] = useState('desc')
  const [invSortColumn, setInvSortColumn] = useState('id')
  const [invSearchInput, setInvSearchInput] = useState('')
  const [invCurrentPage, setInvCurrentPage] = useState(1)
  const [invRowsPerPage, setInvRowsPerPage] = useState(defaultPerPageRow)
  const [invStatusFilter, setInvStatusFilter] = useState(null)
  /* /Invoice pagination */

  // ** Vars
  const invoiceStatus = {
    sent: { color: 'light-secondary', icon: Send },
    paid: { color: 'light-success', icon: CheckCircle },
    draft: { color: 'light-primary', icon: Save },
    downloaded: { color: 'light-info', icon: ArrowDownCircle },
    'Past Due': { color: 'light-danger', icon: Info },
    'Partial Payment': { color: 'light-warning', icon: PieChart }
  }

  /* Invoice Pagination Api */
  const handleInvoiceLists = (sorting = invSort, sortCol = invSortColumn, search = invSearchInput, page = invCurrentPage, perPage = invRowsPerPage, status = "") => {
    dispatch(
      getInvoiceList({
        sort: sorting,
        sortColumn: sortCol,
        search: search,
        page: page,
        perPage: perPage,
        status,
        user_id: id
      })
    )
  }

  const handleInvoicePerPage = (value) => {
    setInvRowsPerPage(parseInt(value))
    handleInvoiceLists(
      invSort,
      invSortColumn,
      invSearchInput,
      invCurrentPage,
      parseInt(value),
      invStatusFilter && invStatusFilter.value ? invStatusFilter.value : ""
    )
  }

  const handleInvoiceSearch = (value) => {
    setInvSearchInput(value)
    handleInvoiceLists(
      invSort,
      invSortColumn,
      value,
      invCurrentPage,
      invRowsPerPage,
      invStatusFilter && invStatusFilter.value ? invStatusFilter.value : ""
    )
  }

  const handleInvoiceSort = (column, sortDirection) => {
    setInvSort(sortDirection)
    setInvSortColumn(column.sortField)
    handleInvoiceLists(
      sortDirection,
      column.sortField,
      invSearchInput,
      invCurrentPage,
      invRowsPerPage,
      invStatusFilter && invStatusFilter.value ? invStatusFilter.value : ""
    )
  }

  const handleInvoicePagination = (page) => {
    // console.log("handleInvoicePagination >>>>>>> ", page)
    setInvCurrentPage(page + 1)
    handleInvoiceLists(
      invSort,
      invSortColumn,
      invSearchInput,
      page + 1,
      invRowsPerPage,
      invStatusFilter && invStatusFilter.value ? invStatusFilter.value : ""
    )
  }

  const handleInvoiceStatusFilter = (value) => {
    setInvStatusFilter(value)
    handleInvoiceLists(
      invSort,
      invSortColumn,
      invSearchInput,
      invCurrentPage,
      invRowsPerPage,
      value && value.value ? value.value : ""
    )
  }
  /* /Invoice Pagination Api */

  /* Device Log history pagination */
  const [logSort, setLogSort] = useState('desc')
  const [logSortColumn, setLogSortColumn] = useState('id')
  const [logCurrentPage, setLogCurrentPage] = useState(1)
  const [logRowsPerPage, setLogRowsPerPage] = useState(defaultPerPageRow)
  /* /Device Log history pagination */

  /* Device Log history Pagination Api */
  const handleLogLists = (sorting = logSort, sortCol = logSortColumn, page = logCurrentPage, perPage = logRowsPerPage) => {
    dispatch(
      getUserDeviceLogs({
        sort: sorting,
        sortColumn: sortCol,
        page: page,
        perPage: perPage,
        user_id: id
      })
    )
  }

  const handleLogPerPage = (value) => {
    setLogRowsPerPage(parseInt(value))
    handleLogLists(
      logSort,
      logSortColumn,
      logCurrentPage,
      parseInt(value)
    )
  }

  const handleLogSort = (column, sortDirection) => {
    setLogSort(sortDirection)
    setLogSortColumn(column.sortField)
    handleLogLists(
      sortDirection,
      column.sortField,
      logCurrentPage,
      logRowsPerPage
    )
  }

  const handledeviceLogPagination = (page) => {
    // console.log("handledeviceLogPagination >>>>>>> ", page)
    setLogCurrentPage(page + 1)
    handleLogLists(
      logSort,
      logSortColumn,
      page + 1,
      logRowsPerPage
    )
  }
  /* /Device Log history Pagination Api */

  // ** Get contact on mount based on id
  useEffect(() => {
    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/user`)
    }

    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getUserView(id))
      dispatch(getUserPermission(id))
      handleCaseList()
      handleInvoiceLists()
      handleLogLists()
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearUserMessage())
    }

    if (caseStore.success || caseStore.error || caseStore.actionFlag) {
      dispatch(clearCaseMessage())
    }

    if (invoiceStore.success || invoiceStore.error || invoiceStore.actionFlag) {
      dispatch(clearInvoiceMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }

    /* If contact deleted then redirected */
    if (store.actionFlag && store.actionFlag === "DELETED") {
      navigate(`${adminRoot}/user`)
    }
  }, [dispatch, store.success, store.error, store.actionFlag, caseStore.success, caseStore.error, caseStore.actionFlag, invoiceStore.success, invoiceStore.error, invoiceStore.actionFlag, loadFirst])
  // console.log("store ", store)

  const onDeleteUser = (userId) => {
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
        dispatch(deleteUser(userId))
      }
    })
  }

  /* renders user column */
  const renderUser = (row) => {
    if (row && row.profile_photo_path && row.profile_photo_path.length) {
      return <Avatar className='me-1' img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.profile_photo_path}`} width='32' height='32' />
    } else {
      return <Avatar color={getRandColorClass()} className='me-50' content={row ? row.name : 'John Doe'} initials />
    }
  }
  /* /renders user column */

  // ** renders case column
  const renderCase = (row) => {
    if (row && row.profile_photo_path && row.profile_photo_path.length) {
      return <Avatar className="me-1" img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.profile_photo_path}`} width="32" height="32" />
    } else {
      return <Avatar color={getRandColorClass()} className="me-50" content={row ? row.name : ""} initials />
    }
  }

  const onCaseDetail = (row) => {
    setCaseRowData(row)
    setDetailModalOpen(true)
  }

  const caseColumns = [
    {
      name: "",
      minWidth: "60px",
      maxWidth: "60px",
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Button type="button" color="#FFFFFF" onClick={() => onCaseDetail(row)}>
            <PlusCircle color="#7367f0" size={17} />
          </Button>
        </div>
      )
    },
    {
      name: "#",
      sortable: true,
      sortField: "CaseID",
      cellClass: "text-uppercase",
      minWidth: "190px",
      cell: row => <Link to={`${adminRoot}/case/view/${row.CaseID}`}>{`#${row.CaseID}`}</Link>
    },
    {
      name: "Client",
      sortable: true,
      cellClass: "text-uppercase",
      minWidth: "250px",
      sortField: "Name",
      cell: row => {
        const name = row ? row.user && row.user.name : "John Doe"
        return (
          <div className="d-flex justify-content-left align-items-center">
            {renderCase(row.user)}
            <div className="d-flex flex-column">
              <Link to={`${adminRoot}/user/view/${row.user && row.user.id}`}>
                <h6 className="user-name text-truncate mb-0">{name}</h6>
                <small className="text-truncate text-muted mb-0">{(row && row.user && row.user.email) || ""}</small>
              </Link>
            </div>
          </div>
        )
      }
    },
    {
      name: "Attorney",
      sortable: true,
      sortField: "LaywerID",
      cellClass: "text-uppercase",
      minWidth: "140px",
      cell: (row) => row && row.laywer && row.laywer.id ? (<Link to={`${adminRoot}/user/view/${row.laywer.id}`}>{row.laywer.name}</Link>) : null
    },
    {
      name: "Datum",
      sortable: true,
      sortField: "Date",
      cellClass: "text-uppercase",
      minWidth: "110px",
      cell: (row) => row.Date && getTransformDate(row.Date, "DD MMM YYYY")
    },
    {
      name: "Status",
      sortable: true,
      sortField: "Status",
      cellClass: "text-uppercase",
      minWidth: "50px",
      cell: (row) => row.Status
    },
    {
      name: "Group",
      sortable: true,
      sortField: "Status",
      cellClass: "text-uppercase",
      minWidth: "110px",
      cell: (row) => row && row.type && row.type.CaseTypeName
    }
  ]
  /* /Case columns */

  /* Invoice columns */
  const invoiceColumns = [
    {
      name: 'Invoice Number',
      sortable: true,
      sortField: 'invoice_no',
      minWidth: '190px',
      cell: (row) => <Link to={`${adminRoot}/invoice/view/${row.id}`}>{`#${row.invoice_no}`}</Link>
    },
    {
      name: 'Status',
      sortable: true,
      sortField: 'status',
      minWidth: '70px',
      cell: (row) => {
        const color = invoiceStatus[row.status] ? invoiceStatus[row.status].color : 'primary',
          Icon = invoiceStatus[row.status] ? invoiceStatus[row.status].icon : Edit
        return (
          <Fragment>
            <Avatar color={color} icon={<Icon size={14} />} id={`av-tooltip-${row.id}`} />
            <UncontrolledTooltip placement='top' target={`av-tooltip-${row.id}`}>
              <span className='fw-bold'>{row.status && capitalizeWordFirstLetter(row.status)}</span>
              <br />
              <span className='fw-bold'>Balance:</span> {row && row.remaining_amount && getDecimalFormat(row.remaining_amount)}
              <br />
              <span className='fw-bold'>Due Date:</span> {row.invoice_due_date && getTransformDate(row.invoice_due_date, "DD/MM/YYYY")}
            </UncontrolledTooltip>
          </Fragment>
        )
      }
    },
    {
      name: 'Client',
      sortable: true,
      minWidth: '240px',
      sortField: 'customer_id',
      cell: (row) => {
        const name = row && row.customer ? row.customer.name : 'John Doe'
        return (
          <div className='d-flex justify-content-left align-items-center'>
            {renderUser(row.customer)}
            <div className='d-flex flex-column'>
              <h6 className='user-name text-truncate mb-0'>{name}</h6>
              <small className='text-truncate text-muted text-wrap mb-0'>{row && row.customer && row.customer.email}</small>
            </div>
          </div>
        )
      }
    },
    {
      name: 'Total',
      sortable: true,
      sortField: 'total_price',
      minWidth: '100px',
      cell: (row) => `€ ${row && row.total_price && getDecimalFormat(row.total_price)}`
    },
    {
      name: 'Due Date',
      sortable: true,
      sortField: 'invoice_due_date',
      minWidth: '140px',
      cell: (row) => row.invoice_due_date && getTransformDate(row.invoice_due_date, "DD MMM YYYY")
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className='column-action d-flex align-items-center'>
          <Link
            id={`pw-view-tooltip-${row.id}`}
            to={`${adminRoot}/invoice/view/${row.id}`}
          >
            <Eye size={17} className="mx-1" />
          </Link>

          <UncontrolledTooltip placement="top" target={`pw-view-tooltip-${row.id}`}>
            View Invoice
          </UncontrolledTooltip>
        </div>
      )
    }
  ]
  /* /Invoice columns */

  /* Device Log history columns */
  const logColumns = [
    {
      name: 'Ip Address',
      sortable: true,
      sortField: 'ip_address',
      minWidth: '140px',
      cell: (row) => row.ip_address
    },
    {
      name: 'Login Date',
      sortable: true,
      sortField: 'login_at',
      minWidth: '140px',
      cell: (row) => row.login_at && getTransformDate(row.login_at, "DD MMM YYYY")
    }
  ]
  /* /Device Log history columns */

  const getPermissionCheck = (value) => {
    if (store.permissions && store.permissions.length) {
      const index = store.permissions.findIndex((x) => x.permission_id === value)
      if (index !== -1) {
        return true
      }
      return false
    }
    return false
  }

  return store ? (<Fragment>
    <div className="app-user-view">
      <Row>
        <Col xl={4} lg={5} xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <Card>
            <CardBody>
              <div
                className={`user-avatar-section ${store.userItem && store.userItem.ids ? '' : 'placeholder-glow'}`}
              >
                <div className="d-flex align-items-center flex-column">
                  {store.userItem && store.userItem.profile_photo_path ? <>
                    <img
                      height="110"
                      width="110"
                      alt="user-avatar"
                      className={`img-fluid rounded mt-3 mb-2 ${store.userItem && store.userItem.id ? '' : 'placeholder'}`}
                      src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.userItem.profile_photo_path}`}
                      onError={(currentTarget) => onImageSrcError(currentTarget)}
                    />
                  </> : <>
                    <img
                      height="110"
                      width="110"
                      alt="user-avatar"
                      className={`img-fluid rounded mt-3 mb-2 ${store.userItem && store.userItem.id ? '' : 'placeholder'}`}
                      src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
                      onError={(currentTarget) => onImageSrcError(currentTarget)}
                    />
                  </>}

                  <div className="d-flex flex-column align-items-center text-center w-100">
                    <div className="user-info w-100">
                      <h4
                        className={`${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                      >
                        {(store.userItem && store.userItem.name)}
                      </h4>

                      {store.userItem && store.userItem.role && store.userItem.role.role_id ? (
                        <Badge
                          className={`text-capitalize ${store.userItem && store.userItem.id ? '' : 'placeholder'}`}
                          color={roleColors[store.userItem.role.role_id] || roleColors[11]}
                        >
                          {(store.userItem.role && store.userItem.role.RoleName)}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="fw-bolder border-bottom pb-50 mb-1">{t("Details")}</h4>
              <div
                className={`info-container ${store.userItem && store.userItem.id ? '' : 'placeholder-glow'}`}
              >
                <ul className="list-unstyled">
                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>Username:</span>
                    <span
                      className={`${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {(store.userItem && store.userItem.email)}
                    </span>
                  </li>

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>Email:</span>
                    <span
                      className={`${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {(store.userItem && store.userItem.email)}
                    </span>
                  </li>

                  {store.userItem && store.userItem.Status ? (
                    <li className='mb-75'>
                      <span className='fw-bolder me-25'>Status:</span>
                      <Badge
                        className={`text-capitalize ${store.userItem && store.userItem.id ? '' : 'placeholder'}`}
                        color={`${store.userItem.Status === "Active" ? 'light-success' : 'light-warning'}`}>
                        {(store.userItem && store.userItem.Status)}
                      </Badge>
                    </li>
                  ) : null}

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>Role:</span>
                    <span
                      className={`text-capitalize ${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {(store.userItem && store.userItem.role && store.userItem.role.RoleName)}
                    </span>
                  </li>

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>Contact:</span>
                    <span
                      className={`${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {store.userItem && store.userItem.Contact}
                    </span>
                  </li>

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>{t("Address")}:</span>
                    <span
                      className={`${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {store.userItem && store.userItem.Address}
                      {store.userItem && store.userItem.Address1 ? (`, ${store.userItem.Address1}`) : null}
                    </span>
                  </li>

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>City:</span>
                    <span
                      className={`text-capitalize ${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {(store.userItem && store.userItem.City)}
                    </span>
                  </li>

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>State:</span>
                    <span
                      className={`text-capitalize ${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {(store.userItem && store.userItem.State)}
                    </span>
                  </li>

                  <li className='mb-75'>
                    <span className='fw-bolder me-25'>Country:</span>
                    <span
                      className={`text-capitalize ${store.userItem && store.userItem.id ? '' : 'placeholder w-50'}`}
                    >
                      {(store.userItem && store.userItem.Country)}
                    </span>
                  </li>
                </ul>
              </div>

              <div
                className={`d-flex justify-content-center flex-wrap pt-2 ${store.userItem && store.userItem.id ? '' : 'placeholder-glow'}`}
              >
                <Button
                  tag={Link}
                  color="primary"
                  className={`me-1 mb-1 ${store.userItem && store.userItem.id ? '' : 'placeholder'}`}
                  to={`${adminRoot}/user/edit/${store.userItem.id}`}
                >
                  {t("Edit")}
                </Button>

                <Button
                  color="danger"
                  className={`mb-1 ${store.userItem && store.userItem.id ? '' : 'placeholder'}`}
                  onClick={() => onDeleteUser(id)}
                >
                  {t("Clear")}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={8} lg={7} xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <Nav pills className="mb-2">
            <NavItem>
              <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                <Briefcase size={18} className="me-50" />
                <span className="fw-bold d-none d-sm-block">{t("Documents")}</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                <FileText size={18} className="me-50" />
                <span className="fw-bold d-none d-sm-block">{t("Bills")}</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                <Monitor size={18} className="me-50" />
                <span className="fw-bold d-none d-sm-block">{t("Recent devices")}</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                <Unlock size={18} className="me-50" />
                <span className="fw-bold d-none d-sm-block">{t("Permissions")}</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={active}>
            <TabPane tabId="1">
              {/* Case listing */}
              <Card>
                <CardHeader className="border-bottom">
                  <CardTitle tag="h4">{t("Documents")}</CardTitle>
                </CardHeader>

                <DatatablePagination
                  customClass=""
                  columns={caseColumns}
                  data={caseStore && caseStore.caseItems && caseStore.caseItems.length ? caseStore.caseItems : []}
                  pagination={caseStore && caseStore.pagination}
                  handleSort={handleCaseSort}
                  handlePagination={handleCasePagination}
                  subHeaderComponent={
                    <CustomCaseHeader
                      searchInput={searchInput}
                      rowsPerPage={rowsPerPage}
                      handleSearch={handleCaseSearch}
                      handlePerPage={handleCasePerPage}
                      statusFilter={statusFilter}
                      handleStatusFilter={handleCaseStatusFilter}
                    />
                  }
                />

                <ModalCaseDetail
                  toggleModal={() => setDetailModalOpen(!detailModalOpen)}
                  open={detailModalOpen}
                  caseRowData={caseRowData}
                  setCaseRowData={setCaseRowData}
                />
              </Card>
              {/* /Case listing */}
            </TabPane>

            <TabPane tabId="2">
              {/* Invoice listing */}
              <Card>
                <CardHeader className="border-bottom">
                  <CardTitle tag="h4">{t("Bills")}</CardTitle>
                </CardHeader>

                <DatatablePagination
                  customClass=""
                  columns={invoiceColumns}
                  data={invoiceStore.invoiceItems && invoiceStore.invoiceItems.length ? invoiceStore.invoiceItems : []}
                  pagination={invoiceStore.pagination}
                  handleSort={handleInvoiceSort}
                  handlePagination={handleInvoicePagination}
                  subHeaderComponent={
                    <CustomInvoiceHeader
                      navigate={navigate}
                      searchInput={invSearchInput}
                      rowsPerPage={rowsPerPage}
                      handleSearch={handleInvoiceSearch}
                      handlePerPage={handleInvoicePerPage}
                      statusFilter={invStatusFilter}
                      handleStatusFilter={handleInvoiceStatusFilter}
                    />
                  }
                />
              </Card>
              {/* /Invoice listing */}
            </TabPane>

            <TabPane tabId="3">
              {/* Device Log History listing */}
              <Card>
                <CardHeader className="border-bottom">
                  <CardTitle tag="h4">{t("Recent devices")}</CardTitle>
                </CardHeader>

                <DatatablePagination
                  customClass=""
                  columns={logColumns}
                  data={store.userDeviceLogs && store.userDeviceLogs.length ? store.userDeviceLogs : []}
                  pagination={store.deviceLogPagination}
                  handleSort={handleLogSort}
                  handlePagination={handledeviceLogPagination}
                  subHeaderComponent={
                    <CustomLogHeader
                      navigate={navigate}
                      rowsPerPage={logRowsPerPage}
                      handlePerPage={handleLogPerPage}
                    />
                  }
                />
              </Card>
              {/* /Device Log History listing */}
            </TabPane>

            <TabPane tabId="4">
              <Card>
                <CardHeader className="border-bottom">
                  <CardTitle tag="h4">{t("Permissions")}</CardTitle>
                </CardHeader>

                {store.permissions && store.permissions.length ? (
                  <Table className="text-nowrap text-center mb-3" responsive>
                    <thead>
                      <tr>
                        <th className="text-start">Type</th>
                        <th>Allow</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPermissionCheck(1) ? (
                        <tr>
                          <td className="text-start">Delete Users</td>
                          <td>
                            <div className="d-flex form-check justify-content-center">
                              <Input
                                disabled
                                type="checkbox"
                                className="opacity-100"
                                defaultChecked={getPermissionCheck(1)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}

                      {getPermissionCheck(2) ? (
                        <tr>
                          <td className="text-start">See All Users</td>
                          <td>
                            <div className="d-flex form-check justify-content-center">
                              <Input
                                disabled
                                type="checkbox"
                                className="opacity-100"
                                defaultChecked={getPermissionCheck(2)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}

                      {getPermissionCheck(3) ? (
                        <tr>
                          <td className="text-start">See Contacts</td>
                          <td>
                            <div className="d-flex form-check justify-content-center">
                              <Input
                                disabled
                                type="checkbox"
                                className="opacity-100"
                                defaultChecked={getPermissionCheck(3)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}

                      {getPermissionCheck(4) ? (
                        <tr>
                          <td className="text-start">See All Cases</td>
                          <td>
                            <div className="d-flex form-check justify-content-center">
                              <Input
                                disabled
                                type="checkbox"
                                className="opacity-100"
                                defaultChecked={getPermissionCheck(4)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}

                      {getPermissionCheck(5) ? (
                        <tr>
                          <td className="text-start">Update Cases</td>
                          <td>
                            <div className="d-flex form-check justify-content-center">
                              <Input
                                disabled
                                type="checkbox"
                                className="opacity-100"
                                defaultChecked={getPermissionCheck(5)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}

                      {getPermissionCheck(6) ? (
                        <tr>
                          <td className="text-start">See Letters</td>
                          <td>
                            <div className="d-flex form-check justify-content-center">
                              <Input
                                disabled
                                type="checkbox"
                                className="opacity-100"
                                defaultChecked={getPermissionCheck(6)}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </Table>
                ) : <p className="p-2">You do not have any permissions...!</p>}
              </Card>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  </Fragment>) : null
}

export default UserView
