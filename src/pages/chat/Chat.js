/* eslint-disable object-shorthand */

// ** React Imports
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import {
  sendMessage,
  getChatHistory,
  getChatContacts,
  clearChatMessage,
  markImportant
} from '@src/pages/chat/store'
import {
  getChatNotification
} from '@store/navTopNotification'
import { useDispatch } from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  Menu,
  Send,
  MoreVertical,
  MessageSquare,
  Star,
  Edit,
  Trash
} from 'react-feather'

// ** Reactstrap Imports
import {
  Form,
  Input,
  Button,
  InputGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Utils
import {
  getWebPreviewUrl,
  getTransformDate
} from '@utils'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Translation
import { T } from '@localization'

const ChatLog = (props) => {
  // ** Props & Store
  const { store, socketIo, handleUser, handleUserSidebarRight, handleSidebar, userSidebarLeft } = props
  const { userProfile, selectedUser, chats, chatCount, totalChatCount, success, error, actionFlag } = store

  // ** Refs & Dispatch
  const chatArea = useRef(null)
  const dispatch = useDispatch()

  // ** State
  const [message, setMessage] = useState('')

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }

  const handleOnIntervalCalling = () => {
    dispatch(getChatNotification({}))
    dispatch(getChatContacts({}))
    if (selectedUser && selectedUser.id) {
      dispatch(getChatHistory({ id: selectedUser.id, payload: { chatCount: chatCount } }))
    }
  }

  /* Interval timing mount */
  useEffect(() => {
    socketIo.on('NEW_CHAT_REQUEST', () => {
      handleOnIntervalCalling()
    })
    return () => {
      socketIo.off('NEW_CHAT_REQUEST')
    }
  })
  /* /Interval timing mount */

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const chatsLen = chats && chats.length

    if (chatsLen) {
      scrollToBottom()
    }

    /* For blank message api called inside */
    if (success || error || actionFlag) {
      dispatch(clearChatMessage())
    }

    /* For reset message state */
    if (actionFlag && actionFlag === "MESSAGE_SENT") {
      setMessage('')
      socketIo.emit('SEND_MESSAGE', { sender_id: userProfile.id, receiver_id: selectedUser.id || "" })
    }
  }, [chats, error, success, actionFlag])

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (chats && chats.length) {
      chatLog = chats
    }

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].sender_id : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.sender_id) {
        msgGroup.messages.push({
          id: msg.id,
          msg: msg.message,
          is_important: msg.is_important,
          time: getTransformDate(msg.created_at, "DD-MM-YYYY hh:mm a")
        })
      } else {
        chatMessageSenderId = msg.sender_id
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.sender_id,
          messages: [
            {
              id: msg.id,
              msg: msg.message,
              is_important: msg.is_important,
              time: getTransformDate(msg.created_at, "DD-MM-YYYY hh:mm a")
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }

  // ** Mark the chat item important
  const handleMarkImportant = (id) => (() => {
    dispatch(markImportant(id))
  })

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': item.senderId !== userProfile.id
          })}
        >
          <div className='chat-avatar'>
            <Avatar
              imgWidth={36}
              imgHeight={36}
              className='box-shadow-1 cursor-pointer'
              img={item.senderId === selectedUser.id ? renderFileWebUrlPreview(selectedUser.profile_photo_path) || defaultAvatar : renderFileWebUrlPreview(userProfile.profile_photo_path) || defaultAvatar}
            />
          </div>

          <div className='chat-body'>
            {item && item.messages.map((chat, index) => (
              <div key={`${index}_${chat.msg}`} className='chat-content'>
                <p className="text-break">{chat.msg}</p>
                {chat.time ? (<div style={{ textAlign: 'right', fontSize: '10px' }}>
                  {chat.time}
                </div>) : null}
                <div className='action-buttons'>
                  {chat.is_important === 0 && (
                    <span className='action-button-item' onClick={handleMarkImportant(chat.id)}>
                      <Star size={17} />
                    </span>
                  )}
                  <span className='action-button-item'>
                    <Edit size={17} />
                  </span>
                  <span className='action-button-item'>
                    <Trash size={17} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    })
  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (user) => {
    handleUserSidebarRight()
    handleUser(user)
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (!Object.keys(selectedUser).length && !userSidebarLeft && window.innerWidth < 992) {
      handleSidebar()
    }
  }

  // ** Sends New Msg
  const handleSendMsg = (event) => {
    event.preventDefault()
    if (message.trim().length) {
      dispatch(sendMessage({ receiver_id: selectedUser.id, message: message }))
    }
  }

  const handleLoadMore = (event) => {
    event.preventDefault()
    dispatch(getChatHistory({ id: selectedUser.id, payload: { chatCount: chatCount } }))
  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper = selectedUser && Object.keys(selectedUser).length && chats && chats.length ? PerfectScrollbar : 'div'

  return (
    <div className='chat-app-window'>
      <div className={classnames('start-chat-area', { 'd-none': selectedUser && Object.keys(selectedUser).length })}>
        <div className='start-chat-icon mb-1'>
          <MessageSquare />
        </div>
        <h4 className='sidebar-toggle start-chat-text' onClick={handleStartConversation}>
          {T('Start Conversation')}
        </h4>
      </div>

      {Object.keys(selectedUser).length ? (
        <div className={classnames('active-chat', { 'd-none': selectedUser === null })}>
          <div className='chat-navbar'>
            <header className='chat-header'>
              <div className='d-flex align-items-center'>
                <div className='sidebar-toggle d-block d-lg-none me-1' onClick={handleSidebar}>
                  <Menu size={21} />
                </div>

                <Avatar
                  imgHeight='36'
                  imgWidth='36'
                  img={renderFileWebUrlPreview(selectedUser.profile_photo_path) || defaultAvatar}
                  // status={selectedUser.contact.status}
                  className='avatar-border user-profile-toggle m-0 me-1'
                  onClick={() => handleAvatarClick(selectedUser)}
                />
                <h6 className='mb-0'>{selectedUser.name}</h6>
              </div>

              {totalChatCount > chatCount ? (
                <div className='d-flex align-items-center'>
                  <Button
                    type="button"
                    color="primary"
                    className="btn btn-primary"
                    onClick={handleLoadMore}
                  >
                    {T('Load More')}
                  </Button>
                </div>
              ) : null}

              <div className='d-flex align-items-center'>
                <UncontrolledDropdown className='more-options-dropdown'>
                  <DropdownToggle className='btn-icon' color='transparent' size='sm'>
                    <MoreVertical size='18' />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem href='/' onClick={(event) => {
                      event.preventDefault()
                      handleAvatarClick(selectedUser)
                    }}>
                      {T('View Contact')}
                    </DropdownItem>
                    <DropdownItem href='/' onClick={(event) => event.preventDefault()}>
                      {T('Clear Chat')}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </header>
          </div>

          <ChatWrapper ref={chatArea} className='user-chats' options={{ wheelPropagation: false }}>
            {chats && chats.length ? (
              <div className='chats'>{renderChats()}</div>
            ) : null}
          </ChatWrapper>

          <Form className='chat-app-form' onSubmit={(event) => handleSendMsg(event)}>
            <InputGroup className='input-group-merge me-1 form-send-message'>
              <Input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder='Type your message or use speech to text'
              />
            </InputGroup>

            <Button className='send' color='primary'>
              <Send size={14} className='d-lg-none' />
              <span className='d-none d-lg-block'>{T('Send')}</span>
            </Button>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default ChatLog
