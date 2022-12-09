// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  getRoleList,
  getUserView,
  getUserPermission,
  clearUserMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// ** Reactstrap Imports
import {
  Col,
  Row
} from 'reactstrap'

// ** Utils
import {
  isUserLoggedIn
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'
import Notification from '@components/toast/notification'

// ** User view Components
import UserTabs from './Tabs'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

// ** Translation
import { T } from '@localization'

const UserEditApp = () => {
  // ** Hooks
  const { id } = useParams()

  // ** Store vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.user)

  /* Constant */
  const [loadFirst, setLoadFirst] = useState(true)
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

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
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearUserMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }
  }, [store.roleItems, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

  return store ? (
    <Row>
      <Col xs={12}>
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <UserTabs
          id={id}
          active={active}
          toggleTab={toggleTab}
        />
      </Col>
    </Row>
  ) : null
}

export default UserEditApp
