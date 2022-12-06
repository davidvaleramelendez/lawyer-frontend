/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'
import DotPulse from '@components/dotpulse'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    Badge,
    Button,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown
} from 'reactstrap'

// ** React Dropdown Import
import Select from 'react-select'

// ** Icons Import
import {
    Eye,
    User,
    Slack,
    Archive,
    PlusCircle,
    MoreVertical
} from 'react-feather'

// ** Utils
import {
    isUserLoggedIn,
    getRandColorClass,
    getTotalNumber,
    getCurrentPageNumber
} from '@utils'

// ** Store & Actions
import {
    getRoleList,
    getUserList,
    getUserStatsList,
    resetDeviceLogHistory,
    clearUserMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
    root,
    adminRoot,
    perPageRowItems,
    defaultPerPageRow,
    TN_USER
} from '@constant/defaultValues'
import {
    userItem
} from '@constant/reduxConstant'

// Translation
import { useTranslation } from 'react-i18next'

// Modal
import ModalAddUser from '../modals/ModalAddUser'
import ModalUserDetail from '../modals/ModalUserDetail'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

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
    roleFilter,
    roleOptions,
    searchInput,
    rowsPerPage,
    setModalOpen,
    handleSearch,
    handlePerPage,
    handleRoleFilter
}) => {
    /* Hook */
    const { t } = useTranslation()

    return (<>
        <div className='invoice-list-table-header w-100 me-50 ms-50 mt-2 mb-75'>
            <Row className="border-bottom">
                <h4 className="p-0 mb-1">Search & Filter</h4>
            </Row>

            <Row className="mt-1">
                <Col
                    lg={3}
                    className="d-flex align-items-center px-0"
                >
                    <div className="d-flex align-items-center w-100">
                        <label htmlFor="rows-per-page">Show</label>
                        <Input
                            type="select"
                            className="mx-50"
                            id="rows-per-page"
                            style={{ width: "5rem" }}
                            value={rowsPerPage}
                            onChange={(event) => handlePerPage(event.target.value)}
                        >
                            {perPageRowItems && perPageRowItems.length ? (<>
                                {perPageRowItems.map((item, index) => (
                                    <option key={`row-${index}`} value={item.value}>{item.label}</option>
                                ))}
                            </>) : null}
                        </Input>
                        <label htmlFor="rows-per-page">Entries</label>
                    </div>
                </Col>

                <Col
                    lg={9}
                    className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
                >
                    <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
                        <label className="mb-0" htmlFor="search-user">Search</label>
                        <Input
                            type="text"
                            id="search-user"
                            className="ms-50 w-100"
                            value={searchInput}
                            placeholder="Search User"
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </div>

                    <div className="d-flex align-items-center table-header-actions">
                        <Select
                            id="role_id-filter"
                            placeholder="Select Role..."
                            options={roleOptions}
                            className="react-select dropdown me-2"
                            classNamePrefix="select"
                            isClearable={true}
                            value={roleFilter}
                            onChange={(data) => handleRoleFilter(data)}
                        />

                        <Button
                            color="primary"
                            className="add-new-user"
                            onClick={() => setModalOpen(true)}
                        >
                            {t("Add")} {t("New")} {t("User")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    </>)
}

const UsersList = () => {
    // ** Hooks
    const navigate = useNavigate()

    // ** Store Vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** States
    const [windowSize, setWindowSize] = useState(getWindowSize())
    const [loadFirst, setLoadFirst] = useState(true)
    const [roleOptions, setRoleOptions] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [userRowData, setUserRowData] = useState(userItem)
    const [plusIconAction, setPlusIconAction] = useState(true)
    const [dotIconAction, setDotIconAction] = useState(false)

    /* Pagination */
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('desc')
    const [sortColumn, setSortColumn] = useState('id')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow)
    const [roleFilter, setRoleFilter] = useState(null)

    const handleUserLists = (sorting = sort, sortCol = sortColumn, search = searchInput, page = currentPage, perPage = rowsPerPage, roleId = "", status = "") => {
        dispatch(
            getUserList({
                sort: sorting,
                sortColumn: sortCol,
                search: search || "",
                page: page,
                perPage: perPage,
                role_id: roleId || "",
                Status: status || ""
            })
        )
    }

    const handleSearch = (value) => {
        setSearchInput(value)
        handleUserLists(
            sort,
            sortColumn,
            value,
            currentPage,
            rowsPerPage,
            roleFilter && roleFilter.value ? roleFilter.value : ""
        )
    }

    const handlePerPage = (value) => {
        setRowsPerPage(parseInt(value))
        handleUserLists(
            sort,
            sortColumn,
            searchInput,
            currentPage,
            parseInt(value),
            roleFilter && roleFilter.value ? roleFilter.value : ""
        )
    }

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
        handleUserLists(
            sortDirection,
            column.sortField,
            searchInput,
            currentPage,
            rowsPerPage,
            roleFilter && roleFilter.value ? roleFilter.value : ""
        )
    }

    const handlePagination = (page) => {
        setCurrentPage(page + 1)
        handleUserLists(
            sort,
            sortColumn,
            searchInput,
            page + 1,
            rowsPerPage,
            roleFilter && roleFilter.value ? roleFilter.value : ""
        )
    }

    const handleRoleFilter = (value) => {
        setRoleFilter(value)
        handleUserLists(
            sort,
            sortColumn,
            searchInput,
            currentPage,
            rowsPerPage,
            value && value.value ? value.value : ""
        )
    }
    /* /Pagination */

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

        /* Calling first time */
        if (loadFirst) {
            dispatch(resetDeviceLogHistory())
            handleUserLists()
            dispatch(getUserStatsList({}))
            dispatch(getRoleList({}))
            setLoadFirst(false)
        }

        let list1 = []
        if (store && store.roleItems && store.roleItems.length) {
            list1 = store.roleItems.map(role => {
                return {
                    value: role.role_id,
                    label: role.RoleName
                }
            })
        }
        setRoleOptions(list1)

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearUserMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification("Success", store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification("Error", store.error, "warning")
        }
    }, [store.roleItems, store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)

    /* Renders User Columns */
    const renderUser = (row) => {
        if (row.profile_photo_path && row.profile_photo_path.length) {
            return <Avatar className="me-50" img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.profile_photo_path}`} width="32" height="32" />
        } else {
            return (
                <Avatar
                    initials
                    className="me-50"
                    color={getRandColorClass()}
                    content={row.name || "John Doe"}
                />
            )
        }
    }
    /* /Renders User Columns */

    /* User detail popup modal */
    const onUserDetail = (row) => {
        setUserRowData(row)
        setDetailModalOpen(true)
    }
    /* /User detail popup modal */

    const columns = [
        {
            minWidth: "60px",
            maxWidth: "60px",
            omit: plusIconAction,
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <PlusCircle
                        size={17}
                        color="#7367f0"
                        className="cursor-pointer"
                        onClick={() => onUserDetail(row)}
                    />
                </div>
            )
        },
        {
            name: "Name",
            sortable: true,
            minWidth: "250px",
            sortField: "name",
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    {renderUser(row)}
                    <div className="d-flex flex-column">
                        <Link
                            to={`${adminRoot}/user/view/${row.id}`}
                            className="user_name text-truncate text-body"
                        >
                            <span className="fw-bolder text-primary">{row.name}</span>
                        </Link>
                    </div>
                </div>
            )
        },
        {
            name: "Email",
            sortable: true,
            minWidth: "300px",
            sortField: "email",
            cell: (row) => row.email
        },
        {
            name: "Role",
            sortable: true,
            minWidth: "150px",
            sortField: "role_id",
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    {row.role && row.role.role_id ? <>
                        {row.role.role_id === 10 ? <Slack color="#ea5455" size={17} className="me-50" /> : <User color={row.role.role_id === 14 ? "#28c76f" : "#7367f0"} size={17} className="me-50" />}
                        <span>{row.role.RoleName}</span>
                    </> : null}
                </div>
            )
        },
        {
            name: "Contact",
            sortable: true,
            minWidth: "130px",
            sortField: "Contact",
            cell: (row) => row.Contact
        },
        {
            name: "Status",
            minWidth: "108px",
            sortable: true,
            sortField: "Status",
            selector: (row) => row.Status,
            cell: (row) => (
                <Badge className="text-capitalize" color="light-success" pill>
                    {row.Status}
                </Badge>
            )
        },
        {
            name: "Action",
            minWidth: "108px",
            omit: dotIconAction,
            cell: (row) => (
                <UncontrolledButtonDropdown>
                    <DropdownToggle color="#FFFFFF">
                        <MoreVertical size={20} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            tag={Link}
                            to={`${adminRoot}/user/view/${row && row.id}`}
                        >
                            <Eye size={20} className="mb-0 me-1" />
                            <span className="me-2">View</span>
                        </DropdownItem>

                        <DropdownItem
                            tag={Link}
                            to={`${adminRoot}/user/edit/${row && row.id}`}
                        >
                            <Archive size={20} className="mb-0 me-1" />
                            <span className="me-2">Edit</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            )
        }
    ]

    return (
        <Fragment>
            <Card className="overflow-hidden">
                {(!store.loading && !getTotalNumber(TN_USER)) ? (
                    <DotPulse />
                ) : (
                    <DatatablePagination
                        customClass="react-dataTable"
                        columns={columns}
                        data={store.userItems}
                        loading={store.loading}
                        pagination={store.loading ? store.pagination : {
                            ...store.pagination,
                            perPage: getCurrentPageNumber(TN_USER, rowsPerPage, currentPage)
                        }
                        }
                        handleSort={handleSort}
                        handlePagination={handlePagination}
                        subHeaderComponent={
                            <CustomHeader
                                roleFilter={roleFilter}
                                roleOptions={roleOptions}
                                searchInput={searchInput}
                                rowsPerPage={rowsPerPage}
                                handleSearch={handleSearch}
                                setModalOpen={setModalOpen}
                                handlePerPage={handlePerPage}
                                handleRoleFilter={handleRoleFilter}
                            />
                        }
                    />
                )
                }
            </Card>

            <ModalAddUser
                toggleModal={() => setModalOpen(!modalOpen)}
                open={modalOpen}
                roleItems={store.roleItems}
            />

            <ModalUserDetail
                toggleModal={() => setDetailModalOpen(!detailModalOpen)}
                open={detailModalOpen}
                userRowData={userRowData}
                setUserRowData={setUserRowData}
            />
        </Fragment>
    )
}

export default UsersList