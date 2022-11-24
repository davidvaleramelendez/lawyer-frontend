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
  getContactNotification,
  clearTopNavMessage
} from '@store/navTopNotification'

// ** Utils
import {
  setInnerHtml
} from '@utils'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  MessageSquare
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

const ContactDropdown = () => {
  /* Hook */
  const { t } = useTranslation()

  // ** Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.navTopNotification)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)

  useEffect(() => {
    if (loadFirst) {
      dispatch(getContactNotification({}))
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

  // ** Function to render Contact Notifications
  const renderContactNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {store.contactNotificationItems.map((item, index) => {
          return (
            <div key={`contact-notification-${index}`} className='list-item align-items-center'>
              <Link
                className='text-body'
                to={`${adminRoot}/contact/view/${item.ContactID}`}
                onClick={() => handleDropdownItemClick()}
              >
                <div className='list-item-body flex-grow-1'>
                  <div className='media-heading'>
                    <h6 className='cart-item-title'>
                      {(item.Subject && setInnerHtml(item.Subject)) || ""}
                    </h6>
                    <small className='cart-item-by'>{item.Name || ""}</small>
                  </div>

                  <div className='media-heading'>
                    <small className='cart-item-by'>{item.Email || ""}</small>
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
        <MessageSquare size={21} />
        <Badge pill color='primary' className='badge-up'>
          {store.contactNotificationItems.length || 0}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto text-capitalize'>{t("contacts")}</h4>
          </DropdownItem>
        </li>

        {store.contactNotificationItems && store.contactNotificationItems.length === 0 ? (
          <li className='dropdown-menu-header'>
            <DropdownItem className='d-flex' tag='div' header>
              <h4 className='text-primary text-center'>{t("No Unread")} {t("Contact")}</h4>
            </DropdownItem>
          </li>
        ) : null}

        {store.contactNotificationItems && store.contactNotificationItems.length ? (
          renderContactNotificationItems()
        ) : null}

        <li className='dropdown-menu-footer'>
          <Button
            block
            tag={Link}
            color='primary'
            to={`${adminRoot}/contact`}
            onClick={() => handleDropdownItemClick()}
          >
            {t("All")} {t("contacts")}
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  ) : null
}

export default ContactDropdown
