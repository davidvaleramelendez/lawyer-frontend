/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledTooltip,
    UncontrolledButtonDropdown
} from 'reactstrap'

// ** React Dropdown Import
import Select from 'react-select'

// ** Utils
import {
    isUserLoggedIn,
    getTotalNumber,
    getDecimalFormat,
    getWebPreviewUrl,
    getTransformDate,
    getRandColorClass,
    getCurrentPageNumber,
    capitalizeWordFirstLetter
} from '@utils'

// Constant
import {
    root,
    adminRoot,
    TN_INVOICE,
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'
import {
    invoiceItem
} from '@constant/reduxConstant'

// ** Store & Actions
import {
    deleteInvoice,
    getInvoiceList,
    resetCalculationVatPrice,
    clearInvoiceMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    Eye,
    Send,
    Edit,
    Save,
    Info,
    Copy,
    Trash2,
    Download,
    PieChart,
    PlusCircle,
    CheckCircle,
    MoreVertical,
    ArrowDownCircle
} from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

// Modal
import ModalSendInvoice from '../modals/ModalSendInvoice'
import ModalInvoiceDetail from '../modals/ModalInvoiceDetail'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Styles
import '@styles/react/apps/app-invoice.scss'

// ** Translation
import { T } from '@localization'

function getWindowSize() {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height
    }
}

