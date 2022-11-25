// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

// ** Store & Actions
import {
  deleteUser,
  getUserView,
  getUserPermission,
  clearUserMessage
} from '../store'
import {
  clearCaseMessage
} from '../../case/store'
import {
  clearInvoiceMessage
} from '../../invoice/store'
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

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** User view Components
import UserTabs from './Tabs'
import UserInfoCard from './UserInfoCard'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/apps/app-users.scss'

const UserView = () => {
  // ** Hooks
  const { id } = useParams()
  const navigate = useNavigate()

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.user)
  const caseStore = useSelector((state) => state.cases)
  const invoiceStore = useSelector((state) => state.invoice)

  // ** States
  const [active, setActive] = useState('1')
  const [loadFirst, setLoadFirst] = useState(true)

  const toggleTab = (tab) => {
    setActive(tab)
  }

  // ** Get contact on mount based on id
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
      dispatch(getUserView(id))
      dispatch(getUserPermission(id))
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearUserMessage())
    }

    if (caseStore.success || caseStore.error || caseStore.actionFlag) {
      dispatch(clearCaseMessage())
    }

    if (invoiceStore.success || invoiceStore.error || invoiceStore.actionFlag) {
      dispatch(clearInvoiceMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }

    /* If contact deleted then redirected */
    if (store.actionFlag && store.actionFlag === "DELETED") {
      navigate(`${adminRoot}/user`)
    }
  }, [store.success, store.error, store.actionFlag, caseStore.success, caseStore.error, caseStore.actionFlag, invoiceStore.success, invoiceStore.error, invoiceStore.actionFlag, loadFirst])
  // console.log("store ", store)

  const onDeleteUser = (userId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId))
      }
    })
  }

  return store ? (<Fragment>
    <div className="app-user-view">
      <Row>
        <Col xl={4} lg={5} xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard
            id={id}
            userItem={store.userItem}
            onDeleteUser={onDeleteUser}
          />
        </Col>

        <Col xl={8} lg={7} xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs
            id={id}
            active={active}
            toggleTab={toggleTab}
            permissions={store.permissions}
          />
        </Col>
      </Row>
    </div>
  </Fragment>) : null
}

export default UserView
