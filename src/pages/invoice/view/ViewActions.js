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
            <CardBody
                className={`${invoiceItem && invoiceItem.id ? '' : 'placeholder-glow'}`}
            >
                <Button
                    block
                    color="primary"
                    className={`mb-75 ${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
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
                    className={`mb-75 ${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
                    href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${invoiceItem.pdf_path}`}
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
                    className={`mb-75 ${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
                    href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${invoiceItem.pdf_path}`}
                    onClick={(event) => invoiceItem && !invoiceItem.pdf_path && event.preventDefault()}
                >
                    {T("Print out")}
                </Button>

                <Button
                    block
                    outline
                    tag={Link}
                    color="secondary"
                    className={`mb-75 ${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
                    to={`${adminRoot}/invoice/edit/${invoiceItem.id}`}
                >
                    {T("Edit")}
                </Button>

                {invoiceItem && parseFloat(invoiceItem.remaining_amount) ? (
                    <Button
                        block
                        color="success"
                        className={`${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
                        onClick={() => setPaymentModalOpen(true)}
                    >
                        {T("Add Payment")}
                    </Button>
                ) : null}
            </CardBody>
        </Card>
    )
}

export default ViewActions
