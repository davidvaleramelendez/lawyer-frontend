/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Table
} from 'reactstrap'

// ** Utils
import {
} from '@utils'

// ** Icons Import
import * as Icon from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

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
                    style={
                        { height: `${bodyRowHeight}px` }
                    }
                >
                    <tr>
                        {columns.map((col, index) => {
                            const minWidth = col.minWidth || ""
                            const maxWidth = col.maxWidth || ""
                            const style = {}
                            if (minWidth) {
                                style.width = minWidth
                            }

                            if (maxWidth) {
                                style.maxWidth = maxWidth
                            }

                            return (
                                !col.omit ? (
                                    <th
                                        style={style}
                                        key={`place-holder-head-${index}`}
                                        className={`${col && col.customLoaderCellClass ? col.customLoaderCellClass : ''}`}
                                    >
                                        {col.name || ""}
                                    </th>
                                ) : null
                            )
                        })}
                    </tr>
                </thead>

                {bodyRows ? (
                    <tbody
                        className={`${bodyClassName}`}
                    >
                        {Array.from(Array(bodyRows).keys(), (row, index) => (
                            <tr
                                key={`place-holder-body-${index}`}
                            >
                                {columns.map((col, bodyIndex) => {
                                    const minWidth = col.minWidth || ""
                                    const maxWidth = col.maxWidth || ""
                                    const style = {}
                                    if (minWidth) {
                                        style.width = minWidth
                                    }

                                    if (maxWidth) {
                                        style.maxWidth = maxWidth
                                    }

                                    let IconTag = ""
                                    if (col && col.customLoadingWithIcon) {
                                        IconTag = Icon[col.customLoadingWithIcon]
                                    }

                                    return (
                                        <Fragment
                                            key={`place-holder-body-content-${bodyIndex}`}
                                        >
                                            {!col.omit ? (
                                                <td
                                                    style={style}
                                                    className={`placeholder-glow ${col && col.customLoaderCellClass ? col.customLoaderCellClass : ''}`}
                                                >
                                                    {IconTag ? (
                                                        <Avatar
                                                            size={"sm"}
                                                            imgWidth='30'
                                                            imgHeight='30'
                                                            className="placeholder me-50"
                                                            icon={<IconTag size={17} />}
                                                        />
                                                    ) : null}

                                                    <div
                                                        className={`placeholder ${col && col.customLoaderContentClass ? col.customLoaderContentClass : ''}`}
                                                    >
                                                        {col && col.loaderContent}
                                                    </div>
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
