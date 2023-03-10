/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import DatatablePagination from '@components/datatable/DatatablePagination'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    Badge,
    Button,
    UncontrolledTooltip
} from 'reactstrap'

// ** React Dropdown Import
import Select from 'react-select'

// ** Icons Import
import {
    Eye,
    User,
    Edit,
    Slack,
    PlusCircle
} from 'react-feather'

// ** Utils
import {
    getTotalNumber,
    isUserLoggedIn,
    getWebPreviewUrl,
    getRandColorClass,
    getCurrentPageNumber
} from '@utils'

// ** Store & Actions
import {
    getRoleList,
    getUserList,
    getUserStatsList,
    resetDeviceLogHistory,
    clearUserMessage
} from '@src/pages/user/store'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
    root,
    TN_USER,
    adminRoot,
    adminRoleId,
    lawyerRoleId,
    partnerRoleId,
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'
import {
    userItem
} from '@constant/reduxConstant'

// Modal
import ModalAddUser from '../modals/ModalAddUser'
import ModalUserDetail from '../modals/ModalUserDetail'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Translation
import { T } from '@localization'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

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
    handleRoleFilter,
    checkPermissionAccess
}) => {

    return (<>
        <div className='invoice-list-table-header w-100 me-50 ms-50 mt-2 mb-75'>
            <Row className="border-bottom">
                <h4 className="p-0 mb-1">{T('Search & Filter')}</h4>
            </Row>

            <Row className="mt-1">
                <Col
                    lg={3}
                    className="d-flex align-items-center px-0"
                >
                    <div className="d-flex align-items-center w-100">
                        <label htmlFor="rows-per-page">{T('Show')}</label>
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
                        <label htmlFor="rows-per-page">{T('Entries')}</label>
                    </div>
                </Col>

                <Col
                    lg={9}
                    className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
                >
                    <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
                        <label className="mb-0" htmlFor="search-user">{T('Search')}</label>
                        <Input
                            type="text"
                            id="search-user"
                            className="ms-50 w-100"
                            value={searchInput}
                            placeholder={T("Search User")}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </div>

                    <div className="d-flex align-items-center table-header-actions">
                        <Select
                            id="role_id-filter"
                            placeholder={`${T('Select Role')}...`}
                            options={roleOptions}
                            className="react-select dropdown"
                            classNamePrefix="select"
                            isClearable={true}
                            value={roleFilter}
                            onChange={(data) => handleRoleFilter(data)}
                        />

                        {checkPermissionAccess(7) ? (
                            <Button
                                color="primary"
                                className="add-new-user ms-2"
                                onClick={() => setModalOpen(true)}
                            >
                                {T("Add New User")}
                            </Button>
                        ) : null}
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
    const authStore = useSelector((state) => state.auth)

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
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }
    }, [store.roleItems, store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)

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

    /* Rendering user image */
    const renderUserProfilePicture = (row) => {
        if (row && row.profile_photo_path) {
            return getWebPreviewUrl(row.profile_photo_path)
        }

        return false
    }
    /* /Rendering user image */

    /* Renders User Columns */
    const renderUser = (row) => {
        if (row && row.profile_photo_path && row.profile_photo_path.length) {
            return <Avatar
                width="32"
                height="32"
                className="me-50"
                img={renderUserProfilePicture(row) || defaultAvatar}
            />
        } else if (row && row.role && row.role.role_id === 11) {
            return (
                <Avatar
                    initials
                    className="me-50"
                    color={getRandColorClass()}
                    content={row.name || ""}
                />
            )
        } else {
            return (
                <Avatar
                    height="32"
                    width="32"
                    className="me-50"
                    img={defaultAvatar}
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

    /* Columns */
    const columns = [
        {
            minWidth: "10%",
            maxWidth: "10%",
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
            name: T("Name"),
            sortable: true,
            sortField: "name",
            minWidth: "20%",
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    {renderUser(row)}
                    <div className="d-flex flex-column">
                        <Link
                            to={handleNavigationRole(row, "view")}
                            className="user_name text-truncate text-body"
                        >
                            <span className="fw-bolder text-primary text-wrap">{row.name}</span>
                        </Link>
                    </div>
                </div>
            ),
            /* Custom placeholder vars */
            customLoadingWithIcon: "User",
            customLoaderCellClass: "",
            customLoaderContentClass: "d-flex align-items-center"
            /* /Custom placeholder vars */
        },
        {
            name: T("Email"),
            sortable: true,
            sortField: "email",
            minWidth: "25%",
            cell: (row) => (<div className="">{row.email}</div>),
            /* Custom placeholder vars */
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Role"),
            sortable: true,
            sortField: "role_id",
            minWidth: "15%",
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    {row.role && row.role.role_id ? <>
                        {row.role.role_id === 10 ? <Slack color="#ea5455" size={17} className="me-50" /> : <User color={row.role.role_id === 14 ? "#28c76f" : "#7367f0"} size={17} className="me-50" />}
                        <span>{row.role.RoleName}</span>
                    </> : null}
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '60px'
            },
            customLoadingWithIcon: "User",
            customLoadingIconStyle: {
                width: '24px', height: '24px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: "d-flex align-items-center"
            /* /Custom placeholder vars */
        },
        {
            name: T("Contact"),
            sortable: true,
            sortField: "Contact",
            minWidth: "15%",
            cell: (row) => row.Contact,
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '105px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        },
        {
            name: T("Status"),
            sortable: true,
            sortField: "Status",
            minWidth: "15%",
            cell: (row) => (
                <Badge className="text-capitalize" color="light-success" pill>
                    {row.Status}
                </Badge>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '60px'
            },
            customLoaderCellClass: "",
            customLoaderContentClass: "rounded-pill"
            /* /Custom placeholder vars */
        },
        {
            name: T("Action"),
            center: true,
            omit: dotIconAction,
            minWidth: "10%",
            cell: (row) => (
                <div className='column-action d-flex align-items-center'>
                    <Link
                        to={handleNavigationRole(row, "view")}
                        id={`pw-view-tooltip-${(row && row.id) || ""}`}
                    >
                        <Eye size={17} className="me-50" />
                    </Link>
                    <UncontrolledTooltip placement="top" target={`pw-view-tooltip-${row.id}`}>
                        {T('View')}
                    </UncontrolledTooltip>

                    <Link
                        to={handleNavigationRole(row, "edit")}
                        id={`pw-edit-tooltip-${(row && row.id) || ""}`}
                    >
                        <Edit size={17} />
                    </Link>
                    <UncontrolledTooltip placement="top" target={`pw-edit-tooltip-${row.id}`}>
                        {T('Edit')}
                    </UncontrolledTooltip>
                </div>
            ),
            /* Custom placeholder vars */
            contentExtraStyles: {
                height: '15px', width: 'auto', borderRadius: '10px', display: 'inline-block', minWidth: '50px'
            },
            customLoaderCellClass: "text-center",
            customLoaderContentClass: ""
            /* /Custom placeholder vars */
        }
    ]

    /* Check permissions */
    const checkPermissionAccess = (id) => {
        if (authStore) {
            if (authStore.userItem && authStore.userItem.id) {
                if (authStore.userItem.permission && authStore.userItem.permission.length) {
                    const index = authStore.userItem.permission.findIndex((x) => x.permission_id === id)
                    if (index !== -1) {
                        return true
                    }
                }
            }
            return false
        }
        return false
    }
    /* /Check permissions */

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
                        }}
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
                                checkPermissionAccess={checkPermissionAccess}
                            />
                        }
                    />
                )}
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
                handleNavigationRole={handleNavigationRole}
            />
        </Fragment>
    )
}

export default UsersList