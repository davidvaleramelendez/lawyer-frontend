// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Store & Actions
import {
    saveAccountImap
} from '../store'
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

// Translation
import { useTranslation } from 'react-i18next'

const ImapTab = ({
}) => {
    /* Hook */
    const { t } = useTranslation()

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    /* imap => Imap information */
    const {
        reset: imapReset,
        control: imapControl,
        handleSubmit: imapHandleSubmit,
        formState: { errors: imapErrors }
    } = useForm({
        mode: 'all',
        defaultValues: store.userItem
    })

    /* Validation rules */
    const PlaceholderSchema = {
        imapName: "",
        imapEmail: "",
        imap_host: "",
        imap_port: "",
        imap_ssl: "",
        imap_email: "",
        imap_password: ""
    }

    const handleReset = () => {
        const userItem = { ...store.userItem }
        if (userItem && userItem.id) {
            if (userItem.name) {
                userItem.imapName = userItem.name
            }

            if (userItem.email) {
                userItem.imapEmail = userItem.email
            }
        }

        if (store.imapItem && store.imapItem.id) {
            if (store.imapItem.imap_host) {
                userItem.imap_host = store.imapItem.imap_host
            }

            if (store.imapItem.imap_port) {
                userItem.imap_port = store.imapItem.imap_port
            }

            if (store.imapItem.imap_ssl) {
                userItem.imap_ssl = store.imapItem.imap_ssl
            }

            if (store.imapItem.imap_email) {
                userItem.imap_email = store.imapItem.imap_email
            }

            if (store.imapItem.imap_password) {
                userItem.imap_password = store.imapItem.imap_password
            }
        }

        imapReset(userItem)
    }

    useEffect(() => {
        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "ACCOUNT_SETTING")) {
            handleReset()
        }
    }, [store.actionFlag])

    /* Submitting Imap Information data */
    const onSubmitImapInfo = (values) => {
        if (values) {
            const userData = {
                UserID: store.userItem.id,
                imap_host: values.imap_host,
                imap_email: values.imap_email,
                imap_password: values.imap_password,
                imap_port: values.imap_port,
                imap_ssl: values.imap_ssl
            }
            dispatch(saveAccountImap(userData))
        }
    }

    return (
        <Fragment>
            <Card className="user-edit-card">
                <CardBody className="user-edit-card-body pl-4 pr-4">
                    <Form id="imap" onSubmit={imapHandleSubmit(onSubmitImapInfo)} autoComplete="off">
                        <Row>
                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imapName">
                                    Name
                                </Label>
                                <Controller
                                    defaultValue={store.userItem && store.userItem.name}
                                    id="imapName"
                                    name="imapName"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imapName} invalid={imapErrors.imapName && true} readOnly />
                                    )}
                                />
                                <FormFeedback>{imapErrors.imapName?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imapEmail">
                                    Email
                                </Label>
                                <Controller
                                    defaultValue={store.userItem && store.userItem.email}
                                    id="imapEmail"
                                    name="imapEmail"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imapEmail} invalid={imapErrors.imapEmail && true} readOnly />
                                    )}
                                />
                                <FormFeedback>{imapErrors.imapEmail?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_host">
                                    IMAP Host
                                </Label>
                                <Controller
                                    defaultValue={store.imapItem && store.imapItem.imap_host ? store.imapItem.imap_host : ""}
                                    id="imap_host"
                                    name="imap_host"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imap_host} invalid={imapErrors.imap_host && true} />
                                    )}
                                />
                                <FormFeedback>{imapErrors.imap_host?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_port">
                                    IMAP Port
                                </Label>
                                <Controller
                                    defaultValue={store.imapItem && store.imapItem.imap_port ? store.imapItem.imap_port : ""}
                                    id="imap_port"
                                    name="imap_port"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imap_port} invalid={imapErrors.imap_port && true} />
                                    )}
                                />
                                <FormFeedback>{imapErrors.imap_port?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_ssl">
                                    Secure
                                </Label>
                                <Controller
                                    defaultValue={store.imapItem && store.imapItem.imap_ssl ? store.imapItem.imap_ssl : ""}
                                    id="imap_ssl"
                                    name="imap_ssl"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <div className="form-check">
                                            <Input
                                                {...field}
                                                type="checkbox"
                                                id="imap_ssl"
                                                checked={field?.value}
                                            />
                                            <Label for="imap_ssl" className="form-check-label">
                                                Use SSL
                                            </Label>
                                        </div>
                                    )}
                                />
                                <FormFeedback>{imapErrors.imap_ssl?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_email">
                                    IMAP Email
                                </Label>
                                <Controller
                                    defaultValue={store.imapItem && store.imapItem.imap_email ? store.imapItem.imap_email : ""}
                                    id="imap_email"
                                    name="imap_email"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.imap_email} invalid={imapErrors.imap_email && true} />
                                    )}
                                />
                                <FormFeedback>{imapErrors.imap_email?.message}</FormFeedback>
                            </Col>

                            <Col xl={4} md={4} sm={4} className="mb-1">
                                <Label className="form-label" for="imap_password">
                                    IMAP Password
                                </Label>
                                <Controller
                                    defaultValue={store.imapItem && store.imapItem.imap_password ? store.imapItem.imap_password : ""}
                                    id="imap_password"
                                    name="imap_password"
                                    control={imapControl}
                                    render={({ field }) => (
                                        <Input {...field} type="password" autoComplete="off" placeholder={PlaceholderSchema && PlaceholderSchema.imap_password} invalid={imapErrors.imap_password && true} />
                                    )}
                                />
                                <FormFeedback>{imapErrors.imap_password?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <div className="d-flex flex-wrap mb-2 mt-2">
                            <Button
                                type="submit"
                                color="primary"
                            >
                                {t("Save Change")}
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default ImapTab