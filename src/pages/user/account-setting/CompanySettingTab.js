// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Store & Actions
import {
    createUpdateCompany
} from '@src/pages/user/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Translation
import { T } from '@localization'

// ** Reactstrap Imports
import {
    Row,
    Col,
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

const CompanySettingTab = ({
}) => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    /* Validation rules */
    const CompanySchema = yup.object({
        name: yup.string().required(`${T("Name is required!")}`),
        last_name: yup.string().required(`${T("Last Name is required!")}`),
        address: yup.string().required(`${T("Address is required!")}`),
        zip_code: yup.string().required(`${T("Zip code is required!")}`).min(4, "Zip code must be minimum 4 digit!").max(8, "Zip code must be 8 digit!"),
        city: yup.string().required(`${T("City is required!")}`)
    }).required()

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.companyItem,
        resolver: yupResolver(CompanySchema)
    })

    /* Placeholder texts */
    const PlaceholderSchema = {
        company: `${T("Company")}`,
        name: `${T("Name")}`,
        lastName: `${T("Last Name")}`,
        address: `${T("Address")}`,
        zipCode: `${T("Zip code")}`,
        city: `${T("City")}`
    }

    const handleReset = () => {
        const companyItem = { ...store.companyItem }
        companyItem.company = companyItem.company || ""
        companyItem.name = companyItem.name || ""
        companyItem.last_name = companyItem.last_name || ""
        companyItem.address = companyItem.address || ""
        companyItem.city = companyItem.city || ""
        companyItem.zip_code = companyItem.zip_code || ""
        reset(companyItem)
    }

    useEffect(() => {
        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "COMPANY_DETAIL")) {
            handleReset()
        }
    }, [store.actionFlag])

    const onSubmitCompany = (values) => {
        if (values) {
            const companyData = {
                id: values.id,
                company: values.company,
                name: values.name,
                last_name: values.last_name,
                address: values.address,
                city: values.city,
                zip_code: values.zip_code
            }

            dispatch(createUpdateCompany(companyData))
        }
    }

    return (
        <Fragment>
            <Card className="user-edit-card">
                <CardBody className="user-edit-card-body pl-4 pr-4">
                    <Form
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmitCompany)}
                    >
                        <Row>
                            <Col xl={12} md={12} sm={12} className="mb-1">
                                <Label className="form-label" for="company">
                                    {T("Company")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="company"
                                    id="company"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.company} invalid={errors.company && true} />
                                    )}
                                />
                                <FormFeedback>{errors.company?.message}</FormFeedback>
                            </Col>

                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="name">
                                    {T("Name")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="name"
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.name} invalid={errors.name && true} />
                                    )}
                                />
                                <FormFeedback>{errors.name?.message}</FormFeedback>
                            </Col>

                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="last_name">
                                    {T("Last Name")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="last_name"
                                    name="last_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.lastName} invalid={errors.last_name && true} />
                                    )}
                                />
                                <FormFeedback>{errors.last_name?.message}</FormFeedback>
                            </Col>

                            <Col xl={12} md={12} sm={12} className="mb-1">
                                <Label className="form-label" for="address">
                                    {T("Address")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="address"
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.address} invalid={errors.address && true} />
                                    )}
                                />
                                <FormFeedback>{errors.address?.message}</FormFeedback>
                            </Col>

                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="zip_code">
                                    {T("Zipcode")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="zip_code"
                                    name="zip_code"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.zipCode} invalid={errors.zip_code && true} />
                                    )}
                                />
                                <FormFeedback>{errors.zip_code?.message}</FormFeedback>
                            </Col>

                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="city">
                                    {T("City")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="city"
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.city} invalid={errors.city && true} />
                                    )}
                                />
                                <FormFeedback>{errors.city?.message}</FormFeedback>
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
export default CompanySettingTab