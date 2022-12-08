/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'

// ** Store & Actions
import {
    getCaseList
} from '../../case/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import {
    getTransformDate,
    getRandColorClass
} from '@utils'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    Button,
    CardTitle,
    CardHeader
} from 'reactstrap'

// ** React Dropdown Import
import Select from "react-select"

// ** Custom Components
import Avatar from "@components/avatar"
import DatatablePagination from "@components/datatable/DatatablePagination"

// ** Icons Import
import {
    Eye,
    PlusCircle
} from 'react-feather'

// Constant
import {
    adminRoot,
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'
import {
    caseItem
} from '@constant/reduxConstant'

// ** Modal
import ModalCaseDetail from '../../case/modals/ModalCaseDetail'

// ** Translation
import { T } from '@localization'

/* Get windows size */
function getWindowSize() {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height
    }
}
/* /Get windows size */

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
                    <label htmlFor="search-case">{T('Search')}</label>
                    <Input
                        id="search-case"
                        className="ms-50 me-2 w-100"
                        type="text"
                        value={searchInput}
                        placeholder={T("Search Case")}
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </div>

                <div className="status">
                    <Select
                        id="status-filter"
                        placeholder="Select..."
                        options={[{ label: T("Hold"), value: "Hold" }, { label: T("Open"), value: "Open" }]}
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

const DocumentsTab = ({
    id
}) => {

    // ** Store vars
    const dispatch = useDispatch()
    const caseStore = useSelector((state) => state.cases)

    // ** States
    const [windowSize, setWindowSize] = useState(getWindowSize())
    const [loadFirst, setLoadFirst] = useState(true)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [caseRowData, setCaseRowData] = useState(caseItem)
    const [plusIconAction, setPlusIconAction] = useState(true)
    const [dotIconAction, setDotIconAction] = useState(false)

    /* Case pagination */
    const [searchInput, setSearchInput] = useState("")
    const [sort, setSort] = useState("desc")
    const [sortColumn, setSortColumn] = useState("caseId")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)
    const [statusFilter, setStatusFilter] = useState(null)
    /* /Case pagination */

    /* Case Pagination Api */
    const handleCaseList = (sortBy = sort, sortCol = sortColumn, search = searchInput, page = currentPage, perPage = rowsPerPage, status = "") => {
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
    }

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

    // ** Get data on mount
    useEffect(() => {
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
    }, [windowSize])

    // ** Get contact on mount based on id
    useEffect(() => {
        /* Calling first time */
        if (loadFirst) {
            handleCaseList()
            setLoadFirst(false)
        }
    }, [loadFirst])

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
            omit: plusIconAction,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <Button type="button" color="#FFFFFF" onClick={() => onCaseDetail(row)}>
                        <PlusCircle color="#7367f0" size={17} />
                    </Button>
                </div>
            )
        },
        {
            name: T("Reference Number"),
            sortable: true,
            sortField: "CaseID",
            cellClass: "text-uppercase",
            minWidth: "190px",
            cell: row => <Link to={`${adminRoot}/case/view/${row.CaseID}`}>{`#${row.CaseID}`}</Link>
        },
        {
            name: T("Client"),
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
            name: T("Attorney"),
            sortable: true,
            sortField: "LaywerID",
            cellClass: "text-uppercase",
            minWidth: "140px",
            cell: (row) => <>{row && row.laywer && row.laywer.id ? (<Link to={`${adminRoot}/user/view/${row.laywer.id}`}>{row.laywer.name}</Link>) : null}</>
        },
        {
            name: T("Date"),
            sortable: true,
            sortField: "Date",
            cellClass: "text-uppercase",
            minWidth: "110px",
            cell: (row) => row.Date && getTransformDate(row.Date, "DD MMM YYYY")
        },
        {
            name: T("Status"),
            sortable: true,
            sortField: "Status",
            cellClass: "text-uppercase",
            minWidth: "50px",
            cell: (row) => row.Status
        },
        {
            name: T("Group"),
            sortable: true,
            sortField: "Status",
            cellClass: "text-uppercase",
            minWidth: "110px",
            cell: (row) => row && row.type && row.type.CaseTypeName
        },
        {
            name: T('Action'),
            minWidth: '90px',
            omit: dotIconAction,
            cell: (row) => (
                <div className='column-action d-flex align-items-center'>
                    <Link
                        to={`${adminRoot}/case/view/${row.CaseID}`}
                    >
                        <Eye size={17} className="mx-1" />
                    </Link>
                </div>
            )
        }
    ]
    /* /Case columns */

    return (
        <Fragment>
            {/* Case listing */}
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T("Documents")}</CardTitle>
                </CardHeader>

                <DatatablePagination
                    customClass=""
                    columns={caseColumns}
                    loading={caseStore && caseStore.loading}
                    data={caseStore && caseStore.caseItems}
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
        </Fragment>
    )
}

export default DocumentsTab