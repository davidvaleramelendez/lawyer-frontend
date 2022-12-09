/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Store & Actions
import {
    updateUser,
    updateUserLoader
} from '../store'
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
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Translation
import { T } from '@localization'

const ChangePassword = ({
    id,
    encryptData,
    PlaceholderSchema
}) => {

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    const UserPswdSchema = yup.object({
        password: yup.string().required('Password is required!').min(6, T("Password Must be 6 digit!")),
        retypePassword: yup.string().oneOf([yup.ref('password'), null], T('Retype Password must match with Password!')).required(T('Retype Password is required!'))
    }).required()

    /* pswd => information */
    const {
        control: pswdControl,
        setValue: pswdSetValue,
        handleSubmit: pswdHandleSubmit,
        formState: { errors: pswdErrors }
    } = useForm({
        mode: 'all',
        defaultValues: store.userItem,
        resolver: yupResolver(UserPswdSchema)
    })

    // ** Get user on mount based on id
    useEffect(() => {
        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "USER_UPDATED")) {
            pswdSetValue('password', '')
            pswdSetValue('retypePassword', '')
        }
        /* /Reset form data */
    }, [store.actionFlag])

    /* Submitting Password data */
    const onSubmitPassword = (values) => {
        if (values) {
            const userData = {
                id: id,
                name: store.userItem.name,
                email: store.userItem.email,
                role_id: store.userItem.role_id
            }

            if (values.password) {
                userData.password = encryptData(values.password)
            }

            // console.log("onSubmitPassword >>> ", userData)
            if (userData && userData.id) {
                dispatch(updateUserLoader(false))
                dispatch(updateUser(userData))
            }
        }
    }
    /* /Submitting Password data */

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{T("Change Password")}</CardTitle>
                </CardHeader>

                <CardBody className="py-2 my-25">
                    <Form id="password" onSubmit={pswdHandleSubmit(onSubmitPassword)} autoComplete="off">
                        <Row>
                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="address">
                                    {T('Password')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="password"
                                    id="password"
                                    control={pswdControl}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            {...field}
                                            autoComplete="off"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.password}
                                            className='input-group-merge'
                                            invalid={pswdErrors.password && true}
                                        />
                                    )}
                                />
                                <FormFeedback>{pswdErrors.password?.message}</FormFeedback>
                            </Col>

                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="address1">
                                    {T('Retype Password')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    name="retypePassword"
                                    id="retypePassword"
                                    control={pswdControl}
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            {...field}
                                            autoComplete="off"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.retypePassword}
                                            className='input-group-merge'
                                            invalid={pswdErrors.retypePassword && true}
                                        />
                                    )}
                                />
                                <FormFeedback>{pswdErrors.retypePassword?.message}</FormFeedback>
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
export default ChangePassword