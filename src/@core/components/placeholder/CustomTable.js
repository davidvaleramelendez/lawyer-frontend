/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Table
} from 'reactstrap'

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

    const bodyRowStyle = {}
    if (bodyRowHeight) {
        bodyRowStyle.height = `${bodyRowHeight}px`
    }

    return columns ? (
        columns && columns.length ? (
            <Fragment>
                <Table
                    responsive={responsive}
                    className={`w-100 ${tableClassName || ""}`}
                >
                    <thead
                        className={`${headerClassName || ""}`}
                        style={bodyRowStyle}
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
                            style={bodyRowStyle}
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

                                        let iconCustomStyle = { width: '32px', height: '32px' }
                                        const iconExtraStyles = { width: '32px', height: '32px', position: 'absolute', borderRadius: '50%', zIndex: 1 }
                                        if (col && col.customLoadingIconStyle) {
                                            iconCustomStyle = col.customLoadingIconStyle

                                            if (col.customLoadingIconStyle.width) {
                                                iconExtraStyles.width = col.customLoadingIconStyle.width
                                            }
                                            if (col.customLoadingIconStyle.height) {
                                                iconExtraStyles.height = col.customLoadingIconStyle.height
                                            }
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
                                                                    <LoadingPlaceHolder extraStyles={iconExtraStyles} />

                                                                    <Avatar
                                                                        size={"sm"}
                                                                        style={iconCustomStyle}
                                                                        className="me-50"
                                                                        icon={<IconTag size={17} />}
                                                                    />
                                                                </div>
                                                            ) : null}

                                                            {col && col.customRenderTwoRow ? (
                                                                <div className="">
                                                                    <LoadingPlaceHolder
                                                                        extraStyles={(col && col.contentExtraStylesRow1) || { height: '15px', borderRadius: '10px' }}
                                                                    />
                                                                    <LoadingPlaceHolder
                                                                        extraStyles={
                                                                            (col && col.contentExtraStylesRow2) || {
                                                                                height: '10px',
                                                                                borderRadius: '10px',
                                                                                marginTop: '3px'
                                                                            }
                                                                        }
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <LoadingPlaceHolder
                                                                    extraStyles={(col && col.contentExtraStyles) || { height: '15px', borderRadius: '10px' }}
                                                                />
                                                            )}

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
            </Fragment>
        ) : null
    ) : null
}

export default CustomTable
