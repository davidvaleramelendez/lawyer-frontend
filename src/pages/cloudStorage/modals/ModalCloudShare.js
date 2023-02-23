// ** React Import
import { useEffect, useState } from "react"

// Redux
import { useDispatch, useSelector } from "react-redux"
import {
  getUserList
} from '@src/pages/cloudStorage/store'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Reactstrap Import
import { Button, Label, Modal, ModalBody, ModalHeader } from "reactstrap"

// ** Third Party Components
import Select, { components } from 'react-select'

// ** Translation
import { T } from '@localization'

// ** Utils
import {
  onImageSrcError,
  getWebPreviewUrl,
  selectThemeColors
} from '@utils'
import { markShareCloudItem } from "../store"

const ModalCloudShare = ({
  sharedInfo,
  closeModal
}) => {

  // ** Store
  const dispatch = useDispatch()
  const userItems = useSelector(state => state.cloudStorage.userItems)

  // ** State
  const [userOptions, setUserOptions] = useState([])
  const [sharedUser, setSharedUser] = useState(null)

  useEffect(() => {
    dispatch(getUserList())
  }, [])

  useEffect(() => {
    let list = []
    if (userItems && userItems.length) {
      list = userItems.map(user => {
        return {
          value: user.id,
          label: `${user.name} (${user.email})`,
          img: user.profile_photo_path ? user.profile_photo_path : 'images/avatars/avatar-blank.png'
        }
      })
    }
    setUserOptions(list)
  }, [userItems])

  useEffect(() => {
    let userItem = null
    if (sharedInfo?.shared_user_id) {
      userItem = userOptions.find(item => item.value === sharedInfo.shared_user_id)
    }
    setSharedUser(userItem)
  }, [sharedInfo])

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }

  const handleCloseModal = () => {
    closeModal()
    setSharedUser(null)
  }

  const handleShare = () => {
    dispatch(markShareCloudItem({
      id: sharedInfo.id,
      shared_user_id: sharedUser?.value
    }))
    closeModal()
  }

  const handleChangeSelect = (selectedOption) => {
    setSharedUser(selectedOption)
  }

  // ** Custom Select Option
  const CustomSelectOption = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex align-items-center'>
          <img
            width='26'
            height='26'
            className='d-block rounded-circle me-50'
            alt={data.label}
            onError={(currentTarget) => onImageSrcError(currentTarget)}
            src={renderFileWebUrlPreview(data.img) || defaultAvatar}
          />
          <p className='mb-0'>{data.label}</p>
        </div>
      </components.Option>
    )
  }

  return (
    <div className="disabled-backdrop-modal">
      <Modal
        isOpen={sharedInfo !== null}
        toggle={handleCloseModal}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader toggle={handleCloseModal}>
          {T("Share with other user")}
        </ModalHeader>
        <ModalBody>
          <div className="mt-1 mb-2">
            <Label className="me-auto mb-1">
              {T("Select User")}
            </Label>
            <Select
              isClearable={true}
              options={userOptions}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              value={sharedUser}
              components={{ Option: CustomSelectOption }}
              onChange={handleChangeSelect}
            />
          </div>
          <div className="text-end">
            <Button color="primary" onClick={handleShare}>
              {T("Share")}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCloudShare