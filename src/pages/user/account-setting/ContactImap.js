// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Store & Actions
import {
    createUpdateContactImap,
    clearContactMessage
} from '@src/pages/contact/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Form,
    Label,
    Input,
    Button,
    CardBody,
    FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Translation
import { T } from '@localization'

const ContactImap = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.contact)

    /* imap => Imap information */
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.inquiryImapItem
    })

    /* Validation rules */
    const PlaceholderSchema = {
        imap_host: "",
        imap_port: "",
        imap_ssl: "",
        imap_email: "",
        imap_password: ""
    }

    const handleReset = () => {
        reset(store.inquiryImapItem)
    }

    useEffect(() => {
        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "CONTACT_IMAP")) {
            handleReset()
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearContactMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag])

    /* Submitting Imap Information data */
    const onSubmitImapInfo = (values) => {
        if (values) {
            const contactImapData = {
                imap_host: values.imap_host,
                imap_email: values.imap_email,
                imap_password: values.imap_password,
                imap_port: values.imap_port,
                imap_ssl: values.imap_ssl
            }

            dispatch(createUpdateContactImap(contactImapData))
        }
    }

    return (
        <Fragment>
            <Card className="user-edit-card">
                <CardBody className="user-edit-card-body pl-4 pr-4">
                    <Form id="imap" onSubmit={handleSubmit(onSubmitImapInfo)} autoComplete="off">
                        <Row>
                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_host">
                                    {T('IMAP Host')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="imap_host"
                                    name="imap_host"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imap_host} invalid={errors.imap_host && true} />
                                    )}
                                />
                                <FormFeedback>{errors.imap_host?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_port">
                                    {T('IMAP Port')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="imap_port"
                                    name="imap_port"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imap_port} invalid={errors.imap_port && true} />
                                    )}
                                />
                                <FormFeedback>{errors.imap_port?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_ssl">
                                    {T('Secure')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="imap_ssl"
                                    name="imap_ssl"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="form-check">
                                            <Input
                                                {...field}
                                                type="checkbox"
                                                id="imap_ssl"
                                                checked={field?.value}
                                            />
                                            <Label for="imap_ssl" className="form-check-label">
                                                {T('Use SSL')}
                                            </Label>
                                        </div>
                                    )}
                                />
                                <FormFeedback>{errors.imap_ssl?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_email">
                                    {T('IMAP Email')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="imap_email"
                                    name="imap_email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imap_email} invalid={errors.imap_email && true} />
                                    )}
                                />
                                <FormFeedback>{errors.imap_email?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_password">
                                    {T('IMAP Password')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="imap_password"
                                    name="imap_password"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="password" autoComplete="off" placeholder={PlaceholderSchema && PlaceholderSchema.imap_password} invalid={errors.imap_password && true} />
                                    )}
                                />
                                <FormFeedback>{errors.imap_password?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <div className="mb-2 mt-2">
                            <Button
                                type="submit"
                                color="primary"
                            >
                                {T("Save Change")}
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default ContactImap