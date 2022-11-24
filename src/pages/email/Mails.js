/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment } from 'react'

// ** Mail Components Imports
import MailCard from './MailCard'
import MailDetails from './MailDetails'
import ModalComposeMail from './modal/ModalComposeMail'

// ** Utils
import {
  setInnerHtml,
  getTransformDate
} from '@utils'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  Menu,
  Trash,
  Search,
  RefreshCw
} from 'react-feather'

// ** Reactstrap Imports
import {
  Input,
  Label,
  InputGroup,
  InputGroupText
} from 'reactstrap'

const Mails = (props) => {
  // ** Props
  const {
    store,
    params,
    openMail,
    dispatch,
    selectMail,
    searchInput,
    rowsPerPage,
    setOpenMail,
    composeOpen,
    selectAllMail,
    getMailDetail,
    toggleCompose,
    uploadedFiles,
    setSearchInput,
    setRowsPerPage,
    handleGetMails,
    setSidebarOpen,
    markEmailTrash,
    markEmailDelete,
    createEmailReply,
    setUploadedFiles,
    markEmailRestore,
    editorHtmlContent,
    editorStateContent,
    markEmailImportant,
    resetMailDetailItem,
    setEditorHtmlContent,
    setEditorStateContent,
    createEmailAttachment,
    deleteEmailAttachment,
    resetSelectedMail
  } = props

  const { mails, selectedMails } = store

  // ** States

  // ** Variables
  const labelColors = {
    personal: 'success',
    company: 'primary',
    important: 'warning',
    private: 'danger'
  }

  // ** Handles Update Functions
  const handleMailClick = (mail) => {
    let type = 'email'
    if (mail && mail.type) {
      type = 'notification'
    }
    dispatch(getMailDetail({ id: mail.id, payload: { email_group_id: mail.email_group_id, type: type } }))
    dispatch(resetSelectedMail())
    dispatch(selectAllMail(false))
    setOpenMail(true)
  }

  // ** Handles SelectAll
  const handleSelectAll = (event) => {
    dispatch(selectAllMail(event.target.checked))
  }

  // ** Handles Move to Trash
  const handleMailToTrash = (ids) => {
    if (params && params.folder === "trash") {
      dispatch(markEmailDelete({ emailIds: ids }))
    } else {
      dispatch(markEmailTrash({ emailIds: ids }))
    }
    dispatch(resetSelectedMail())
  }

  // ** Handles Restore mail
  const handleMailToRestore = (ids) => {
    if (params && params.folder === "trash") {
      dispatch(markEmailRestore({ emailIds: ids }))
    }
    dispatch(resetSelectedMail())
  }

  const handleSearch = (value) => {
    setSearchInput(value)
    handleGetMails(params, value, rowsPerPage)
  }

  const onScrollDown = (container, value) => {
    const { scrollTop, scrollHeight, clientHeight } = container
    const { totalRecord } = store.pagination
    // console.log("onScrollDown >>> ", scrollTop, scrollHeight, clientHeight, totalRecord)
    if ((scrollTop + clientHeight) === (scrollHeight - 1) || (scrollTop + clientHeight) === (scrollHeight)) {
      if (value < totalRecord) {
        setRowsPerPage(value + 10)
        handleGetMails(params, searchInput, value + 10)
      }
    }
  }

  // ** Renders Mail
  const renderMails = () => {
    if (mails && mails.length) {
      return mails.map((mail, index) => {
        return (
          <MailCard
            key={index}
            mailItem={mail}
            dispatch={dispatch}
            selectMail={selectMail}
            labelColors={labelColors}
            selectedMails={selectedMails}
            handleMailClick={handleMailClick}
            getTransformDate={getTransformDate}
            markEmailImportant={markEmailImportant}
          />
        )
      })
    }
  }

  return (
    <Fragment>
      <div className='email-app-list'>
        <div className='app-fixed-search d-flex align-items-center'>
          <div className='sidebar-toggle d-block d-lg-none ms-1' onClick={() => setSidebarOpen(true)}>
            <Menu size='21' />
          </div>

          <div className='d-flex align-content-center justify-content-between w-100'>
            <InputGroup className='input-group-merge'>
              <InputGroupText>
                <Search className='text-muted' size={14} />
              </InputGroupText>

              <Input
                id='email-search'
                placeholder='Search email'
                value={searchInput}
                onChange={(event) => handleSearch(event.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        <div className='app-action'>
          <div className='action-left form-check'>
            <Input
              type='checkbox'
              id='select-all'
              onChange={handleSelectAll}
              checked={selectedMails.length && selectedMails.length === mails.length}
            />
            <Label className='form-check-label fw-bolder ps-25 mb-0' for='select-all'>
              Select All
            </Label>
          </div>

          {selectedMails && selectedMails.length ? (
            <div className='action-right'>
              <ul className='list-inline m-0'>
                {params && params.folder === "trash" ? (<li className='list-inline-item'>
                  <span className='action-icon' onClick={() => handleMailToRestore(selectedMails)}>
                    <RefreshCw size={18} />
                  </span>
                </li>) : null}

                <li className='list-inline-item'>
                  <span className='action-icon' onClick={() => handleMailToTrash(selectedMails)}>
                    <Trash size={18} />
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        <PerfectScrollbar
          className='email-user-list'
          options={{ wheelPropagation: false }}
          onScrollDown={(container) => onScrollDown(container, rowsPerPage)}
        >
          {mails && mails.length ? (
            <ul className='email-media-list'>{renderMails()}</ul>
          ) : (
            <div className='no-results d-block'>
              <h5>No Items Found</h5>
            </div>
          )}
        </PerfectScrollbar>
      </div>

      <MailDetails
        params={params}
        openMail={openMail}
        dispatch={dispatch}
        setOpenMail={setOpenMail}
        labelColors={labelColors}
        setInnerHtml={setInnerHtml}
        uploadedFiles={uploadedFiles}
        mailItem={store.currentMailItem}
        getTransformDate={getTransformDate}
        setUploadedFiles={setUploadedFiles}
        createEmailReply={createEmailReply}
        handleMailToTrash={handleMailToTrash}
        editorHtmlContent={editorHtmlContent}
        editorStateContent={editorStateContent}
        resetMailDetailItem={resetMailDetailItem}
        setEditorHtmlContent={setEditorHtmlContent}
        setEditorStateContent={setEditorStateContent}
        createEmailAttachment={createEmailAttachment}
        deleteEmailAttachment={deleteEmailAttachment}
      />

      <ModalComposeMail
        store={store}
        composeOpen={composeOpen}
        toggleCompose={toggleCompose}
      />
    </Fragment>
  )
}

export default Mails
