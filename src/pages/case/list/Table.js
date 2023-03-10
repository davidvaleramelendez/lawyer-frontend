/* eslint-disable object-shorthand */
/* eslint-disable no-confusing-arrow */

import { useState, useEffect, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Col, Row, Card, CardHeader, CardTitle, Input, Button } from "reactstrap"
import Select from "react-select"
import { isUserLoggedIn, getTotalNumber, getWebPreviewUrl, getTransformDate, getRandColorClass, getCurrentPageNumber } from "@utils"

// ** Constant
import {
    root,
    TN_CASES,
    adminRoot,
    adminRoleId,
    lawyerRoleId,
    partnerRoleId,
    perPageRowItems,
    defaultPerPageRow
} from "@constant/defaultValues"
import { caseItem } from "@constant/reduxConstant"

import { getCaseList, clearCaseMessage } from "../store"
import { useDispatch, useSelector } from "react-redux"
import ModalCaseDetail from "../modals/ModalCaseDetail"
import { Eye, PlusCircle } from "react-feather"
import Avatar from "@components/avatar"
import DotPulse from "@components/dotpulse"
import Notification from '@components/toast/notification'
import DatatablePagination from "@components/datatable/DatatablePagination"
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'
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

const CustomHeader = ({
    searchInput,
    rowsPerPage,
    handleSearch,
    handlePerPage,
    statusFilter,
    handleStatusFilter
}) => {
    return (<div className="w-100 py-2">
        <Card className="overflow-hidden">
            <CardHeader className="border-bottom">
                <CardTitle tag="h4">{T('Cases')}</CardTitle>
            </CardHeader>
        </Card>
        <Row>
            <Col lg={6} className="d-flex align-items-center px-0 px-lg-1">
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
                    <label className="entries"> entries </label>
                </div>
            </Col>

            <Col lg={6} className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0">
                <div className="d-flex align-items-center">
                    <label htmlFor="search-case">Search</label>
                    <Input
                        id="search-case"
                        className="ms-50 me-2 w-100"
                        type="text"
                        value={searchInput}
                        placeholder="Search Case"
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </div>

                <div className="status">
                    <Select
                        id="status-filter"
                        placeholder="Select Status..."
                        options={[{ label: "Hold", value: "Hold" }, { label: "Open", value: "Open" }]}
                        className="react-select"
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

const CaseList = () => {
    // ** Hooks
    const navigate = useNavigate()

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.cases)

    // ** States
    const [windowSize, setWindowSize] = useState(getWindowSize())
    const [loadFirst, setLoadFirst] = useState(true)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [caseRowData, setCaseRowData] = useState(caseItem)
    const [plusIconAction, setPlusIconAction] = useState(true)
    const [dotIconAction, setDotIconAction] = useState(false)

    /* pagination */
    const [searchInput, setSearchInput] = useState("")
    const [sort, setSort] = useState("desc")
    const [sortColumn, setSortColumn] = useState("caseId")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)
    const [statusFilter, setStatusFilter] = useState(null)

    const handleCaseList = useCallback((sortBy = sort, sortCol = sortColumn, search = searchInput, page = currentPage, perPage = rowsPerPage, status = "") => {
        dispatch(
            getCaseList({
                sort: sortBy,
                search: search,
                sortColumn: sortCol,
                page: page,
                perPage: parseInt(perPage),
                status
            })
        )
    }, [])

    const handlePerPage = (value) => {
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

    const handleSearch = (val) => {
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

    const handleSort = (column, sortDirection) => {
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

    const handlePagination = (page) => {
        // console.log("handlePagination >>>>>>> ", page)
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

    const handleStatusFilter = (value) => {
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

    // ** Get data on mount
    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleCaseList()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearCaseMessage())
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

    /* Rendering file preview web url */
    const renderFileWebUrlPreview = (path) => {
        if (path) {
            return getWebPreviewUrl(path)
        }

        return false
    }
    /* /Rendering file preview web url */

    const handleNavigationRole = (user, type = "view") => {
        if (user && user.id) {
            if (user.role_id === adminRoleId) {
                return `${adminRoot}/user/admin/${type}/${user.id}`
            } else if (user.role_id === lawyerRoleId) {
                return `${adminRoot}/user/lawyer/${type}/${user.id}`
            } else if (user.role_id === partnerRoleId) {
                return `${adminRoot}/user/partner/${type}/${user.id}`
            } else {
                return `${adminRoot}/user/customer/${type}/${user.id}`
            }
        }
        return `${adminRoot}/user`
    }

    // ** renders case column
    const renderCase = (row) => {
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
                    initials
                    className="me-50"
                    color={getRandColorClass()}
                    content={row ? row.name : ""}
                />)
        }
    }

    const onCaseDetail = (row) => {
        setCaseRowData(row)
        setDetailModalOpen(true)
    }

    /* Columns */
    const columns = [
        {
            name: "",
            minWidth: "10%",
            maxWidth: "10%",
            omit: plusIconAction,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <Button type="button" color="#FFFFFF" onClick={() => onCaseDetail(row)}>
                        <PlusCircle color="#7367f0" size={17} />
                    </Button>
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
            name: `${T("CaseID")}#`,
            sortable: true,
            sortField: "CaseID",
            minWidth: "13%",
            cell: (row) => <Link to={`${adminRoot}/case/view/${row.CaseID}`}>{`#${row.CaseID}`}</Link>,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '90px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Client"),
            sortable: true,
            minWidth: "23%",
            sortField: "Name",
            cell: (row) => {
                const name = (row && row.user && row.user.name) || ""
                return (
                    <div className="d-flex justify-content-left align-items-center">
                        {renderCase(row.user)}
                        <div className="d-flex flex-column">
                            <Link
                                to={handleNavigationRole(row.user, "view")}
                            >
                                <h6 className="user-name text-truncate mb-0">{name}</h6>
                                <small className="text-truncate text-muted text-wrap mb-0">{(row && row.user && row.user.email) || ""}</small>
                            </Link>
                        </div>
                    </div>
                )
            },
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
            name: T("Attorney"),
            sortable: true,
            sortField: "LaywerID",
            minWidth: "15%",
            cell: (row) => row && row.laywer && row.laywer.id ? (
                <Link
                    to={handleNavigationRole(row.laywer, "view")}
                >
                    {row.laywer.name}
                </Link>
            ) : null,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '100px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Date"),
            sortable: true,
            sortField: "Date",
            minWidth: "13%",
            cell: (row) => row.Date && getTransformDate(row.Date, "DD MMM YYYY"),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '100px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Status"),
            sortable: true,
            sortField: "Status",
            minWidth: "12%",
            cell: (row) => row.Status,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '60px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Group"),
            sortable: true,
            sortField: "CaseTypeID",
            minWidth: "14%",
            cell: (row) => row && row.type && row.type.CaseTypeName,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '100px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T('Action'),
            center: true,
            minWidth: "10%",
            maxWidth: "10%",
            omit: dotIconAction,
            cell: (row) => (
                <div className="column-action d-flex align-items-center">
                    <Link
                        to={`${adminRoot}/case/view/${row.CaseID}`}
                    >
                        <Eye size={17} className="mx-1" />
                    </Link>
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

    return (<>
        <Card className="overflow-hidden">
            {(!store.loading && !getTotalNumber(TN_CASES)) ? (
                <DotPulse />
            ) : (
                <DatatablePagination
                    customClass="react-dataTable"
                    columns={columns}
                    data={store.caseItems}
                    loading={store.loading}
                    pagination={store.loading ? store.pagination : {
                        ...store.pagination,
                        perPage: getCurrentPageNumber(TN_CASES, rowsPerPage, currentPage)
                    }}
                    handleSort={handleSort}
                    handlePagination={handlePagination}
                    subHeaderComponent={
                        <CustomHeader
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

            <ModalCaseDetail
                toggleModal={() => setDetailModalOpen(!detailModalOpen)}
                open={detailModalOpen}
                caseRowData={caseRowData}
                setCaseRowData={setCaseRowData}
                handleNavigationRole={handleNavigationRole}
            />
        </Card>
    </>)
}

export default CaseList
