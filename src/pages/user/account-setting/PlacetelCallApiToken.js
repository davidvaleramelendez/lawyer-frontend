// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Store & Actions
import {
    updateUserLoader,
    getPlacetelCallApiTokenDetail,
    createUpdatePlacetelCallApiToken
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

const PlacetelCallApiToken = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** State
    const [loadFirst, setLoadFirst] = useState(true)

    const ApiTokenSchema = yup.object({
        token: yup.string().required(T('Token is required!'))
    }).required()

    /* Placeholder texts */
    const PlaceholderSchema = {
        token: "Token"
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.placetelCallApiTokenItem,
        resolver: yupResolver(ApiTokenSchema)
    })

    const handleReset = () => {
        reset(store.placetelCallApiTokenItem)
    }

    useEffect(() => {
        if (loadFirst) {
            dispatch(getPlacetelCallApiTokenDetail({}))
            setLoadFirst(false)
        }

        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "PLACETEL_CALL_API_TOKEN_DETAIL")) {
            handleReset()
        }
    }, [store.actionFlag, loadFirst])

    /* Submitting placetel call api token data */
    const onSubmitPdfApi = (values) => {
        if (values) {
            const tokenData = {
                token: values.token
            }

            // console.log("onSubmitPdfApi >>> ", tokenData)
            dispatch(updateUserLoader(false))
            dispatch(createUpdatePlacetelCallApiToken(tokenData))
        }
    }
    /* /Submitting placetel call api token data */

    return (
        <Fragment>
            <Card>
                <CardBody className="pt-1">
                    <Form onSubmit={handleSubmit(onSubmitPdfApi)} autoComplete="off">
                        <Row>
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

export default PlacetelCallApiToken
