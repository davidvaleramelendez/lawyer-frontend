/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Store & Actions
import {
    updateUser,
    updateUserLoader
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

import Flatpickr from 'react-flatpickr'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** React Dropdown Import
import Select from 'react-select'

// ** Icons Import
import {
    User,
    MapPin
} from 'react-feather'

// Constant
import {
    statusOptions
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

const AccountTab = ({
    id,
    onImageSrcError,
    getTransformDate,
    getWebPreviewUrl,
    PlaceholderSchema
}) => {

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** States
    const [roleOptions, setRoleOptions] = useState([])
    const [imageUrl, setImageUrl] = useState("")

    const UserAcntSchema = yup.object({
        first_name: yup.string().required(T('Name is required!')),
        last_name: yup.string().required(T('Last name is required!')),
        email: yup.string().required(T('Email is required!')).email(T('Invalid email address!')),
        status: yup.object().required(T(`Status is required!`)).nullable(),
        roleId: yup.object().required(T(`Role is required!`)).nullable(),
        DOB: yup.date().notRequired(T("Birth date is required!")).max(new Date(Date.now() - 86400000), T("Date cannot be in the future!")).nullable(),
        contact: yup.string().required(T('Mobile is required!')).min(6, T("Mobile Must be 6 digit!")).max(16, T("Mobile Must be 16 digit!")),
        gender: yup.string().required(T('Gender is required!')),
        address: yup.string().notRequired(T('Address line 1 is required!')),
        postcode: yup.string().notRequired(T('Postcode is required!')).max(6, T("Postcode no more than 6 characters!")),
        state: yup.string().notRequired(T('State is required!')),
        country: yup.string().notRequired(T('Country is required!'))
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
        resolver: yupResolver(UserAcntSchema)
    })

    const handleReset = () => {
        const userItem = { ...store.userItem }
        if (userItem && userItem.id) {
            if (userItem.role && userItem.role.role_id) {
                userItem.roleId = { value: userItem.role.role_id, label: userItem.role.RoleName }
            }

            userItem.name = userItem.name || ""
            userItem.first_name = userItem.first_name || ""
            userItem.last_name = userItem.last_name || ""
            userItem.company = userItem.last_name || ""
            userItem.contact = userItem.Contact || ""
            userItem.address = userItem.Address || ""
            userItem.address1 = userItem.Address1 || ""
            userItem.postcode = userItem.Postcode || ""
            userItem.city = userItem.City || ""
            userItem.state = userItem.State || ""
            userItem.country = userItem.Country || ""

            if (userItem.Status) {
                userItem.status = { value: userItem.Status, label: userItem.Status }
            }

            if (userItem.Gender) {
                userItem.gender = userItem.Gender
            }
        }

        acntReset(userItem)
    }

    // ** Get user on mount based on id
    useEffect(() => {
        let list1 = []
        if (store && store.roleItems && store.roleItems.length) {
            list1 = store.roleItems.map(role => {
                return {
                    value: role.role_id,
                    label: role.RoleName
                }
            })
        }
        setRoleOptions(list1)

        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "EDIT_USER")) {
            handleReset()
        }
    }, [store.roleItems, store.actionFlag])

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

    /* Submitting Account data */
    const onSubmitAccount = (values) => {
        // console.log("onSubmitAccount >>>>>>>>> ", values)
        if (values) {
            const userData = {
                id: id,
                name: values.name,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                Company: values.company,
                Contact: values.contact,
                Gender: values.gender,
                Address: values.address,
                Address1: values.address1,
                Postcode: values.postcode,
                City: values.city,
                State: values.state,
                Country: values.country
            }

            if (imageUrl) {
                userData.image = imageUrl
            }

            if (values.roleId && values.roleId.value) {
                userData.role_id = values.roleId.value
            }

            if (values.status && values.status.value) {
                userData.status = values.status.value
            }

            if (values.DOB && typeof values.DOB !== 'string' && values.DOB.length) {
                userData.DOB = getTransformDate(new Date(values.DOB[0], "YYYY-MM-DD"))
            } else if (values.DOB) {
                userData.DOB = getTransformDate(values.DOB, "YYYY-MM-DD")
            }

            // console.log("onSubmitAccount >>>>>>>>> ", userData)
            if (userData && userData.id) {
                dispatch(updateUserLoader(false))
                dispatch(updateUser(userData))
            }
        }
    }
    /* /Submitting Account data */

    /* Rendering user image */
    const renderUserProfilePicture = () => {
        if (store && store.userItem && store.userItem.profile_photo_path) {
            return getWebPreviewUrl(store.userItem.profile_photo_path)
        }

        return false
    }
    /* /Rendering user image */

    return (
        <Fragment>
            <Card>
                <CardBody className="py-2 my-25">
                    <Form id="account" onSubmit={acntHandleSubmit(onSubmitAccount)} autoComplete="off">
                        <div className="d-flex mb-2">
                            <div className="me-25">
                                <img
                                    className="rounded me-50"
                                    src={imageUrl ? imageUrl : store.userItem.profile_photo_path ? renderUserProfilePicture() : defaultAvatar}
                                    onError={(currentTarget) => onImageSrcError(currentTarget)}
                                    alt="user-avatar"
                                    height="100"
                                    width="100"
                                />
                            </div>

                            <div className="d-flex mt-75 ms-1">
                                <div>
                                    <h4
                                        className="mb-50"
                                        style={{
                                            height: "20px"
                                        }}
                                    >
                                        {store.userItem.name}
                                    </h4>
                                    <Button
                                        size="sm"
                                        tag={Label}
                                        type="button"
                                        color="primary"
                                        className="mb-75 me-75"
                                        disabled={store.userItem && !store.userItem.id}
                                    >
                                        {T('Change')}
                                        <Input type="file" hidden accept="image/*" onChange={(event) => onFileChange(event)} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Row>
                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="first_name">
                                    {T('Name')}
                                </Label>
                                <Controller
                                    defaultValue={""}
                                    id="first_name"
                                    name="first_name"
                                    control={acntControl}
                                    render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.first_name} invalid={acntErrors.first_name && true} />}
                                />
                                <FormFeedback>{acntErrors.first_name?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="last_name">
                                    {T('Last Name')}
                                </Label>
                                <Controller
                                    defaultValue={""}
                                    id="last_name"
                                    name="last_name"
                                    control={acntControl}
                                    render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.last_name} invalid={acntErrors.last_name && true} />}
                                />
                                <FormFeedback>{acntErrors.last_name?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="email">
                                    {T("Email")}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.email}
                                    name="email"
                                    id="email"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.emailAddress} invalid={acntErrors.email && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.email?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="status">
                                    {T("Status")}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Status ? { label: store.userItem.Status, value: store.userItem.Status } : null}
                                    name="status"
                                    id="status"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="status"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.status}
                                            options={statusOptions}
                                            className="react-select"
                                            classNamePrefix="select"
                                            isClearable={false}
                                        />
                                    )}
                                />
                                <FormFeedback className="d-block">{acntErrors.status?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="roleId">
                                    {T("Role")}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.role && store.userItem.role.role_id ? { label: store.userItem.role.RoleName, value: store.userItem.role.role_id } : null}
                                    name="roleId"
                                    id="roleId"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="roleId"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.roleId}
                                            options={roleOptions}
                                            className="react-select"
                                            classNamePrefix="select"
                                            isClearable={false}
                                        />
                                    )}
                                />
                                <FormFeedback className="d-block">{acntErrors.roleId?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="company">
                                    {T('Company')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Company ? store.userItem.Company : ""}
                                    name="company"
                                    id="company"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.company} invalid={acntErrors.company && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.company?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <Row className="mt-1">
                            <Col xl={12} md={12} sm={12} className="mb-1">
                                <h4>
                                    <User size={17} className="me-50" />
                                    <span className="align-middle">Personal Information</span>
                                </h4>
                            </Col>

                            <Col sm={12} className="mb-1">
                                <Label className="form-label" for="gender">
                                    {T('Gender')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Gender ? store.userItem.Gender : ""}
                                    name="gender"
                                    id="gender"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Row className="px-1">
                                            <div className="form-check" style={{ width: "max-content" }}>
                                                <Input {...field} type="radio" value="Male" checked={field && field.value === "Male"} />
                                                <Label className="form-check-label" for="Male">Male</Label>
                                            </div>
                                            <div className="form-check" style={{ width: "max-content" }}>
                                                <Input {...field} type="radio" value="Female" checked={field && field.value === "Female"} />
                                                <Label className="form-check-label" for="Female">Female</Label>
                                            </div>
                                        </Row>
                                    )}
                                />
                                <FormFeedback className="d-block">{acntErrors.gender?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="DOB">
                                    {T('Birth date')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="DOB"
                                    id="DOB"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Flatpickr
                                            {...field}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "Y-m-d"
                                            }}
                                            className="form-control"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.DOB}
                                        />
                                    )}
                                />
                                <FormFeedback className="d-block">{acntErrors.DOB?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="contact">
                                    {T('Mobile')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Contact ? store.userItem.Contact : ""}
                                    name="contact"
                                    id="contact"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="number" placeholder={PlaceholderSchema && PlaceholderSchema.contact} invalid={acntErrors.contact && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.contact?.message}</FormFeedback>
                            </Col>

                            <Col xl={12} md={12} sm={12} className="mb-1 mt-1">
                                <h4>
                                    <MapPin size={17} className="me-50" />
                                    <span className="align-middle">Address</span>
                                </h4>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="address">
                                    {T('Address Line')} 1
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Address ? store.userItem.Address : ""}
                                    name="address"
                                    id="address"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.address} invalid={acntErrors.address && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.address?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="address1">
                                    {T('Address Line')} 2
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Address1 ? store.userItem.Address1 : ""}
                                    name="address1"
                                    id="address1"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.address1} invalid={acntErrors.address1 && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.address1?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="postcode">
                                    {T('Postcode')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Postcode ? store.userItem.Postcode : ""}
                                    name="postcode"
                                    id="postcode"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.postcode} invalid={acntErrors.postcode && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.postcode?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="city">
                                    {T('City')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.City ? store.userItem.City : ""}
                                    name="city"
                                    id="city"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.city} invalid={acntErrors.city && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.city?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="state">
                                    {T('State')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.State ? store.userItem.State : ""}
                                    name="state"
                                    id="state"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.state} invalid={acntErrors.state && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.state?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="country">
                                    {T('Country')}
                                </Label>
                                <Controller
                                    defaultValue={store.userItem.Country ? store.userItem.Country : ""}
                                    name="country"
                                    id="country"
                                    control={acntControl}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder={PlaceholderSchema && PlaceholderSchema.country} invalid={acntErrors.country && true} />
                                    )}
                                />
                                <FormFeedback>{acntErrors.country?.message}</FormFeedback>
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
export default AccountTab