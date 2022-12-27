// ** React Imports
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Store & Actions
import {
  addUser,
  updateUserLoader,
  clearUserMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Button,
  FormFeedback
} from 'reactstrap'

// ** React Dropdown Import
import Select from 'react-select'

import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Utils
import {
  encryptData
} from '@utils'

// Constant
import {
  userItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalAddUser = ({
  open,
  roleItems,
  toggleModal
}) => {

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.user)
  const authStore = useSelector((state) => state.auth)

  /* Yup validation schema */
  const UserSchema = yup.object({
    first_name: yup.string().required(T('First name is required!')),
    last_name: yup.string().required(T('Last name is required!')),
    email: yup.string().required(T('Email is required!')).email(T('Invalid email address!')),
    Contact: yup.string().required(T('Mobile is required!')).min(6, T("Mobile Must be 6 digit!")).max(16, T("Mobile Must be 16 digit!")),
    password: yup.string().required(T('Password is required!')).min(6, T("Password Must be 6 digit!")),
    role_id: yup.object().required(T(`Role is required!`)).nullable()
  }).required()

  /* Constant */
  const [roleOptions, setRoleOptions] = useState([])

  /* Placeholder texts */
  const PlaceholderSchema = {
    name: "John Doe",
    first_name: "John",
    last_name: "Doe",
    Contact: "+4915901766553",
    email: "john.doe@example.com",
    password: "******",
    role_id: `${T("Select Role")}...`
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: { ...userItem },
    resolver: yupResolver(UserSchema)
  })

  const handleReset = () => {
    reset(userItem)
    toggleModal()
  }

  useEffect(() => {
    let list1 = []
    if (roleItems && roleItems.length) {
      list1 = roleItems.map(role => {
        return {
          value: role.role_id,
          label: role.RoleName
        }
      })

      if (authStore.userItem && authStore.userItem.id) {
        if (authStore.userItem.role_id !== 10) {
          const index = list1.findIndex((x) => x.value === 10)
          if (index !== -1) {
            list1.splice(index, 1)
          }
        }
      }
    }
    setRoleOptions(list1)

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearUserMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "ADDED_ITEM") {
      handleReset()
    }
  }, [roleItems, authStore.userItem, store.success, store.error, store.actionFlag])

  /* Submitting data */
  const onSubmit = (values) => {
    if (values) {
      const userData = {
        first_name: values.first_name,
        last_name: values.last_name,
        Contact: values.Contact,
        email: values.email,
        password: encryptData(values.password)
      }

      if (values.role_id && values.role_id.value) {
        userData.role_id = values.role_id.value
      }

      // console.log("onSubmit >>>>> ", userData)
      /* Calling api */
      dispatch(updateUserLoader(false))
      dispatch(addUser(userData))
    }
  }

  return store ? (
    <Sidebar
      size="lg"
      open={open}
      title="New User"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={handleReset}
    >
      {!store.loading ? (
        <DotPulse
          className="d-flex justify-content-center position-absolute top-50 w-75 zindex-1"
        />
      ) : null}

      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mb-1">
          <Label className="form-label" for="first_name">
            {T("First Name")}
          </Label>
          <Controller
            defaultValue=""
            id="first_name"
            name="first_name"
            control={control}
            render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.first_name} invalid={errors.first_name && true} />}
          />
          <FormFeedback>{errors.first_name?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="last_name">
            {T("Last Name")}
          </Label>
          <Controller
            defaultValue=""
            id="last_name"
            name="last_name"
            control={control}
            render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.last_name} invalid={errors.last_name && true} />}
          />
          <FormFeedback>{errors.last_name?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="Contact">
            {T("Telephone")}
          </Label>
          <Controller
            defaultValue=""
            id="Contact"
            name="Contact"
            control={control}
            render={({ field }) => <Input {...field} type="number" placeholder={PlaceholderSchema && PlaceholderSchema.Contact} invalid={errors.Contact && true} />}
          />
          <FormFeedback>{errors.Contact?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="email">
            {T("Email")}
          </Label>
          <Controller
            defaultValue=""
            name="email"
            id="email"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" placeholder={PlaceholderSchema && PlaceholderSchema.email} invalid={errors.email && true} />
            )}
          />
          <FormFeedback>{errors.email?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="password">
            {T("Password")}
          </Label>
          <Controller
            defaultValue=""
            id="password"
            name="password"
            control={control}
            render={({ field }) => (
              <InputPasswordToggle
                className="input-group-merge"
                placeholder={PlaceholderSchema && PlaceholderSchema.password}
                invalid={errors.password && true}
                {...field}
              />
            )}
          />
          <FormFeedback>{errors.password?.message}</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="role_id">
            {T("User Role")}
          </Label>
          <Controller
            defaultValue=""
            name="role_id"
            id="role_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="role_id"
                placeholder={PlaceholderSchema && PlaceholderSchema.role_id}
                options={roleOptions}
                className="react-select"
                classNamePrefix="select"
                isClearable={false}
              />
            )}
          />
          <FormFeedback className="d-block">{errors.role_id?.message}</FormFeedback>
        </div>

        <div className="d-flex flex-wrap mb-2 mt-2">
          <Button
            type="submit"
            className="me-1"
            color="primary"
            disabled={!store.loading}
          >
            {T("Submit")}
          </Button>

          <Button
            outline
            color="secondary"
            onClick={handleReset}
            disabled={!store.loading}
          >
            {T("Cancel")}
          </Button>
        </div>
      </Form>
    </Sidebar>
  ) : null
}

export default ModalAddUser
