/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
    getInvoiceList
} from '../../invoice/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import {
    getTransformDate,
    getDecimalFormat,
    getRandColorClass,
    capitalizeWordFirstLetter
} from '@utils'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    CardTitle,
    CardHeader,
    UncontrolledTooltip
} from 'reactstrap'

// ** React Dropdown Import
import Select from "react-select"

// ** Icons Import
import {
    Eye,
    Edit,
    Info,
    Send,
    Save,
    PieChart,
    CheckCircle,
    ArrowDownCircle
} from 'react-feather'

// ** Custom Components
import Avatar from "@components/avatar"
import DatatablePagination from "@components/datatable/DatatablePagination"

// Constant
import {
    adminRoot,
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'

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

const BillingsTab = ({
    id
}) => {
    // ** Hooks
    const { t } = useTranslation()
    const navigate = useNavigate()

    // ** Store vars
    const dispatch = useDispatch()
    const invoiceStore = useSelector((state) => state.invoice)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)

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

    // ** Get contact on mount based on id
    useEffect(() => {
        /* Calling first time */
        if (loadFirst) {
            handleInvoiceLists()
            setLoadFirst(false)
        }
    }, [loadFirst])

    /* renders user column */
    const renderUser = (row) => {
        if (row && row.profile_photo_path && row.profile_photo_path.length) {
            return <Avatar className='me-1' img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.profile_photo_path}`} width='32' height='32' />
        } else {
            return <Avatar color={getRandColorClass()} className='me-50' content={row ? row.name : 'John Doe'} initials />
        }
    }
    /* /renders user column */

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

    return (
        <Fragment>
            {/* Invoice listing */}
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{t("Bills")}</CardTitle>
                </CardHeader>

                <DatatablePagination
                    customClass=""
                    columns={invoiceColumns}
                    loading={invoiceStore && invoiceStore.loading}
                    data={invoiceStore && invoiceStore.invoiceItems}
                    pagination={invoiceStore && invoiceStore.pagination}
                    handleSort={handleInvoiceSort}
                    handlePagination={handleInvoicePagination}
                    subHeaderComponent={
                        <CustomInvoiceHeader
                            navigate={navigate}
                            searchInput={invSearchInput}
                            rowsPerPage={invRowsPerPage}
                            handleSearch={handleInvoiceSearch}
                            handlePerPage={handleInvoicePerPage}
                            statusFilter={invStatusFilter}
                            handleStatusFilter={handleInvoiceStatusFilter}
                        />
                    }
                />
            </Card>
            {/* /Invoice listing */}
        </Fragment>
    )
}

export default BillingsTab