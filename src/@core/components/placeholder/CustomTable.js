/* eslint-disable object-shorthand */

// ** Reactstrap Imports
import { Fragment } from 'react'
import {
    Table
} from 'reactstrap'

const CustomTable = ({
    responsive = true,
    tableClassName = "",
    headerClassName = "",
    bodyClassName = "",
    columns,
    bodyRows = 3,
    bodyRowHeight = 40
}) => {

    return columns ? (
        columns && columns.length ? (
            <Table
                responsive={responsive}
                className={`${tableClassName}`}
            >
                <thead
                    className={`${headerClassName}`}
                >
                    <tr>
                        {columns.map((col, index) => (
                            !col.omit ? (
                                <th key={`place-holder-head-${index}`}>{col.name || ""}</th>
                            ) : null
                        ))}
                    </tr>
                </thead>

                {bodyRows ? (
                    <tbody
                        className={`${bodyClassName}`}
                    >
                        {Array.from(Array(bodyRows), (row, index) => (
                            <tr
                                key={`place-holder-body-${index}`}
                                style={
                                    { height: `${bodyRowHeight}px` }
                                }
                            >
                                {columns.map((col, bodyIndex) => {
                                    const minWidth = col.minWidth
                                    const maxWidth = col.maxWidth
                                    const style = {}
                                    if (minWidth) {
                                        style.minWidth = minWidth
                                    }

                                    if (maxWidth) {
                                        style.maxWidth = maxWidth
                                    }

                                    return (
                                        <Fragment
                                            key={`place-holder-body-content-${bodyIndex}`}
                                        >
                                            {!col.omit ? (
                                                <td
                                                    style={style}
                                                    className="placeholder-glow"
                                                >
                                                    <div className="placeholder w-100" />
                                                </td>
                                            ) : null}
                                        </Fragment>)
                                })}
                            </tr>
                        ))}
                    </tbody>
                ) : null}
            </Table>
        ) : null
    ) : null
}

export default CustomTable
