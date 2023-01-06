// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Store & Actions
import {
    saveAccount
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

// ** Icons Import
import {
} from 'react-feather'

const AccountTab = ({
    userData,
    languages,
    selLanguage,
    setSelLanguage,
    getCurrentUser,
    onImageSrcError
}) => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** State
    const [imageUrl, setImageUrl] = useState("")

    /* Validation rules */
    const AccountSchema = yup.object({
        first_name: yup.string().required(T('Name is required!')),
        last_name: yup.string().required(T('Last name is required!')),
        email: yup.string().required(`${T("Email is required!")}`).email('Invalid email address!')
    }).required()

    /* acnt => account */
    const {
        reset: acntReset,
        control: acntControl,
        handleSubmit: acntHandleSubmit,
        formState: { errors: acntErrors }
    } = useForm({
        mode: 'all',
        defaultValues: store.userItem,
        resolver: yupResolver(AccountSchema)
    })

    /* Placeholder texts */
    const PlaceholderSchema = {
        name: "John Doe",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        company: "Company"
    }

    const handleReset = () => {
        const userItem = { ...store.userItem }
        if (userItem && userItem.id) {
            if (userItem.Company) {
                userItem.company = userItem.Company
            }
        }
        acntReset(userItem)
    }

    useEffect(() => {
        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "ACCOUNT_SETTING")) {
            handleReset()
        }
    }, [store.actionFlag])

    const onFileChange = (event) => {
        const fileReader = new FileReader()
        const files = event.target.files

        if (files && files.length > 0) {
            fileReader.onloadend = async () => {
                setImageUrl(fileReader.result)
            }
            fileReader.readAsDataURL(files[0])
        }
    }

    const onLanguageChange = (event) => {
        setSelLanguage(event.target.value)
    }

    /* Submitting Account data */
    const onSubmitAccount = (values) => {
        if (values) {
            const userData = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                Company: values.company,
                language: selLanguage
            }

            if (imageUrl) {
                userData.image = imageUrl
            }

            // console.log("onSubmitAccount >>>>>>>>> ", userData)
            dispatch(saveAccount(userData))
        }
    }

    /* Check admin role permission */
    const checkAdminRoleAccess = () => {
        const currentUser = getCurrentUser()

        if (store.userItem && store.userItem.role_id === 10) {
            return true
        } else if (currentUser && currentUser.role_id === 10) {
            return true
        }

        return false
    }
    /* /Check admin role permission */

    return (
        <Fragment>
            <Card className="user-edit-card">
                <CardBody className="user-edit-card-body pl-4 pr-4">
                    <Form id="account" onSubmit={acntHandleSubmit(onSubmitAccount)} autoComplete="off">
                        <Row>
                            <Col xl={12} md={12} sm={12}>
                                <div className="d-flex mb-2">
                                    <div className="me-25">
                                        <img
                                            className="rounded me-50"
                                            id="user-image"
                                            src={imageUrl ? imageUrl : store.userItem && store.userItem.profile_photo_path ? `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.userItem.profile_photo_path}` : `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
                                            onError={(currentTarget) => onImageSrcError(currentTarget)}
                                            alt="user-avatar"
                                            height="100"
                                            width="100"
                                        />
                                    </div>

                                    <div className="d-flex mt-75 ms-1">
                                        <div>
                                            <h4 className="mb-50">
                                                {(store.userItem && store.userItem.name) || (userData && userData.name) || ""}
                                            </h4>

                                            <Button
                                                size="sm"
                                                tag={Label}
                                                type="button"
                                                color="primary"
                                                className="mb-75 me-75"
                                            >
                                                {T('Change')}
                                                <Input type="file" hidden accept="image/*" onChange={(event) => onFileChange(event)} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="first_name">
                                    {T('Name')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="first_name"
                                    id="first_name"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.first_name} invalid={acntErrors.first_name && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.first_name?.message}</FormFeedback>
                            </Col>

                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="last_name">
                                    {T('Last Name')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="last_name"
                                    name="last_name"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.last_name} invalid={acntErrors.last_name && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.last_name?.message}</FormFeedback>
                            </Col>

                            <Col xl={6} md={6} sm={6} className="mb-1">
                                <Label className="form-label" for="email">
                                    {T("Email")}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem && store.userItem.email}
                                    name="email"
                                    id="email"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.email} invalid={acntErrors.email && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.email?.message}</FormFeedback>
                            </Col>

                            {checkAdminRoleAccess() ? (
                                <Col xl={6} md={6} sm={6} className="mb-1">
                                    <label className="form-label" htmlFor="language-select">{T('Language')}</label>
                                    <Input
                                        type="select"
                                        name="language"
                                        id="language"
                                        value={selLanguage || ""}
                                        onChange={onLanguageChange}
                                    >
                                        {languages && languages.length ? (<>
                                            {languages.map((item, index) => (
                                                <option key={`row-${index}`} value={item}>{item}</option>
                                            ))}
                                        </>) : null}
                                    </Input>
                                </Col>
                            ) : null}
                        </Row>

                        <div className="mb-2 mt-2">
                            <Button
                                type="submit"
                                color="primary"
                                disabled={store && store.userItem && !store.userItem.id}
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
export default AccountTab