const CustomHeader = ({
    navigate,
    searchInput,
    rowsPerPage,
    handleSearch,
    handlePerPage,
    statusFilter,
    handleStatusFilter
}) => {
    return (<div className="invoice-list-table-header w-100 py-2">
        <Row>
            <Col lg={6} className="d-flex align-items-center px-0 px-lg-1">
                <div className="d-flex align-items-center me-2">
                    <label htmlFor="rows-per-page">{T('Show')}</label>
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

                <Button color="primary" onClick={() => navigate(`${adminRoot}/invoice/add`)}>
                    {T('Create Invoice')}
                </Button>
            </Col>

            <Col lg={6} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                <div className="d-flex align-items-center">
                    <label htmlFor="search-invoice">{T('Search')}</label>
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
                        placeholder={`${T('Select Status')}...`}
                        options={[{ label: T("Paid"), value: "paid" }]}
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

const InvoiceList = () => {
    // ** Hooks
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.invoice)

    // ** States
    const [windowSize, setWindowSize] = useState(getWindowSize())
    const [loadFirst, setLoadFirst] = useState(true)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [invoiceRowData, setInvoiceRowData] = useState(invoiceItem)
    const [sendInvoiceModalOpen, setSendInvoiceModalOpen] = useState(false)
    const [plusIconAction, setPlusIconAction] = useState(true)
    const [dotIconAction, setDotIconAction] = useState(false)


    /* pagination */
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [searchInput, setSearchInput] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)
    const [statusFilter, setStatusFilter] = useState(null)

    // ** Vars
    const invoiceStatus = {
        sent: { color: 'light-secondary', icon: Send },
        paid: { color: 'light-success', icon: CheckCircle },
        draft: { color: 'light-primary', icon: Save },
        downloaded: { color: 'light-info', icon: ArrowDownCircle },
        'Past Due': { color: 'light-danger', icon: Info },
        'Partial Payment': { color: 'light-warning', icon: PieChart }
    }

    const handleInvoiceLists = (sorting = sort, sortCol = sortColumn, search = searchInput, page = currentPage, perPage = rowsPerPage, status = "") => {
        dispatch(
            getInvoiceList({
                sort: sorting,
                sortColumn: sortCol,
                search: search,
                page: page,
                perPage: perPage,
                status
            })
        )
    }

    const handlePerPage = (value) => {
        setRowsPerPage(parseInt(value))
        handleInvoiceLists(
            sort,
            sortColumn,
            searchInput,
            currentPage,
            parseInt(value),
            statusFilter && statusFilter.value ? statusFilter.value : ""
        )
    }

    const handleSearch = (value) => {
        setSearchInput(value)
        handleInvoiceLists(
            sort,
            sortColumn,
            value,
            currentPage,
            rowsPerPage,
            statusFilter && statusFilter.value ? statusFilter.value : ""
        )
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleInvoiceLists(
            sortDirection,
            column.sortField,
            searchInput,
            currentPage,
            rowsPerPage,
            statusFilter && statusFilter.value ? statusFilter.value : ""
        )
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handleInvoiceLists(
            sort,
            sortColumn,
            searchInput,
            page + 1,
            rowsPerPage,
            statusFilter && statusFilter.value ? statusFilter.value : ""
        )
    }

    const handleStatusFilter = (value) => {
        setStatusFilter(value)
        handleInvoiceLists(
            sort,
            sortColumn,
            searchInput,
            currentPage,
            rowsPerPage,
            value && value.value ? value.value : ""
        )
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

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleInvoiceLists()
            dispatch(resetCalculationVatPrice())
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearInvoiceMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }

        if (windowSize && windowSize.width) {
            setPlusIconAction(true)
            if (windowSize.width < 959) {
                setPlusIconAction(false)
            }

            setDotIconAction(true)
            if (windowSize.width > 960) {
                setDotIconAction(false)
            }
        }

        function handleWindowResize() {
            setWindowSize(getWindowSize())
        }

        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [store.success, store.error, store.actionFlag, sort, searchInput, sortColumn, currentPage, rowsPerPage, windowSize, loadFirst])
    // console.log("store >>> ", store)

    /* Rendering file preview web url */
    const renderFileWebUrlPreview = (path) => {
        if (path) {
            return getWebPreviewUrl(path)
        }

        return false
    }
    /* /Rendering file preview web url */

    // ** renders contact column
    const renderUser = (row) => {
        if (row && row.profile_photo_path && row.profile_photo_path.length) {
            return (
                <Avatar
                    width='32'
                    height='32'
                    className='me-50'
                    img={renderFileWebUrlPreview(row.profile_photo_path) || defaultAvatar}
                />
            )
        } else {
            return (
                <Avatar
                    initials
                    className='me-50'
                    color={getRandColorClass()}
                    content={row ? row.name : 'John Doe'}
                />
            )
        }
    }

    const onUserDetail = (row) => {
        setInvoiceRowData(row)
        setDetailModalOpen(true)
    }

    const onSendMailClick = (row) => {
        setInvoiceRowData(row)
        setSendInvoiceModalOpen(true)
    }

    /* Columns */
    const columns = [
        {
            name: "",
            minWidth: "15%",
            maxWidth: "15%",
            omit: plusIconAction,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <PlusCircle
                        size={17}
                        color="#7367f0"
                        className="cursor-pointer"
                        onClick={() => onUserDetail(row)}
                    />
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '30px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Invoice Number"),
            sortable: true,
            sortField: "invoice_no",
            minWidth: "20%",
            cell: (row) => <Link to={`${adminRoot}/invoice/view/${row.id}`}>{`#${row.invoice_no}`}</Link>,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '90px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Status"),
            sortable: true,
            sortField: "status",
            minWidth: "13%",
            cell: (row) => {
                const color = invoiceStatus[row.status] ? invoiceStatus[row.status].color : "primary",
                    Icon = invoiceStatus[row.status] ? invoiceStatus[row.status].icon : Edit
                return (
                    <Fragment>
                        <Avatar color={color} icon={<Icon size={14} />} id={`av-tooltip-${row.id}`} />
                        <UncontrolledTooltip placement="top" target={`av-tooltip-${row.id}`}>
                            <span className="fw-bold">{row.status && capitalizeWordFirstLetter(row.status)}</span>
                            <br />
                            <span className="fw-bold">{T('Balance')}:</span> {row && row.remaining_amount && getDecimalFormat(row.remaining_amount)}
                            <br />
                            <span className="fw-bold">{T('Due Date')}:</span> {row.invoice_due_date && getTransformDate(row.invoice_due_date, "DD/MM/YYYY")}
                        </UncontrolledTooltip>
                    </Fragment>
                )
            },
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '35px', width: 'auto', borderRadius: '50%', display: 'inline-block', minWidth: '35px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Client"),
            sortable: true,
            minWidth: "25%",
            sortField: "customer_id",
            cell: (row) => {
                const name = row && row.customer ? row.customer.name : "John Doe"
                return (
                    <div className="d-flex justify-content-left align-items-center">
                        {renderUser(row.customer)}
                        <div className="d-flex flex-column">
                            <h6 className="user-name text-truncate mb-0">{name}</h6>
                            <small className="text-truncate text-muted text-wrap mb-0">{row && row.customer && row.customer.email}</small>
                        </div>
                    </div>
                )
            },
            /* Custom placeholder vars */
            customRenderTwoRow: true,
            contentExtraStylesRow1: {
                height: '15px', width: 'auto', borderRadius: '10px', minWidth: '140px'
            },
            contentExtraStylesRow2: {
                height: '10px', width: 'auto', borderRadius: '10px', minWidth: '140px', marginTop: '3px'
            },
            customLoadingWithIcon: "User",
            customLoaderCellClass: "",
            customLoaderContentClass: "d-flex align-items-center"
            /* /Custom placeholder vars */
        },
        {
            name: T("Total"),
            sortable: true,
            sortField: "total_price",
            minWidth: "12%",
            cell: (row) => `??? ${row && row.total_price && getDecimalFormat(row.total_price)}`,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '65px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Due Date"),
            sortable: true,
            sortField: "invoice_due_date",
            minWidth: "15%",
            cell: (row) => row.invoice_due_date && getTransformDate(row.invoice_due_date, "DD MMM YYYY"),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '100px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Action"),
            center: true,
            omit: dotIconAction,
            minWidth: "15%",
            cell: (row) => (
                <div className="d-flex column-action align-items-center">
                    <Send
                        className="cursor-pointer"
                        size={17}
                        id={`pw-send-tooltip-${row.id}`}
                        onClick={() => onSendMailClick(row)}
                    />
                    <UncontrolledTooltip placement="top" target={`pw-send-tooltip-${row.id}`}>
                        {T('Send Mail')}
                    </UncontrolledTooltip>

                    <Link
                        id={`pw-view-tooltip-${row.id}`}
                        to={`${adminRoot}/invoice/view/${row.id}`}
                    >
                        <Eye size={17} className="mx-1" />
                    </Link>

                    <UncontrolledTooltip placement="top" target={`pw-view-tooltip-${row.id}`}>
                        {T('View Invoice')}
                    </UncontrolledTooltip>

                    <UncontrolledButtonDropdown>
                        <DropdownToggle color="#FFFFFF" tag="span">
                            <MoreVertical size={17} className="cursor-pointer" />
                        </DropdownToggle>
                        <DropdownMenu className="position-fixed" end>
                            <DropdownItem
                                tag="a"
                                target="_blank"
                                className="w-100"
                                rel="noopener noreferrer"
                                href={renderFileWebUrlPreview(row.pdf_path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                                onClick={(event) => row && !row.pdf_path && event.preventDefault()}
                            >
                                <Download size={17} className="me-50" />
                                <span className="align-middle">{T('Download')}</span>
                            </DropdownItem>

                            <DropdownItem
                                tag={Link}
                                to={`${adminRoot}/invoice/edit/${row.id}`}
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
                                    onDeleteInvoice(row.id)
                                }}
                            >
                                <Trash2 size={17} className="me-50" />
                                <span className="align-middle">{T('Delete')}</span>
                            </DropdownItem>

                            <DropdownItem
                                tag={Link}
                                to={`${adminRoot}/invoice/add?copyId=${row.id}`}
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
                        setInvoiceRowData={setInvoiceRowData}
                    />
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '90px'
            },
            customLoaderCellClass: "text-center",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        }
    ]

    return store ? (<>
        <div className='invoice-list-wrapper'>
            <Card className="overflow-hidden">
                {(!store.loading && !getTotalNumber(TN_INVOICE)) ? (
                    <DotPulse />
                ) : (
                    <DatatablePagination
                        customClass="invoice-list-dataTable"
                        columns={columns}
                        loading={store.loading}
                        data={store.invoiceItems}
                        pagination={store.loading ? store.pagination : {
                            ...store.pagination,
                            perPage: getCurrentPageNumber(TN_INVOICE, rowsPerPage, currentPage)
                        }}
                        handleSort={handleSort}
                        handlePagination={handlePagination}
                        subHeaderComponent={
                            <CustomHeader
                                navigate={navigate}
                                searchInput={searchInput}
                                rowsPerPage={rowsPerPage}
                                handleSearch={handleSearch}
                                handlePerPage={handlePerPage}
                                statusFilter={statusFilter}
                                handleStatusFilter={handleStatusFilter}
                            />
                        }
                    />
                )}

                <ModalInvoiceDetail
                    toggleModal={() => setDetailModalOpen(!detailModalOpen)}
                    open={detailModalOpen}
                    invoiceStatus={invoiceStatus}
                    invoiceRowData={invoiceRowData}
                    setInvoiceRowData={setInvoiceRowData}
                />
            </Card>
        </div>
    </>) : null
}

export default InvoiceList