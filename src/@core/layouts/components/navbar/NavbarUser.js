// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
import ContactDropdown from './ContactDropdown'
import EmailDropdown from './EmailDropdown'
import NotificationDropdown from './NotificationDropdown'
import PhoneNotification from './PhoneNotification'

const NavbarUser = () => {

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <NavbarSearch />
      <ContactDropdown />
      <EmailDropdown />
      <NotificationDropdown />
      <PhoneNotification />
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
