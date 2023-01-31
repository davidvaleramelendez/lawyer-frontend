// ** React Imports
import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { login, updateAuthLoader, cleanAuthMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { AbilityContext } from '@src/utility/context/Can'
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import InputPasswordToggle from '@components/input-password-toggle'
import { useTranslation } from 'react-i18next'
import { encryptData,  decryptData, isUserLoggedIn, getRememberMeAuthData, setRememberMeAuthData } from '@utils'
import {  Col, Row, Form, Input, Label, Button, CardText, CardTitle, FormFeedback } from 'reactstrap'
import '@styles/react/pages/page-authentication.scss'

const LoginCover = () => {
  // ** Hooks
  const { skin } = useSkin()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.auth)

  /* Checking auth user exist data */
  const checkAuthExistData = (key, data, flag) => {
    if (data) {
      if (key === "password") {
        return decryptData(data[key || ''])
      } else if (data[key || '']) {
        return data[key || '']
      }

      if (flag) {
        return data !== null
      }
    }
    return ''
  }
  /* Checking auth user exist data */

  // ** Vars
  const defaultValues = {
    email: checkAuthExistData('email', getRememberMeAuthData()),
    password: checkAuthExistData('password', getRememberMeAuthData()),
    remember_me: checkAuthExistData('remember_me', getRememberMeAuthData(), true)
  }

  const PlaceholderSchema = {
    email: 'E-Mail-Adresse eingeben'
  }

  /* Yup validation schema */
  const LoginSchema = yup.object({
  }).required()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(LoginSchema)
  })
  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  useEffect(() => {
    /* if user logged then navigate */
    if (isUserLoggedIn() !== null) {
      navigate(`/dashboard`)
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "LOGGED") {
      ability.update(store.userItem.ability)
      navigate(`/dashboard`)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(cleanAuthMessage())
    }

    /* Succes toast notification */
    if (store && store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store && store.error) {
      Notification("Error", store.error, "warning")
    }
  }, [store.success, store.error, store.actionFlag])
  // console.log("store >>> ", store)

  const onSubmit = (values) => {
    if (values) {
      const authData = {
        email: values.email,
        password: encryptData(values.password)
      }

      if (values?.remember_me) {
        setRememberMeAuthData(authData)
      } else {
        setRememberMeAuthData()
      }

      dispatch(updateAuthLoader(false))
      dispatch(login(authData))
    }
  }

  return (
    <div className="auth-wrapper auth-cover">
      {store && !store.loading ? (
        <DotPulse
          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
        />
      ) : null}

      <Row className="auth-inner mb-0">
        <Col
          lg={8}
          sm={12}
          className="d-none d-lg-flex align-items-center p-5"
        >
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>

        <Col
          lg={4}
          sm={12}
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
        >
          <Col className="px-xl-2 mx-auto"
            sm={8}
            md={6}
            lg={12}
          >
          <Link className="brand-logo" to="/" onClick={(event) => event.preventDefault()}>
          <h2 className="brand-text text-primary ms-0">{t("Lawyer")}</h2>
        </Link>

            <CardText className="mb-2">Please sign-in to your account</CardText>

            <Form
              autoComplete="off"
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Controller
                  id="email"
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      autoComplete="off"
                      placeholder={PlaceholderSchema && PlaceholderSchema.email}
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </div>

              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.password?.message}</FormFeedback>
                <div className="forgot-password">
                <Link to="/forgot-password">
                    <small>Forgot Password</small>
                </Link>
                </div>
              </div>

              <div className="form-check mb-1">
                <Controller
                  id="checkbox"
                  name="remember_me"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      checked={field?.value}
                      type="checkbox"
                      id="remember_me"
                    />
                  )}
                />
                <Label className="form-check-label" for="remember_me">
                  Remember Me
                </Label>
              </div>

              <Button
                block
                type="submit"
                color="primary"
              >
                Sign in
              </Button>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginCover
