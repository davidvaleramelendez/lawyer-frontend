/* eslint-disable multiline-ternary */

// ** React Imports
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
  useSelector,
  useDispatch
} from 'react-redux'
import {
  getEmailNotification,
  clearTopNavMessage
} from '@store/navTopNotification'

// ** Utils
import {
  getTransformDate
} from '@utils'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Mail
} from 'react-feather'

// ** Reactstrap Imports
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

const EmailDropdown = () => {
  /* Hook */
  const { t } = useTranslation()

  // ** Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.navTopNotification)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (loadFirst) {
      dispatch(getEmailNotification({}))
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearTopNavMessage())
    }
  }, [store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

  // ** Function to toggle Dropdown
  const toggle = () => setDropdownOpen((prevState) => !prevState)

  const handleDropdownItemClick = () => {
    setDropdownOpen(false)
  }

  // ** Function to render Email Notifications
  const renderEmailNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {store.emailNotificationItems.map((item, index) => {
          return (
            <div key={`contact-notification-${index}`} className='list-item align-items-center'>
              <Link
                className='text-body'
                target="_blank"
                to={`${adminRoot}/email/view/${item.id}`}
                onClick={() => handleDropdownItemClick()}
              >
                <div className='list-item-body flex-grow-1'>
                  <div className='media-heading'>
                    <h6 className='cart-item-title'>
                      {(item && item.subject) || ""}
                    </h6>
                    <small className='cart-item-by'>{(item && item.sender && item.sender.name) || ""}</small>
                  </div>

                  <div className='media-heading'>
                    <small className='cart-item-by'>{(item.created_at && getTransformDate(item.created_at, "DD MMM YYYY HH:mm")) || ""}</small>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </PerfectScrollbar>
    )
  }

  return store ? (
    <UncontrolledDropdown
      tag='li'
      isOpen={dropdownOpen}
      toggle={toggle}
      className='dropdown-notification nav-item me-25'
    >
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Mail size={21} />
        <Badge pill color='primary' className='badge-up'>
          {store.emailNotificationItems.length || 0}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto text-capitalize'>{t("emails")}</h4>
          </DropdownItem>
        </li>

        {store.emailNotificationItems && store.emailNotificationItems.length === 0 ? (
          <li className='dropdown-menu-header'>
            <DropdownItem className='d-flex' tag='div' header>
              <h4 className='text-primary text-center'>{t("No Unread")} {t("Email")}</h4>
            </DropdownItem>
          </li>
        ) : null}

        {store.emailNotificationItems && store.emailNotificationItems.length ? (
          renderEmailNotificationItems()
        ) : null}

        <li className='dropdown-menu-footer'>
          <Button
            block
            tag={Link}
            color='primary'
            to={`${adminRoot}/email`}
            onClick={() => handleDropdownItemClick()}
          >
            {t("All")} {t("emails")}
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  ) : null
}

export default EmailDropdown
