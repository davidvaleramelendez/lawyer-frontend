// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Email App Component Imports
import Mails from './Mails'
import Sidebar from './Sidebar'
import ModalComposeMail from './modal/ModalComposeMail'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getMails,
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
  clearEmailMessage,
  toggleCompose
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
  // ** Hooks
  const navigate = useNavigate()

  // ** States
  const [loadFirst, setLoadFirst] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openMail, setOpenMail] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const [composeOpen, setComposeOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [editorHtmlContent, setEditorHtmlContent] = useState("")
  const [editorStateContent, setEditorStateContent] = useState(null)
  const [folder, setFolder] = useState('inbox')

  // ** Store Variables
  const dispatch = useDispatch()

  const store = useSelector(state => state.email)

  const handleGetMails = (search = searchInput, perPage = rowsPerPage) => {
    dispatch(getMails({
      payload: { search: search || "", perPage: perPage || 10 },
      folder: folder || 'inbox'
    }))
  }

  const goToOtherFolder = (newFolder) => {
    setFolder(newFolder)
  }

  // ** UseEffect: GET initial data on Mount
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      setRowsPerPage(10)
      handleGetMails(searchInput, 10)
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
  }, [dispatch, store.attachments, store.success, store.error, store.actionFlag, searchInput, loadFirst])
  
  return (
    <Fragment>
      <Sidebar
        store={store}
        setOpenMail={setOpenMail}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        folder={folder}
        goToOtherFolder={goToOtherFolder}
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
            folder={folder}
            dispatch={dispatch}
            openMail={openMail}
            getMails={getMails}
            searchInput={searchInput}
            rowsPerPage={rowsPerPage}
            setOpenMail={setOpenMail}
            uploadedFiles={uploadedFiles}
            getMailDetail={getMailDetail}
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

      <ModalComposeMail/>
    </Fragment>
  )
}

export default EmailApp
