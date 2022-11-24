/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import { clearCaseMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'

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

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const ModalCaseDetail = ({
  open,
  toggleModal,
  caseRowData,
  setCaseRowData
}) => {
  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cases)

  const handleReset = () => {
    setCaseRowData(caseItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])
  // console.log("caseRowData Model >>>> ", caseRowData)

  // ** Renders Case Columns
  const renderCase = (row) => {
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
        <ModalHeader toggle={handleReset}>{t("Details")} {t("of")} {caseRowData && caseRowData.Name}</ModalHeader>
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
                      <Link to={`${adminRoot}/user/view/${caseRowData.user && caseRowData.user.id}`}>
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
                    <Link to={`${adminRoot}/user/view/${caseRowData.laywer && caseRowData.laywer.id}`}>
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
