// Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
    Card,
    Table,
    CardBody,
    CardHeader
} from 'reactstrap'

const PaymentHistory = ({
    invoiceItem,
    getDecimalFormat,
    getTransformDate
}) => {
    // ** Hooks
    const { t } = useTranslation()

    return (
        <Card className="invoice-action-wrapper">
            <CardHeader>
                <h4>{t("Payment History")}</h4>
            </CardHeader>

            <CardBody>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th className="text-left">{t("Amount")}</th>
                            <th className="text-center">{t("Note")}</th>
                            <th className="text-center">{t("Date")}</th>
                        </tr>
                    </thead>
                    {invoiceItem && invoiceItem.payments && invoiceItem.payments.length ? <>
                        <tbody>
                            {invoiceItem.payments.map((payment, index) => (
                                <tr key={`payment_${index}`}>
                                    <td className="text-left">€ {payment.paid_amount && getDecimalFormat(payment.paid_amount)}</td>
                                    <td className="text-center">{payment.note}</td>
                                    <td className="text-center">{payment.date && getTransformDate(payment.date, "DD.MM.YYYY")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </> : null}
                    <tbody>
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    )
}

export default PaymentHistory
