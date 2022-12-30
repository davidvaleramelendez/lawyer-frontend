/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment } from 'react'

// ** Mail Components Imports
import MailCard from './MailCard'
import MailDetails from './MailDetails'

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
  RefreshCw,
  RefreshCcw
} from 'react-feather'

// ** Reactstrap Imports
import {
  Input,
  Label,
  Spinner,
  InputGroup,
  InputGroupText,
  UncontrolledTooltip
} from 'reactstrap'
import DraftCard from './DraftCard'
import {
  getMails,
  selectMail,
  selectAllMail,
  selectDraft,
  selectAllDraft,
  getDraftMail,
  deleteDrafts,
  resetSelectedDraft,
  resetComposeModal
} from './store'

// ** Translation
import { T } from '@localization'

const Mails = (props) => {
  // ** Props
  const {
    store,
    folder,
    openMail,
    dispatch,
    searchInput,
    rowsPerPage,
    setOpenMail,
    getMailDetail,
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
    callEmailCronJob,
    updateEmailLoader,
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

  const {
    mails,
    drafts,
    loading,
    selectedMails,
    selectedDrafts
  } = store

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
    if (folder === 'draft') {
      dispatch(selectAllDraft(event.target.checked))
    } else {
      dispatch(selectAllMail(event.target.checked))
    }
  }

  // ** Handles Move to Trash
  const handleMailToTrash = (ids) => {
    if (folder === "trash") {
      dispatch(markEmailDelete({ emailIds: ids }))
    } else {
      dispatch(markEmailTrash({ emailIds: ids }))
    }
    dispatch(resetSelectedMail())
  }

  // ** Handles Restore mail
  const handleMailToRestore = (ids) => {
    if (folder === "trash") {
      dispatch(markEmailRestore({ emailIds: ids }))
    }
    dispatch(resetSelectedMail())
  }

  const handleSearch = (value) => {
    setSearchInput(value)
    handleGetMails(value, rowsPerPage)
  }

  /* Refetching emails */
  const getRefetchEmail = () => {
    dispatch(updateEmailLoader(false))
    dispatch(callEmailCronJob({}))
  }
  /* /Refetching emails */

  const onScrollDown = (container, value) => {
    const { scrollTop, scrollHeight, clientHeight } = container
    const { totalRecord } = store.pagination
    // console.log("onScrollDown >>> ", scrollTop, scrollHeight, clientHeight, totalRecord)
    if ((scrollTop + clientHeight) === (scrollHeight - 1) || (scrollTop + clientHeight) === (scrollHeight)) {
      if (value < totalRecord) {
        setRowsPerPage(value + 10)
        handleGetMails(searchInput, value + 10)
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

  // ** Handles Draft click Functions
  const handleDraftClick = (draft) => {
    dispatch(getDraftMail(draft.id))
  }

  // ** Handles Draft removing
  const handleRemoveDrafts = () => {
    const ids = selectedDrafts.map(t => t.id).join(',')

    if (selectedDrafts.filter(t => t.id === store.composeModal.draftId).length) {
      dispatch(resetComposeModal())
    }

    dispatch(deleteDrafts(ids))
    dispatch(resetSelectedDraft())
    dispatch(getMails({ ...store.params }))
  }

  const getCheckedAllStatus = () => {
    if (folder === 'draft') {
      return selectedDrafts.length && selectedDrafts.length === drafts.length
    }
    return selectedMails.length && selectedMails.length === mails.length
  }

  // ** Renders Draft
  const renderDrafts = () => {
    if (drafts && drafts.length) {
      return drafts.map((draft, index) => {
        return (
          <DraftCard
            key={index}
            draftItem={draft}
            dispatch={dispatch}
            selectDraft={selectDraft}
            selectedDrafts={selectedDrafts}
            handleDraftClick={handleDraftClick}
            getTransformDate={getTransformDate}
          />
        )
      })
    }
  }

  return (
    <Fragment>
      <div className="email-app-list">
        <div className="app-fixed-search d-flex align-items-center">
          <div className="sidebar-toggle d-block d-lg-none ms-1" onClick={() => setSidebarOpen(true)}>
            <Menu size="21" />
          </div>

          <div className="d-flex align-content-center justify-content-between w-100">
            <InputGroup className="input-group-merge">
              <InputGroupText>
                <Search className="text-muted" size={14} />
              </InputGroupText>

              <Input
                id="email-search"
                placeholder={T("Search email")}
                value={searchInput}
                onChange={(event) => handleSearch(event.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        <div className="app-action">
          <div className="action-left form-check">
            <Input
              type="checkbox"
              id="select-all"
              onChange={handleSelectAll}
              checked={getCheckedAllStatus()}
            />
            <Label className="form-check-label fw-bolder ps-25 mb-0" for="select-all">
              {T("Select All")}
            </Label>
          </div>

          <div className="action-right">
            <ul className="list-inline m-0">
              <li className="list-inline-item" id={`pw-mail-refresh-tooltip`}>
                {loading ? (
                  <span className="action-icon" onClick={() => getRefetchEmail()}>
                    <RefreshCw size={18} />
                  </span>
                ) : (
                  <Spinner size="sm" />
                )}
                <UncontrolledTooltip placement="top" target={`pw-mail-refresh-tooltip`}>
                  {T("Refresh")}
                </UncontrolledTooltip>
              </li>

              {folder !== "draft" && selectedMails && selectedMails.length ? (
                <Fragment>
                  {folder === "trash" ? (
                    <li className="list-inline-item" id={`pw-mail-restore-tooltip`}>
                      <span className="action-icon" onClick={() => handleMailToRestore(selectedMails)}>
                        <RefreshCcw size={18} />
                      </span>
                      <UncontrolledTooltip placement="top" target={`pw-mail-restore-tooltip`}>
                        {T("Restore")}
                      </UncontrolledTooltip>
                    </li>
                  ) : null}

                  <li className="list-inline-item">
                    <span className="action-icon" onClick={() => handleMailToTrash(selectedMails)}>
                      <Trash size={18} />
                    </span>
                  </li>
                </Fragment>
              ) : null}

              {folder === "draft" && selectedDrafts && selectedDrafts.length ? (
                <li className="list-inline-item">
                  <span className="action-icon" onClick={() => handleRemoveDrafts()}>
                    <Trash size={18} />
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <PerfectScrollbar
          className="email-user-list"
          options={{ wheelPropagation: false }}
          onScrollDown={(container) => onScrollDown(container, rowsPerPage)}
        >
          {folder !== "draft" && mails && mails.length ? (
            <ul className="email-media-list">{renderMails()}</ul>

          ) : folder === "draft" && drafts && drafts.length ? (
            <ul className="email-media-list">{renderDrafts()}</ul>
          ) : (
            <div className="no-results d-block">
              <h5>{T("No Items Found")}</h5>
            </div>
          )}
        </PerfectScrollbar>
      </div>

      <MailDetails
        store={store}
        folder={folder}
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
    </Fragment>
  )
}

export default Mails
