// Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Table,
    CardBody,
    CardText
} from 'reactstrap'

const ViewCard = ({
    invoiceItem,
    getDecimalFormat,
    getTransformDate
}) => {
    // ** Hooks
    const { t } = useTranslation()

    const onNetValueCost = (total = 0, vat = 0) => {
        return getDecimalFormat(total - vat)
    }

    return invoiceItem ? (
        <Card className="invoice-preview-card">
            <CardBody className="invoice-padding pb-0">
                {/* Header */}
                <div
                    className={`d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0 ${invoiceItem && invoiceItem.id ? '' : 'placeholder-glow'}`}
                >
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
                        <CardText
                            className={`mb-25 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                        >
                            {invoiceItem && invoiceItem.user_data && invoiceItem.user_data.name}
                        </CardText>

                        <CardText
                            className={`mb-25 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                        >
                            {invoiceItem && invoiceItem.user_data && invoiceItem.user_data.id ? <>
                                {invoiceItem.user_data.Address},
                                {invoiceItem.user_data.State}
                            </> : "N/A"}
                        </CardText>

                        <CardText
                            className={`mb-0 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                        >
                            {invoiceItem && invoiceItem.user_data && invoiceItem.user_data.Contact ? invoiceItem.user_data.Contact : "N/A"}
                        </CardText>
                    </div>

                    <div className="mt-md-0 mt-2">
                        <h4 className="invoice-title">
                            {t("Invoice")} <span className={`invoice-number ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}>
                                #{invoiceItem && invoiceItem.invoice_no}
                            </span>
                        </h4>

                        <div className="invoice-date-wrapper">
                            <p className="invoice-date-title">{t("Created")}:</p>
                            <p
                                className={`invoice-date ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                            >
                                {invoiceItem && invoiceItem.invoice_date && getTransformDate(invoiceItem.invoice_date, "DD.MM.YYYY")}
                            </p>
                        </div>

                        <div className="invoice-date-wrapper">
                            <p className="invoice-date-title">{t("Maturity")}:</p>
                            <p
                                className={`invoice-date ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                            >
                                {invoiceItem && invoiceItem.invoice_due_date && getTransformDate(invoiceItem.invoice_due_date, "DD.MM.YYYY")}
                            </p>
                        </div>

                        <div className="invoice-date-wrapper">
                            <p className="invoice-date-title">{t("Status")}:</p>
                            <p
                                className={`invoice-date text-capitalize ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                            >
                                {invoiceItem && invoiceItem.status}
                            </p>
                        </div>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className="invoice-spacing" />

            {/* Address and Contact */}
            <CardBody className="invoice-padding pt-0">
                <Row
                    className={`invoice-spacing ${invoiceItem && invoiceItem.id ? '' : 'placeholder-glow'}`}
                >
                    <Col
                        xl={8}
                        className="p-0"
                    >
                        <h6 className="mb-2">{t("Invoice to")}:</h6>
                        <h6
                            className={`mb-25 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-50'}`}
                        >
                            {invoiceItem && invoiceItem.customer && invoiceItem.customer.name}
                        </h6>

                        <CardText
                            className={`mb-25 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-75'}`}
                        >
                            {invoiceItem && invoiceItem.customer && invoiceItem.customer.email}
                        </CardText>

                        <CardText
                            className={`mb-25 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-75'}`}
                        >
                            {invoiceItem && invoiceItem.customer && invoiceItem.customer.Address}
                        </CardText>

                        <CardText
                            className={`mb-25 ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-50'}`}
                        >
                            {invoiceItem && invoiceItem.customer && invoiceItem.customer.Postcode}
                        </CardText>
                    </Col>

                    <Col
                        xl={4}
                        className="p-0 mt-xl-0 mt-2"
                    >
                        <h6 className="mb-2">{t("Payment details")}:</h6>
                        <table>
                            <tbody>
                                <tr>
                                    <td>{t("Total")}:</td>
                                    <td>
                                        <span
                                            className={`fw-bold ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                                        >
                                            € {invoiceItem && invoiceItem.total_price && getDecimalFormat(invoiceItem.total_price)}
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="">{t("Open amount")}:</td>
                                    <td>
                                        <span
                                            className={`fw-bold ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-100'}`}
                                        >
                                            € {invoiceItem && invoiceItem.remaining_amount && getDecimalFormat(invoiceItem.remaining_amount)}
                                        </span>
                                    </td>
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
                        <th>{t("Description")}</th>
                        <th className="d-flex justify-content-end">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceItem && invoiceItem.items && invoiceItem.items.length ? <>
                        {invoiceItem.items.map((item, index) => (
                            <tr key={`item_${index}`}>
                                <td>
                                    {item.item_detail}
                                </td>

                                <td className="d-flex justify-content-end">
                                    € {item.price && getDecimalFormat(item.price)}
                                </td>
                            </tr>
                        ))}
                    </> : null}
                </tbody>
            </Table>
            {/* /Invoice Description */}

            {/* Total & Sales Person */}
            <CardBody className="invoice-padding pb-0">
                <Row
                    className={`invoice-sales-total-wrapper ${invoiceItem && invoiceItem.id ? '' : 'placeholder-glow'}`}
                >
                    <Col className="mt-md-0 mt-3" md={6} order={{ md: 1, lg: 2 }} />
                    <Col className="d-flex justify-content-end" md={6} order={{ md: 2, lg: 1 }}>
                        <div className="invoice-total-wrapper">
                            <div className="invoice-total-item">
                                <p className="invoice-total-title">{t("Net")}:</p>
                                <p
                                    className={`invoice-total-amount ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    € {onNetValueCost(invoiceItem && invoiceItem.total_price, invoiceItem && invoiceItem.vat)}
                                </p>
                            </div>

                            <div className="invoice-total-item">
                                <p className="invoice-total-title text-uppercase">{t("Vat")} 19 %</p>
                                <p
                                    className={`invoice-total-amount ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    € {invoiceItem && invoiceItem.vat && getDecimalFormat(invoiceItem.vat)}
                                </p>
                            </div>
                            <hr className="my-50" />

                            <div className="invoice-total-item">
                                <p className="invoice-total-title">{("Total")}:</p>
                                <p
                                    className={`invoice-total-amount ${invoiceItem && invoiceItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    € {invoiceItem && invoiceItem.total_price && getDecimalFormat(invoiceItem.total_price)}
                                </p>
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