// ** React Imports
import { Link } from 'react-router-dom'

// Translation
import { useTranslation } from 'react-i18next'

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

const ViewActions = ({
    invoiceItem,
    setPaymentModalOpen,
    setSendInvoiceModalOpen
}) => {
    // ** Hooks
    const { t } = useTranslation()

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
                    {t("Send invoice by e-mail")}
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
                    {t("Download")}
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
                    {t("Print out")}
                </Button>

                <Button
                    block
                    outline
                    tag={Link}
                    color="secondary"
                    className={`mb-75 ${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
                    to={`${adminRoot}/invoice/edit/${invoiceItem.id}`}
                >
                    {t("Edit")}
                </Button>

                {invoiceItem && parseFloat(invoiceItem.remaining_amount) ? (
                    <Button
                        block
                        color="success"
                        className={`${invoiceItem && invoiceItem.id ? '' : 'placeholder'}`}
                        onClick={() => setPaymentModalOpen(true)}
                    >
                        {t("Add")} {t("Payment")}
                    </Button>
                ) : null}
            </CardBody>
        </Card>
    )
}

export default ViewActions
