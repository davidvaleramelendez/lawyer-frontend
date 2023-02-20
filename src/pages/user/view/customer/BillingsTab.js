/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
    getInvoiceList
} from '@src/pages/invoice/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import {
    getTotalNumber,
    getTransformDate,
    getDecimalFormat,
    getCurrentPageNumber,
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
import DotPulse from "@components/dotpulse"
import DatatablePagination from "@components/datatable/DatatablePagination"

// Constant
import {
    adminRoot,
    TN_INVOICE,
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'

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
            </Col>

            <Col lg={8} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                <div className="d-flex align-items-center">
                    <label htmlFor="search-invoice">{T('Search')}</label>
                    <Input
                        id="search-invoice"
                        className="ms-50 me-2 w-100"
                        type="text"
                        value={searchInput}
                        placeholder={T("Search Invoice")}
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
/* /Invoice header */

const BillingsTab = ({
    id
}) => {
    // ** Hooks
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

    /* Invoice columns */
    const invoiceColumns = [
        {
            name: T("Invoice Number"),
            sortable: true,
            sortField: "invoice_no",
            minWidth: "22%",
            cell: (row) => (
                <Link to={`${adminRoot}/invoice/view/${row.id}`}>{`#${row.invoice_no}`}</Link>
            ),
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
            minWidth: "20%",
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
            name: T("Total"),
            sortable: true,
            sortField: "total_price",
            minWidth: "18%",
            cell: (row) => (
                `€ ${row && row.total_price && getDecimalFormat(row.total_price)}`
            ),
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
            minWidth: "25%",
            cell: (row) => (
                row.invoice_due_date && getTransformDate(row.invoice_due_date, "DD MMM YYYY")
            ),
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
            minWidth: "15%",
            cell: (row) => (
                <div className="d-flex column-action align-items-center">
                    <Link
                        id={`pw-view-tooltip-${row.id}`}
                        to={`${adminRoot}/invoice/view/${row.id}`}
                    >
                        <Eye size={17} className="mx-1" />
                    </Link>

                    <UncontrolledTooltip placement="top" target={`pw-view-tooltip-${row.id}`}>
                        {T('View Invoice')}
                    </UncontrolledTooltip>
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '30px'
            },
            customLoaderCellClass: "text-center",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        }
    ]
    /* /Invoice columns */

    return (
        <Fragment>
            {/* Invoice listing */}
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T("Bills")}</CardTitle>
                </CardHeader>

                {(!invoiceStore.loading && !getTotalNumber(TN_INVOICE)) ? (
                    <DotPulse />
                ) : (
                    <DatatablePagination
                        customClass=""
                        columns={invoiceColumns}
                        loading={invoiceStore && invoiceStore.loading}
                        data={invoiceStore && invoiceStore.invoiceItems}
                        pagination={invoiceStore.loading ? invoiceStore.pagination : {
                            ...invoiceStore.pagination,
                            perPage: getCurrentPageNumber(TN_INVOICE, invRowsPerPage, invCurrentPage)
                        }}
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
                )}
            </Card>
            {/* /Invoice listing */}
        </Fragment>
    )
}

export default BillingsTab