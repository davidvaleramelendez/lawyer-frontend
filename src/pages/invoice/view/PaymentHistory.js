// ** Reactstrap Imports
import {
    Card,
    Table,
    CardBody,
    CardHeader
} from 'reactstrap'

// ** Translation
import { T } from '@localization'

const PaymentHistory = ({
    invoiceItem,
    getDecimalFormat,
    getTransformDate
}) => {

    return (
        <Card className="invoice-action-wrapper">
            <CardHeader>
                <h4>{T("Payment History")}</h4>
            </CardHeader>

            <CardBody>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th className="text-left">{T("Amount")}</th>
                            <th className="text-center">{T("Note")}</th>
                            <th className="text-center">{T("Date")}</th>
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
