// ** React Imports
import { React, useEffect, useState } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  handleCustomizerOpen
} from '@store/layout'

// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
import ContactDropdown from './ContactDropdown'
import EmailDropdown from './EmailDropdown'
import NotificationDropdown from './NotificationDropdown'
import PhoneNotification from './PhoneNotification'

// ** Reactstrap Imports
import {
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// ** Icons Import
import { Settings } from 'react-feather'

// ** Utils Import
import { getWebPreviewUrl } from '@utils'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { socketIo } from '@src/index'

// ** Translation
import { T } from '@localization'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-default.jpg'

const NavbarUser = () => {

  // ** Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector(state => state.layout)

  const { openCustomizer } = layoutStore

  // ** States
  const [modalVisible, setModalVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [marked_at, setMarkedAt] = useState(new Date())
  const [current, setCurrent] = useState(new Date())
  const [timer, setTimer] = useState(null)
  const [user, setUser] = useState({
    name: '',
    photo: defaultAvatar
  })

  // ** Toggles Customizer
  const handleToggle = (event) => {
    event.preventDefault()
    dispatch(handleCustomizerOpen(!openCustomizer))
  }

  useEffect(() => {
    socketIo.on('CHAT_IMPORTANT', ({ operator, msg, photo, time }) => {
      setMessage(msg)
      setMarkedAt(new Date(time))
      setUser({
        name: operator,
        photo: photo === '' ? defaultAvatar : getWebPreviewUrl(photo)
      })
      setModalVisible(true)
      const timerId = setInterval(() => {
        setCurrent(new Date())
      }, 1000)
      setTimer(timerId)
    })
  })

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const handleReset = () => {
    setMessage('')
    setMarkedAt(new Date())
    setUser({
      name: '',
      photo: defaultAvatar
    })
    clearInterval(timer)
    setTimer(null)
  }


  const getTimeString = () => {
    const seconds = Math.floor((current.getTime() - marked_at.getTime()) / 1000)
    if (seconds === 1) return `A second ago`
    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds => 60 && seconds < 120) return `A min ago`
    return `${Math.floor(seconds / 60)} mins ago`
  }

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <NavbarSearch />
      <ContactDropdown />
      <EmailDropdown />
      <NotificationDropdown />
      <PhoneNotification />
      <UserDropdown />

      <a href="/" className="ms-50" onClick={handleToggle}>
        <Settings size={21} />
      </a>

      <Modal
        isOpen={modalVisible}
        backdrop="static"
        toggle={toggleModal}
        onClosed={handleReset}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader toggle={toggleModal}>
          {T("Marked as important")}
        </ModalHeader>

        <ModalBody className="my-2">
          <div className='d-flex'>
            <div className='ms-auto'>
              <Avatar img={user.photo} imgHeight='65' imgWidth='65' />
            </div>
            <div className="ms-2 me-auto">
              <div className='mb-1'><strong>{user.name}</strong> {T("marked the chat as important.")}</div>
              <div className='mb-1' style={{ fontStyle: 'italic' }}>
                --- <strong>{message}</strong>
              </div>
              <div className='text-end' style={{ fontSize: 12 }}>
                {getTimeString()}
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </ul>
  )
}
export default NavbarUser
