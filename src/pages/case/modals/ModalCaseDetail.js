/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Modal,
  Table,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Icons Import
import {
  Eye
} from 'react-feather'

// ** Utils
import {
  getWebPreviewUrl,
  getTransformDate,
  getRandColorClass
} from '@utils'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'
import {
  caseItem
} from '@constant/reduxConstant'

// ** Translation
import { T } from '@localization'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

const ModalCaseDetail = ({
  open,
  toggleModal,
  caseRowData,
  setCaseRowData,
  handleNavigationRole
}) => {
  const handleReset = () => {
    setCaseRowData(caseItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
  }, [])
  // console.log("caseRowData Model >>>> ", caseRowData)

  /* Rendering file preview web url */
  const renderFileWebUrlPreview = (path) => {
    if (path) {
      return getWebPreviewUrl(path)
    }

    return false
  }
  /* /Rendering file preview web url */

  // ** Renders Case Columns
  const renderCase = (row) => {
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
        <ModalHeader toggle={handleReset}>{T("Details")} {T("of")} {caseRowData && caseRowData.Name}</ModalHeader>
        {caseRowData && caseRowData.CaseID ? <>
          <ModalBody>
            <Table striped responsive>
              <tbody>
                <tr>
                  <td>Reference number:</td>
                  <td><Link to={`${adminRoot}/case/view/${caseRowData.CaseID}`}>{`#${caseRowData.CaseID}`}</Link></td>
                </tr>
                <tr>
                  <td>Client:</td>
                  <td>
                    <div className='d-flex justify-content-left align-items-center'>
                      {renderCase(caseRowData.user)}
                      <Link
                        to={handleNavigationRole(caseRowData.user, "view")}
                      >
                        <div className='d-flex flex-column'>
                          <span className='fw-bolder'>{caseRowData.user && caseRowData.user.name}</span>
                          <small className='text-truncate text-muted mb-0'>{caseRowData.user && caseRowData.user.email}</small>
                        </div>
                      </Link>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Lawyer:</td>
                  <td>
                    <Link
                      to={handleNavigationRole(caseRowData.laywer, "view")}
                    >
                      <span className='fw-bolder'>{caseRowData.laywer && caseRowData.laywer.name}</span>
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>Datum:</td>
                  <td>{caseRowData.Date && getTransformDate(caseRowData.Date, "DD MMM YYYY")}</td>
                </tr>

                <tr>
                  <td>Status:</td>
                  <td>{caseRowData.Status}</td>
                </tr>

                <tr>
                  <td>Group:</td>
                  <td>{caseRowData.type && caseRowData.type.CaseTypeName}</td>
                </tr>

                <tr>
                  <td>Actions:</td>
                  <td>
                    <Link to={`${adminRoot}/case/view/${caseRowData.CaseID}`} id={`pw-tooltip-${caseRowData.CaseID}`}>
                      <Eye size={17} className='mx-1' />
                    </Link>
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

export default ModalCaseDetail
