// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
import ContactDropdown from './ContactDropdown'
import EmailDropdown from './EmailDropdown'
import NotificationDropdown from './NotificationDropdown'

const NavbarUser = () => {

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <NavbarSearch />
      <ContactDropdown />
      <EmailDropdown />
      <NotificationDropdown />
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
