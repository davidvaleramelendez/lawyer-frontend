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
    getTransformDate,
    getCurrentPageNumber
} from '@utils'

// Constant
import {
    root,
    adminRoot,
    TN_IMPORT_LETTER_FILE
} from '@constant/defaultValues'

// ** Store & Actions
import {
    setSelectedItemValues,
    deleteImportLetterFile,
    setImportLetterFileItem,
    getImportLetterFileList,
    callImportDropboxPdfCron,
    moveToLetterImportedFile,
    markDoneImportLetterFile,
    updateImportLetterFileLoader,
    clearImportLetterFileMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    X,
    Eye,
    Edit,
    Check,
    Trash2,
    RefreshCw
} from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

// ** Modal
import ModalImportFile from '../modals/ModalImportFile'
import ModalEditImportFile from '../modals/ModalEditImportFile'

// ** Translation
import { T } from '@localization'

const CustomHeader = ({
    loading,
    dispatch,
    searchInput,
    rowsPerPage,
    handleSearch,
    setModalOpen,
    handlePerPage,
    selectedImportItem,
    onSelectAllImportItem,
    handleSelectedImportMove,
    handleSelectedAllImportChecked
}) => {
    const handleRefreshCron = () => {
        dispatch(updateImportLetterFileLoader(false))
        dispatch(callImportDropboxPdfCron({}))
    }

    return (
        <div className="invoice-list-table-header w-100 py-1">
            <Row>
                <Col lg={8} className="d-flex align-items-center flex-wrap mt-lg-0 mt-1 px-0 px-lg-1">
                    <div className="form-check mt-lg-0 mt-1 me-1">
                        <Input
                            type="checkbox"
                            id="import-item-select-all"
                            checked={handleSelectedAllImportChecked()}
                            onChange={(event) => onSelectAllImportItem(event.target.checked)}
                        />
                        <Label
                            for="import-item-select-all"
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

                    <Button
                        color="primary"
                        className="mt-lg-0 mt-1"
                        onClick={() => setModalOpen(true)}
                    >
                        {T('Import File')}
                    </Button>

                    {selectedImportItem && selectedImportItem.length ? (
                        <Button
                            color="primary"
                            className="ms-1 mt-lg-0 mt-1"
                            onClick={() => handleSelectedImportMove()}
                        >
                            {T('Move to Letter')}
                        </Button>
                    ) : null}
                </Col>

                <Col lg={4} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                    <div className="d-flex align-items-center">
                        <label htmlFor="search-letter">{T('Search')}</label>
                        <Input
                            id="search-voice-recording"
                            className="ms-50 me-2 w-100"
                            type="text"
                            value={searchInput}
                            placeholder={T('Search Imported Letter File')}
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

const ImportLetterFileList = () => {
    // ** Hook
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.importLetterFile)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleImportLetterFileLists = (sorting = sort, search = searchInput, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage) => {
        dispatch(
            getImportLetterFileList({
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
        handleImportLetterFileLists(sort, searchInput, sortColumn, currentPage, parseInt(value))
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handleImportLetterFileLists(sort, val, sortColumn, currentPage, rowsPerPage)
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleImportLetterFileLists(sortDirection, searchInput, column.sortField, currentPage, rowsPerPage)
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handleImportLetterFileLists(sort, searchInput, sortColumn, page + 1, rowsPerPage)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleImportLetterFileLists()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearImportLetterFileMessage())
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
                dispatch(deleteImportLetterFile(id))
            }
        })
    }

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
                dispatch(markDoneImportLetterFile(id))
            }
        })
    }

    const handleEditModal = (row) => {
        dispatch(setImportLetterFileItem(row))
        setEditModalOpen(true)
    }

    /* Select import item checkbox event */
    const onSelectAllImportItem = (checked) => {
        let selectedItemArr = []
        if (checked) {
            if (store && store.importLetterFileItems && store.importLetterFileItems.length) {
                selectedItemArr = store.importLetterFileItems.map((t) => t.id)
            }
        } else {
            selectedItemArr = []
        }

        dispatch(setSelectedItemValues(selectedItemArr))
    }

    const onSelectImportItem = (item) => {
        const selectedItemArr = [...store.selectedImportItem]
        if (item && item.id) {
            const index = selectedItemArr.indexOf(item.id)
            if (index !== -1) {
                selectedItemArr.splice(index, 1)
            } else {
                selectedItemArr.push(item.id)
            }
            dispatch(setSelectedItemValues(selectedItemArr))
        }
    }

    const handleSelectedAllImportChecked = () => {
        if (store && store.importLetterFileItems && store.importLetterFileItems.length) {
            if (store.selectedImportItem && (store.selectedImportItem.length === store.importLetterFileItems.length)) {
                return true
            }
        }
        return false
    }

    const handleSelectedImportChecked = (item) => {
        if (item && item.id) {
            if (store && store.selectedImportItem && store.selectedImportItem.length) {
                if (store.selectedImportItem.indexOf(item.id || "") !== -1) {
                    return true
                }
            }
        }
        return false
    }

    const handleSelectedImportMove = () => {
        MySwal.fire({
            title: T('Are you sure?'),
            text: T("You won't be able to revert this!"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: T('Yes, move it!'),
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
                dispatch(moveToLetterImportedFile({ ids: store.selectedImportItem }))
            }
        })
    }
    /* /Select import item checkbox event */

    /* Rendering file preview web url */
    const renderFileWebUrlPreview = (path) => {
        if (path) {
            return getWebPreviewUrl(path)
        }

        return false
    }
    /* /Rendering file preview web url */

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
                        id={`import-item-action-${row.id}`}
                        name={`import-item-action-${row.id}`}
                        onChange={() => onSelectImportItem(row)}
                        checked={handleSelectedImportChecked(row)}
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
            name: T("CaseID"),
            sortable: true,
            sortField: "case_id",
            minWidth: "14%",
            cell: (row) => (
                <Link to={`${adminRoot}/case/view/${row.case_id}`}>{`#${row.case_id}`}</Link>
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
            name: T("Deadline Date"),
            sortable: true,
            sortField: "frist_date",
            minWidth: "18%",
            cell: (row) => row.frist_date && getTransformDate(row.frist_date, "DD-MM-YYYY"),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '100px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Subject"),
            sortable: true,
            minWidth: "34%",
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
            minWidth: "18%",
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
        },
        {
            name: T("Action"),
            center: true,
            minWidth: "10%",
            cell: (row) => (
                <div className='column-action d-flex align-items-center'>
                    <a
                        target="_blank"
                        id={`pw-view-pdf-tooltip-${row.id}`}
                        href={renderFileWebUrlPreview(row.file_path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                    >
                        <Eye size={14} />
                    </a>
                    <UncontrolledTooltip placement="top" target={`pw-view-pdf-tooltip-${row.id}`}>
                        {T('Open file')}
                    </UncontrolledTooltip>

                    <Edit
                        size={17}
                        id={`pw-edit-tooltip-${row.id}`}
                        onClick={() => handleEditModal(row)}
                        className='cursor-pointer mb-0 ms-50'
                    />
                    <UncontrolledTooltip placement="top" target={`pw-edit-tooltip-${row.id}`}>
                        {T('Edit')}
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
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '60px'
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
                    <CardTitle tag="h4">{T('Import Letter File')}</CardTitle>
                </CardHeader>
                {(!store.loading && !getTotalNumber(TN_IMPORT_LETTER_FILE)) ? (
                    <DotPulse />
                ) : (
                    <DatatablePagination
                        customClass="react-dataTable"
                        columns={columns}
                        loading={store.loading}
                        data={store.importLetterFileItems}
                        pagination={store.loading ? store.pagination : {
                            ...store.pagination,
                            perPage: getCurrentPageNumber(TN_IMPORT_LETTER_FILE, rowsPerPage, currentPage)
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
                                setModalOpen={setModalOpen}
                                handlePerPage={handlePerPage}
                                selectedImportItem={store.selectedImportItem}
                                onSelectAllImportItem={onSelectAllImportItem}
                                handleSelectedImportMove={handleSelectedImportMove}
                                handleSelectedAllImportChecked={handleSelectedAllImportChecked}
                            />
                        }
                    />
                )}

                <ModalEditImportFile
                    toggleModal={() => setEditModalOpen(!editModalOpen)}
                    open={editModalOpen}
                />

                <ModalImportFile
                    toggleModal={() => setModalOpen(!modalOpen)}
                    open={modalOpen}
                />
            </Card>
        </Fragment>
    ) : null
}

export default ImportLetterFileList
