/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Store & Actions
import {
    getUserDeviceLogs
} from '@src/pages/user/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import {
    getTransformDate
} from '@utils'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Input,
    CardTitle,
    CardHeader
} from 'reactstrap'

// ** Custom Components
import DatatablePagination from "@components/datatable/DatatablePagination"

// Constant
import {
    perPageRowItems,
    defaultPerPageRow
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'

/* Device Log History header */
const CustomLogHeader = ({
    rowsPerPage,
    handlePerPage
}) => {
    return (<div className="invoice-list-table-header w-100 py-2">
        <Row>
            <Col lg={4} className="d-flex align-items-center px-0 px-lg-1">
                <div className="d-flex align-items-center me-2">
                    <label htmlFor="log-rows-per-page">{T('Show')}</label>
                    <Input
                        type="select"
                        id="log-rows-per-page"
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
        </Row>
    </div>)
}
/* /Device Log History header */

const RecentDevices = ({
    id
}) => {

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)

    /* Device Log history pagination */
    const [logSort, setLogSort] = useState('desc')
    const [logSortColumn, setLogSortColumn] = useState('id')
    const [logCurrentPage, setLogCurrentPage] = useState(1)
    const [logRowsPerPage, setLogRowsPerPage] = useState(defaultPerPageRow)
    /* /Device Log history pagination */

    /* Device Log history Pagination Api */
    const handleLogLists = (sorting = logSort, sortCol = logSortColumn, page = logCurrentPage, perPage = logRowsPerPage) => {
        dispatch(
            getUserDeviceLogs({
                sort: sorting,
                sortColumn: sortCol,
                page: page,
                perPage: perPage,
                user_id: id
            })
        )
    }

    const handleLogPerPage = (value) => {
        setLogRowsPerPage(parseInt(value))
        handleLogLists(
            logSort,
            logSortColumn,
            logCurrentPage,
            parseInt(value)
        )
    }

    const handleLogSort = (column, sortDirection) => {
        setLogSort(sortDirection)
        setLogSortColumn(column.sortField)
        handleLogLists(
            sortDirection,
            column.sortField,
            logCurrentPage,
            logRowsPerPage
        )
    }

    const handledeviceLogPagination = (page) => {
        // console.log("handledeviceLogPagination >>>>>>> ", page)
        setLogCurrentPage(page + 1)
        handleLogLists(
            logSort,
            logSortColumn,
            page + 1,
            logRowsPerPage
        )
    }
    /* /Device Log history Pagination Api */

    // ** Get contact on mount based on id
    useEffect(() => {
        /* Calling first time */
        if (loadFirst) {
            handleLogLists()
            setLoadFirst(false)
        }
    }, [loadFirst])

    /* Device Log history columns */
    const logColumns = [
        {
            name: T('Ip Address'),
            sortable: true,
            sortField: 'ip_address',
            minWidth: '140px',
            cell: (row) => row.ip_address
        },
        {
            name: T('Login Date'),
            sortable: true,
            sortField: 'login_at',
            minWidth: '140px',
            cell: (row) => row.login_at && getTransformDate(row.login_at, "DD MMM YYYY")
        }
    ]
    /* /Device Log history columns */

    return (
        <Fragment>
            {/* Device Log History listing */}
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T("Recent devices")}</CardTitle>
                </CardHeader>

                <DatatablePagination
                    customClass=""
                    columns={logColumns}
                    loading={store && store.loading}
                    data={store && store.userDeviceLogs}
                    pagination={store && store.deviceLogPagination}
                    handleSort={handleLogSort}
                    handlePagination={handledeviceLogPagination}
                    subHeaderComponent={
                        <CustomLogHeader
                            rowsPerPage={logRowsPerPage}
                            handlePerPage={handleLogPerPage}
                        />
                    }
                />
            </Card>
            {/* /Device Log History listing */}
        </Fragment>
    )
}

export default RecentDevices