/* eslint-disable object-shorthand */

// ** Icons Import
import * as Icon from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

const CustomTable = ({
    bodyClassName = "",
    columns,
    bodyRows = 3
    // bodyRowHeight = 40
}) => {

    return columns ? (
        columns && columns.length ? (
            bodyRows ? (
                <div
                    role="rowgroup"
                    className={`rdt_TableBody flex-column ${bodyClassName}`}
                >
                    {Array.from(Array(bodyRows).keys(), (row, index) => (
                        <div
                            role="row"
                            id={`row-${index + 1}`}
                            key={`place-holder-body-${index}`}
                            className={`rdt_TableRow d-flex`}
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

                                let IconTag = ""
                                if (col && col.customLoadingWithIcon) {
                                    IconTag = Icon[col.customLoadingWithIcon] || Icon["User"]
                                }

                                return (
                                    !col.omit ? (
                                        <div
                                            key={`place-holder-body-content-${bodyIndex}`}
                                            style={style}
                                            role="gridcell"
                                            data-column-id={`${bodyIndex + 1}`}
                                            id={`cell-${bodyIndex + 1}-${index + 1}`}
                                            className={`rdt_TableCell placeholder-glow ${col && col.customLoaderCellClass ? col.customLoaderCellClass : ''}`}
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
                                                className={`placeholder ${col && col.customLoaderContentClass ? col.customLoaderContentClass : 'w-100'}`}
                                            />
                                        </div>
                                    ) : null
                                )
                            })}
                        </div>
                    ))}
                </div>
            ) : null
        ) : null
    ) : null
}

export default CustomTable
