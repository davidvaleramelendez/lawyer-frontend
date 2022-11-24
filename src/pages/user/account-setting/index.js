/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  saveAccount,
  saveAccountImap,
  getAccountSetting,
  saveAccountSetting,
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

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { EditorState, ContentState, convertToRaw } from 'draft-js'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/apps/app-users.scss'
import '@styles/react/libs/editor/editor.scss'

const AccountSettingApp = () => {
  /* Hooks */
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.user)

  /* acnt => account */
  const {
    control: acntControl,
    handleSubmit: acntHandleSubmit,
    formState: { errors: acntErrors }
  } = useForm({ defaultValues: store.userItem, mode: 'all' })

  /* info => information */
  const {
    control: infoControl,
    handleSubmit: infoHandleSubmit,
    formState: { errors: infoErrors }
  } = useForm({ defaultValues: store.accountItem, mode: 'all' })

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
  const [invoiceLogoUrl, setInvoiceLogoUrl] = useState("")
  const [editorStateContent, setEditorStateContent] = useState(null)
  const [editorHtmlContent, setEditorHtmlContent] = useState("")

  const getInitialHTML = (value) => {
    const contentBlock = htmlToDraft(value)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorStateContent(editorState)
    }
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
      setLoadFirst(false)
    }

    if (store.accountItem && (store.accountItem.defaultText || store.accountItem.bank_information)) {
      getInitialHTML(store.accountItem.bank_information ? store.accountItem.bank_information : store.accountItem.defaultText)
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
  // console.log("active >>> ", active)

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

  const onLogoFileChange = (event) => {
    const fileReader = new FileReader()
    const files = event.target.files

    if (files && files.length > 0) {
      fileReader.onloadend = async () => {
        setInvoiceLogoUrl(fileReader.result)
      }
      fileReader.readAsDataURL(files[0])
    }
  }

  const handleEditorStateChange = (state) => {
    setEditorStateContent(state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }

  /* Submitting Account data */
  const onSubmitAccount = (values) => {
    if (values) {
      const userData = {
        name: values.fullname,
        email: values.emailAddress,
        Company: values.company
      }

      if (imageUrl) {
        userData.image = imageUrl
      }

      dispatch(saveAccount(userData))

      // console.log("onSubmitAccount >>>>>>>>> ", userData)
    }

  }

  /* Submitting Information data */
  const onSubmitInformation = (values) => {
    if (values) {
      const infoData = {
        UserID: store.userItem.id,
        User_Name: values.User_Name,
        footer_column_1: values.column1,
        footer_column_2: values.column2,
        footer_column_3: values.column3,
        footer_column_4: values.column4,
        Address: values.Address,
        Postal_Code: values.Postal_Code,
        City: values.City,
        Invoice_text: values.Invoice_text
      }

      if (editorHtmlContent) {
        infoData.bank_information = editorHtmlContent
      }

      if (invoiceLogoUrl) {
        infoData.invoice_logo = invoiceLogoUrl
      }

      // console.log("onSubmitInformation >>>>> ", userData)
      dispatch(saveAccountSetting(infoData))
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

      // console.log("onSubmitImapInfo >>>>> ", userData)
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
                <span className="fw-bold d-none d-sm-block">Information</span>
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
                </Row>

                <div className="d-flex flex-wrap mb-2 mt-2">
                  <Button type="submit" className="me-1" color="primary">
                    {t("Save Change")}
                  </Button>
                </div>
              </Form>
            </TabPane>

            <TabPane tabId="2">
              <Form id="information" className="mt-2" onSubmit={infoHandleSubmit(onSubmitInformation)} autoComplete="off">
                <Row>
                  <Col xl={12} md={12} sm={12}>
                    <div className="d-flex mb-2">
                      <div className="me-25">
                        <img
                          className="rounded me-50"
                          id="invoice-logo"
                          src={invoiceLogoUrl ? invoiceLogoUrl : store.accountItem && store.accountItem.invoice_logo ? `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.accountItem.invoice_logo}` : `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
                          onError={(currentTarget) => onImageSrcError(currentTarget)}
                          alt="user-avatar"
                          height="100"
                          width="100"
                        />
                      </div>

                      <div className="mt-75 ms-1">
                        <h4 className="mb-50">Logo</h4>
                        <Button type="button" tag={Label} className="mb-75 me-75" color="primary">
                          Add
                          <Input type="file" hidden accept="image/*" onChange={(event) => onLogoFileChange(event)} />
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={12} md={12} sm={12}>
                    <h4 className="mb-1">
                      <User size={20} />
                      <span className="align-middle">Personal Information</span>
                    </h4>
                  </Col>

                  <Col xl={12} md={12} sm={12} className="mb-1">
                    <Controller
                      defaultValue={store.accountItem && store.accountItem.bank_information ? store.accountItem.bank_information : store.accountItem && store.accountItem.defaultText ? store.accountItem.defaultText : ""}
                      name="bankInformation"
                      id="bankInformation"
                      control={infoControl}
                      rules={ValidationSchema.bank_information}
                      render={({ field }) => (<>
                        <Editor
                          {...field}
                          toolbar={{
                            options: ["blockType", "fontSize", "inline", "list", "textAlign", "history"],
                            blockType: {
                              inDropdown: true,
                              options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"]
                            },
                            fontSize: {
                              options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96]
                            },
                            inline: {
                              inDropdown: false,
                              options: ["bold", "italic", "underline", "strikethrough"]
                            }
                          }}
                          editorState={editorStateContent}
                          placeholder={ValidationSchema.bank_information && ValidationSchema.bank_information.placeholder}
                          onEditorStateChange={handleEditorStateChange}
                        />
                      </>)}
                    />
                    <div className="invalid-feedback">{infoErrors.bank_information?.message}</div>
                  </Col>

                  <Col xl={12} md={12} sm={12}>
                    <h4 className="mb-1">
                      <User size={20} />
                      <span className="align-middle">Footer Information</span>
                    </h4>
                  </Col>

                  <Col xl={6} md={6} sm={6} className="mb-1">
                    <Label className="form-label" for="column1">
                      Column 1
                    </Label>
                    <Controller
                      defaultValue={store.accountItem && store.accountItem.footer_columns && store.accountItem.footer_columns.footer_column_1 ? store.accountItem.footer_columns.footer_column_1 : ""}
                      name="column1"
                      id="column1"
                      control={infoControl}
                      rules={ValidationSchema.column1}
                      render={({ field }) => (
                        <Input {...field} type="text" placeholder={ValidationSchema.column1 && ValidationSchema.column1.placeholder} invalid={infoErrors.column1 && true} />
                      )}
                    />
                    <div className="invalid-feedback">{infoErrors.column1?.message}</div>
                  </Col>

                  <Col xl={6} md={6} sm={6} className="mb-1">
                    <Label className="form-label" for="column2">
                      Column 2
                    </Label>
                    <Controller
                      defaultValue={store.accountItem && store.accountItem.footer_columns && store.accountItem.footer_columns.footer_column_2 ? store.accountItem.footer_columns.footer_column_2 : ""}
                      name="column2"
                      id="column2"
                      control={infoControl}
                      rules={ValidationSchema.column2}
                      render={({ field }) => (
                        <Input {...field} type="text" placeholder={ValidationSchema.column2 && ValidationSchema.column2.placeholder} invalid={infoErrors.column2 && true} />
                      )}
                    />
                    <div className="invalid-feedback">{infoErrors.column2?.message}</div>
                  </Col>

                  <Col xl={6} md={6} sm={6} className="mb-1">
                    <Label className="form-label" for="column3">
                      Column 3
                    </Label>
                    <Controller
                      defaultValue={store.accountItem && store.accountItem.footer_columns && store.accountItem.footer_columns.footer_column_3 ? store.accountItem.footer_columns.footer_column_3 : ""}
                      name="column3"
                      id="column3"
                      control={infoControl}
                      rules={ValidationSchema.column3}
                      render={({ field }) => (
                        <Input {...field} type="text" placeholder={ValidationSchema.column3 && ValidationSchema.column3.placeholder} invalid={infoErrors.column3 && true} />
                      )}
                    />
                    <div className="invalid-feedback">{infoErrors.column3?.message}</div>
                  </Col>

                  <Col xl={6} md={6} sm={6} className="mb-1">
                    <Label className="form-label" for="column4">
                      Column 4
                    </Label>
                    <Controller
                      defaultValue={store.accountItem && store.accountItem.footer_columns && store.accountItem.footer_columns.footer_column_4 ? store.accountItem.footer_columns.footer_column_4 : ""}
                      name="column4"
                      id="column4"
                      control={infoControl}
                      rules={ValidationSchema.column4}
                      render={({ field }) => (
                        <Input {...field} type="text" placeholder={ValidationSchema.column4 && ValidationSchema.column4.placeholder} invalid={infoErrors.column4 && true} />
                      )}
                    />
                    <div className="invalid-feedback">{infoErrors.column4?.message}</div>
                  </Col>
                </Row>

                <div className="d-flex flex-wrap mb-2 mt-2">
                  <Button type="submit" className="me-1" color="primary">
                    {t("Save Change")}
                  </Button>
                </div>
              </Form>
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
