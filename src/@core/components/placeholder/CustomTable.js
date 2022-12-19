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
import LoadingPlaceHolder from '@components/loadingPlaceHolder/LoadingPlaceHolder'

const CustomTable = ({
    responsive = true,
    tableClassName = "",
    headerClassName = "",
    bodyClassName = "",
    columns,
    bodyRows = 3,
    bodyRowHeight = 40
}) => {

    const headerStyle = {}
    if (bodyRowHeight) {
        headerStyle.height = `${bodyRowHeight}px`
    }

    return columns ? (
        columns && columns.length ? (
            <Table
                responsive={responsive}
                className={`${tableClassName || ""}`}
            >
                <thead
                    className={`${headerClassName || ""}`}
                    style={headerStyle}
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
                                        className={`${(col && col.customLoaderCellClass) || ""}`}
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
                        className={`${bodyClassName || ""}`}
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
                                        IconTag = Icon[col.customLoadingWithIcon] || Icon["User"]
                                    }

                                    return (
                                        <Fragment
                                            key={`place-holder-body-content-${bodyIndex}`}
                                        >
                                            {!col.omit ? (
                                                <td
                                                    style={style}
                                                    className={`${(col && col.customLoaderCellClass) || ''}`}
                                                >
                                                    <div
                                                        className={`${(col && col.customLoaderContentClass) || ""}`}
                                                    >
                                                        {IconTag ? (
                                                            <div className="zindex-1">
                                                                <LoadingPlaceHolder extraStyles={{ width: '24px', height: '24px', position: 'absolute', borderRadius: '50%', zIndex: 1 }} />

                                                                <Avatar
                                                                    size={"sm"}
                                                                    imgWidth={30}
                                                                    imgHeight={30}
                                                                    className="me-50"
                                                                    icon={<IconTag size={17} />}
                                                                />
                                                            </div>
                                                        ) : null}

                                                        <LoadingPlaceHolder
                                                            extraStyles={(col && col.contentExtraStyles) || { height: '15px', borderRadius: '10px' }}
                                                        />
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
