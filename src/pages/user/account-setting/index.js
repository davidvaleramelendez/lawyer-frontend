/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  saveAccount,
  saveAccountImap,
  getAccountSetting,
  clearUserMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Col,
  Nav,
  Row,
  Card,
  Form,
  Label,
  Input,
  Button,
  NavLink,
  TabPane,
  NavItem,
  CardBody,
  TabContent
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

// Translation
import { useTranslation } from 'react-i18next'

// ** React Dropdown Import
import Select from 'react-select'

// ** API calling components
import axios from 'axios'
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Utils
import {
  isUserLoggedIn,
  onImageSrcError
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Icons Import
import {
  User,
  Info
} from 'react-feather'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/apps/app-users.scss'
import '@styles/react/libs/editor/editor.scss'

import LanguageLabels from './language-labels'

const AccountSettingApp = () => {
  /* Hooks */
  const { t } = useTranslation()
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.user)

  /* acnt => account */
  const {
    control: acntControl,
    handleSubmit: acntHandleSubmit,
    formState: { errors: acntErrors }
  } = useForm({ defaultValues: store.userItem, mode: 'all' })

  /* imap => Imap information */
  const {
    control: imapControl,
    handleSubmit: imapHandleSubmit,
    formState: { errors: imapErrors }
  } = useForm({ defaultValues: store.userItem, mode: 'all' })

  /* Validation rules */
  const ValidationSchema = {
    username: {
      placeholder: "john.doe@example.com",
      required: "Username is required!",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid username!"
      }
    },
    fullname: {
      placeholder: "John Doe",
      required: "Name is required!"
    },
    emailAddress: {
      placeholder: "john.doe@example.com",
      required: "Email is required!",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid username!"
      }
    },
    status: {
      placeholder: `Select ${t("Status")}...`,
      required: `${t("Status")} is required!`
    },
    roleId: {
      placeholder: `Select ${t("Role")}...`,
      required: `${t("Role")} is required!`
    },
    company: {
      placeholder: "Company",
      required: false
    },
    bank_information: {
      placeholder: "",
      required: false
    },
    column1: {
      placeholder: "",
      required: false
    },
    column2: {
      placeholder: "",
      required: false
    },
    column3: {
      placeholder: "",
      required: false
    },
    column4: {
      placeholder: "",
      required: false
    },
    imapName: {
      placeholder: "",
      required: false
    },
    imapEmail: {
      placeholder: "",
      required: false
    },
    imap_host: {
      placeholder: "",
      required: false
    },
    imap_port: {
      placeholder: "",
      required: false
    },
    imap_ssl: {
      placeholder: "",
      required: false
    },
    imap_email: {
      placeholder: "",
      required: false
    },
    imap_password: {
      placeholder: "",
      required: false
    }
  }

  /* Constant */
  const [loadFirst, setLoadFirst] = useState(true)
  const [active, setActive] = useState('1')
  const [imageUrl, setImageUrl] = useState("")
  const [languages, setLanguages] = useState([])
  const [selLanguage, setSelLanguage] = useState(store.userItem.language)

  // ** Get languages 
  const getLanguages = () => {
    axios.get(`${API_ENDPOINTS.language.languages}`)
        .then((res) => {
          let langList = res.data.data
          if (langList === undefined || langList === null) {
            langList = []
          }

          if (!langList.includes('English')) {
            langList.push('English')
          }

          if (!langList.includes('Dutch')) {
            langList.push('Dutch')
          }
          setLanguages(langList)
        })
        .catch((error) => {
          Notification("Error", error, "Error")
        })
  }

  // ** Get user on mount based on id
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getAccountSetting({}))
      getLanguages()
      setSelLanguage(store.userItem.language)
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearUserMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }
  }, [dispatch, store.roleItems, store.accountItem, store.success, store.error, store.actionFlag, loadFirst])
  
  useEffect(() => {
    setSelLanguage(store.userItem.language)
  }, [store.userItem])

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

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
        name: values.fullname,
        email: values.emailAddress,
        Company: values.company,
        language: selLanguage
      }

      if (imageUrl) {
        userData.image = imageUrl
      }

      dispatch(saveAccount(userData))

      // console.log("onSubmitAccount >>>>>>>>> ", userData)
    }

  }

  /* Submitting Imap Information data */
  const onSubmitImapInfo = (values) => {
    if (values) {
      const userData = {
        UserID: store.userItem.id,
        imap_host: values.imap_host,
        imap_email: values.imap_email,
        imap_password: values.imap_password,
        imap_port: values.imap_port,
        imap_ssl: values.imap_ssl
      }
      dispatch(saveAccountImap(userData))
    }
  }

  return store && store.userItem && store.userItem.id ? (<>
    <div className="app-user-view">
      <Card className="user-edit-card">
        <CardBody className="user-edit-card-body pl-4 pr-4">
          <Nav pills className="mb-2">
            <NavItem>
              <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                <User size={14} className="me-50" />
                <span className="fw-bold d-none d-sm-block">Account</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                <Info size={14} className="me-50" />
                <span className="fw-bold d-none d-sm-block">Language Labels</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                <Info size={14} className="me-50" />
                <span className="fw-bold d-none d-sm-block">IMAP information</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={active}>
            <TabPane tabId="1">
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

                      <div className="mt-75 ms-1">
                        <h4 className="mb-50">
                          {store.userItem && store.userItem.name}
                        </h4>

                        <Button type="button" tag={Label} className="mb-75 me-75" color="primary">
                          Change
                          <Input type="file" hidden accept="image/*" onChange={(event) => onFileChange(event)} />
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="username">
                      Username
                    </Label>
                    <Controller
                      defaultValue={store.userItem && store.userItem.email}
                      name="username"
                      id="username"
                      control={acntControl}
                      rules={ValidationSchema.username}
                      render={({ field }) => (
                        <Input {...field} type="email" placeholder={ValidationSchema.username.placeholder ? ValidationSchema.username.placeholder : ""} invalid={acntErrors.username && true} />
                      )}
                    />
                    <div className="invalid-feedback">{acntErrors.username?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="fullname">
                      Name
                    </Label>
                    <Controller
                      defaultValue={store.userItem && store.userItem.name}
                      id="fullname"
                      name="fullname"
                      control={acntControl}
                      rules={ValidationSchema.fullname}
                      render={({ field }) => (
                        <Input {...field} placeholder={ValidationSchema.fullname && ValidationSchema.fullname.placeholder} invalid={acntErrors.fullname && true} />
                      )}
                    />
                    <div className="invalid-feedback">{acntErrors.fullname?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="emailAddress">
                      {t("Email")}
                    </Label>
                    <Controller
                      defaultValue={store.userItem && store.userItem.email}
                      name="emailAddress"
                      id="emailAddress"
                      control={acntControl}
                      rules={ValidationSchema.emailAddress}
                      render={({ field }) => (
                        <Input {...field} type="email" placeholder={ValidationSchema.emailAddress && ValidationSchema.emailAddress.placeholder} invalid={acntErrors.emailAddress && true} />
                      )}
                    />
                    <div className="invalid-feedback">{acntErrors.emailAddress?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="company">
                      Company
                    </Label>
                    <Controller
                      defaultValue={store.userItem && store.userItem.Company ? store.userItem.Company : ""}
                      name="company"
                      id="company"
                      control={acntControl}
                      rules={ValidationSchema.company}
                      render={({ field }) => (
                        <Input {...field} type="text" placeholder={ValidationSchema.company && ValidationSchema.company.placeholder} invalid={acntErrors.company && true} />
                      )}
                    />
                    <div className="invalid-feedback">{acntErrors.company?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <label className="form-label" htmlFor="language-select">Language</label>
                    <Input
                      type="select"
                      name="language"
                      id="language"
                      value={selLanguage}
                      onChange={onLanguageChange}
                    >
                      {languages && languages.length ? (<>
                          {languages.map((item, index) => (
                              <option key={`row-${index}`} value={item}>{item}</option>
                          ))}
                      </>) : null}
                    </Input>
                  </Col>
                </Row>

                <div className="d-flex flex-wrap mb-2 mt-2">
                  <Button type="submit" className="me-1" color="primary">
                    {t("Save Change")}
                  </Button>
                </div>
              </Form>
            </TabPane>

            <TabPane tabId="2">
              <LanguageLabels />
            </TabPane>

            <TabPane tabId="3">
              <Form id="imap" onSubmit={imapHandleSubmit(onSubmitImapInfo)} autoComplete="off">
                <Row>
                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imapName">
                      Name
                    </Label>
                    <Controller
                      defaultValue={store.userItem && store.userItem.name}
                      id="imapName"
                      name="imapName"
                      control={imapControl}
                      rules={ValidationSchema.imapName}
                      render={({ field }) => (
                        <Input {...field} placeholder={ValidationSchema.imapName && ValidationSchema.imapName.placeholder} invalid={imapErrors.imapName && true} readOnly />
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imapName?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imapEmail">
                      Email
                    </Label>
                    <Controller
                      defaultValue={store.userItem && store.userItem.email}
                      id="imapEmail"
                      name="imapEmail"
                      control={imapControl}
                      rules={ValidationSchema.imapEmail}
                      render={({ field }) => (
                        <Input {...field} placeholder={ValidationSchema.imapEmail && ValidationSchema.imapEmail.placeholder} invalid={imapErrors.imapEmail && true} readOnly />
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imapEmail?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imap_host">
                      IMAP Host
                    </Label>
                    <Controller
                      defaultValue={store.imapItem && store.imapItem.imap_host ? store.imapItem.imap_host : ""}
                      id="imap_host"
                      name="imap_host"
                      control={imapControl}
                      rules={ValidationSchema.imap_host}
                      render={({ field }) => (
                        <Input {...field} placeholder={ValidationSchema.imap_host && ValidationSchema.imap_host.placeholder} invalid={imapErrors.imap_host && true} />
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imap_host?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imap_port">
                      IMAP Port
                    </Label>
                    <Controller
                      defaultValue={store.imapItem && store.imapItem.imap_port ? store.imapItem.imap_port : ""}
                      id="imap_port"
                      name="imap_port"
                      control={imapControl}
                      rules={ValidationSchema.imap_port}
                      render={({ field }) => (
                        <Input {...field} placeholder={ValidationSchema.imap_port && ValidationSchema.imap_port.placeholder} invalid={imapErrors.imap_port && true} />
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imap_port?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imap_ssl">
                      Secure
                    </Label>
                    <Controller
                      defaultValue={store.imapItem && store.imapItem.imap_ssl ? store.imapItem.imap_ssl : ""}
                      id="imap_ssl"
                      name="imap_ssl"
                      control={imapControl}
                      rules={ValidationSchema.imap_ssl}
                      render={({ field }) => (
                        <div className="form-check">
                          <Input {...field} type="checkbox" id="imap_ssl" defaultChecked={field && field.value} />
                          <Label for="imap_ssl" className="form-check-label">
                            Use SSL
                          </Label>
                        </div>
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imap_ssl?.message}</div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imap_email">
                      IMAP Email
                    </Label>
                    <Controller
                      defaultValue={store.imapItem && store.imapItem.imap_email ? store.imapItem.imap_email : ""}
                      id="imap_email"
                      name="imap_email"
                      control={imapControl}
                      rules={ValidationSchema.imap_email}
                      render={({ field }) => (
                        <Input {...field} placeholder={ValidationSchema.imap_email && ValidationSchema.imap_email.placeholder} invalid={imapErrors.imap_email && true} />
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imap_email?.message}</div>
                  </Col>

                  <Col xl={4} md={4} sm={4} className="mb-1">
                    <Label className="form-label" for="imap_password">
                      IMAP Password
                    </Label>
                    <Controller
                      defaultValue={store.imapItem && store.imapItem.imap_password ? store.imapItem.imap_password : ""}
                      id="imap_password"
                      name="imap_password"
                      control={imapControl}
                      rules={ValidationSchema.imap_password}
                      render={({ field }) => (
                        <Input {...field} type="password" autoComplete="off" placeholder={ValidationSchema.imap_password && ValidationSchema.imap_password.placeholder} invalid={imapErrors.imap_password && true} />
                      )}
                    />
                    <div className="invalid-feedback">{imapErrors.imap_password?.message}</div>
                  </Col>
                </Row>

                <div className="d-flex flex-wrap mb-2 mt-2">
                  <Button type="submit" className="me-1" color="primary">
                    {t("Save Change")}
                  </Button>
                </div>
              </Form>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  </>) : null
}

export default AccountSettingApp
