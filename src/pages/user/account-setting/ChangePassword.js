// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Store & Actions
import {
    updateUserLoader,
    updateAccountPassword
} from '@src/pages/user/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Form,
    Label,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Translation
import { T } from '@localization'

const ChangePassword = ({
    encryptData
}) => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    const UserPswdSchema = yup.object({
        password: yup.string().required('Password is required!').min(6, T("Password Must be 6 digit!")),
        newPassword: yup.string().required(T('New Password is required!')).min(6, T("New Password Must be 6 digit!")),
        retypeNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], T('Retype New Password must match with New Password!')).required(T('Retype New Password is required!'))
    }).required()

    const passwordItemValue = {
        password: "",
        newPassword: "",
        retypeNewPassword: ""
    }

    /* Placeholder texts */
    const PlaceholderSchema = {
        password: "********",
        newPassword: "********",
        retypeNewPassword: "********"
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: passwordItemValue,
        resolver: yupResolver(UserPswdSchema)
    })

    const handleReset = () => {
        reset(passwordItemValue)
    }

    useEffect(() => {
        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "PASSWORD_UPDATED")) {
            handleReset()
        }
    }, [store.actionFlag])

    /* Submitting Password data */
    const onSubmitPassword = (values) => {
        if (values) {
            const passwdData = {
                password: encryptData(values.password),
                newPassword: encryptData(values.newPassword)
            }

            dispatch(updateUserLoader(false))
            dispatch(updateAccountPassword(passwdData))
        }
    }
    /* /Submitting Password data */

    return (
        <Fragment>
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T("Change Password")}</CardTitle>
                </CardHeader>

                <CardBody className="pt-1">
                    <Form onSubmit={handleSubmit(onSubmitPassword)} autoComplete="off">
                        <Row>
                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="password">
                                    {T('Current Password')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="password"
                                    id="password"
                                    control={control}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            {...field}
                                            autoComplete="off"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.password}
                                            className='input-group-merge'
                                            invalid={errors.password && true}
                                        />
                                    )}
                                />
                                <FormFeedback>{errors.password?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="newPassword">
                                    {T('New Password')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="newPassword"
                                    id="newPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            {...field}
                                            autoComplete="off"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.newPassword}
                                            className='input-group-merge'
                                            invalid={errors.newPassword && true}
                                        />
                                    )}
                                />
                                <FormFeedback>{errors.newPassword?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="retypeNewPassword">
                                    {T('Retype New Password')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="retypeNewPassword"
                                    id="retypeNewPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            {...field}
                                            autoComplete="off"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.retypeNewPassword}
                                            className='input-group-merge'
                                            invalid={errors.retypeNewPassword && true}
                                        />
                                    )}
                                />
                                <FormFeedback>{errors.retypeNewPassword?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <div className="d-flex flex-wrap mb-2 mt-2">
                            <Button
                                type="submit"
                                className="me-1"
                                color="primary"
                            // disabled={!store.loading}
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

export default ChangePassword
