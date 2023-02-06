// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Store & Actions
import {
    updateUserLoader,
    getDropboxApiTokenDetail,
    createUpdateDropboxApiToken
} from '@src/pages/user/store'
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
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Translation
import { T } from '@localization'

const DropboxApiToken = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** State
    const [loadFirst, setLoadFirst] = useState(true)

    const ApiTokenSchema = yup.object({
        client_id: yup.string().required(T('Client Id is required!')),
        secret: yup.string().required(T('Secret is required!')),
        token: yup.string().required(T('Token is required!'))
    }).required()

    /* Placeholder texts */
    const PlaceholderSchema = {
        client_id: T("Client Id"),
        secret: T("Secret"),
        token: T("Token"),
        access_type: T("Access Type")
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.dropboxApiTokenItem,
        resolver: yupResolver(ApiTokenSchema)
    })

    const handleReset = () => {
        reset(store.dropboxApiTokenItem)
    }

    useEffect(() => {
        if (loadFirst) {
            dispatch(getDropboxApiTokenDetail({}))
            setLoadFirst(false)
        }

        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "DROPBOX_API_TOKEN_DETAIL")) {
            handleReset()
        }
    }, [store.actionFlag, loadFirst])

    /* Submitting dropbox api token data */
    const onSubmit = (values) => {
        if (values) {
            const tokenData = {
                id: values.id,
                client_id: values.client_id,
                secret: values.secret,
                token: values.token,
                access_type: values.access_type
            }

            // console.log("onSubmit >>> ", tokenData, values)
            dispatch(updateUserLoader(false))
            dispatch(createUpdateDropboxApiToken(tokenData))
        }
    }
    /* /Submitting dropbox api token data */

    return (
        <Fragment>
            <Card>
                <CardBody className="pt-1">
                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Row>
                            <Col sm={4} className="mb-1">
                                <Label className="form-label" for="client_id">
                                    {T('Client Id')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="client_id"
                                    id="client_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.client_id} invalid={errors.client_id && true} />
                                    )}
                                />
                                <FormFeedback>{errors.client_id?.message}</FormFeedback>
                            </Col>

                            <Col sm={4} className="mb-1">
                                <Label className="form-label" for="secret">
                                    {T('Secret')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="secret"
                                    id="secret"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.secret} invalid={errors.secret && true} />
                                    )}
                                />
                                <FormFeedback>{errors.secret?.message}</FormFeedback>
                            </Col>

                            <Col sm={4} className="mb-1">
                                <Label className="form-label" for="access_type">
                                    {T('Access Type')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="access_type"
                                    id="access_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.access_type} invalid={errors.access_type && true} />
                                    )}
                                />
                                <FormFeedback>{errors.access_type?.message}</FormFeedback>
                            </Col>

                            <Col sm={12} className="mb-1">
                                <Label className="form-label" for="token">
                                    {T('Token')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="token"
                                    id="token"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="textarea" placeholder={PlaceholderSchema && PlaceholderSchema.token} invalid={errors.token && true} />
                                    )}
                                />
                                <FormFeedback>{errors.token?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <div className="d-flex flex-wrap mb-2 mt-2">
                            <Button
                                type="submit"
                                className="me-1"
                                color="primary"
                                disabled={!store.loading}
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

export default DropboxApiToken
