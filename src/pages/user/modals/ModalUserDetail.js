/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Store & Actions
import { clearUserMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'

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
  getRandColorClass
} from '@utils'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'
import {
  userItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalUserDetail = ({
  open,
  toggleModal,
  userRowData,
  setUserRowData
}) => {

  // ** Store vars
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const store = useSelector((state) => state.user)

  const handleReset = () => {
    setUserRowData(userItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearUserMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("userItem Model >>>> ", userRowData)

  // ** Renders User Columns
  const renderUser = (row) => {
    if (row.profile_photo_path && row.profile_photo_path.length) {
      return <Avatar className='me-1' img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${row.profile_photo_path}`} width='32' height='32' />
    } else {
      return (
        <Avatar
          initials
          className='me-1'
          color={getRandColorClass()}
          content={row.name || 'John Doe'}
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
                          to={`${adminRoot}/user/view/${userRowData && userRowData.id}`}
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
                        <DropdownItem href={`${adminRoot}/user/view/${userRowData && userRowData.id}`} tag='a' onClick={e => { e.preventDefault(); navigate(`${adminRoot}/user/view/${userRowData && userRowData.id}`) }}>
                          <Eye size={18} className='mb-0 me-1' />
                          <span className='me-2'>View</span>
                        </DropdownItem>
                        <DropdownItem href={`${adminRoot}/user/edit/${userRowData && userRowData.id}`} tag='a' onClick={e => { e.preventDefault(); navigate(`${adminRoot}/user/edit/${userRowData && userRowData.id}`) }}>
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
