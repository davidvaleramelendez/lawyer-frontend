// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import {
  handleContentWidth
} from '@store/layout'

import moment from "moment"

// ** Store & Actions
import {
  closeCase,
  getCaseView,
  toggleCompose,
  getCaseLetters,
  getCaseDocuments,
  getCaseRecord,
  getNoteCaseRecords,
  shareCaseRecord,
  statusCaseLetter,
  statusCaseDocument,
  clearCaseMessage,
  updateSelectedDetails,
  getTimeCaseRecords,
  createTimeCaseRecord,
  deleteCaseLetter
} from '../store'
import { getLetterTemplateList } from '../../letterTemplate/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Constants
import {
  adminRoot,
  CONTINUE_MODAL
} from '@constant/defaultValues'
import {
  letterItem,
  caseDocItem
} from '@constant/reduxConstant'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Input,
  Table,
  Button,
  CardBody,
  Collapse
} from 'reactstrap'

// ** Icons Import
import {
  X,
  Eye,
  Flag,
  Home,
  Mail,
  Star,
  User,
  Type,
  Edit,
  Send,
  Check,
  Phone,
  Trash2,
  EyeOff,
  Calendar,
  Paperclip
} from 'react-feather'

// ** Utils
import {
  setInnerHtml,
  getTimeCounter,
  setTimeCounter,
  isUserLoggedIn,
  getTransformDate
} from '@utils'

// ** Custom Components
import Avatar from '@components/avatar'
import Notification from '@components/toast/notification'
import CardDetails from './CaseDetails'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Modals
import ModalEditCaseClient from '../modals/ModalEditCaseClient'
import ModalEditCaseOpponent from '../modals/ModalEditCaseOpponent'
import ModalCaseNoteFile from '../modals/ModalCaseNoteFile'
import ModalCaseDocument from '../modals/ModalCaseDocument'
import ModalCaseLetter from '../modals/ModalCaseLetter'
import ModalCaseTimeTracking from '../modals/ModalCaseTimeTracking'
import TerminalCaseTimeTrackingCounter from '../modals/TerminalCaseTimeTrackingCounter'
import ModalComposeMail from '../modals/ModalComposeMail'

// ** Image icons
import pdfPng from '@src/assets/images/icons/pdf.png'

// ** Translation
import { T } from '@localization'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const CaseView = () => {
  // ** Hooks
  const { id } = useParams()
  const dispatch = useDispatch()

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const navigate = useNavigate()
  const store = useSelector((state) => state.cases)

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [opponentModalOpen, setOpponentModalOpen] = useState(false)
  const [noteFileModalOpen, setNoteFileModalOpen] = useState(false)
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false)
  const [documentRowData, setDocumentRowData] = useState(caseDocItem)
  const [letterModalOpen, setLetterModalOpen] = useState(false)
  const [letterRowData, setLetterRowData] = useState(letterItem)
  const [timeTrackModalOpen, setTimeTrackModalOpen] = useState(false)
  const [timeCounterTerminalOpen, setTimeCounterTerminalOpen] = useState(false)

  const [isCollapseOpen, setIsCollapseOpen] = useState('')

  const handleCollapseAction = (value) => {
    if (isCollapseOpen === value) {
      setIsCollapseOpen('')
      return
    }
    setIsCollapseOpen(value)
  }

  // Check TimeCounterModal 
  useEffect(() => {
    const time_modal_status = getTimeCounter().status
    const time_completed_status = getTimeCounter().completed
    if (time_modal_status === true) {
      setTimeCounterTerminalOpen(true)
    }
    if (time_completed_status === true) {
      setTimeCounterTerminalOpen(true)
    }
  }, [])

  /* Format Details of record */
  const onRecordCloseClick = () => {
    dispatch(handleContentWidth('boxed'))
    dispatch(updateSelectedDetails(null))
  }
  /* /Format Details of record */

  // ** Get contact on mount based on id
  useEffect(() => {
    /* If id not present then navigate */
    if (!id) {
      navigate(`${adminRoot}/case`)
    }

    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getCaseView(id))
      dispatch(getLetterTemplateList({}))
      dispatch(getCaseLetters({ case_id: id }))
      dispatch(getCaseDocuments({ case_id: id }))
      dispatch(getNoteCaseRecords({ CaseID: id }))
      dispatch(getCaseRecord(id))
      dispatch(getTimeCaseRecords(id))
      setLoadFirst(false)
    }

    if (store && store.actionFlag && (store.actionFlag === "LETTER_DELETED")) {
      onRecordCloseClick()
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearCaseMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }

    /* If contact deleted then redirected */
    if (store.actionFlag && store.actionFlag === "DELETED") {
      navigate(`${adminRoot}/case`)
    }
  }, [store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>>> ", store)

  /* Delete case */
  const onDeleteFile = (caseId) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Close this Case?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(closeCase(caseId))
      }
    })
  }

  /* Case Send Mail */
  const onSendCaseMail = (caseData) => {
    console.log(caseData)
    dispatch(toggleCompose())
  }

  /* Change note history done status */
  const onShareCaseRecord = (id) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Share this case record?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(shareCaseRecord(id))
      }
    })
  }

  /* Change document done status */
  const onDocumentDone = (id) => {
    // console.log("onDocumentDone >>> ", id)
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Done this document?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(statusCaseDocument(id))
      }
    })
  }

  /* Change letter done status */
  const onLetterDone = (id) => {
    // console.log("onLetterDone >>> ", id)
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You want to Done this letter?"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(statusCaseLetter(id))
      }
    })
  }

  /* Delete case letter */
  const onDeleteLetter = (lttrId) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You won't be able to revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteCaseLetter(lttrId))
      }
    })
  }
  /* /Delete case letter */

  /* Details of record at the right side */
  const onRecordClick = (details, typeOf = "") => () => {
    details = { ...details, typeOf }
    dispatch(handleContentWidth('full'))
    dispatch(updateSelectedDetails(details))
  }

  const handleTimeRecordStart = (values, caseId) => {
    const timeData = {
      CaseID: caseId,
      Subject: values.Subject,
      interval_time: values.interval_time * 60
    }
    const startTime = moment(new Date()).format('hh:mm:ss')

    setTimeCounter({
      ...timeData,
      current_time: 0,
      start_time: startTime,
      manual: CONTINUE_MODAL.INITIAL_STATE,
      status: true
    })
    dispatch(createTimeCaseRecord({
      ...timeData,
      IsShare: 0
    }))
    setTimeCounterTerminalOpen(true)
  }

  /* Check case permission */
  const checkPermissionAccess = (id) => {
    if (store) {
      if (store.authUserItem && store.authUserItem.id) {
        if (store.authUserItem.permission && store.authUserItem.permission.length) {
          const index = store.authUserItem.permission.findIndex((x) => x.permission_id === id)
          if (index !== -1) {
            return true
          }
        }

        if (store.caseItem && store.caseItem.LaywerID === store.authUserItem.id) {
          return true
        }

        return false
      }
      return false
    }

    return false
  }
  /* /Check case permission */

  return (
    <div className='invoice-preview-wrapper case-detail-view'>
      <Row className='match-height'>
        <Col xl={`${store.selectedItem ? '7' : '12'}`} md={12} sm={12}>
          {/* Header */}
          <Row
            className={`invoice-preview ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder-glow'}`}
          >
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding'>
                  <Row>
                    <Col xl={6} md={6} sm={6} className='d-flex flex-column justify-content-between border-container-lg'>
                      <div>
                        <h4
                          className={`mb-25 ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                        >
                          {T('Details on file')} {store.caseItem && store.caseItem.CaseID}
                        </h4>
                      </div>
                    </Col>

                    <Col xl={6} md={6} sm={6}>
                      <div className='mt-md-0 mt-2'>
                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className="ms-1 invoice-date-title">{T("Lawyer")}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.laywer && store.caseItem.laywer.name}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Header */}

          {/* Client && Opponent detail */}
          <Row className='invoice-preview'>
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding'>
                  <Row>
                    {/* Client detail */}
                    <Col xl={6} md={6} sm={6} className={`${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder-glow'}`}
                    >
                      <div className='mt-md-0 mt-2'>
                        <div className="user-info">
                          <h4 className='mb-10'>{T("Client")}</h4>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>{T('Name')}</p>
                          <p
                            className={`me-2 invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.name}
                          </p>

                          {checkPermissionAccess(5) ? (
                            <Button.Ripple
                              color="flat-primary"
                              className={`btn-icon rounded-circle ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                              onClick={() => setEditModalOpen(true)}
                            >
                              <Edit size={16} />
                            </Button.Ripple>
                          ) : null}

                          <ModalEditCaseClient
                            open={editModalOpen}
                            toggleModal={() => setEditModalOpen(!editModalOpen)}
                            lawyers={store.laywerItems}
                            groups={store.typeItems}
                            caseData={store.caseItem}
                          />
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Check size={14} />
                          <p className='invoice-date-title ms-1'>{T('Stadium')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.Status}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Star size={14} />
                          <p className='invoice-date-title ms-1'>{T('Group')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.type && store.caseItem.type.CaseTypeName}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Flag size={14} />
                          <p className='invoice-date-title ms-1'>{T('Land')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.Country}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Phone size={14} />
                          <p className='invoice-date-title ms-1'>{T('Telephone')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.Contact}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Mail size={14} />
                          <p className='invoice-date-title ms-1'>{T('E-Mail')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.email}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Calendar size={14} />
                          <p className='invoice-date-title ms-1'>{T('Date')}</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.Date && getTransformDate(store.caseItem.Date, "DD.MM.YYYY")}
                          </p>
                        </div>

                        <div className="d-flex flex-wrap mt-1">
                          <Button.Ripple
                            outline
                            color="danger"
                            className={`btn-icon rounded-circle me-1 mb-1 ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                            onClick={() => onDeleteFile(id)}
                          >
                            <Trash2 size={16} />
                          </Button.Ripple>

                          <Button.Ripple
                            outline
                            color="primary"
                            className={`btn-icon rounded-circle mb-1 ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                            onClick={() => onSendCaseMail(store.caseItem)}
                          >
                            <Send size={16} />
                          </Button.Ripple>
                        </div>
                      </div>

                      <div className="d-flex align-items-center user-total-numbers">
                        <div className="d-flex align-items-center mr-2">
                          <div className="color-box bg-light-primary rounded-circle">
                            <Home size={32} />
                          </div>

                          <div className="ml-1 ms-1">
                            <h5 className="mb-0">{T("Address")}</h5>
                            <small
                              className={`${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-100'}`}
                            >
                              {store.caseItem && store.caseItem.user ? <>
                                {store.caseItem.user.Address ? `${store.caseItem.user.Address}, ` : ''}
                                {store.caseItem.user.Postcode ? `${store.caseItem.user.Postcode} ` : ''}
                                {store.caseItem.user.City}
                              </> : null}
                            </small>
                          </div>
                        </div>
                      </div>

                      <ModalComposeMail
                        caseData={store.caseItem}
                        fighterData={store.fighterItem}
                      />
                    </Col>
                    {/* /Client detail */}

                    {/* Opponent detail */}
                    <Col xl={3} md={3} sm={3}>
                      <div className='mt-md-0 mt-2'>
                        <div className="user-info">
                          <h4 className='mb-10'>{T("Opponent")}</h4>
                        </div>
                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>{T('Name')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.name}</p>
                          <Button.Ripple
                            color="flat-primary"
                            className={`btn-icon rounded-circle ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                            onClick={() => setOpponentModalOpen(true)}
                          >
                            <Edit size={16} />
                          </Button.Ripple>
                          <ModalEditCaseOpponent
                            open={opponentModalOpen}
                            toggleModal={() => setOpponentModalOpen(!opponentModalOpen)}
                            caseId={store.caseItem.CaseID}
                            fighterData={store.fighterItem}
                          />
                        </div>

                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>{T('Surname')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.last_name}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Phone size={14} />
                          <p className='invoice-date-title ms-1'>{T('Telephone')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.telefone}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Mail size={14} />
                          <p className='invoice-date-title ms-1'>{T('E-Mail')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.email}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Calendar size={14} />
                          <p className='invoice-date-title ms-1'>{T('Updated')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.created_at && getTransformDate(store.fighterItem.created_at, "DD.MM.YYYY")}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Flag size={14} />
                          <p className='invoice-date-title ms-1'>{T('Land')}</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.country}</p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center user-total-numbers mt-1">
                        <div className="d-flex align-items-center mr-2">
                          <div className="color-box bg-light-primary rounded-circle">
                            <Home size={32} />
                          </div>

                          <div className="ml-1 ms-1">
                            <h5 className="mb-0">{T("Address")}</h5>
                            <small>
                              {store.fighterItem && store.fighterItem.id ? <>
                                {store.fighterItem.address ? `${store.fighterItem.address}, ` : ''}
                                {store.fighterItem.zip_code ? `${store.fighterItem.zip_code} ` : ''}
                                {store.fighterItem.city}
                              </> : null}
                            </small>
                          </div>
                        </div>
                      </div>
                    </Col>
                    {/* /Opponent detail */}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Client && Opponent detail */}

          {/* Time tracking terminal */}
          <Row>
            {/* <Col xl={5} md={6} sm={8} className="mx-auto"> */}
            <TerminalCaseTimeTrackingCounter
              open={timeCounterTerminalOpen}
              caseId={store.caseItem.CaseID}
              closeTerminal={() => setTimeCounterTerminalOpen(false)}
            />
            {/* </Col> */}
          </Row>
          {/* /Time tracking terminal */}

          {/* Notes && Time Recording && Letter && Document History */}
          <Row className='invoice-preview'>
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding pb-0'>
                  <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                    <div className="d-flex flex-wrap">
                      <Button className="mt-1" color="primary" onClick={() => setNoteFileModalOpen(true)}>
                        {T("Add a note")}
                      </Button>

                      <ModalCaseNoteFile
                        open={noteFileModalOpen}
                        toggleModal={() => setNoteFileModalOpen(!noteFileModalOpen)}
                        caseId={store.caseItem.CaseID}
                      />

                      <Button className="ms-2 mt-1" color="primary" onClick={() => setTimeTrackModalOpen(true)}>
                        {T("Add Time Tracking")}
                      </Button>

                      <ModalCaseTimeTracking
                        open={timeTrackModalOpen}
                        toggleModal={() => setTimeTrackModalOpen(!timeTrackModalOpen)}
                        caseId={store.caseItem.CaseID}
                        onTimeRecordStart={handleTimeRecordStart}
                      />

                      <Button className="ms-2 mt-1" color="primary" onClick={() => setLetterModalOpen(true)}>
                        {T("Write a letter now")}
                      </Button>

                      <ModalCaseLetter
                        open={letterModalOpen}
                        toggleModal={() => setLetterModalOpen(!letterModalOpen)}
                        caseData={store.caseItem}
                        fighterData={store.fighterItem}
                        letterRowData={letterRowData}
                        setLetterRowData={setLetterRowData}
                      />

                      <Button className="ms-2 mt-1" color="primary" onClick={() => setDocUploadModalOpen(true)}>
                        {T("Upload document")}
                      </Button>

                      <ModalCaseDocument
                        open={docUploadModalOpen}
                        toggleModal={() => setDocUploadModalOpen(!docUploadModalOpen)}
                        userId={store.caseItem && store.caseItem.UserID}
                        caseId={store.caseItem && store.caseItem.CaseID}
                        documentRowData={documentRowData}
                        setDocumentRowData={setDocumentRowData}
                      />
                    </div>

                    <div className="d-flex flex-wrap mt-1">
                      <h3 className="invoice-date">{T("History")}</h3>
                    </div>
                  </div>

                  <Row className='mb-2'>
                    <Col xl={12} md={12} sm={12}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th />
                            <th>{T('Date')}</th>
                            <th>{T('Subject')}</th>
                            <th>{T('Done')}?</th>
                            <th>{T('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {store.timeCaseRecord.map((record, index) => (
                            record.end_time !== null ? (
                              <Fragment key={`case_time_track_${index}`}>
                                <tr
                                  className={`cursor-pointer ${(isCollapseOpen === `case_time_track_${record.RecordID}` ? 'background-highlight-color' : '')}`}
                                  onClick={() => handleCollapseAction(`case_time_track_${record.RecordID}`)}
                                >
                                  <td />

                                  <td>{record.CreatedAt && getTransformDate(record.CreatedAt, "DD.MM.YYYY")}</td>

                                  <td>{record.Subject}</td>

                                  <td>
                                    <div className='form-switch form-check-primary'>
                                      <Input
                                        type='switch'
                                        checked={record.IsShare}
                                        id={`record_${index}_${record.IsShare}`}
                                        name={`record_${index}_${record.IsShare}`}
                                        className="cursor-pointer"
                                        onChange={() => onShareCaseRecord(record.RecordID)}
                                      />
                                      <Label className='form-check-label' htmlFor="icon-primary">
                                        <span className='switch-icon-left'>
                                          <Check size={14} />
                                        </span>
                                        <span className='switch-icon-right'>
                                          <X size={14} />
                                        </span>
                                      </Label>
                                    </div>
                                  </td>

                                  <td>
                                    <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_time_track_${record.RecordID}`)} />
                                  </td>
                                </tr>

                                <tr>
                                  <td colSpan={5} className={`px-0 ${(isCollapseOpen === `case_time_track_${record.RecordID}` ? '' : 'border-0 py-0')}`}>
                                    <Collapse
                                      className="case-table-collapse"
                                      isOpen={(isCollapseOpen === `case_time_track_${record.RecordID}`) || false}
                                    >
                                      <Row>
                                        <div className="col-3">
                                          <strong>{T("Date")}: </strong>
                                        </div>
                                        {(record && record.CreatedAt) && (
                                          <div className="col-9">
                                            {getTransformDate(record.CreatedAt, "DD.MM.YYYY")}
                                          </div>
                                        )}
                                      </Row>

                                      {(record && record.interval_time) && (
                                        <Row className="mt-1">
                                          <div className="col-3">
                                            <strong>{T("Interval Time")}: </strong>
                                          </div>
                                          <div className="col-9">
                                            {record.interval_time} S
                                          </div>
                                        </Row>
                                      )}

                                      {(record && record.start_time) && (
                                        <Row className="mt-1">
                                          <div className="col-3">
                                            <strong>{T("Start Time")}: </strong>
                                          </div>
                                          <div className="col-9">
                                            {record.start_time}
                                          </div>
                                        </Row>
                                      )}

                                      {(record && record.end_time) && (
                                        <Row className="mt-1">
                                          <div className="col-3">
                                            <strong>{T("End Time")}: </strong>
                                          </div>
                                          <div className="col-9">
                                            {record.end_time}
                                          </div>
                                        </Row>
                                      )}
                                    </Collapse>
                                  </td>
                                </tr>
                              </Fragment>
                            ) : null
                          ))}

                          {store.caseRecords.map((record, index) => (
                            <Fragment key={`case_record_${index}`}>
                              <tr
                                className={`cursor-pointer ${(isCollapseOpen === `case_record_${record.RecordID}` ? 'background-highlight-color' : '')}`}
                                onClick={() => handleCollapseAction(`case_record_${record.RecordID}`)}
                              >
                                <td>
                                  {record.Type === "File" ? <>
                                    <Paperclip size={14} />
                                  </> : <>
                                    <Type size={14} />
                                  </>}
                                </td>

                                <td>{record.CreatedAt && getTransformDate(record.CreatedAt, "DD.MM.YYYY")}</td>

                                <td>{record.Subject}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={record.IsShare}
                                      id={`record_${index}_${record.IsShare}`}
                                      name={`record_${index}_${record.IsShare}`}
                                      className="cursor-pointer"
                                      onChange={() => onShareCaseRecord(record.RecordID)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_record_${record.RecordID}`)} />
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={5} className={`px-0 ${(isCollapseOpen === `case_record_${record.RecordID}` ? '' : 'border-0 py-0')}`}>
                                  <Collapse
                                    className="case-table-collapse"
                                    isOpen={(isCollapseOpen === `case_record_${record.RecordID}`) || false}
                                  >
                                    <Row>
                                      <div className="col-3">
                                        <strong>{T("Content")}: </strong>
                                      </div>
                                      <div className="col-9">
                                        {(record && record.Content) || ""}
                                      </div>
                                    </Row>

                                    {(record && record.CreatedAt) && (
                                      <Row className="mt-1">
                                        <div className="col-3">
                                          <strong>{T("Date")}: </strong>
                                        </div>
                                        <div className="col-9">
                                          {getTransformDate(record.CreatedAt, "DD.MM.YYYY")}
                                        </div>
                                      </Row>
                                    )}

                                    {record && record.attachment && record.attachment.length > 0 && (
                                      <Row className="mt-1">
                                        <div className="col-3">
                                          <strong>{T("Files")}: </strong>
                                        </div>
                                        <div className="col-9">
                                          {record.attachment.map((item, index) => {
                                            return (
                                              <div className="inline" key={`attachment_${index}`}>
                                                <Paperclip className='cursor-pointer me-1' size={17} />
                                                {item && item.path ? (
                                                  <a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.path}`} target="_blank" className="me-1">{item.name}</a>
                                                ) : null}
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </Row>
                                    )}
                                  </Collapse>
                                </td>
                              </tr>
                            </Fragment>
                          ))}

                          {store.caseLetters.map((letter, index) => (
                            <Fragment key={`case_letters_${index}`}>
                              <tr
                                className={`cursor-pointer ${(isCollapseOpen === `case_letters_${letter.id}` ? 'background-highlight-color' : '')}`}
                                onClick={() => handleCollapseAction(`case_letters_${letter.id}`)}
                              >
                                <td />
                                <td>{letter.created_at && getTransformDate(letter.created_at, "DD.MM.YYYY")}</td>

                                <td>{letter.subject}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={letter.isErledigt}
                                      id={`letter_${index}_${letter.isErledigt}`}
                                      name={`letter_${index}_${letter.isErledigt}`}
                                      className="cursor-pointer"
                                      onChange={() => onLetterDone(letter.id)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_letters_${letter.id}`)} />
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={5} className={`px-0 ${(isCollapseOpen === `case_letters_${letter.id}` ? '' : 'border-0 py-0')}`}>
                                  <Collapse
                                    className="case-table-collapse"
                                    isOpen={(isCollapseOpen === `case_letters_${letter.id}`) || false}
                                  >
                                    <Row>
                                      <div className="col-3">
                                        <strong>{T("Message")}: </strong>
                                      </div>
                                      {(letter && letter.message) && (
                                        <div className="col-9">
                                          {setInnerHtml(letter.message)}
                                        </div>
                                      )}
                                    </Row>

                                    <div className="mt-1">
                                      {(letter && letter.pdf_path) && (
                                        <Button.Ripple
                                          outline
                                          tag="a"
                                          target="_blank"
                                          color="primary"
                                          className={`btn-icon rounded-circle me-50`}
                                          href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${letter.pdf_path}`}
                                        >
                                          <Avatar
                                            img={pdfPng}
                                            imgWidth={16}
                                            imgHeight={16}
                                            className="bg-transparent"
                                          />
                                        </Button.Ripple>
                                      )}

                                      <Button.Ripple
                                        outline
                                        tag={Link}
                                        color="primary"
                                        to={`${adminRoot}/case/letter-template/edit/${id}/${letter.id}`}
                                        className={`btn-icon rounded-circle me-50`}
                                      >
                                        <Edit size={16} />
                                      </Button.Ripple>

                                      <Button.Ripple
                                        outline
                                        color="danger"
                                        className={`btn-icon rounded-circle`}
                                        onClick={() => onDeleteLetter(letter.id)}
                                      >
                                        <Trash2 size={16} />
                                      </Button.Ripple>
                                    </div>
                                  </Collapse>
                                </td>
                              </tr>
                            </Fragment>
                          ))}

                          {store.caseDocs.map((doc, index) => (
                            <Fragment key={`case_docs_${index}`}>
                              <tr
                                className={`cursor-pointer ${(isCollapseOpen === `case_docs_${doc.id}` ? 'background-highlight-color' : '')}`}
                                onClick={() => handleCollapseAction(`case_docs_${doc.id}`)}
                              >
                                <td />
                                <td>{doc.created_at && getTransformDate(doc.created_at, "DD.MM.YYYY")}</td>

                                <td>{doc.title}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={doc.isErledigt}
                                      id={`docs_${index}_${doc.isErledigt}`}
                                      name={`docs_${index}_${doc.isErledigt}`}
                                      className="cursor-pointer"
                                      onChange={() => onDocumentDone(doc.id)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => handleCollapseAction(`case_docs_${doc.id}`)} />
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={5} className={`px-0 ${(isCollapseOpen === `case_docs_${doc.id}` ? '' : 'border-0 py-0')}`}>
                                  <Collapse
                                    className="case-table-collapse"
                                    isOpen={(isCollapseOpen === `case_docs_${doc.id}`) || false}
                                  >
                                    <Row>
                                      <div className="col-3">
                                        <strong>{T("Content")}: </strong>
                                      </div>
                                      <div className="col-9">
                                        {(doc && doc.description) || ""}
                                      </div>
                                    </Row>

                                    {(doc && doc.created_at) && (
                                      <Row className="mt-1">
                                        <div className="col-3">
                                          <strong>{T("Date")}: </strong>
                                        </div>
                                        <div className="col-9">
                                          {getTransformDate(doc.created_at, "DD.MM.YYYY")}
                                        </div>
                                      </Row>
                                    )}

                                    {(doc && doc.attachment_pdf) && (
                                      <Row className="mt-1">
                                        <div className="col-3">
                                          <strong>{T("File")}: </strong>
                                        </div>
                                        <div className="col-9">
                                          <div className="inline">
                                            <a href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${doc.attachment_pdf}`} target="_blank" className="me-1">
                                              <Paperclip className='cursor-pointer me-1' size={17} />
                                              attachment
                                            </a>
                                          </div>
                                        </div>
                                      </Row>
                                    )}
                                  </Collapse>
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Notes && Time Recording && Letter && Document History */}

          {/* Email History */}
          <Row className='invoice-preview'>
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding pb-0'>
                  <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                    <div className="d-flex flex-wrap">
                      <h3 className="invoice-date">{T("Email History")}</h3>
                    </div>
                  </div>

                  <Row className='mb-2'>
                    <Col xl={12} md={12} sm={12}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th />
                            <th>{T('Date')}</th>
                            <th>{T('Subject')}</th>
                            <th>{T('Done')}?</th>
                            <th>{T('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>

                          {store.mailCaseRecords.map((record, index) => (
                            record.type === 'Email' ? (
                              <tr key={`docs_${index}`} onClick={onRecordClick(doc)} className="cursor-pointer">
                                <td />
                                <td>{doc.created_at && getTransformDate(doc.created_at, "DD.MM.YYYY")}</td>

                                <td>{doc.title}</td>

                                <td>
                                  <div className='form-switch form-check-primary'>
                                    <Input
                                      type='switch'
                                      checked={doc.isErledigt}
                                      id={`docs_${index}_${doc.isErledigt}`}
                                      name={`docs_${index}_${doc.isErledigt}`}
                                      className="cursor-pointer"
                                      onChange={() => onDocumentDone(doc.id)}
                                    />
                                    <Label className='form-check-label' htmlFor="icon-primary">
                                      <span className='switch-icon-left'>
                                        <Check size={14} />
                                      </span>
                                      <span className='switch-icon-right'>
                                        <X size={14} />
                                      </span>
                                    </Label>
                                  </div>
                                </td>

                                <td>
                                  <Eye size={18} className="cursor-pointer" onClick={() => onRecordClick(doc)} />
                                </td>
                              </tr>
                            ) : null
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Email History */}
        </Col>

        <Col xl={5} md={12} sm={12}>
          {store.selectedItem ? (
            <Card className='case-details-card'>
              <CardBody className='invoice-padding pb-0'>
                <div className='d-flex justify-content-between' >
                  <h3 className='mt-1'>{T("Details")}</h3>
                  <div>
                    {store.selectedItem && store.selectedItem.typeOf === "letter" ? (
                      <Fragment>
                        {store.selectedItem.pdf_path ? (
                          <Button.Ripple
                            outline
                            tag="a"
                            target="_blank"
                            color="primary"
                            className={`btn-icon rounded-circle me-50`}
                            href={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${store.selectedItem.pdf_path}`}
                          >
                            <Avatar
                              img={pdfPng}
                              imgWidth={16}
                              imgHeight={16}
                              className="bg-transparent"
                            />
                          </Button.Ripple>
                        ) : null}

                        <Button.Ripple
                          outline
                          tag={Link}
                          color="primary"
                          to={`${adminRoot}/case/letter-template/edit/${id}/${store.selectedItem.id}`}
                          className={`btn-icon rounded-circle me-50`}
                        >
                          <Edit size={16} />
                        </Button.Ripple>

                        <Button.Ripple
                          outline
                          color="danger"
                          className={`btn-icon rounded-circle`}
                          onClick={() => onDeleteLetter(store.selectedItem.id)}
                        >
                          <Trash2 size={16} />
                        </Button.Ripple>
                      </Fragment>
                    ) : null}

                    <Button.Ripple className='btn-icon rounded-circle' color='flat-grey' onClick={() => onRecordCloseClick()}>
                      <EyeOff size={16} />
                    </Button.Ripple>
                  </div>
                </div>
                <hr />
                <CardDetails details={store.selectedItem} />
              </CardBody>
            </Card>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default CaseView
