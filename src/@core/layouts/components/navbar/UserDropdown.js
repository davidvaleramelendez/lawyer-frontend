// ** React Imports
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import {
  getCurrentUser,
  isUserLoggedIn
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// Constant
import {
  root,
  adminRoot
} from '@constant/defaultValues'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  logout,
  updateAuthLoader,
  cleanAuthMessage
} from '@src/pages/auth/store'

// ** Third Party Components
import {
  User,
  Mail,
  Power,
  CheckSquare,
  MessageSquare
} from 'react-feather'

// ** Reactstrap Imports
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'

// ** Translation
import { T } from '@localization'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.auth)
  const userStore = useSelector((state) => state.user)

  // ** State
  const [userData, setUserData] = useState(getCurrentUser)

  //** ComponentDidMount
  useEffect(() => {
    /* Reset form data */
    if (userStore && userStore.actionFlag && (userStore.actionFlag === "ACCOUNT_SETTING")) {
      setUserData(getCurrentUser)
    }
  }, [userStore.actionFlag])

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getCurrentUser)
    }

    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(cleanAuthMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "LOGOUT") {
      navigate(root)
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

  const onLogoutHandle = (event) => {
    if (event) {
      event.preventDefault()
    }

    dispatch(updateAuthLoader(false))
    dispatch(logout())
  }

  //** Vars
  const userAvatar = userData && userData.profile_photo_path ? `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${userData.profile_photo_path}` : defaultAvatar || defaultAvatar

  return (<>
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(userData && userData.name) || 'John Doe'}</span>
          <span className='user-status'>{(userData && userData.role && userData.role.RoleName) || ''}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to={`${adminRoot}/account-setting`}>
          <User size={14} className='me-75' />
          <span className='align-middle'>{T('Profile')}</span>
        </DropdownItem>

        <DropdownItem tag={Link} to={`${adminRoot}/email`}>
          <Mail size={14} className='me-75' />
          <span className='align-middle'>{T('Inbox')}</span>
        </DropdownItem>

        <DropdownItem tag={Link} to={`${adminRoot}/todo`}>
          <CheckSquare size={14} className='me-75' />
          <span className='align-middle'>{T('Tasks')}</span>
        </DropdownItem>

        <DropdownItem tag={Link} to={`${adminRoot}/chat`}>
          <MessageSquare size={14} className='me-75' />
          <span className='align-middle'>{T('Chats')}</span>
        </DropdownItem>

        <DropdownItem divider />
        <DropdownItem tag={Link} to='/login' onClick={(event) => onLogoutHandle(event)}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>{T('Logout')}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </>)
}

export default UserDropdown
