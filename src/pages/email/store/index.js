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

export const appEmailSlice = createSlice({
  name: 'appEmail',
  initialState: {
    params: {},
    mails: [],
    pagination: null,
    emailsMeta: emailsMeta,
    emailItem: emailItem,
    separateMailItem: null,
    userItems: [],
    selectedMails: [],
    attachments: [],
    currentMailItem: null,
    actionFlag: "",
    loading: false,
    success: "",
    error: "",

    // compose modal 
    composeOpen: false,
    ccOpen: false,
    bccOpen: false,
    modalMaximize: false,
    userOptions: [],
    editorHtmlContent: "",
    modalSizeStyle: "",
    modalPositionStyle: ""
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
      state.composeOpen = !state.composeOpen
    },

    closeCompose: (state) => {
      state.composeOpen = false
    },

    setCCOpen: (state, action) => {
      state.ccOpen = action.payload || false
    },

    setBCCOpen: (state, action) => {
      state.bccOpen = action.payload || false
    },

    setModalMaximize: (state, action) => {
      state.modalMaximize = action.payload || false
    },

    setEditorHtmlContent: (state, action) => {
      state.editorHtmlContent = action.payload || ""
    }, 

    setUserOptions: (state, action) => {
      state.userOptions = action.payload || []
    },

    setModalSizeStyle: (state, action) => {
      state.modalSizeStyle = action.payload || ""
    },

    setModalPositionStyle: (state, action) => {
      state.modalPositionStyle = action.payload || ""
    },

    resetComposeModal: (state) => {
      state.composeOpen = false
      state.ccOpen = false
      state.bccOpen = false
      state.modalMaximize = false
      state.userOptions = []
      state.editorHtmlContent = ""
      state.modalSizeStyle = ""
      state.modalPositionStyle = ""
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
        state.attachments = action.payload.attachments
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
  }
})

export const {
  selectMail,
  selectAllMail,
  updateEmailLoader,
  resetSelectedMail,
  resetMailDetailItem,
  clearEmailMessage,
  toggleCompose,
  closeCompose,
  setCCOpen,
  setBCCOpen,
  setModalMaximize,
  setUserOptions,
  setEditorHtmlContent,
  setModalSizeStyle,
  setModalPositionStyle,
  resetComposeModal
} = appEmailSlice.actions

export default appEmailSlice.reducer
