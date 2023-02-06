// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Store & Actions
import {
    getPdfApiDetail,
    updateUserLoader,
    createUpdatePdfApi
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

const PdfApiToken = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** State
    const [loadFirst, setLoadFirst] = useState(true)

    const PdfApiSchema = yup.object({
        key: yup.string().required(T('Key is required!'))
    }).required()

    /* Placeholder texts */
    const PlaceholderSchema = {
        key: "Key"
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.pdfApiItem,
        resolver: yupResolver(PdfApiSchema)
    })

    const handleReset = () => {
        reset(store.pdfApiItem)
    }

    useEffect(() => {
        if (loadFirst) {
            dispatch(getPdfApiDetail({}))
            setLoadFirst(false)
        }

        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "PDF_API_DETAIL")) {
            handleReset()
        }
    }, [store.actionFlag, loadFirst])

    /* Submitting pdf api data */
    const onSubmitPdfApi = (values) => {
        if (values) {
            const pdfApiData = {
                key: values.key
            }

            // console.log("onSubmitPdfApi >>> ", pdfApiData)
            dispatch(updateUserLoader(false))
            dispatch(createUpdatePdfApi(pdfApiData))
        }
    }
    /* /Submitting pdf api data */

    return (
        <Fragment>
            <Card>
                <CardBody className="pt-1">
                    <Form onSubmit={handleSubmit(onSubmitPdfApi)} autoComplete="off">
                        <Row>
                            <Col sm={12} className="mb-1">
                                <Label className="form-label" for="key">
                                    {T('Key')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="key"
                                    id="key"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="textarea" placeholder={PlaceholderSchema && PlaceholderSchema.key} invalid={errors.key && true} />
                                    )}
                                />
                                <FormFeedback>{errors.key?.message}</FormFeedback>
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

export default PdfApiToken
