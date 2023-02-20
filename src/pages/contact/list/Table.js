/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    Button,
    Spinner,
    UncontrolledTooltip
} from 'reactstrap'

// ** Utils
import {
    isUserLoggedIn,
    getTotalNumber,
    getTransformDate,
    getCurrentPageNumber
} from '@utils'

// Constant
import {
    root,
    adminRoot,
    TN_CONTACT,
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'

// ** Store & Actions
import {
    getContactList,
    updateContactLoader,
    callContactImapCron,
    clearContactMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    Eye,
    RefreshCw
} from 'react-feather'

// Modal
import ModalAddContact from '../modals/ModalAddContact'

// ** Custom Components
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

// ** Translation
import { T } from '@localization'

const CustomHeader = ({
    loading,
    dispatch,
    searchInput,
    rowsPerPage,
    handleSearch,
    setModalOpen,
    handlePerPage
}) => {
    const handleRefreshCron = () => {
        dispatch(updateContactLoader(false))
        dispatch(callContactImapCron({}))
    }

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
                <Button color="primary" onClick={() => setModalOpen(true)}>
                    {T('Add Contact')}
                </Button>
            </Col>

            <Col lg={6} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                <div className="d-flex align-items-center">
                    <label htmlFor="search-contact">{T('Search')}</label>
                    <Input
                        id="search-contact"
                        className="ms-50 me-2 w-100"
                        type="text"
                        value={searchInput}
                        placeholder={T('Search Contact')}
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </div>

                {loading ? (<>
                    <RefreshCw
                        size={28}
                        id={`pw-tooltip-header-refresh-cron`}
                        className="cursor-pointer"
                        onClick={() => handleRefreshCron()}
                    />
                    <UncontrolledTooltip
                        placement="top"
                        target={`pw-tooltip-header-refresh-cron`}
                    >
                        {T('Refresh')}
                    </UncontrolledTooltip>
                </>) : (
                    <Spinner />
                )}
            </Col>
        </Row>
    </div>)
}

const ContactList = () => {
    // ** Hooks
    const navigate = useNavigate()

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('ContactID')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)


    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.contact)

    const handleContactLists = (sorting = sort, search = searchInput, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage) => {
        dispatch(
            getContactList({
                sort: sorting,
                search: search,
                sortColumn: sortCol,
                page: page,
                perPage: perPage
            })
        )
    }

    const handlePerPage = (value) => {
        setRowsPerPage(parseInt(value))
        handleContactLists(sort, searchInput, sortColumn, currentPage, parseInt(value))
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handleContactLists(sort, val, sortColumn, currentPage, rowsPerPage)
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleContactLists(sortDirection, searchInput, column.sortField, currentPage, rowsPerPage)
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handleContactLists(sort, searchInput, sortColumn, page + 1, rowsPerPage)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleContactLists()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearContactMessage())
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
            name: `${T('Ticket')}#`,
            sortable: true,
            minWidth: "15%",
            sortField: "ContactID",
            cell: (row) => (
                <Link to={`${adminRoot}/contact/view/${row.ContactID}`}>{`#${row.ContactID}`}</Link>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '90px'
            },
            customLoadingWithIcon: "",
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Name"),
            sortable: true,
            minWidth: "25%",
            sortField: "Name",
            cell: (row) => {
                const name = (row && row.Name) || ""
                return (
                    <div className="d-flex justify-content-left align-items-center">
                        <div className="d-flex flex-column">
                            <h6 className="user-name text-truncate mb-0">{name}</h6>
                        </div>
                    </div>
                )
            },
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '150px'
            },
            customLoadingWithIcon: "",
            customLoaderCellClass: "",
            customLoaderContentClass: "d-flex align-items-center"
            /* /Custom placeholder vars */
        },
        {
            name: T("Email"),
            sortable: true,
            minWidth: "30%",
            sortField: "Email",
            cell: row => row.Email,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '190px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Created Date"),
            sortable: true,
            minWidth: "20%",
            sortField: "CreatedAt",
            cell: row => row.CreatedAt && getTransformDate(row.CreatedAt, "DD.MM.YYYY"),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '90px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Action"),
            center: true,
            minWidth: "10%",
            cell: row => (
                <div className="column-action d-flex align-items-center">
                    <Link to={`${adminRoot}/contact/view/${row.ContactID}`} id={`pw-tooltip-${row.ContactID}`}>
                        <Eye size={17} className="mx-1" />
                    </Link>
                    <UncontrolledTooltip placement="top" target={`pw-tooltip-${row.ContactID}`}>
                        {T('View Contact')}
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

    return store ? (<>
        <Card className="overflow-hidden">
            {(!store.loading && !getTotalNumber(TN_CONTACT)) ? (
                <DotPulse />
            ) : (
                <DatatablePagination
                    customClass="react-dataTable"
                    columns={columns}
                    loading={store.loading}
                    data={store.contactItems}
                    pagination={store.loading ? store.pagination : {
                        ...store.pagination,
                        perPage: getCurrentPageNumber(TN_CONTACT, rowsPerPage, currentPage)
                    }}
                    handleSort={handleSort}
                    handlePagination={handlePagination}
                    subHeaderComponent={
                        <CustomHeader
                            dispatch={dispatch}
                            loading={store.loading}
                            searchInput={searchInput}
                            rowsPerPage={rowsPerPage}
                            handleSearch={handleSearch}
                            handlePerPage={handlePerPage}
                            setModalOpen={setModalOpen}
                        />
                    }
                />
            )}

            <ModalAddContact
                toggleModal={() => setModalOpen(!modalOpen)}
                open={modalOpen}
            />
        </Card>
    </>) : null
}

export default ContactList
