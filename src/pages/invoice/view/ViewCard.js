// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Table,
    CardBody,
    CardText
} from 'reactstrap'

// ** Custom Components
import LoadingPlaceHolder from '@components/loadingPlaceHolder/LoadingPlaceHolder'

// ** Translation
import { T } from '@localization'

const ViewCard = ({
    invoiceItem,
    companyItem,
    getDecimalFormat,
    getTransformDate
}) => {

    /* Net cost value */
    const onNetValueCost = (total = 0, vat = 0) => {
        return getDecimalFormat(total - vat)
    }
    /* /Net cost value */

    /* Contact two values */
    const concateTwoValue = (value1 = "", value2 = "") => {
        let name = ""
        if (value1) {
            name = value1
        }

        if (value2) {
            name = name ? `${name} ${value2}` : value2
        }

        return name
    }
    /* /Contact two values */

    return invoiceItem ? (
        <Card className="invoice-preview-card">
            <CardBody className="invoice-padding pb-0">
                {/* Header */}
                <div className={`d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0`}>
                    <div>
                        <div className="logo-wrapper">
                            <svg viewBox='0 0 139 95' version='1.1' height='24'>
                                <defs>
                                    <linearGradient id='invoice-linearGradient-1' x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%'>
                                        <stop stopColor='#000000' offset='0%'></stop>
                                        <stop stopColor='#FFFFFF' offset='100%'></stop>
                                    </linearGradient>
                                    <linearGradient
                                        id='invoice-linearGradient-2'
                                        x1='64.0437835%'
                                        y1='46.3276743%'
                                        x2='37.373316%'
                                        y2='100%'
                                    >
                                        <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                                        <stop stopColor='#FFFFFF' offset='100%'></stop>
                                    </linearGradient>
                                </defs>
                                <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                                    <g transform='translate(-400.000000, -178.000000)'>
                                        <g transform='translate(400.000000, 178.000000)'>
                                            <path
                                                className='text-primary'
                                                d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                                                style={{ fill: 'currentColor' }}
                                            ></path>
                                            <path
                                                d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                                                fill='url(#invoice-linearGradient-1)'
                                                opacity='0.2'
                                            ></path>
                                            <polygon
                                                fill='#000000'
                                                opacity='0.049999997'
                                                points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                                            ></polygon>
                                            <polygon
                                                fill='#000000'
                                                opacity='0.099999994'
                                                points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                                            ></polygon>
                                            <polygon
                                                fill='url(#invoice-linearGradient-2)'
                                                opacity='0.099999994'
                                                points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                                            ></polygon>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            <h3 className="text-primary invoice-logo">Logo</h3>
                        </div>
                        {invoiceItem && invoiceItem.id ? (
                            <CardText className={`mb-25`}>
                                {companyItem && companyItem.id ? concateTwoValue(companyItem.name, companyItem.last_name) : null}
                            </CardText>
                        ) : (
                            <LoadingPlaceHolder
                                customClassName="mb-25"
                                extraStyles={{
                                    height: "21px",
                                    width: 'max-content',
                                    minWidth: "150px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}

                        {companyItem && companyItem.id ? (
                            <Fragment>
                                <CardText className={`mb-25`}>
                                    {companyItem.address || ""}
                                    {companyItem.city ? `, ${companyItem.city || ""}` : ''}
                                </CardText>
                            </Fragment>
                        ) : (
                            <LoadingPlaceHolder
                                customClassName="mb-25"
                                extraStyles={{
                                    height: "21px",
                                    width: 'max-content',
                                    minWidth: "250px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}

                        {companyItem && companyItem.id ? (
                            <CardText className={`mb-0`}>
                                {companyItem.zip_code || ""}
                            </CardText>
                        ) : (
                            <LoadingPlaceHolder
                                customClassName="mb-25"
                                extraStyles={{
                                    height: "21px",
                                    width: 'max-content',
                                    minWidth: "100px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}
                    </div>

                    <div className="mt-md-0 mt-2">
                        <h4 className="invoice-title">
                            {invoiceItem && invoiceItem.id ? (
                                <Fragment>
                                    {T("Invoice")} <span className={`invoice-number`}>
                                        #{(invoiceItem && invoiceItem.invoice_no) || ""}
                                    </span>
                                </Fragment>
                            ) : (
                                <LoadingPlaceHolder
                                    extraStyles={{
                                        height: "22px",
                                        width: 'max-content',
                                        minWidth: "210px",
                                        borderRadius: "10px"
                                    }}
                                />
                            )}
                        </h4>

                        <div className="invoice-date-wrapper">
                            {invoiceItem && invoiceItem.id ? (
                                <Fragment>
                                    <p className="invoice-date-title">{T("Created")}:</p>
                                    <p className={`invoice-date`}>
                                        {(invoiceItem && invoiceItem.invoice_date && getTransformDate(invoiceItem.invoice_date, "DD.MM.YYYY")) || ""}
                                    </p>
                                </Fragment>
                            ) : (
                                <LoadingPlaceHolder
                                    extraStyles={{
                                        height: "21px",
                                        width: 'max-content',
                                        minWidth: "200px",
                                        borderRadius: "10px"
                                    }}
                                />
                            )}
                        </div>

                        <div className="invoice-date-wrapper">
                            {invoiceItem && invoiceItem.id ? (
                                <Fragment>
                                    <p className="invoice-date-title">{T("Maturity")}:</p>
                                    <p className={`invoice-date`}>
                                        {(invoiceItem && invoiceItem.invoice_due_date && getTransformDate(invoiceItem.invoice_due_date, "DD.MM.YYYY")) || ""}
                                    </p>
                                </Fragment>
                            ) : (
                                <LoadingPlaceHolder
                                    extraStyles={{
                                        height: "21px",
                                        width: 'max-content',
                                        minWidth: "200px",
                                        borderRadius: "10px"
                                    }}
                                />
                            )}
                        </div>

                        <div className="invoice-date-wrapper">
                            {invoiceItem && invoiceItem.id ? (
                                <Fragment>
                                    <p className="invoice-date-title">{T("Status")}:</p>
                                    <p className={`invoice-date text-capitalize`}>
                                        {(invoiceItem && invoiceItem.status) || ""}
                                    </p>
                                </Fragment>
                            ) : (
                                <LoadingPlaceHolder
                                    extraStyles={{
                                        height: "21px",
                                        width: 'max-content',
                                        minWidth: "160px",
                                        borderRadius: "10px"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className="invoice-spacing" />

            {/* Address and Contact */}
            <CardBody className="invoice-padding pt-0">
                <Row className={`invoice-spacing`}>
                    <Col xl={8} className="p-0">
                        <h6 className="mb-2">{T("Invoice to")}:</h6>
                        <h6 className={`mb-25`}>
                            {invoiceItem && invoiceItem.id ? (
                                (invoiceItem && invoiceItem.customer && invoiceItem.customer.name) || ""
                            ) : (
                                <LoadingPlaceHolder
                                    customClassName="mb-50"
                                    extraStyles={{
                                        height: "18px",
                                        width: 'max-content',
                                        minWidth: "140px",
                                        borderRadius: "10px"
                                    }}
                                />
                            )}
                        </h6>

                        {invoiceItem && invoiceItem.id ? (
                            <CardText className={`mb-25`}>
                                {(invoiceItem && invoiceItem.customer && invoiceItem.customer.email) || ""}
                            </CardText>
                        ) : (
                            <LoadingPlaceHolder
                                customClassName="mb-25"
                                extraStyles={{
                                    height: "18px",
                                    width: 'max-content',
                                    minWidth: "190px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}

                        {invoiceItem && invoiceItem.id ? (
                            <CardText className={`mb-25`}>
                                {(invoiceItem && invoiceItem.customer && invoiceItem.customer.Address) || ""}
                            </CardText>
                        ) : (
                            <LoadingPlaceHolder
                                customClassName="mb-25"
                                extraStyles={{
                                    height: "18px",
                                    width: 'max-content',
                                    minWidth: "190px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}

                        {invoiceItem && invoiceItem.id ? (
                            invoiceItem && invoiceItem.customer && invoiceItem.customer.Postcode ? (
                                <CardText className={`mb-25`}>
                                    {invoiceItem.customer.Postcode || ""}
                                </CardText>
                            ) : (
                                <CardText
                                    className={`mb-25`}
                                    style={{ height: '17px' }}
                                />
                            )
                        ) : (
                            <LoadingPlaceHolder
                                customClassName="mb-25"
                                extraStyles={{
                                    height: "18px",
                                    width: 'max-content',
                                    minWidth: "100px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}
                    </Col>

                    <Col xl={4} className="p-0 mt-xl-0 mt-2">
                        <h6 className="mb-2">{T("Payment details")}:</h6>
                        <table>
                            <tbody>
                                <tr>
                                    {invoiceItem && invoiceItem.id ? (
                                        <Fragment>
                                            <td>{T("Total")}:</td>
                                            <td>
                                                <span className={`fw-bold`}>
                                                    € {invoiceItem && invoiceItem.total_price && getDecimalFormat(invoiceItem.total_price)}
                                                </span>
                                            </td>
                                        </Fragment>
                                    ) : (
                                        <td>
                                            <LoadingPlaceHolder
                                                customClassName="mb-25"
                                                extraStyles={{
                                                    height: "18px",
                                                    width: 'max-content',
                                                    minWidth: "180px",
                                                    borderRadius: "10px"
                                                }}
                                            />
                                        </td>
                                    )}
                                </tr>

                                <tr>
                                    {invoiceItem && invoiceItem.id ? (
                                        <Fragment>
                                            <td className="">{T("Open amount")}:</td>
                                            <td>
                                                <span className={`fw-bold`}>
                                                    € {invoiceItem && invoiceItem.remaining_amount && getDecimalFormat(invoiceItem.remaining_amount)}
                                                </span>
                                            </td>
                                        </Fragment>
                                    ) : (
                                        <td>
                                            <LoadingPlaceHolder
                                                customClassName="mb-25"
                                                extraStyles={{
                                                    height: "18px",
                                                    width: 'max-content',
                                                    minWidth: "180px",
                                                    borderRadius: "10px",
                                                    marginTop: "2px"
                                                }}
                                            />
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </CardBody>
            {/* /Address and Contact */}

            {/* Invoice Description */}
            <Table responsive>
                <thead>
                    <tr>
                        <th>{T("Description")}</th>
                        <th className="d-flex justify-content-end">{T("Amount")}</th>
                    </tr>
                </thead>

                <tbody>
                    {invoiceItem && invoiceItem.items && invoiceItem.items.length ? <>
                        {invoiceItem.items.map((item, index) => (
                            <tr key={`item_${index}`}>
                                <td>
                                    {invoiceItem && invoiceItem.id ? (
                                        item.item_detail
                                    ) : (
                                        <LoadingPlaceHolder
                                            extraStyles={{
                                                height: "20px",
                                                width: 'max-content',
                                                minWidth: "210px",
                                                borderRadius: "10px"
                                            }}
                                        />
                                    )}
                                </td>

                                <td className="d-flex justify-content-end">
                                    {invoiceItem && invoiceItem.id ? (
                                        <Fragment>
                                            € {item.price && getDecimalFormat(item.price)}
                                        </Fragment>
                                    ) : (
                                        <LoadingPlaceHolder
                                            extraStyles={{
                                                height: "20px",
                                                width: 'max-content',
                                                minWidth: "80px",
                                                borderRadius: "10px"
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </> : null}
                </tbody>
            </Table>
            {/* /Invoice Description */}

            {/* Total & Sales Person */}
            <CardBody className="invoice-padding pb-0">
                <Row className={`invoice-sales-total-wrapper`}>
                    <Col className="mt-md-0 mt-3" md={6} order={{ md: 1, lg: 2 }} />
                    <Col className="d-flex justify-content-end" md={6} order={{ md: 2, lg: 1 }}>
                        <div className="invoice-total-wrapper">
                            <div className="invoice-total-item">
                                {invoiceItem && invoiceItem.id ? (
                                    <Fragment>
                                        <p className="invoice-total-title">{T("Net")}:</p>
                                        <p className={`invoice-total-amount`}>
                                            € {onNetValueCost(invoiceItem && invoiceItem.total_price, invoiceItem && invoiceItem.vat)}
                                        </p>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "20px",
                                            width: 'max-content',
                                            minWidth: "170px",
                                            borderRadius: "10px"
                                        }}
                                    />
                                )}
                            </div>

                            <div className="invoice-total-item">
                                {invoiceItem && invoiceItem.id ? (
                                    <Fragment>
                                        <p className="invoice-total-title text-uppercase">{T("Vat")} 19 %</p>
                                        <p className={`invoice-total-amount`}>
                                            € {invoiceItem && invoiceItem.vat && getDecimalFormat(invoiceItem.vat)}
                                        </p>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "20px",
                                            width: 'max-content',
                                            minWidth: "170px",
                                            borderRadius: "10px",
                                            marginTop: '6px'
                                        }}
                                    />
                                )}
                            </div>
                            <hr className="my-50" />

                            <div className="invoice-total-item">
                                {invoiceItem && invoiceItem.id ? (
                                    <Fragment>
                                        <p className="invoice-total-title">{T("Total")}:</p>
                                        <p className={`invoice-total-amount`}>
                                            € {invoiceItem && invoiceItem.total_price && getDecimalFormat(invoiceItem.total_price)}
                                        </p>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "21px",
                                            width: 'max-content',
                                            minWidth: "170px",
                                            borderRadius: "10px"
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>

            <hr className="invoice-spacing" />

            <CardBody className="invoice-padding pt-0">
                <Row className="invoice-preview">
                    <Col xl={12} md={12} sm={12} />
                </Row>
            </CardBody>
        </Card>
    ) : null
}

export default ViewCard