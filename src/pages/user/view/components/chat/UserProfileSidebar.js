// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Utils
import {
  getWebPreviewUrl
} from '@utils'

// ** Icons Import
import {
  X,
  Mail,
  Clock,
  PhoneCall
} from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Translation
import { T } from '@localization'

const UserProfileSidebar = (props) => {
  // ** Props
  const { user, handleUserSidebarRight, userSidebarRight } = props

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  return (
    <div className={classnames('user-profile-sidebar', { show: userSidebarRight === true })}>
      <header className='user-profile-header'>
        <span className='close-icon' onClick={handleUserSidebarRight}>
          <X size={14} />
        </span>
        <div className='header-profile-sidebar'>
          <Avatar
            size='xl'
            imgWidth='70'
            imgHeight='70'
            className='box-shadow-1 avatar-border'
            img={renderFileWebUrlPreview(user.profile_photo_path) || defaultAvatar}
          />
          <h4 className='chat-user-name'>{user && user.name}</h4>
          <span className='user-post'>{user && user.role && user.role.RoleName}</span>
        </div>
      </header>
      <PerfectScrollbar className='user-profile-sidebar-area' options={{ wheelPropagation: false }}>
        <div className='personal-info'>
          <h6 className='section-label mb-1 mt-3'>{T('Personal Information')}</h6>
          <ul className='list-unstyled'>
            <li className='mb-1'>
              <Mail className='me-75' size={17} />
              <span className='align-middle'>{user.email}</span>
            </li>
            <li className='mb-1'>
              <PhoneCall className='me-50' size={17} />
              <span className='align-middle'> +1(123) 456 - 7890</span>
              {/* <span className='align-middle'>{user && user.Contact}</span> */}
            </li>
            <li>
              <Clock className='me-50' size={17} />
              <span className='align-middle'> Mon - Fri 10AM - 8PM</span>
            </li>
          </ul>
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default UserProfileSidebar
