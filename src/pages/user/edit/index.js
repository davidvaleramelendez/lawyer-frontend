/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  getRoleList,
  updateUser,
  getUserView,
  getUserPermission,
  getUserDeviceLogs,
  updateUserLoader,
  updatePermission,
  clearUserMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
  adminRoot,
  statusOptions,
  perPageRowItems,
  defaultPerPageRow
} from '@constant/defaultValues'

// ** Reactstrap Imports
import {
  Col,
  Nav,
  Row,
  Card,
  Form,
  Label,
  Input,
  Table,
  Button,
  NavLink,
  TabPane,
  NavItem,
  CardBody,
  CardTitle,
  CardHeader,
  TabContent,
  FormFeedback
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** React Dropdown Import
import Select from 'react-select'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  encryptData,
  isUserLoggedIn,
  onImageSrcError,
  getTransformDate
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-spinner'
import Notification from '@components/toast/notification'
import InputPasswordToggle from '@components/input-password-toggle'
import DatatablePagination from "@components/datatable/DatatablePagination"

// ** Icons Import
import {
  User,
  Lock,
  MapPin,
  Unlock
} from 'react-feather'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

/* Device Log History header */
const CustomLogHeader = ({
  rowsPerPage,
  handlePerPage
}) => {
  return (<div className="invoice-list-table-header w-100 py-2">
    <Row>
      <Col lg={4} className="d-flex align-items-center px-0 px-lg-1">
        <div className="d-flex align-items-center me-2">
          <label htmlFor="log-rows-per-page">Show</label>
          <Input
            type="select"
            id="log-rows-per-page"
            value={rowsPerPage}
            onChange={(event) => handlePerPage(event.target.value)}
            className="form-control ms-50 pe-3"
          >
            {perPageRowItems && perPageRowItems.length ? (<>
              {perPageRowItems.map((item, index) => (
                <option key={`row-${index}`} value={item.value}>{item.label}</option>
              ))}
            </>) : null}
          </Input>
        </div>
      </Col>
    </Row>
  </div>)
}
/* /Device Log History header */

const UserEditApp = () => {
  // ** Hooks
  const { id } = useParams()
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.user)

  const UserAcntSchema = yup.object({
    username: yup.string().required('Email is required!').email('Invalid username!'),
    name: yup.string().required('Name is required!'),
    email: yup.string().required('Email is required!').email('Invalid email address!'),
    status: yup.object().required(`${t("Status")} is required!`).nullable(),
    roleId: yup.object().required(`${t("Role")} is required!`).nullable(),
    DOB: yup.date().required("Birth date is required!").max(new Date(Date.now() - 86400000), "Date cannot be in the future!").nullable(),
    contact: yup.string().required('Mobile is required!').min(10, "Mobile Must be 10 digit!").max(10, "Mobile Must be 10 digit!"),
    gender: yup.string().required('Gender is required!'),
    address: yup.string().required('Address line 1 is required!'),
    postcode: yup.string().required('Postcode is required!').max(6, "Postcode no more than 6 characters!"),
    state: yup.string().required('State is required!'),
    country: yup.string().required('Country is required!')
  }).required()

  const UserPswdSchema = yup.object({
    password: yup.string().required('Password is required!').matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', "Min. 8 characters,At least one uppercase letter,One lowercase letter,One number and one special character"),
    retypePassword: yup.string().oneOf([yup.ref('password'), null], 'Retype Password must match with Password!').required('Retype Password is required!')
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

  /* Placeholder texts */
  const PlaceholderSchema = {
    username: "john.doe@example.com",
    fullname: "John Doe",
    emailAddress: "john.doe@example.com",
    status: `Select ${t("Status")}...`,
    roleId: `Select ${t("Role")}...`,
    company: "Company",
    DOB: "YYYY-MM-DD",
    contact: "Mobile",
    address: "Address Line 1",
    address1: "T-78, Groove Street",
    postcode: "597626",
    city: "City",
    state: "Manhattan",
    country: "United States",
    password: "********",
    retypePassword: "********"
  }

  /* Constant */
  const [loadFirst, setLoadFirst] = useState(true)
  const [active, setActive] = useState('1')
  const [roleOptions, setRoleOptions] = useState([])
  const [imageUrl, setImageUrl] = useState("")
  const [permission, setPermission] = useState(store.permissions || [])

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const handleReset = () => {
    const userItem = { ...store.userItem }
    if (userItem && userItem.id) {
      if (userItem.email) {
        userItem.username = userItem.email
      }

      if (userItem.role && userItem.role.role_id) {
        userItem.roleId = { value: userItem.role.role_id, label: userItem.role.RoleName }
      }

      if (userItem.Company) {
        userItem.company = userItem.Company
      }

      if (userItem.Status) {
        userItem.status = { value: userItem.Status, label: userItem.Status }
      }

      if (userItem.Gender) {
        userItem.gender = userItem.Gender
      }

      if (userItem.Contact) {
        userItem.contact = userItem.Contact
      }

      if (userItem.Address) {
        userItem.address = userItem.Address
      }

      if (userItem.Address1) {
        userItem.address1 = userItem.Address1
      }

      if (userItem.Postcode) {
        userItem.postcode = userItem.Postcode
      }

      if (userItem.City) {
        userItem.city = userItem.City
      }

      if (userItem.State) {
        userItem.state = userItem.State
      }

      if (userItem.Country) {
        userItem.country = userItem.Country
      }
    }

    acntReset(userItem)
  }

  /* Device Log history pagination */
  const [logSort, setLogSort] = useState('desc')
  const [logSortColumn, setLogSortColumn] = useState('id')
  const [logCurrentPage, setLogCurrentPage] = useState(1)
  const [logRowsPerPage, setLogRowsPerPage] = useState(defaultPerPageRow)
  /* /Device Log history pagination */

  /* Device Log history Pagination Api */
  const handleLogLists = (sorting = logSort, sortCol = logSortColumn, page = logCurrentPage, perPage = logRowsPerPage) => {
    dispatch(
      getUserDeviceLogs({
        sort: sorting,
        sortColumn: sortCol,
        page: page,
        perPage: perPage,
        user_id: id
      })
    )
  }

  const handleLogPerPage = (value) => {
    setLogRowsPerPage(parseInt(value))
    handleLogLists(
      logSort,
      logSortColumn,
      logCurrentPage,
      parseInt(value)
    )
  }

  const handleLogSort = (column, sortDirection) => {
    setLogSort(sortDirection)
    setLogSortColumn(column.sortField)
    handleLogLists(
      sortDirection,
      column.sortField,
      logCurrentPage,
      logRowsPerPage
    )
  }

  const handledeviceLogPagination = (page) => {
    // console.log("handledeviceLogPagination >>>>>>> ", page)
    setLogCurrentPage(page + 1)
    handleLogLists(
      logSort,
      logSortColumn,
      page + 1,
      logRowsPerPage
    )
  }
  /* /Device Log history Pagination Api */

  // ** Get user on mount based on id
  useEffect(() => {
    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/user`)
    }

    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getRoleList({}))
      dispatch(getUserView(id))
      dispatch(getUserPermission(id))
      handleLogLists()
      setLoadFirst(false)
    }

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

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearUserMessage())
    }

    /* Reset form data */
    if (store && store.actionFlag && (store.actionFlag === "EDIT_USER")) {
      handleReset()
    }

    if (store && store.actionFlag && (store.actionFlag === "USER_UPDATED")) {
      pswdSetValue('password', '')
      pswdSetValue('retypePassword', '')
    }
    /* /Reset form data */

    if (store && store.actionFlag && (store.actionFlag === "USER_PERMISSION" || store.actionFlag === "PERMISSION_ADDED")) {
      setPermission(store.permissions)
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }
  }, [store.roleItems, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

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
        // username: values.username,
        name: values.name,
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

  /* Device Log history columns */
  const logColumns = [
    {
      name: 'Ip Address',
      sortable: true,
      sortField: 'ip_address',
      minWidth: '140px',
      cell: (row) => row.ip_address
    },
    {
      name: 'Login Date',
      sortable: true,
      sortField: 'login_at',
      minWidth: '140px',
      cell: (row) => row.login_at && getTransformDate(row.login_at, "DD MMM YYYY")
    }
  ]
  /* /Device Log history columns */

  /* Permission */
  const onPermissionCheckboxChange = (checked, value) => {
    const permissionData = [...permission]
    if (value) {
      const checkIndex = permissionData.findIndex(x => x.permission_id === value)
      if (checkIndex !== -1) {
        if (checked) {
          permissionData[checkIndex].permission_id = value
        } else {
          permissionData.splice(checkIndex, 1)
        }
      } else {
        permissionData.push({ permission_id: value })
      }
    }
    setPermission([...permissionData])
  }

  const getPermissionChecked = (value) => {
    if (permission && permission.length) {
      const index = permission.findIndex((x) => x.permission_id === value)
      if (index !== -1) {
        return true
      }
      return false
    }
    return false
  }

  const onPermissionSubmit = () => {
    if (permission && permission.length) {
      const userData = {
        user_id: id,
        permissions: permission
      }
      dispatch(updateUserLoader(false))
      dispatch(updatePermission(userData))
    }
  }
  /* /Permission */

  return store ? (
    <Row>
      <Col xs={12}>
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <Nav pills className="mb-2">
          <NavItem>
            <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
              <User className="font-medium-3 me-50" />
              <span className="fw-bold d-none d-sm-block">{t("Account")}</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
              <Lock className="font-medium-3 me-50" />
              <span className="fw-bold d-none d-sm-block">{t("Security")}</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
              <Unlock className="font-medium-3 me-50" />
              <span className="fw-bold d-none d-sm-block">{t("Permissions")}</span>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={active}>
          <TabPane tabId="1">
            <Card>
              <CardBody className="py-2 my-25">
                <Form id="account" onSubmit={acntHandleSubmit(onSubmitAccount)} autoComplete="off">
                  <div className="d-flex mb-2">
                    <div className="me-25">
                      <img
                        className="rounded me-50"
                        src={imageUrl ? imageUrl : store.userItem.profile_photo_path ? `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.userItem.profile_photo_path}` : `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
                        onError={(currentTarget) => onImageSrcError(currentTarget)}
                        alt="user-avatar"
                        height="100"
                        width="100"
                      />
                    </div>
                    <div className="d-flex align-items-end mt-75 ms-1">
                      <div>
                        <h4 className="mb-50">{store.userItem.name}</h4>
                        <Button
                          size="sm"
                          tag={Label}
                          type="button"
                          color="primary"
                          className="mb-75 me-75"
                        >
                          Change
                          <Input type="file" hidden accept="image/*" onChange={(event) => onFileChange(event)} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Row>
                    <Col sm={6} className="mb-1">
                      <Label className="form-label" for="username">
                        Username
                      </Label>
                      <Controller
                        defaultValue={store.userItem.email}
                        name="username"
                        id="username"
                        control={acntControl}
                        render={({ field }) => (
                          <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.username} invalid={acntErrors.username && true} />
                        )}
                      />
                      <FormFeedback>{acntErrors.username?.message}</FormFeedback>
                    </Col>

                    <Col sm={6} className="mb-1">
                      <Label className="form-label" for="name">
                        Name
                      </Label>
                      <Controller
                        defaultValue={store.userItem.name}
                        id="name"
                        name="name"
                        control={acntControl}
                        render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.fullname} invalid={acntErrors.name && true} />}
                      />
                      <FormFeedback>{acntErrors.name?.message}</FormFeedback>
                    </Col>

                    <Col sm={6} className="mb-1">
                      <Label className="form-label" for="email">
                        {t("Email")}
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
                        {t("Status")}
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
                        {t("Role")}
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
                        Company
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
                        Gender
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
                        Birth date
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
                        Mobile
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
                        Address Line 1
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
                        Address Line 2
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
                        Postcode
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
                        City
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
                        State
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
                        Country
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
                      {t("Save Change")}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </TabPane>

          <TabPane tabId="2">
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>{t("Change Password")}</CardTitle>
              </CardHeader>

              <CardBody className="py-2 my-25">
                <Form id="password" onSubmit={pswdHandleSubmit(onSubmitPassword)} autoComplete="off">
                  <Row>
                    <Col sm={6} className="mb-1">
                      <Label className="form-label" for="address">
                        Password
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
                        Retype Password
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
                      {t("Save Change")}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="border-bottom">
                <CardTitle tag="h4">{t("Recent devices")}</CardTitle>
              </CardHeader>

              <DatatablePagination
                customClass=""
                columns={logColumns}
                data={store.userDeviceLogs && store.userDeviceLogs.length ? store.userDeviceLogs : []}
                pagination={store.deviceLogPagination}
                handleSort={handleLogSort}
                handlePagination={handledeviceLogPagination}
                subHeaderComponent={
                  <CustomLogHeader
                    navigate={navigate}
                    rowsPerPage={logRowsPerPage}
                    handlePerPage={handleLogPerPage}
                  />
                }
              />
            </Card>
          </TabPane>

          <TabPane tabId="3">
            <Card>
              <CardHeader className="border-bottom">
                <CardTitle tag="h4">{t("Permissions")}</CardTitle>
              </CardHeader>

              <Table className='text-nowrap text-center border-bottom' responsive>
                <thead>
                  <tr>
                    <th className='text-start'>Type</th>
                    <th>Allow</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='text-start'>Delete Users</td>
                    <td>
                      <div className='d-flex form-check justify-content-center'>
                        <Input
                          type='checkbox'
                          id="admin-read"
                          value={1}
                          checked={getPermissionChecked(1)}
                          onChange={(event) => onPermissionCheckboxChange(event.target.checked, 1)}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='text-start'>See All Users</td>
                    <td>
                      <div className='d-flex form-check justify-content-center'>
                        <Input
                          type='checkbox'
                          id="staff-read"
                          value={2}
                          checked={getPermissionChecked(2)}
                          onChange={(event) => onPermissionCheckboxChange(event.target.checked, 2)}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='text-start'>See Contacts</td>
                    <td>
                      <div className='d-flex form-check justify-content-center'>
                        <Input
                          type='checkbox'
                          id="author-read"
                          value={3}
                          checked={getPermissionChecked(3)}
                          onChange={(event) => onPermissionCheckboxChange(event.target.checked, 3)}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='text-start'>See All Cases</td>
                    <td>
                      <div className='d-flex form-check justify-content-center'>
                        <Input
                          type='checkbox'
                          id="contributor-read"
                          value={4}
                          checked={getPermissionChecked(4)}
                          onChange={(event) => onPermissionCheckboxChange(event.target.checked, 4)}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='text-start'>Update Cases</td>
                    <td>
                      <div className='d-flex form-check justify-content-center'>
                        <Input
                          type='checkbox'
                          id="user-read"
                          value={5}
                          checked={getPermissionChecked(5)}
                          onChange={(event) => onPermissionCheckboxChange(event.target.checked, 5)}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='text-start'>See Letters</td>
                    <td>
                      <div className='d-flex form-check justify-content-center'>
                        <Input
                          type='checkbox'
                          id="user-letters"
                          value={6}
                          checked={getPermissionChecked(6)}
                          onChange={(event) => onPermissionCheckboxChange(event.target.checked, 6)}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div className='d-flex flex-wrap p-2'>
                <Button
                  type='button'
                  color='primary'
                  disabled={!store.loading}
                  onClick={() => onPermissionSubmit()}
                >
                  {t("Update")}
                </Button>
              </div>
            </Card>
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  ) : null
}

export default UserEditApp
