/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Chat App Component Imports
import Chat from './Chat'
import Sidebar from './SidebarLeft'
import UserProfileSidebar from './UserProfileSidebar'

// ** Utils
import {
  isUserLoggedIn,
  getTotalNumber
} from '@utils'

// Constant
import {
  root,
  TN_CHAT,
  TN_CHAT_CONTACT
} from '@constant/defaultValues'

// ** Third Party Components
import classnames from 'classnames'
import { socketIo } from '@src/index'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getChatContacts,
  setDefaultVariables
} from '@src/pages/chat/store'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'

const ChatApp = () => {
  // ** Store Vars
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector(state => state.chat)

  // ** States
  const [placeholderChats] = useState(getTotalNumber(TN_CHAT) ?? 0)
  const [placeholderContacts] = useState(getTotalNumber(TN_CHAT_CONTACT) ?? 0)
  const [loadFirst, setLoadFirst] = useState(true)
  const [user, setUser] = useState({})
  const [sidebar, setSidebar] = useState(false)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar)
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft)
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)
  const handleOverlayClick = () => {
    setSidebar(false)
    setUserSidebarRight(false)
    setUserSidebarLeft(false)
  }

  // ** Set user function for Right Sidebar
  const handleUser = (user) => setUser(user)

  // ** Get data on Mount
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      dispatch(getChatContacts({}))
      dispatch(setDefaultVariables({}))
      handleUser({})
      setLoadFirst(false)
    }
  }, [loadFirst])
  // console.log("store >>> ", store)

  return (
    <Fragment>
      <Sidebar
        store={store}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        placeholderChats={placeholderChats}
        placeholderContacts={placeholderContacts}
        handleUserSidebarLeft={handleUserSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: userSidebarRight === true || sidebar === true || userSidebarLeft === true
              })}
              onClick={handleOverlayClick}
            ></div>
            <Chat
              store={store}
              socketIo={socketIo}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />

            <UserProfileSidebar
              user={user}
              userSidebarRight={userSidebarRight}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ChatApp
