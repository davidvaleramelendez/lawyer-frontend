/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'
import DotPulse from '@components/dotpulse'

// ** Store & Actions
import {
  getContactChat,
  getChatContacts
} from '@src/pages/chat/store'
import {
  getChatNotification
} from '@store/navTopNotification'
import { useDispatch } from 'react-redux'

// ** Utils
import {
  isObjEmpty,
  getWebPreviewUrl,
  getTransformDate
} from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  X,
  Mail,
  Search,
  PhoneCall
} from 'react-feather'

// ** Reactstrap Imports
import {
  Input,
  Badge,
  CardText,
  InputGroup,
  InputGroupText
} from 'reactstrap'

/* Blank avatar image */
import avatarBlank from '@src/assets/images/avatars/avatar-blank.png'

// ** Translation
import { T } from '@localization'

const SidebarLeft = (props) => {
  // ** Props & Store
  const {
    store,
    sidebar,
    handleSidebar,
    userSidebarLeft,
    placeholderChats,
    placeholderContacts,
    handleUserSidebarLeft
  } = props

  const {
    loading,
    contacts,
    chatItems,
    userProfile
  } = store

  // ** Dispatch
  const dispatch = useDispatch()

  // ** State
  const [active, setActive] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // ** Handles User Chat Click
  const handleUserClick = (id, from = '') => {
    dispatch(getContactChat({ id: id, chatCount: 0 }))

    setActive(`${from}_${id}`)
    if (sidebar === true) {
      handleSidebar()
    }

    if (from === 'chat') {
      dispatch(getChatNotification())
    }
  }

  useEffect(() => {
  }, [])

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  // ** Renders Chat
  const renderChats = () => {
    if (!loading && placeholderChats === 0) {
      return <DotPulse />
    }
    if (!loading && placeholderChats > 0) {
      return (<>
        {Array.from(Array(placeholderChats).keys(), (row, index) => (
          <li
            key={`placeholder-chat-${index}`}
            className="placeholder-glow"
          >
            <Avatar
              imgWidth='42'
              imgHeight='42'
              className="placeholder"
              img={avatarBlank}
            />

            <div className='chat-info flex-grow-1'>
              <h5 className='placeholder w-50 mb-0'>{""}</h5>
              <CardText className='text-truncate placeholder w-75' />
            </div>

            <div className='chat-meta text-nowrap mt-50 w-25'>
              <small className='float-end mb-25 chat-time ms-25 placeholder w-100'>{""}</small>
            </div>
          </li>
        ))}
      </>)
    }

    if (searchInput.length && !Object.keys(chatItems).length) {
      return (
        <li className='no-results show'>
          <h6 className='mb-0'>{T('No Chats Found')}</h6>
        </li>
      )
    } else {
      if (chatItems && Object.keys(chatItems).length) {
        return Object.keys(chatItems).map((key) => {
          const item = chatItems[key]
          const time = getTransformDate(item.created_at ? item.created_at : new Date(), "HH:mm:ss")
          return (
            <li
              key={item.id}
              onClick={() => handleUserClick(item.user_id, 'chat')}
              className={classnames({
                active: active === `chat_${item.user_id}`
              })}
            >
              <Avatar
                imgHeight='42'
                imgWidth='42'
                img={renderFileWebUrlPreview(item.profile_photo_path) || avatarBlank}
                status={item.has_chat_status_exists ? 'online' : 'offline'}
              />
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.name}</h5>
                <CardText className='text-truncate'>
                  {item.message ? item.message : null}
                </CardText>
              </div>
              <div className='chat-meta text-nowrap'>
                <small className='float-end mb-25 chat-time ms-25'>{time}</small>
                {item.count >= 1 ? (
                  <Badge className='float-end' color='danger' pill>
                    {item.count}
                  </Badge>
                ) : null}
              </div>
            </li>
          )
        })
      } else {
        return null
      }
    }
  }

  // ** Renders Contact
  const renderContacts = () => {
    if (!loading && placeholderContacts === 0) {
      return <DotPulse />
    }
    if (!loading && placeholderContacts > 0) {
      return (<>
        {Array.from(Array(placeholderContacts).keys(), (row, index) => (
          <li
            key={`placeholder-contact-${index}`}
            className="placeholder-glow"
          >
            <Avatar
              imgWidth='42'
              imgHeight='42'
              className="placeholder"
              img={avatarBlank}
            />

            <div className='chat-info flex-grow-1'>
              <h5 className='mb-0 placeholder w-75'>{""}</h5>
            </div>
          </li>
        ))}
      </>)
    }

    if (searchInput.length && !contacts.length) {
      return (
        <li className='no-results show'>
          <h6 className='mb-0'>{T('No Chats Found')}</h6>
        </li>
      )
    } else {
      if (contacts && contacts.length) {
        return contacts.map(item => {
          return (
            <li
              key={item.id}
              onClick={() => handleUserClick(item.id, 'contact')}
              className={classnames({
                active: active === `contact_${item.id}`
              })}
            >
              <Avatar
                imgWidth='42'
                imgHeight='42'
                img={renderFileWebUrlPreview(item.profile_photo_path) || avatarBlank}
                status={item.has_chat_status_exists ? 'online' : 'offline'}
              />
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.name}</h5>
                {item && item.role ? (
                  <CardText className='text-truncate'>{(item.role && item.role.RoleName) || ""}</CardText>
                ) : null}
              </div>
            </li>
          )
        })
      } else {
        return null
      }
    }
  }

  // ** Handles Filter
  const handleSearch = (value) => {
    setSearchInput(value)
    dispatch(getChatContacts({ search: value }))
  }

  return store ? (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classnames("chat-profile-sidebar", {
            show: userSidebarLeft
          })}
        >
          <header className="chat-profile-header">
            <div className="close-icon" onClick={handleUserSidebarLeft}>
              <X size={14} />
            </div>
            <div
              className={`header-profile-sidebar ${isObjEmpty(userProfile) ? 'placeholder-glow' : 'placeholder-glow'}`}
            >
              <Avatar
                size={"xl"}
                status={"online"}
                className={`box-shadow-1 avatar-border ${isObjEmpty(userProfile) ? 'placeholder' : ''}`}
                img={renderFileWebUrlPreview(userProfile.profile_photo_path) || avatarBlank}
              />
              <h4
                className={`chat-user-name ${isObjEmpty(userProfile) ? 'placeholder w-100' : ''}`}
              >
                {userProfile && userProfile.name}
              </h4>
              <span
                className={`user-post ${isObjEmpty(userProfile) ? 'placeholder w-100' : ''}`}
              >
                {userProfile && userProfile.role && userProfile.role.RoleName}
              </span>
            </div>
          </header>
          <PerfectScrollbar className="profile-sidebar-area" options={{ wheelPropagation: false }}>
            <h6 className="section-label mb-1 mt-2">{T('Personal Information')}</h6>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center cursor-pointer mb-1">
                <Mail className="me-75" size={17} />
                <span className="align-middle">{(userProfile && userProfile.email) || ""}</span>
              </li>

              <li className="d-flex align-items-center cursor-pointer mb-1">
                <PhoneCall className="me-75" size={17} />
                <span className="align-middle">{(userProfile && userProfile.Contact) || ""}</span>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>

        <div
          className={classnames("sidebar-content", {
            show: sidebar === true
          })}
        >
          <div className="sidebar-close-icon" onClick={handleSidebar}>
            <X size={14} />
          </div>

          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div
                className={`sidebar-profile-toggle ${isObjEmpty(userProfile) ? 'placeholder-glow' : ''}`}
                onClick={handleUserSidebarLeft}
              >
                {Object.keys(userProfile).length ? (
                  <Avatar
                    imgWidth="42"
                    imgHeight="42"
                    status="online"
                    className="avatar-border"
                    img={renderFileWebUrlPreview(userProfile.profile_photo_path) || avatarBlank}
                  />
                ) : (
                  <Avatar
                    imgWidth="42"
                    imgHeight="42"
                    status="online"
                    className="avatar-border placeholder"
                    img={avatarBlank}
                  />
                )}
              </div>

              <InputGroup className="input-group-merge ms-1 w-100">
                <InputGroupText className="round">
                  <Search className="text-muted" size={14} />
                </InputGroupText>
                <Input
                  value={searchInput}
                  className="round"
                  placeholder="Search or start a new chat"
                  onChange={(event) => handleSearch(event.target.value)}
                />
              </InputGroup>
            </div>
          </div>

          <PerfectScrollbar className="chat-user-list-wrapper list-group" options={{ wheelPropagation: false }}>
            <h4 className="chat-list-title">{T('Chats')}</h4>
            <ul className="chat-users-list chat-list media-list">{renderChats()}</ul>
            <h4 className="chat-list-title">{T('Contacts')}</h4>
            <ul className="chat-users-list contact-list media-list">{renderContacts()}</ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null
}

export default SidebarLeft
