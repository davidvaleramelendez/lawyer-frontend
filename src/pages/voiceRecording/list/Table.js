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
    Label,
    CardHeader,
    CardTitle
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
    TN_VOICE_RECORDING
} from '@constant/defaultValues'

// ** Store & Actions
import {
    getVoiceRecordingList,
    markDoneVoiceRecording,
    clearVoiceRecordingMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    X,
    Check
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
    return (
        <div className="invoice-list-table-header w-100 py-1">
            <Row>
                <Col lg={6} className="mt-1 d-flex align-items-center px-0 px-lg-1">
                    <div className="d-flex align-items-center me-2">
                        <label htmlFor="rows-per-page">{T('Show')}</label>
                        <Input
                            type="select"
                            id="rows-per-page"
                            value={rowsPerPage}
                            onChange={(event) => handlePerPage(event.target.value)}
                            className="form-control ms-50 pe-3"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </Input>
                    </div>
                </Col>

                <Col lg={6} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                    <div className="d-flex align-items-center">
                        <label htmlFor="search-letter">{T('Search')}</label>
                        <Input
                            id="search-voice-recording"
                            className="ms-50 me-2 w-100"
                            type="text"
                            value={searchInput}
                            placeholder={T('Search Voice Recording')}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const VoiceRecordingList = () => {
    /* Hook */
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.voiceRecording)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleVoiceRecordingLists = (sorting = sort, search = searchInput, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage) => {
        dispatch(
            getVoiceRecordingList({
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
        handleVoiceRecordingLists(sort, searchInput, sortColumn, currentPage, parseInt(value))
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handleVoiceRecordingLists(sort, val, sortColumn, currentPage, rowsPerPage)
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleVoiceRecordingLists(sortDirection, searchInput, column.sortField, currentPage, rowsPerPage)
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handleVoiceRecordingLists(sort, searchInput, sortColumn, page + 1, rowsPerPage)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleVoiceRecordingLists()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearVoiceRecordingMessage())
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

    const handleMarkDone = (id) => {
        MySwal.fire({
            title: T('Are you sure?'),
            text: T("You want to done this!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: T('Yes, done it!'),
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
                dispatch(markDoneVoiceRecording(id))
            }
        })
    }

    /* Columns */
    const columns = [
        {
            name: T("CaseID"),
            sortable: true,
            sortField: "case_id",
            minWidth: "20%",
            // cell: (row) => row.case_id,
            cell: (row) => (<Link to={`${adminRoot}/case/view/${row.case_id}`}>{`#${row.case_id}`}</Link>),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '90px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Date"),
            sortable: true,
            sortField: "created_at",
            minWidth: "20%",
            cell: (row) => row.created_at && getTransformDate(row.created_at, "DD-MM-YYYY HH:mm:ss"),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '140px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Subject"),
            sortable: true,
            minWidth: "40%",
            sortField: "subject",
            cell: (row) => row.subject,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '210px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: `${T('Done')}?`,
            sortable: true,
            minWidth: "20%",
            sortField: "isErledigt",
            cell: (row) => (
                <div className="form-switch form-check-primary">
                    <Input
                        type="switch"
                        checked={row.isErledigt}
                        id={`invoice_${row.id}_${row.isErledigt}`}
                        name={`invoice_${row.id}_${row.isErledigt}`}
                        className="cursor-pointer"
                        onChange={() => handleMarkDone(row.id)}
                    />
                    <Label className="form-check-label" htmlFor="icon-primary">
                        <span className="switch-icon-left">
                            <Check size={14} />
                        </span>
                        <span className="switch-icon-right">
                            <X size={14} />
                        </span>
                    </Label>
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '50px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        }
    ]

    return store ? (
        <Fragment>
            <Card className="overflow-hidden">
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T('Voice Recording')}</CardTitle>
                </CardHeader>
                {(!store.loading && !getTotalNumber(TN_VOICE_RECORDING)) ? (
                    <DotPulse />
                ) : (
                    <DatatablePagination
                        customClass="react-dataTable"
                        columns={columns}
                        loading={store.loading}
                        data={store.voiceRecordingItems}
                        pagination={store.loading ? store.pagination : {
                            ...store.pagination,
                            perPage: getCurrentPageNumber(TN_VOICE_RECORDING, rowsPerPage, currentPage)
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
        </Fragment>
    ) : null
}

export default VoiceRecordingList
