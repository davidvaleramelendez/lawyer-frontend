// ** React Imports
import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Store & Actions
import {
  login,
  updateAuthLoader,
  cleanAuthMessage
} from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'
import Notification from '@components/toast/notification'
import InputPasswordToggle from '@components/input-password-toggle'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  encryptData,
  isUserLoggedIn
} from '@utils'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
  FormFeedback
} from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const defaultValues = {
  password: '1234567890',
  email: 'test@valera-melendez.com'
}

const LoginApp = () => {
  // ** Hooks
  const { skin } = useSkin()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.auth)

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
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
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("store >>> ", store)

  const onSubmit = (values) => {
    if (Object.values(values).every(field => field.length > 0)) {
      dispatch(updateAuthLoader(false))
      dispatch(login({ email: values.email, password: encryptData(values.password) }))
    } else {
      for (const key in values) {
        if (values[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      {store && !store.loading ? (
        <Spinner
          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
        />
      ) : null}

      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1'>{t("Lawyer")}</h2>
        </Link>

        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>

        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Welcome to {t("Lawyer")}
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  rules={{
                    required: "Email is required!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address!"
                    }
                  }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      autoComplete="off"
                      placeholder='john@example.com'
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </div>

              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  rules={{
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be 6 or more character long!"
                    }
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className='input-group-merge'
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.password?.message}</FormFeedback>
              </div>

              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>

              <Button type='submit' color='primary' block>
                Sign in
              </Button>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginApp
