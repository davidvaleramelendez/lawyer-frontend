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
  getChatNotification,
  clearTopNavMessage
} from '@store/navTopNotification'

// ** Utils
import {
  getTransformDate
} from '@utils'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Bell
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

const NotificationDropdown = () => {
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
      dispatch(getChatNotification({}))
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

  // ** Function to render Chat Notifications
  const renderChatNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {store.chatNotificationItems.map((item, index) => {
          return (
            <div key={`chat-notification-${index}`} className='list-item align-items-center'>
              <div className='list-item-body flex-grow-1'>
                <div className='media-heading'>
                  <h6 className='cart-item-title'>
                    <a
                      href={'#'}
                      className="text-body"
                      onClick={(event) => event.preventDefault()}
                    >
                      {(item && item.sender && item.sender.name) || ""}
                    </a>
                  </h6>
                  <small className='cart-item-by text-wrap'>{item.message || ""}</small>
                </div>

                <div className='media-heading'>
                  <small className='cart-item-by'>{(item.created_at && getTransformDate(item.created_at, "YYYY-MM-DD HH:mm:ss")) || ""}</small>
                </div>
              </div>
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
      <DropdownToggle
        tag='a'
        href='/'
        className='nav-link'
        onClick={(event) => event.preventDefault()}
      >
        <Bell size={21} />
        <Badge pill color='danger' className='badge-up'>
          {store.chatNotificationItems.length || 0}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>{t("Notifications")}</h4>
          </DropdownItem>
        </li>

        {store.chatNotificationItems && store.chatNotificationItems.length ? (
          renderChatNotificationItems()
        ) : null}

        <li className='dropdown-menu-footer'>
          <Button
            block
            tag={Link}
            color='primary'
            to={`${adminRoot}/chat`}
            onClick={() => handleDropdownItemClick()}
          >
            {t("All")} {t("notifications")}
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  ) : null
}

export default NotificationDropdown
