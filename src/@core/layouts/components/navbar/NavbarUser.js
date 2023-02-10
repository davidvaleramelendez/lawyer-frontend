// ** React Imports
import { React, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
import ContactDropdown from './ContactDropdown'
import EmailDropdown from './EmailDropdown'
import NotificationDropdown from './NotificationDropdown'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-default.jpg'

// ** Utils Import
import { getWebPreviewUrl } from '@utils'

// ** Third Party Components
import { socketIo } from '@src/index'

// ** Translation
import { T } from '@localization'

const NavbarUser = () => {

  const [modalVisible, setModalVisible] = useState(false)
  const [from, setFrom] = useState('1234567890')
  const [user, setUser] = useState({
    name: '',
    photo: defaultAvatar
  })

  useEffect(() => {
    socketIo.on('PLACETEL_NOTIFY', (data) => {
      const { from, name, photo } = data
      setFrom(from)
      setUser({
        name,
        photo: photo === '' ? defaultAvatar : getWebPreviewUrl(photo)
      })
      setModalVisible(true)
    })
  }, [])

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const handleReset = () => {
    setFrom('')
    setUser({
      name: '',
      photo: defaultAvatar
    })
  }

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <NavbarSearch />
      <ContactDropdown />
      <EmailDropdown />
      <NotificationDropdown />
      <UserDropdown />
      <Modal
        isOpen={modalVisible}
        backdrop="static"
        toggle={toggleModal}
        onClosed={handleReset}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader toggle={toggleModal}>
          {T("Incoming call")}
        </ModalHeader>

        <ModalBody className="mb-2">
          <div className='incoming-call'>
            <div className="pulse">
              <div style={{ zIndex: 2 }}>
                <Avatar img={user.photo} imgHeight='120' imgWidth='120' />
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            {user.name !== '' && <p>{T("From")}: <strong>{user.name}</strong></p>}
            <p>{T("Phone")}: <strong>{from}</strong></p>
            <p>{T("Status")}: <strong>{T("Accepted")}</strong></p>
          </div>
        </ModalBody>
      </Modal>
    </ul>
  )
}
export default NavbarUser
