// ** React Imports
import { React, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import { Phone } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { getAcceptedNotification } from '@store/navTopNotification'

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

const PhoneNotification = () => {
  // ** States
  const [modalVisible, setModalVisible] = useState(false)
  const [from, setFrom] = useState('1234567890')
  const [user, setUser] = useState({
    name: '',
    photo: defaultAvatar
  })
  
  // ** Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.navTopNotification)

  const handleGetNotification = () => {
    dispatch(getAcceptedNotification({}))
  }

  //** ComponentDidMount
  useEffect(() => {
    /* Reset form data */
    if (store && store.actionFlag && store.actionFlag === "PLACETEL_GET_ACCEPTED_NOTIFICATION_CALLED") {
      const { from, name, photo } = store.acceptedNotification
      setFrom(from)
      setUser({
        name,
        photo: photo === '' ? defaultAvatar : getWebPreviewUrl(photo)
      })
      setModalVisible(true)
    }
  }, [store.actionFlag])

  useEffect(() => {
    socketIo.on('PLACETEL_NOTIFY', (data) => {
      const { from, name, photo } = data
      if (from) {
        setFrom(from)
        setUser({
          name,
          photo: photo === '' ? defaultAvatar : getWebPreviewUrl(photo)
        })
        setModalVisible(true)
      }
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
    <div style={{padding: '0 0.5rem', cursor: 'pointer'}}>
      <Phone size={21} onClick={handleGetNotification}/>
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
    </div>
  )
}

export default PhoneNotification