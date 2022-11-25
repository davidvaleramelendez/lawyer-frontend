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
    Badge,
    CardHeader,
    CardTitle
} from 'reactstrap'

// ** Utils
import {
    isUserLoggedIn
} from '@utils'

// Constant
import {
    root
} from '@constant/defaultValues'

// ** Store & Actions
import {
    getLetterList,
    archiveLetter,
    updatePrintStatus,
    clearLetterMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    X,
    Eye,
    Check
} from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

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
                        <label htmlFor="rows-per-page">Show</label>
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
                        <label htmlFor="search-letter">Search</label>
                        <Input
                            id="search-letter"
                            className="ms-50 me-2 w-100"
                            type="text"
                            value={searchInput}
                            placeholder="Search Letter"
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const LetterList = () => {
    /* Hook */
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.letter)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleLetterLists = (sorting = sort, search = searchInput, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage) => {
        dispatch(
            getLetterList({
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
        handleLetterLists(sort, searchInput, sortColumn, currentPage, parseInt(value))
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handleLetterLists(sort, val, sortColumn, currentPage, rowsPerPage)
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleLetterLists(sortDirection, searchInput, column.sortField, currentPage, rowsPerPage)
    }

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
        setCurrentPage(page + 1)
        handleLetterLists(sort, searchInput, sortColumn, page + 1, rowsPerPage)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleLetterLists()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearLetterMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification("Success", store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification("Error", store.error, "warning")
        }
    }, [dispatch, store.success, store.error, store.actionFlag, sort, searchInput, sortColumn, currentPage, rowsPerPage, loadFirst])
    // console.log("store >>> ", store)

    const onLetterArchive = (id, type) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You want to archive this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, archive it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
                dispatch(archiveLetter({ id: id, payload: { type: type } }))
            }
        })
    }

    const onLetterPrint = (row) => {
        dispatch(updatePrintStatus({ id: row.id, payload: { status: true } }))
        window.open(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.pdf_path}`, '_blank', 'noopener,noreferrer')
    }

    const columns = [
        {
            name: 'Reference Number',
            sortable: true,
            sortField: 'case_id',
            cellClass: 'text-uppercase',
            minWidth: '210px',
            cell: (row) => row.case_id
        },
        {
            name: 'Date',
            sortable: true,
            cellClass: 'text-uppercase',
            minWidth: '180px',
            sortField: 'last_date',
            cell: (row) => row.last_date
        },
        {
            name: 'Subject',
            sortable: true,
            cellClass: 'text-uppercase',
            minWidth: '310px',
            sortField: 'subject',
            cell: (row) => row.subject
        },
        {
            name: 'Printed',
            sortable: true,
            cellClass: 'text-uppercase',
            minWidth: '140px',
            // maxWidth: '50px',
            sortField: 'is_print',
            cell: (row) => (
                <div className='form-switch form-check-primary'>
                    <Input
                        type='switch'
                        checked={row.is_print}
                        id={`invoice_${row.id}_${row.is_print}`}
                        name={`invoice_${row.id}_${row.is_print}`}
                        className="cursor-pointer"
                        onChange={(event) => event.preventDefault()}
                    />
                    <Label className='form-check-label' htmlFor="icon-primary">
                        <span className='switch-icon-left'>
                            <Check size={14} />
                        </span>
                        <span className='switch-icon-right'>
                            <X size={14} />
                        </span>
                    </Label>
                </div>
            )
        },
        {
            name: 'Done?',
            sortable: true,
            cellClass: 'text-uppercase',
            minWidth: '120px',
            sortField: 'is_archived',
            cell: (row) => (
                <Badge className="text-capitalize cursor-pointer" color="light-success" pill onClick={() => onLetterArchive(row.id, 'letter')}>
                    Done
                </Badge>
            )
        },
        {
            name: 'View',
            cellClass: 'text-uppercase',
            minWidth: '50px',
            cell: (row) => <a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.pdf_path}`} target="_blank" className="d-flex align-items-center" onClick={(event) => {
                event.preventDefault()
                onLetterPrint(row)
            }} rel="noopener noreferrer">
                <Eye size={14} />
            </a>
        }
    ]

    return store ? (<Fragment>
        <Card className="overflow-hidden">
            <CardHeader className="border-bottom">
                <CardTitle tag="h4">Outbox</CardTitle>
            </CardHeader>

            <DatatablePagination
                customClass="react-dataTable"
                columns={columns}
                loading={store.loading}
                data={store.letterItems}
                pagination={store.pagination}
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
        </Card>
    </Fragment>) : null
}

export default LetterList
