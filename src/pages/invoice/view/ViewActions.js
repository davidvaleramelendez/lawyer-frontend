// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Card,
    Button,
    CardBody
} from 'reactstrap'

// Constant
import {
    adminRoot
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'


const ViewActions = ({
    invoiceItem,
    setPaymentModalOpen,
    setSendInvoiceModalOpen
}) => {

    return (
        <Card className="invoice-action-wrapper">
            <CardBody>
                <Button
                    block
                    color="primary"
                    className={`mb-75`}
                    disabled={invoiceItem && !invoiceItem.id}
                    onClick={() => setSendInvoiceModalOpen(true)}
                >
                    {T("Send invoice by e-mail")}
                </Button>

                <Button
                    block
                    outline
                    tag="a"
                    target="_blank"
                    color="secondary"
                    rel="noopener noreferrer"
                    className={`mb-75`}
                    href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${invoiceItem.pdf_path}`}
                    disabled={invoiceItem && !invoiceItem.id}
                    onClick={(event) => invoiceItem && !invoiceItem.pdf_path && event.preventDefault()}
                >
                    {T("Download")}
                </Button>

                <Button
                    block
                    outline
                    tag="a"
                    target="_blank"
                    color="secondary"
                    rel="noopener noreferrer"
                    className={`mb-75`}
                    href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${invoiceItem.pdf_path}`}
                    disabled={invoiceItem && !invoiceItem.id}
                    onClick={(event) => invoiceItem && !invoiceItem.pdf_path && event.preventDefault()}
                >
                    {T("Print out")}
                </Button>

                <Button
                    block
                    outline
                    tag={Link}
                    color="secondary"
                    className={`mb-75`}
                    to={`${adminRoot}/invoice/edit/${invoiceItem.id}`}
                    disabled={invoiceItem && !invoiceItem.id}
                >
                    {T("Edit")}
                </Button>

                <Button
                    block
                    color="success"
                    disabled={invoiceItem && !parseFloat(invoiceItem.remaining_amount)}
                    onClick={() => setPaymentModalOpen(true)}
                >
                    {T("Add Payment")}
                </Button>
            </CardBody>
        </Card>
    )
}

export default ViewActions
