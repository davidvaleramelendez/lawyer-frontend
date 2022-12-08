// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
  handleContentWidth
} from '@store/layout'

// ** Store & Actions
import {
  closeCase,
  getCaseView,
  getCaseLetters,
  getCaseDocuments,
  getNoteCaseRecords,
  shareCaseRecord,
  statusCaseLetter,
  statusCaseDocument,
  clearCaseMessage,
  updateSelectedDetails,
  getTimeCaseRecords,
  createTimeCaseRecord
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'
import {
  recordItem,
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
  CardBody
} from 'reactstrap'

// Translation
import { useTranslation } from 'react-i18next'

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
  Check,
  Phone,
  Calendar,
  Paperclip,
  Edit,
  Trash2,
  Send,
  EyeOff
} from 'react-feather'

// ** Utils
import {
  isUserLoggedIn,
  getTransformDate,
  getTimeCounter
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'
import CardDetails from './CaseDetails'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Modals
import ModalEditCaseClient from '../modals/ModalEditCaseClient'
import ModalEditCaseOpponent from '../modals/ModalEditCaseOpponent'
import ModalCaseNoteFile from '../modals/ModalCaseNoteFile'
import ModalCaseRecordDetail from '../modals/ModalCaseRecordDetail'
import ModalCaseDocument from '../modals/ModalCaseDocument'
import ModalCaseLetter from '../modals/ModalCaseLetter'
import ModalCaseTimeTracking from '../modals/ModalCaseTimeTracking'
import TerminalCaseTimeTrackingCounter from '../modals/TerminalCaseTimeTrackingCounter'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import { setTimeCounter } from '../../../utility/Utils'

const CaseView = () => {
  // ** Hooks
  const { id } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const MySwal = withReactContent(Swal)

  // ** Store vars
  const navigate = useNavigate()
  const store = useSelector((state) => state.cases)


  /* Constant */
  const [loadFirst, setLoadFirst] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [opponentModalOpen, setOpponentModalOpen] = useState(false)
  const [noteFileModalOpen, setNoteFileModalOpen] = useState(false)
  const [recordDetailModalOpen, setRecordDetailModalOpen] = useState(false)
  const [caseRecordRowData, setCaseRecordRowData] = useState(recordItem)
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false)
  const [documentRowData, setDocumentRowData] = useState(caseDocItem)
  const [letterModalOpen, setLetterModalOpen] = useState(false)
  const [letterRowData, setLetterRowData] = useState(letterItem)
  const [timeTrackModalOpen, setTimeTrackModalOpen] = useState(false)
  const [timeCounterTerminalOpen, setTimeCounterTerminalOpen] = useState(false)

  // Check TimeCounterModal 
  useEffect(() => {
    const time_modal_status = getTimeCounter()?.status
    if (time_modal_status === true) {
      setTimeCounterTerminalOpen(true)
    }
  }, [])

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
      dispatch(getCaseLetters({ case_id: id }))
      dispatch(getCaseDocuments({ case_id: id }))
      dispatch(getNoteCaseRecords({ CaseID: id }))
      dispatch(getTimeCaseRecords(id))
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearCaseMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }

    /* If contact deleted then redirected */
    if (store.actionFlag && store.actionFlag === "DELETED") {
      navigate(`${adminRoot}/case`)
    }
  }, [dispatch, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>>> ", store)

  /* Delete case */
  const onDeleteFile = (caseId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You want to Close this Case?",
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

  /* Change note history done status */
  const onShareCaseRecord = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You want to Share this case record?",
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
        dispatch(shareCaseRecord(id))
      }
    })
  }

  /* Case record detail popup */
  const onCaseRecordDetail = (record) => {
    setCaseRecordRowData(record)
    setRecordDetailModalOpen(true)
  }

  /* Change document done status */
  const onDocumentDone = (id) => {
    // console.log("onDocumentDone >>> ", id)
    MySwal.fire({
      title: 'Are you sure?',
      text: "You want to Done this document?",
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
        dispatch(statusCaseDocument(id))
      }
    })
  }

  // /* Detail view of Case Document */
  // const onCaseDocumentDetail = (row) => {
  //   setDocumentRowData({ ...row })
  //   setDocUploadModalOpen(true)
  // }

  /* Change letter done status */
  const onLetterDone = (id) => {
    // console.log("onLetterDone >>> ", id)
    MySwal.fire({
      title: 'Are you sure?',
      text: "You want to Done this letter?",
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
        dispatch(statusCaseLetter(id))
      }
    })
  }

  // /* Detail view of Case Letter */
  // const onCaseLetterDetail = (row) => {
  //   setLetterRowData({ ...row })
  //   setLetterModalOpen(true)
  // }

  /* Details of record at the right side */
  const onRecordClick = (details) => () => {
    dispatch(handleContentWidth('full'))
    dispatch(updateSelectedDetails(details))
  }

  /* Format Details of record */
  const onRecordCloseClick = () => {
    dispatch(handleContentWidth('boxed'))
    dispatch(updateSelectedDetails(null))
  }

  const handleTimeRecordStart = (values, caseId) => {
    const timeData = {
      CaseID: caseId,
      Subject: values.Subject,
      interval_time: values.interval_time * 60
    }
    setTimeCounter({
      ...timeData,
      current_time: 0,
      status: true
    })
    dispatch(createTimeCaseRecord({
      ...timeData,
      IsShare: 0
    }))
    setTimeCounterTerminalOpen(true)
  }

  return store ? (
    <div className='invoice-preview-wrapper'>
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
                          Details on file {store.caseItem && store.caseItem.CaseID}
                        </h4>
                      </div>
                    </Col>

                    <Col xl={6} md={6} sm={6}>
                      <div className='mt-md-0 mt-2'>
                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className="ms-1 invoice-date-title">{t("Lawyer")}</p>
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
                    <Col
                      xl={6}
                      md={6}
                      sm={6}
                      className={`${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder-glow'}`}
                    >
                      <div className='mt-md-0 mt-2'>
                        <div className="user-info">
                          <h4 className='mb-10'>{t("Client")}</h4>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>Name</p>
                          <p
                            className={`me-2 invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.name}
                          </p>
                          <Button.Ripple
                                color="flat-primary"
                                className={`btn-icon rounded-circle ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder'}`}
                                onClick={() => setEditModalOpen(true)}
                              >
                            <Edit size={16} />
                          </Button.Ripple>
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
                          <p className='invoice-date-title ms-1'>Stadium</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.Status}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Star size={14} />
                          <p className='invoice-date-title ms-1'>Group</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.type && store.caseItem.type.CaseTypeName}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Flag size={14} />
                          <p className='invoice-date-title ms-1'>Land</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.Country}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Phone size={14} />
                          <p className='invoice-date-title ms-1'>Telephone</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.Contact}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Mail size={14} />
                          <p className='invoice-date-title ms-1'>E-Mail</p>
                          <p
                            className={`invoice-date ${store.caseItem && store.caseItem.CaseID ? '' : 'placeholder w-50'}`}
                          >
                            {store.caseItem && store.caseItem.user && store.caseItem.user.email}
                          </p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Calendar size={14} />
                          <p className='invoice-date-title ms-1'>Datum</p>
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
                            <h5 className="mb-0">{t("Address")}</h5>
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
                    </Col>

                    {/* Opponent detail */}
                    <Col xl={3} md={3} sm={3}>
                      <div className='mt-md-0 mt-2'>
                        <div className="user-info">
                          <h4 className='mb-10'>{t("Opponent")}</h4>
                        </div>
                        <div className='invoice-date-wrapper'>
                          <User size={14} />
                          <p className='invoice-date-title ms-1'>Name</p>
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
                          <p className='invoice-date-title ms-1'>Surname</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.last_name}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Phone size={14} />
                          <p className='invoice-date-title ms-1'>Telephone</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.telefone}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Mail size={14} />
                          <p className='invoice-date-title ms-1'>E-Mail</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.email}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Calendar size={14} />
                          <p className='invoice-date-title ms-1'>Updated</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.created_at && getTransformDate(store.fighterItem.created_at, "DD.MM.YYYY")}</p>
                        </div>

                        <div className='invoice-date-wrapper'>
                          <Flag size={14} />
                          <p className='invoice-date-title ms-1'>Land</p>
                          <p className='invoice-date'>{store.fighterItem && store.fighterItem.country}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center user-total-numbers mt-1">
                        <div className="d-flex align-items-center mr-2">
                          <div className="color-box bg-light-primary rounded-circle">
                            <Home size={32} />
                          </div>

                          <div className="ml-1 ms-1">
                            <h5 className="mb-0">{t("Address")}</h5>
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
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* /Client && Opponent detail */}
          <Row>
            <Col xl={5} md={6} sm={8} className="mx-auto">
              <TerminalCaseTimeTrackingCounter
                open={timeCounterTerminalOpen}
                caseId={store.caseItem.CaseID}
                closeTerminal={() => setTimeCounterTerminalOpen(false)}
              />
            </Col>
          </Row>

          {/* Notes && Time Recording && Letter && Document History */}
          <Row className='invoice-preview'>
            <Col xl={12} md={12} sm={12}>
              <Card className='invoice-preview-card'>
                <CardBody className='invoice-padding pb-0'>
                  <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                    <div className="d-flex flex-wrap">
                      <Button className="mt-1" color="primary" onClick={() => setNoteFileModalOpen(true)}>
                        {t("Add a note")}
                      </Button>

                      <ModalCaseNoteFile
                        open={noteFileModalOpen}
                        toggleModal={() => setNoteFileModalOpen(!noteFileModalOpen)}
                        caseId={store.caseItem.CaseID}
                      />

                      <Button className="ms-2 mt-1" color="primary" onClick={() => setTimeTrackModalOpen(true)}>
                        {t("Add Time Tracking")}
                      </Button>

                      <ModalCaseTimeTracking
                        open={timeTrackModalOpen}
                        toggleModal={() => setTimeTrackModalOpen(!timeTrackModalOpen)}
                        caseId={store.caseItem.CaseID}
                        onTimeRecordStart={handleTimeRecordStart}
                      />

                      <Button className="ms-2 mt-1" color="primary" onClick={() => setLetterModalOpen(true)}>
                        {t("Write a letter now")}
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
                        {t("Upload document")}
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
                      <h3 className="invoice-date">{t("History")}</h3>
                    </div>
                  </div>

                  <Row className='mb-2'>
                    <Col xl={12} md={12} sm={12}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th />
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Done?</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                          <tbody>
                            {store.timeCaseRecord.map((record, index) => (
                              <tr key={`record_${index}`} onClick={onRecordClick(record)} className="cursor-pointer">
                                <td/>

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
                                  <Eye size={18} className="cursor-pointer" onClick={() => onRecordClick(record)} />
                                </td>
                              </tr>
                            ))}
                            {store.caseRecords.map((record, index) => (
                              <tr key={`record_${index}`} onClick={onRecordClick(record)} className="cursor-pointer">
                                <td>
                                  {record.Type === "File" ? <>
                                    <Paperclip size={14} className="cursor-pointer" onClick={() => onCaseRecordDetail(record)} />
                                  </> : <>
                                    <Type size={14} className="cursor-pointer" onClick={() => onCaseRecordDetail(record)} />
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
                                  <Eye size={18} className="cursor-pointer" onClick={() => onRecordClick(record)} />
                                </td>
                              </tr>
                            ))}
                            {store.caseLetters.map((letter, index) => (
                              <tr key={`letters_${index}`} onClick={onRecordClick(letter)} className="cursor-pointer">
                                <td/>
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
                                  {/* <Eye size={18} className="cursor-pointer" onClick={() => onCaseLetterDetail(letter)} /> */}
                                  <Eye size={18} className="cursor-pointer" onClick={() => onRecordClick(letter)} />
                                </td>
                              </tr>
                            ))}
                            {store.caseDocs.map((doc, index) => (
                              <tr key={`docs_${index}`} onClick={onRecordClick(doc)} className="cursor-pointer">
                                <td/>
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
                                  {/* <Eye size={18} className="cursor-pointer" onClick={() => onCaseDocumentDetail(doc)} /> */}
                                  <Eye size={18} className="cursor-pointer" onClick={() => onRecordClick(doc)} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                      </Table>
                    </Col>
                    <ModalCaseRecordDetail
                      open={recordDetailModalOpen}
                      toggleModal={() => setRecordDetailModalOpen(!recordDetailModalOpen)}
                      caseRecordRowData={caseRecordRowData}
                      setCaseRecordRowData={setCaseRecordRowData}
                    />
                  </Row>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          {/* /Notes && Time Recording && Letter && Document History */}
        </Col>
        <Col xl={5} md={12} sm={12}>
          { store.selectedItem ? (
              <Card className='case-details-card'>
              <CardBody className='invoice-padding pb-0'>
                <div className='d-flex justify-content-between' >
                  <h3  className='mt-1'>{t("Details")}</h3>
                  <Button.Ripple className='btn-icon rounded-circle' color='flat-grey' onClick={() => onRecordCloseClick()}>
                    <EyeOff size={16} />
                  </Button.Ripple>
                </div>
                <hr/>
                <CardDetails details={store.selectedItem} />
              </CardBody>
            </Card>
          ) : (
            <></>
          )}

        </Col>
      </Row>
    </div>
  ) : null
}

export default CaseView
