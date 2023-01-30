// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Col,
    Row
} from 'reactstrap'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'

// ** Custom Placeholder Components
import CustomTable from '@components/placeholder/CustomTable'

// ** Translation
import { T } from '@localization'

// ** Icons Import
import { ChevronDown } from 'react-feather'

// Constant
import {
    defaultPerPageRow
} from '@constant/defaultValues'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const DatatablePagination = ({
    customClass = "invoice-list-dataTable",
    columns,
    loading = true,
    data = [],
    pagination,
    handleSort,
    handlePagination,
    subHeaderComponent,
    displayEntriesLabel = true
    // noDataComponent = "There are no records to display..."
}) => {
    /* Page change function */
    const onPageChange = (page) => {
        if (page && (page.selected || page.selected === 0)) {
            handlePagination(page.selected)
        }
    }

    const DatatablePagination = ({
        placeholder = false,
        bodyRows
    }) => {
        return (
            <Row className="d-flex align-items-center">
                <Col sm={6} md={6}>
                    {displayEntriesLabel ? (
                        <div className="text-muted text-center text-sm-start p-1">
                            {placeholder ? (
                                <Fragment>
                                    {T("Showing")} {pagination && pagination.startIndex ? pagination.startIndex : 1} {T("to")} {bodyRows || 1} {T("of")} {bodyRows || 1} {T("entries")}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    {T("Showing")} {pagination && pagination.startIndex ? pagination.startIndex : 1} {T("to")} {pagination && pagination.startIndex ? pagination.endIndex : 1} {T("of")} {pagination && pagination.startIndex ? pagination.totalRecord : 1} {T("entries")}
                                </Fragment>
                            )}
                        </div>
                    ) : null}
                </Col>

                <Col sm={6} md={6}>
                    <ReactPaginate
                        nextLabel=''
                        breakLabel='...'
                        previousLabel=''
                        pageCount={pagination && pagination.totalPages ? pagination.totalPages : 1}
                        activeClassName='active'
                        breakClassName='page-item'
                        pageClassName={'page-item'}
                        breakLinkClassName='page-link'
                        nextLinkClassName={'page-link'}
                        pageLinkClassName={'page-link'}
                        nextClassName={'page-item next'}
                        previousLinkClassName={'page-link'}
                        previousClassName={'page-item prev'}
                        onPageChange={(page) => onPageChange(page)}
                        forcePage={pagination && pagination.pageIndex ? pagination.pageIndex : 0}
                        containerClassName={'pagination react-paginate text-center text-sm-start justify-content-center justify-content-sm-end p-1'}
                    />
                </Col>
            </Row>
        )
    }

    return (
        <div className={`react-dataTable ${customClass} ${!loading ? 'customize-placeholder-header' : ''}`}>
            <DataTable
                noHeader={true}
                pagination={true}
                sortServer={true}
                subHeader={true}
                columns={columns}
                responsive={true}
                onSort={handleSort}
                persistTableHead={true}
                paginationServer={true}
                progressPending={!loading}
                progressComponent={
                    <CustomTable
                        responsive={false}
                        tableClassName="placeholder-table"
                        headerClassName=""
                        columns={columns}
                        bodyRows={pagination && pagination.perPage ? parseInt(pagination.perPage) : defaultPerPageRow}
                        bodyRowHeight={40}
                    />
                }
                data={data && data.length ? data : []}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                // noDataComponent={noDataComponent}
                defaultSortField={pagination && pagination.sortColumn ? pagination.sortColumn : ''}
                paginationDefaultPage={pagination && pagination.pageIndex ? pagination.pageIndex : 1}
                paginationComponent={DatatablePagination}
                subHeaderComponent={subHeaderComponent}
            />

            {!loading ? (
                <DatatablePagination
                    placeholder={true}
                    bodyRows={pagination && pagination.perPage ? parseInt(pagination.perPage) : defaultPerPageRow}
                />
            ) : null}
        </div>
    )
}

export default DatatablePagination
