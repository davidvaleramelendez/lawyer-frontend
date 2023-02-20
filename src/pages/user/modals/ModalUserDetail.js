/* eslint-disable object-shorthand */

// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Modal,
  Table,
  Badge,
  ModalBody,
  ModalHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Icons Import
import {
  Eye,
  Archive,
  MoreVertical
} from 'react-feather'

// ** Utils
import {
  getWebPreviewUrl,
  getRandColorClass
} from '@utils'

// ** Constant
import {
  userItem
} from '@constant/reduxConstant'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalUserDetail = ({
  open,
  toggleModal,
  userRowData,
  setUserRowData,
  handleNavigationRole
}) => {
  const handleReset = () => {
    setUserRowData(userItem)
    toggleModal()
  }

  // console.log("userItem Model >>>> ", userRowData)

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  // ** Renders User Columns
  const renderUser = (row) => {
    if (row.profile_photo_path && row.profile_photo_path.length) {
      return (
        <Avatar
          width='32'
          height='32'
          className='me-1'
          img={renderFileWebUrlPreview(row.profile_photo_path) || defaultAvatar}
        />
      )
    } else {
      return (
        <Avatar
          initials
          className='me-1'
          color={getRandColorClass()}
          content={row.name || ''}
        />
      )
    }
  }

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{T("Details of")} {userRowData && userRowData.name}</ModalHeader>
        {userRowData && userRowData.id ? <>
          <ModalBody>
            <Table striped responsive>
              <tbody>
                <tr>
                  <td>{T('User')}:</td>
                  <td>
                    <div className='d-flex justify-content-left align-items-center'>
                      {renderUser(userRowData)}
                      <div className='d-flex flex-column'>
                        <Link
                          to={handleNavigationRole(userRowData, "view")}
                          className='user_name text-truncate text-body'
                        >
                          <span className='fw-bolder'>{userRowData && userRowData.name}</span>
                        </Link>
                        <small className='text-truncate text-muted mb-0'>{userRowData && userRowData.email}</small>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>{T('Email')}:</td>
                  <td>{userRowData && userRowData.email}</td>
                </tr>

                <tr>
                  <td>{T('Role')}:</td>
                  <td>{userRowData && userRowData.role && userRowData.role.RoleName}</td>
                </tr>

                <tr>
                  <td>{T('Contact')}:</td>
                  <td>{userRowData && userRowData.Contact}</td>
                </tr>

                <tr>
                  <td>{T('Status')}:</td>
                  <td>
                    <Badge className='text-capitalize' color="light-success" pill>
                      {userRowData && userRowData.Status}
                    </Badge>
                  </td>
                </tr>

                <tr>
                  <td>{T('Actions')}:</td>
                  <td>
                    <UncontrolledButtonDropdown>
                      <DropdownToggle color="#FFFFFF">
                        <MoreVertical size={18} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          tag={Link}
                          to={handleNavigationRole(userRowData, "view")}
                        >
                          <Eye size={18} className='mb-0 me-1' />
                          <span className='me-2'>View</span>
                        </DropdownItem>

                        <DropdownItem
                          tag={Link}
                          to={handleNavigationRole(userRowData, "edit")}
                        >
                          <Archive size={18} className='mb-0 me-1' />
                          <span className='me-2'>Edit</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
        </> : null}
      </Modal>
    </div>
  )
}

export default ModalUserDetail
