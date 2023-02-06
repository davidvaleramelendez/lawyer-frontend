/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    Label,
    Button,
    Spinner,
    CardTitle,
    CardHeader,
    UncontrolledTooltip
} from 'reactstrap'

// ** Utils
import {
    isUserLoggedIn,
    getTotalNumber,
    getWebPreviewUrl,
    getCurrentPageNumber
} from '@utils'

// Constant
import {
    root,
    TN_PLACETEL_CALL
} from '@constant/defaultValues'

// ** Store & Actions
import {
    deletePlacetelCall,
    getPlacetelCallList,
    setInitiateCallItem,
    initiatePlacetelCall,
    fetchIncomingCallsApi,
    updatePlacetelCallLoader,
    clearPlacetelCallMessage,
    getPlacetelCallStatsCount,
    deleteMultiplePlacetelCall,
    setSelectedPlacetelCallIds
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    Phone,
    Trash2,
    RefreshCw
} from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Modal
import ModalPlacetelInitiatedCall from '../modals/ModalPlacetelInitiatedCall'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Translation
import { T } from '@localization'

const CustomHeader = ({
    loading,
    dispatch,
    searchInput,
    rowsPerPage,
    handleSearch,
    handlePerPage,
    onSelectAllPlacetelCalls,
    selectedPlacetelCallIds,
    handleSelectedPlacetelCallDelete,
    handleSelectedAllPlacetelCallChecked
}) => {
    const handleRefreshCron = () => {
        dispatch(updatePlacetelCallLoader(false))
        dispatch(fetchIncomingCallsApi({}))
    }

    return (
        <div className="invoice-list-table-header w-100 py-1">
            <Row>
                <Col lg={8} className="d-flex align-items-center flex-wrap mt-lg-0 mt-1 px-0 px-lg-1">
                    <div className="form-check mt-lg-0 mt-1 me-1">
                        <Input
                            type="checkbox"
                            id="placetel-calls-item-select-all"
                            checked={handleSelectedAllPlacetelCallChecked()}
                            onChange={(event) => onSelectAllPlacetelCalls(event.target.checked)}
                        />
                        <Label
                            for="placetel-calls-item-select-all"
                            className="form-check-label fw-bold"
                        >
                            {T("Select All")}
                        </Label>
                    </div>

                    <div className="d-flex align-items-center mt-lg-0 mt-1 me-2">
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

                    {selectedPlacetelCallIds && selectedPlacetelCallIds.length ? (
                        <Button
                            color="danger"
                            className="mt-lg-0 mt-1"
                            onClick={() => handleSelectedPlacetelCallDelete()}
                        >
                            {T('Delete')}
                        </Button>
                    ) : null}
                </Col>

                <Col lg={4} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                    <div className="d-flex align-items-center">
                        <label htmlFor="search-letter">{T('Search')}</label>
                        <Input
                            id="search-placetel-call"
                            className="ms-50 me-2 w-100"
                            type="text"
                            value={searchInput}
                            placeholder={T('Search Placetel Call')}
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
        </div>
    )
}

const PlacetelCallList = () => {
    // ** Hook
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.placetelCall)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handlePlacetelCallLists = (sorting = sort, search = searchInput, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage) => {
        dispatch(
            getPlacetelCallList({
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
        handlePlacetelCallLists(sort, searchInput, sortColumn, currentPage, parseInt(value))
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handlePlacetelCallLists(sort, val, sortColumn, currentPage, rowsPerPage)
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handlePlacetelCallLists(sortDirection, searchInput, column.sortField, currentPage, rowsPerPage)
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handlePlacetelCallLists(sort, searchInput, sortColumn, page + 1, rowsPerPage)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handlePlacetelCallLists()
            dispatch(getPlacetelCallStatsCount({}))
            setLoadFirst(false)
        }

        /* Opening initiated call modal */
        // if (store && store.actionFlag && (store.actionFlag === "PLACETEL_CALL_INITIATED")) {
        //     setModalOpen(true)
        // }
        /* /Opening initiated call modal */

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearPlacetelCallMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)

    const handleInitiateCall = (item) => {
        MySwal.fire({
            title: item.from_number || "",
            text: T("Are you sure want to initiate call!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: T('Yes'),
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
                dispatch(setInitiateCallItem({ ...item, status: "processing" }))
                setModalOpen(true)
                dispatch(initiatePlacetelCall({
                    id: item.id || ""
                }))
            }
        })
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
                dispatch(deletePlacetelCall(id))
            }
        })
    }

    /* Select placetel call item checkbox event */
    const onSelectAllPlacetelCalls = (checked) => {
        let selectedItemArr = []
        if (checked) {
            if (store && store.placetelCallItems && store.placetelCallItems.length) {
                selectedItemArr = store.placetelCallItems.map((t) => t.id)
            }
        } else {
            selectedItemArr = []
        }

        dispatch(setSelectedPlacetelCallIds(selectedItemArr))
    }

    const onSelectPlacetelCallItem = (item) => {
        const selectedItemArr = [...store.selectedPlacetelCallIds]
        if (item && item.id) {
            const index = selectedItemArr.indexOf(item.id)
            if (index !== -1) {
                selectedItemArr.splice(index, 1)
            } else {
                selectedItemArr.push(item.id)
            }
            dispatch(setSelectedPlacetelCallIds(selectedItemArr))
        }
    }

    const handleSelectedAllPlacetelCallChecked = () => {
        if (store && store.placetelCallItems && store.placetelCallItems.length) {
            if (store.selectedPlacetelCallIds && (store.selectedPlacetelCallIds.length === store.placetelCallItems.length)) {
                return true
            }
        }
        return false
    }

    const handleSelectedPlacetelCallChecked = (item) => {
        if (item && item.id) {
            if (store && store.selectedPlacetelCallIds && store.selectedPlacetelCallIds.length) {
                if (store.selectedPlacetelCallIds.indexOf(item.id || "") !== -1) {
                    return true
                }
            }
        }
        return false
    }

    const handleSelectedPlacetelCallDelete = () => {
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
                dispatch(deleteMultiplePlacetelCall({ ids: store.selectedPlacetelCallIds }))
            }
        })
    }
    /* /Select placetel call item checkbox event */

    /* Rendering file preview web url */
    const renderFileWebUrlPreview = (path) => {
        if (path) {
            return getWebPreviewUrl(path)
        }

        return false
    }
    /* /Rendering file preview web url */

    // ** renders case column
    const renderPlacetelCallUser = (row) => {
        if (row && row.profile_photo_path && row.profile_photo_path.length) {
            return (
                <Avatar
                    width="32"
                    height="32"
                    className="me-50"
                    img={renderFileWebUrlPreview(row.profile_photo_path) || defaultAvatar}
                />
            )
        } else {
            return (
                <Avatar
                    width="32"
                    height="32"
                    className="me-50"
                    img={defaultAvatar}
                />)
        }
    }

    /* Columns */
    const columns = [
        {
            name: "",
            center: true,
            minWidth: "6%",
            cell: (row) => (
                <div className="form-check">
                    <Input
                        type="checkbox"
                        id={`placetel-call-item-action-${row.id}`}
                        name={`placetel-call-item-action-${row.id}`}
                        onChange={() => onSelectPlacetelCallItem(row)}
                        checked={handleSelectedPlacetelCallChecked(row)}
                    />
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '20px', width: 'auto', borderRadius: '6px', display: 'inline-block', minWidth: '20px'
            },
            customLoaderCellClass: "text-center",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("User"),
            sortable: true,
            minWidth: "34%",
            sortField: "user_id",
            cell: (row) => (
                row.user && row.user.id ? (
                    <div className="d-flex justify-content-left align-items-center">
                        {renderPlacetelCallUser(row.user)}
                        <div className="d-flex flex-column">
                            <h6 className="user-name text-truncate mb-0">{row.user.name}</h6>
                            <small className="text-truncate text-muted text-wrap mb-0">{(row && row.user && row.user.email) || ""}</small>
                        </div>
                    </div>
                ) : null
            ),
            /* Custom placeholder vars */
            customRenderTwoRow: true,
            contentExtraStylesRow1: {
                height: '15px', width: 'auto', borderRadius: '10px', minWidth: '120px'
            },
            contentExtraStylesRow2: {
                height: '10px', width: 'auto', borderRadius: '10px', minWidth: '120px', marginTop: '3px'
            },
            customLoadingWithIcon: "User",
            customLoaderCellClass: "",
            customLoaderContentClass: "d-flex align-items-center"
            /* /Custom placeholder vars */
        },
        {
            name: T("Type"),
            sortable: true,
            sortField: "type",
            minWidth: "25%",
            cell: (row) => (<div className="text-capitalize">{row.type}</div>),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '75px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Number"),
            sortable: true,
            sortField: "type",
            minWidth: "25%",
            cell: (row) => (row.from_number),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '105px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Action"),
            center: true,
            minWidth: "10%",
            cell: (row) => (
                <div className='column-action d-flex align-items-center'>
                    <Phone
                        size={17}
                        id={`pw-phone-tooltip-${row.id}`}
                        onClick={() => handleInitiateCall(row)}
                        className='cursor-pointer mb-0'
                    />
                    <UncontrolledTooltip placement="top" target={`pw-phone-tooltip-${row.id}`}>
                        {T('Initiate Call')}
                    </UncontrolledTooltip>

                    <Trash2
                        size={17}
                        id={`pw-delete-tooltip-${row.id}`}
                        onClick={() => handleDelete(row.id)}
                        className='cursor-pointer mb-0 ms-50'
                    />
                    <UncontrolledTooltip placement="top" target={`pw-delete-tooltip-${row.id}`}>
                        {T('Delete')}
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

    return store ? (
        <Fragment>
            <Card className="overflow-hidden">
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T('Placetel Call')}</CardTitle>
                </CardHeader>
                {(!store.loading && !getTotalNumber(TN_PLACETEL_CALL)) ? (
                    <DotPulse />
                ) : (
                    <DatatablePagination
                        customClass="react-dataTable"
                        columns={columns}
                        loading={store.loading}
                        data={store.placetelCallItems}
                        pagination={store.loading ? store.pagination : {
                            ...store.pagination,
                            perPage: getCurrentPageNumber(TN_PLACETEL_CALL, rowsPerPage, currentPage)
                        }}
                        handleSort={handleSort}
                        handlePagination={handlePagination}
                        subHeaderComponent={
                            <CustomHeader
                                loading={store.loading}
                                dispatch={dispatch}
                                searchInput={searchInput}
                                rowsPerPage={rowsPerPage}
                                handleSearch={handleSearch}
                                handlePerPage={handlePerPage}
                                onSelectAllPlacetelCalls={onSelectAllPlacetelCalls}
                                handleSelectedPlacetelCallDelete={handleSelectedPlacetelCallDelete}
                                selectedPlacetelCallIds={store.selectedPlacetelCallIds}
                                handleSelectedAllPlacetelCallChecked={handleSelectedAllPlacetelCallChecked}
                            />
                        }
                    />
                )}

                <ModalPlacetelInitiatedCall
                    toggleModal={() => setModalOpen(!modalOpen)}
                    open={modalOpen}
                    initiatedCallItem={store.initiatedCallItem}
                />
            </Card>
        </Fragment>
    ) : null
}

export default PlacetelCallList
