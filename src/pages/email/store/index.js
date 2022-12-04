/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  emailItem,
  emailsMeta
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getMailsRequest(folder, params) {
  return axios.get(`${API_ENDPOINTS.emails.imapList}/${folder}`, { params }).then((email) => email.data).catch((error) => error)
}

export const getMails = createAsyncThunk('appEmail/getMails', async (params) => {
  try {
    const response = await getMailsRequest(params.folder, params.payload)
    if (response && response.flag) {
      return {
        params,
        mails: response.data && response.data.mails,
        pagination: response.pagination,
        emailsMeta: response.data && response.data.emailsMeta,
        userItems: response.data && response.data.users,
        separateMailItem: null,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        mails: [],
        pagination: null,
        emailsMeta: emailsMeta,
        userItems: [],
        separateMailItem: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getMails catch ", error)
    return {
      params,
      mails: [],
      pagination: null,
      emailsMeta: emailsMeta,
      userItems: [],
      separateMailItem: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getMailDetailRequest(id, params) {
  return axios.get(`${API_ENDPOINTS.emails.imapDetail}/${id}`, { params }).then((email) => email.data).catch((error) => error)
}

export const getMailDetail = createAsyncThunk('appEmail/getMailDetail', async (params, { dispatch, getState }) => {
  try {
    const response = await getMailDetailRequest(params.id, params.payload)
    if (response && response.flag) {
      if (response.data && response.data.mailData && response.data.mailData.mail && !response.data.mailData.mail.is_read) {
        await dispatch(getMails(getState().email.params))
      }
      return {
        currentMailItem: response.data.mailData,
        userItems: response.data && response.data.users,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        currentMailItem: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getMailDetail catch ", error)
    return {
      currentMailItem: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function sendEmailRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emails.send}`, payload).then((email) => email.data).catch((error) => error)
}

export const sendEmail = createAsyncThunk('appContact/sendEmail', async (payload, { dispatch, getState }) => {
  try {
    const response = await sendEmailRequest(payload)
    if (response && response.flag) {
      await dispatch(getMails(getState().email.params))
      return {
        actionFlag: "MAIL_SENT",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("sendEmail catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function markEmailTrashRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emails.markTrash}`, payload).then((email) => email.data).catch((error) => error)
}

export const markEmailTrash = createAsyncThunk('appContact/markEmailTrash', async (payload, { dispatch, getState }) => {
  try {
    const response = await markEmailTrashRequest(payload)
    if (response && response.flag) {
      await dispatch(getMails(getState().email.params))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("markEmailTrash catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function markEmailDeleteRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emails.markDelete}`, payload).then((email) => email.data).catch((error) => error)
}

export const markEmailDelete = createAsyncThunk('appContact/markEmailDelete', async (payload, { dispatch, getState }) => {
  try {
    const response = await markEmailDeleteRequest(payload)
    if (response && response.flag) {
      await dispatch(getMails(getState().email.params))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("markEmailDelete catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function markEmailRestoreRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emails.markRestore}`, payload).then((email) => email.data).catch((error) => error)
}

export const markEmailRestore = createAsyncThunk('appContact/markEmailRestore', async (payload, { dispatch, getState }) => {
  try {
    const response = await markEmailRestoreRequest(payload)
    if (response && response.flag) {
      await dispatch(getMails(getState().email.params))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("markEmailRestore catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function markEmailImportantRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emails.markImportant}`, payload).then((email) => email.data).catch((error) => error)
}

export const markEmailImportant = createAsyncThunk('appContact/markEmailImportant', async (payload, { dispatch, getState }) => {
  try {
    const response = await markEmailImportantRequest(payload)
    if (response && response.flag) {
      await dispatch(getMails(getState().email.params))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("markEmailImportant catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createEmailReplyRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emails.createReply}`, payload).then((email) => email.data).catch((error) => error)
}

export const createEmailReply = createAsyncThunk('appContact/createEmailReply', async (payload, { dispatch }) => {
  try {
    const response = await createEmailReplyRequest(payload)
    if (response && response.flag) {
      if (payload && payload.id) {
        dispatch(getMailDetail({ id: payload.id, payload: { email_group_id: payload.email_group_id, type: payload.type } }))
      }
      return {
        attachments: [],
        actionFlag: "REPLIED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createEmailReply catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getMailItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.emails.view}/${id}`).then((email) => email.data).catch((error) => error)
}

export const getMailItem = createAsyncThunk('appEmail/getMailItem', async (id) => {
  try {
    const response = await getMailItemRequest(id)
    if (response && response.flag) {
      return {
        separateMailItem: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        separateMailItem: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getMailItem catch ", error)
    return {
      separateMailItem: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

/* Mail attachment */
async function createEmailAttachmentRequest(payload) {
  return axios.post(`${API_ENDPOINTS.attachments.create}`, payload).then((email) => email.data).catch((error) => error)
}

export const createEmailAttachment = createAsyncThunk('appContact/createEmailAttachment', async (payload) => {
  try {
    const response = await createEmailAttachmentRequest(payload)
    if (response && response.flag) {
      return {
        attachments: response.data,
        actionFlag: "ATTACHMENT_ADDED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        attachments: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createEmailAttachment catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteEmailAttachmentRequest(id) {
  return axios.get(`${API_ENDPOINTS.attachments.delete}/${id}`).then((email) => email.data).catch((error) => error)
}

export const deleteEmailAttachment = createAsyncThunk('appEmail/deleteEmailAttachment', async (params) => {
  try {
    const response = await deleteEmailAttachmentRequest(params.id)
    if (response && response.flag) {
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteEmailAttachment catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Mail attachment */

/* Draft */
async function getDraftListRequest() {
  return axios.get(`${API_ENDPOINTS.emails.draft}`).then((res) => res.data).catch((error) => error)
}

export const getDraftList = createAsyncThunk('appEmail/getDraftList', async () => {
  try {
    const response = await getDraftListRequest()
    if (response && response.flag) {
      return {
        draftList: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        draftList: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getDraftList catch ", error)
    return {
      draftList: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getDraftMailRequest(id) {
  return axios.get(`${API_ENDPOINTS.emails.draft}/${id}`).then((res) => res.data).catch((error) => error)
}

export const getDraftMail = createAsyncThunk('appEmail/getDraftMail', async (id) => {
  try {
    const response = await getDraftMailRequest(id)
    if (response && response.flag) {
      return {
        data: response.data,
        attachments: response.attachments,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        data: null,
        attachments: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getDraftMail catch ", error)
    return {
      data: null,
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function saveDraftMailRequest(body) {
  return axios.post(`${API_ENDPOINTS.emails.draft}`, body).then((res) => res.data).catch((error) => error)
}

export const saveDraftEmail = createAsyncThunk('appEmail/saveDraftEmail', async (body) => {
  try {
    const response = await saveDraftMailRequest(body)
    if (response && response.flag) {
      return {
        data: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        data: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("saveDraftEmail catch ", error)
    return {
      data: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteDraftRequest(ids) {
  return axios.delete(`${API_ENDPOINTS.emails.draft}/${ids}`).then((response) => response.data).catch((error) => error)
}

export const deleteDrafts = createAsyncThunk('appEmail/deleteDrafts', async (ids) => {
  try {
    const response = await deleteDraftRequest(ids)
    if (response && response.flag) {
      return {
        actionFlag: "",
        success: response.message,
        error: "",
        data: ids
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message,
        data: null
      }
    }
  } catch (error) {
    console.log("deleteDrafts catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error,
      data: null
    }
  }
})
/* /Draft*/

export const appEmailSlice = createSlice({
  name: 'appEmail',
  initialState: {
    params: {},
    mails: [],
    drafts: [],
    pagination: null,
    emailsMeta: emailsMeta,
    emailItem: emailItem,
    separateMailItem: null,
    userItems: [],
    selectedMails: [],
    selectedDrafts: [],
    attachments: [],
    currentMailItem: null,
    actionFlag: "",
    loading: false,
    success: "",
    error: "",

    // compose modal 
    composeModal: {
      draftId: 0,
      open: false,
      maximize: false,
      userOptions: [],
      mailTo: [],
      ccOpen: false,
      cc: [],
      bccOpen: false,
      bcc: [],
      subject: "",
      editorHtmlContent: "",
      attachments: []
    }
  },
  reducers: {
    selectMail: (state, action) => {
      const selectedMails = state.selectedMails
      let type = 'email'
      if (action && action.payload && action.payload.type) {
        type = 'notification'
      }

      const index = selectedMails.findIndex(x => x.id === action.payload.id && type === type)
      if (index !== -1) {
        selectedMails.splice(index, 1)
      } else {
        selectedMails.push({ id: action.payload.id, type: type })
      }
      state.selectedMails = selectedMails
    },

    selectAllMail: (state, action) => {
      const selectAllMailsArr = []
      if (action.payload) {
        selectAllMailsArr.length = 0
        state.mails.forEach((mail) => {
          let type = 'email'
          if (mail && mail.type) {
            type = 'notification'
          }
          selectAllMailsArr.push({ id: mail.id, type: type })
        })
      }
      state.selectedMails = selectAllMailsArr
    },

    resetSelectedMail: (state) => {
      state.selectedMails = []
    },

    selectDraft: (state, action) => {
      const selectedDrafts = state.selectedDrafts

      const index = selectedDrafts.findIndex(x => x.id === action.payload.id)
      if (index !== -1) {
        selectedDrafts.splice(index, 1)
      } else {
        selectedDrafts.push({ id: action.payload.id})
      }
      state.selectedDrafts = selectedDrafts
    },

    selectAllDraft: (state, action) => {
      const selectAllDraftsArr = []
      if (action.payload) {
        state.drafts.map(draft => {
          selectAllDraftsArr.push({id: draft.id})
        })
      }
      console.log('action.payload: ', action.payload)
      console.log('selectAllDraftsArr: ', selectAllDraftsArr)
      state.selectedDrafts = selectAllDraftsArr
    },

    resetSelectedDraft: (state) => {
      state.selectedDrafts = []
    },

    resetMailDetailItem: (state) => {
      state.currentMailItem = null
      state.separateMailItem = null
    },

    updateEmailLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearEmailMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    },

    /** Compose related reducers */
    toggleCompose: (state) => {
      state.composeModal.open = !state.composeModal.open
    },

    setDraftId: (state, action) => {
      state.composeModal.draftId = action.payload || 0
    },

    setComposeMaximize: (state, action) => {
      state.composeModal.maximize = action.payload || false
    },

    setComposeUserOptions: (state, action) => {
      state.composeModal.userOptions = action.payload || []
      console.log('--------- user options: ', action.payload)
    },

    setComposeMailTo: (state, action) => {
      state.composeModal.mailTo = action.payload || []
    },

    setComposeCCOpen: (state, action) => {
      state.composeModal.ccOpen = action.payload || false
    },

    setComposeCC: (state, action) => {
      state.composeModal.cc = action.payload || []
    },

    setComposeBCCOpen: (state, action) => {
      state.composeModal.bccOpen = action.payload || false
    },

    setComposeBCC: (state, action) => {
      state.composeModal.bcc = action.payload || []
    },

    setComposeSubject: (state, action) => {
      state.composeModal.subject = action.payload || ""
    }, 

    setComposeEditorHtmlContent: (state, action) => {
      state.composeModal.editorHtmlContent = action.payload || ""
    }, 

    setComposeAttachments: (state, action) => {
      state.composeModal.attachments = action.payload || []
    },

    resetComposeModal: (state) => {
      state.composeModal.draftId = 0
      state.composeModal.open = false
      state.composeModal.maximize = false
      state.composeModal.mailTo = []
      state.composeModal.ccOpen = false
      state.composeModal.cc = []
      state.composeModal.bccOpen = false
      state.composeModal.bcc = []
      state.composeModal.subject = ""
      state.composeModal.editorHtmlContent = ""
      state.composeModal.attachments = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMails.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.mails = action.payload.mails
        state.pagination = action.payload.pagination
        state.emailsMeta = action.payload.emailsMeta
        state.userItems = action.payload.userItems
        state.separateMailItem = action.payload.separateMailItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getMailDetail.fulfilled, (state, action) => {
        state.currentMailItem = action.payload.currentMailItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(markEmailTrash.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(markEmailDelete.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(markEmailRestore.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(markEmailImportant.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getMailItem.fulfilled, (state, action) => {
        state.separateMailItem = action.payload.separateMailItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createEmailReply.fulfilled, (state, action) => {
        state.attachments = action.payload.attachments
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* Mail attachment */
      .addCase(createEmailAttachment.fulfilled, (state, action) => {
        state.composeModal.attachments = action.payload.attachments
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteEmailAttachment.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Mail attachment */
      /* Draft */
      .addCase(getDraftList.fulfilled, (state, action) => {
        state.drafts = action.payload.draftList
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getDraftMail.fulfilled, (state, action) => {

        if (!action.payload.data) {
          return
        }
        
        const draft = action.payload.data

        state.composeModal.draftId = draft.id

        const userOptions = JSON.parse(JSON.stringify(state.composeModal.userOptions))

        const toIds = draft.to_ids.split(",")
        state.composeModal.mailTo = []
        toIds.forEach((id) => {
          const users = userOptions.filter((user) => user.value === parseInt(id))
          if (users.length > 0) {
            state.composeModal.mailTo.push(users[0])
          }
        })

        const ccIds = draft.cc_ids.split(",")
        state.composeModal.cc = []
        state.composeModal.ccOpen = false
        ccIds.forEach((id) => {
          const users = userOptions.filter((user) => user.value === parseInt(id))
          if (users.length > 0) {
            state.composeModal.cc.push(users[0])
            state.composeModal.ccOpen = true
          }
        })

        const bccIds = draft.bcc_ids.split(",")
        state.composeModal.bcc = []
        state.composeModal.bccOpen = false
        bccIds.forEach((id) => {
          const users = userOptions.filter((user) => user.value === parseInt(id))
          if (users.length > 0) {
            state.composeModal.bcc.push(users[0])
            state.composeModal.bccOpen = true
          }
        })

        state.composeModal.subject = draft.subject
        state.composeModal.editorHtmlContent = draft.body
        state.composeModal.attachments = action.payload.attachments


        state.composeModal.open = true
        
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(saveDraftEmail.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
        if (action.payload.data) {
          const id = action.payload.data.id
          const idList = state.drafts.map(draft => draft.id)
          if (!idList.includes(id)) {
            state.drafts.push(action.payload.data)
            state.composeModal.draftId = id

          } else {
            const drafts = []
            state.drafts.map(draft => {
              if (draft.id !== id) {
                drafts.push(draft)
              } else {
                drafts.push(action.payload.data)
              }
            })
            state.drafts = drafts
          }
        }
      })
      .addCase(deleteDrafts.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
        if (action.payload.data) {
          const deletedList = action.payload.data.toString().split(',')
          state.drafts = state.drafts.filter(draft => !deletedList.includes(draft.id.toString()))
        }
      })
      /* /Draft */
  }
})

export const {
  selectMail,
  selectAllMail,
  resetSelectedMail,

  selectDraft,
  selectAllDraft,
  resetSelectedDraft,

  updateEmailLoader,
  resetMailDetailItem,
  clearEmailMessage,

  toggleCompose,
  setDraftId,
  setComposeMaximize,
  setComposeUserOptions,
  setComposeMailTo,
  setComposeCCOpen,
  setComposeCC,
  setComposeBCCOpen,
  setComposeBCC,
  setComposeSubject,
  setComposeEditorHtmlContent,
  setComposeAttachments,
  resetComposeModal
} = appEmailSlice.actions

export default appEmailSlice.reducer
