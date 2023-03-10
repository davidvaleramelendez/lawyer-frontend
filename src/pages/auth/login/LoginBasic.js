import { useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login, updateAuthLoader, cleanAuthMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'
import InputPasswordToggle from '@components/input-password-toggle'
import { Card, Form, Label, Input, Button, CardBody, CardText, FormFeedback } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { encryptData, decryptData, isUserLoggedIn, getRememberMeAuthData, setRememberMeAuthData } from '@utils'
import { AbilityContext } from '@src/utility/context/Can'
import '@styles/react/pages/page-authentication.scss'
import { T } from '@localization'

const LoginBasic = () => {
  // ** Hooks
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
 
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues
  })

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
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store && store.error) {
      Notification(T("Error"), store.error, "warning")
    }
  }, [store.success, store.error, store.actionFlag])

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
    <div className="auth-wrapper auth-basic px-2">
      {store && !store.loading ? (
        <DotPulse
          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
        />
      ) : null}

      <div className="auth-inner auth-inner-login my-2">
        <Card className="mb-0">
          <CardBody>
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
                <Label className="form-label" for="email">
                  Email
                </Label>
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
                  <Label className="form-label" for="password">
                    Password
                  </Label>

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
                color="primary"
                className="mb-2"
              >
                Sign in
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default LoginBasic
