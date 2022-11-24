// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Email App Component Imports
import Mails from './Mails'
import Sidebar from './Sidebar'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getMails,
  selectMail,
  selectAllMail,
  getMailDetail,
  markEmailTrash,
  markEmailDelete,
  createEmailReply,
  markEmailRestore,
  resetSelectedMail,
  markEmailImportant,
  resetMailDetailItem,
  createEmailAttachment,
  deleteEmailAttachment,
  clearEmailMessage
} from './store'

// ** Utils
import {
  isUserLoggedIn
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// Constant
import {
  root
} from '@constant/defaultValues'

// ** Styles
import '@styles/react/apps/app-email.scss'

const EmailApp = () => {
  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openMail, setOpenMail] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [editorHtmlContent, setEditorHtmlContent] = useState("")
  const [editorStateContent, setEditorStateContent] = useState(null)

  // ** Toggle Compose Function
  const toggleCompose = () => setComposeOpen(!composeOpen)

  // ** Store Variables
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector(state => state.email)

  // ** Vars
  const params = useParams()

  const handleGetMails = (param = params, search = searchInput, perPage = rowsPerPage) => {
    dispatch(getMails({
      payload: { search: search || "", perPage: perPage || 10 },
      folder: param.folder || 'inbox'
    }))
  }

  // ** UseEffect: GET initial data on Mount
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      setRowsPerPage(10)
      handleGetMails(params, searchInput, 10)
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearEmailMessage())
    }

    /* Succes toast notification */
    if (store && store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store && store.error) {
      Notification("Error", store.error, "warning")
    }

    /* Updating uploaded files */
    if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_ADDED") {
      setUploadedFiles(store.attachments)
    }

    /* Updating editor data in detail page files */
    if (store && store.actionFlag && store.actionFlag === "REPLIED") {
      setEditorHtmlContent("")
      setUploadedFiles(store.attachments)
      setEditorStateContent(null)
    }
  }, [dispatch, store.attachments, store.success, store.error, store.actionFlag, params.folder, searchInput, loadFirst])
  // console.log("store >>> ", store)

  return (
    <Fragment>
      <Sidebar
        store={store}
        dispatch={dispatch}
        getMails={getMails}
        setOpenMail={setOpenMail}
        sidebarOpen={sidebarOpen}
        toggleCompose={toggleCompose}
        setSidebarOpen={setSidebarOpen}
        resetSelectedMail={resetSelectedMail}
      />
      <div className='content-right'>
        <div className='content-body'>
          <div
            className={classnames('body-content-overlay', {
              show: sidebarOpen
            })}
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Mails
            store={store}
            params={params}
            dispatch={dispatch}
            openMail={openMail}
            getMails={getMails}
            selectMail={selectMail}
            searchInput={searchInput}
            rowsPerPage={rowsPerPage}
            composeOpen={composeOpen}
            setOpenMail={setOpenMail}
            uploadedFiles={uploadedFiles}
            getMailDetail={getMailDetail}
            selectAllMail={selectAllMail}
            toggleCompose={toggleCompose}
            setSidebarOpen={setSidebarOpen}
            setSearchInput={setSearchInput}
            setRowsPerPage={setRowsPerPage}
            handleGetMails={handleGetMails}
            markEmailTrash={markEmailTrash}
            markEmailDelete={markEmailDelete}
            setUploadedFiles={setUploadedFiles}
            createEmailReply={createEmailReply}
            markEmailRestore={markEmailRestore}
            editorHtmlContent={editorHtmlContent}
            resetSelectedMail={resetSelectedMail}
            editorStateContent={editorStateContent}
            markEmailImportant={markEmailImportant}
            setEditorHtmlContent={setEditorHtmlContent}
            setEditorStateContent={setEditorStateContent}
            createEmailAttachment={createEmailAttachment}
            deleteEmailAttachment={deleteEmailAttachment}
            resetMailDetailItem={resetMailDetailItem}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default EmailApp
