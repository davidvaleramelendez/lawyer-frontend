/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Badge,
    Input,
    Button,
    UncontrolledTooltip
} from 'reactstrap'

// ** Utils
import {
    isUserLoggedIn,
    getTotalNumber,
    getCurrentPageNumber
} from '@utils'

// Constant
import {
    root,
    adminRoot,
    perPageRowItems,
    defaultPerPageRow,
    TN_EMAIL_TEMPLATE
} from '@constant/defaultValues'

// ** Store & Actions
import {
    deleteEmailTemplate,
    getEmailTemplateList,
    clearEmailTemplateMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    Eye,
    Edit,
    Trash2,
    Paperclip
} from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

// ** Translation
import { T } from '@localization'

const CustomHeader = ({
    searchInput,
    rowsPerPage,
    handleSearch,
    handlePerPage
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
                <Button color="primary" tag={Link} to={`${adminRoot}/email-template/add`}>
                    {T('Add Email Template')}
                </Button>
            </Col>

            <Col lg={6} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                <div className="d-flex align-items-center">
                    <label htmlFor="search-email-template">{T('Search')}</label>
                    <Input
                        id="search-email-template"
                        className="ms-50 me-2 w-100"
                        type="text"
                        value={searchInput}
                        placeholder={T('Search Email Template')}
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </div>
            </Col>
        </Row>
    </div>)
}

const EmailTemplateList = () => {
    // ** Hooks
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.emailTemplate)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)

    /* Pagination */
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)

    const handleEmailTemplateLists = (sorting = sort, sortCol = sortColumn, search = searchInput, page = currentPage, perPage = rowsPerPage) => {
        // console.log("handleEmailTemplateLists >>> ", sorting, sortCol, search, page, perPage)
        dispatch(
            getEmailTemplateList({
                sort: sorting,
                sortColumn: sortCol,
                search: search || "",
                page: page,
                perPage: perPage
            }))
    }

    const handlePerPage = (value) => {
        setRowsPerPage(parseInt(value))
        handleEmailTemplateLists(
            sort,
            sortColumn,
            searchInput,
            currentPage,
            parseInt(value)
        )
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handleEmailTemplateLists(
            sort,
            sortColumn,
            val,
            currentPage,
            rowsPerPage
        )
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleEmailTemplateLists(
            sortDirection,
            column.sortField,
            searchInput,
            currentPage,
            rowsPerPage
        )
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handleEmailTemplateLists(
            sort,
            sortColumn,
            searchInput,
            page + 1,
            rowsPerPage
        )
    }

    const handleDelete = (id) => {
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
                // console.log("handleDelete >>> ", id)
                dispatch(deleteEmailTemplate(id))
            }
        })
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleEmailTemplateLists()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearEmailTemplateMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag, sort, searchInput, sortColumn, currentPage, rowsPerPage, loadFirst])
    // console.log("store >>> ", store)

    /* Columns */
    const columns = [
        {
            name: T('Subject'),
            sortable: true,
            minWidth: '40%',
            sortField: 'subject',
            cell: (row) => (
                <Link
                    to={`${adminRoot}/email-template/edit/${row.id}`}
                >
                    {row.subject}
                </Link>
            ),
            /* Custom placeholder vars */
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T('Status'),
            sortable: true,
            minWidth: '20%',
            sortField: 'status',
            cell: (row) => <>{row.status === "Active" ? <Badge color='success'>{row.status}</Badge> : <Badge color='warning'>{row.status}</Badge>}</>,
            /* Custom placeholder vars */
            customLoaderCellClass: "",
            customLoaderContentClass: "rounded-pill"
            /* /Custom placeholder vars */
        },
        {
            name: T('Action'),
            minWidth: '40%',
            cell: (row) => (
                <div className='column-action d-flex align-items-center'>
                    <Link
                        to={`${adminRoot}/email-template/edit/${row.id}`}
                        id={`pw-edit-tooltip-${row.id}`}
                    >
                        <Edit size={17} className='mb-0 me-1' />
                    </Link>
                    <UncontrolledTooltip placement="top" target={`pw-edit-tooltip-${row.id}`}>
                        {T('Edit')}
                    </UncontrolledTooltip>

                    <Link
                        to={`${adminRoot}/email-template/view/${row.id}`}
                        id={`pw-view-tooltip-${row.id}`}
                    >
                        <Eye size={17} className='mb-0 me-1' />
                    </Link>
                    <UncontrolledTooltip placement="top" target={`pw-view-tooltip-${row.id}`}>
                        {T('View')}
                    </UncontrolledTooltip>

                    <Trash2
                        size={17}
                        id={`pw-delete-tooltip-${row.id}`}
                        onClick={() => handleDelete(row.id)}
                        className='cursor-pointer mb-0 me-1'
                    />
                    <UncontrolledTooltip placement="top" target={`pw-delete-tooltip-${row.id}`}>
                        {T('Delete')}
                    </UncontrolledTooltip>

                    {row && row.email_template_attachment && row.email_template_attachment.length ? (<>
                        <Paperclip
                            size={17}
                            className='mb-0 me-1'
                            id={`pw-attachment-tooltip-${row.id}`}
                        />
                        <UncontrolledTooltip placement="top" target={`pw-attachment-tooltip-${row.id}`}>
                            {T('Has attachment')}
                        </UncontrolledTooltip>
                    </>) : null}
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: { height: '15px', borderRadius: '10px', width: '30%' },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        }
    ]

    return store ? (<Fragment>
        <Card className="overflow-hidden">
            {(!store.loading && !getTotalNumber(TN_EMAIL_TEMPLATE)) ? (
                <DotPulse />
            ) : (
                <DatatablePagination
                    customClass="react-dataTable"
                    columns={columns}
                    loading={store.loading}
                    data={store.emailTemplateItems}
                    pagination={store.loading ? store.pagination : {
                        ...store.pagination,
                        perPage: getCurrentPageNumber(TN_EMAIL_TEMPLATE, rowsPerPage, currentPage)
                    }}
                    handleSort={handleSort}
                    handlePagination={handlePagination}
                    subHeaderComponent={
                        <CustomHeader
                            searchInput={searchInput}
                            rowsPerPage={rowsPerPage}
                            handleSearch={handleSearch}
                            handlePerPage={handlePerPage}
                        />
                    }
                />
            )}
        </Card>
    </Fragment>) : null
}

export default EmailTemplateList
