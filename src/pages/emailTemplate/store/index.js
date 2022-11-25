/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  emailTemplateItem,
  emailTemplateAttachmentItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getEmailTemplateListRequest(params) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.list}`, { params }).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const getEmailTemplateList = createAsyncThunk('appEmailTemplate/getEmailTemplateList', async (params) => {
  try {
    const response = await getEmailTemplateListRequest(params)
    if (response && response.flag) {
      return {
        params,
        emailTemplateItems: response.data,
        pagination: response.pagination,
        emailTemplateItem: emailTemplateItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        emailTemplateItems: [],
        pagination: null,
        emailTemplateItem: emailTemplateItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getEmailTemplateList catch ", error)
    return {
      params,
      emailTemplateItems: [],
      pagination: null,
      emailTemplateItem: emailTemplateItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createEmailTemplateRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emailTemplates.create}`, payload).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const createEmailTemplate = createAsyncThunk('appEmailTemplate/createEmailTemplate', async (payload) => {
  try {
    const response = await createEmailTemplateRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "CREATED_ITEM",
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
    console.log("createEmailTemplate catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getEmailTemplateRequest(id) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.view}/${id}`).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const getEmailTemplate = createAsyncThunk('appEmailTemplate/getEmailTemplate', async (id) => {
  try {
    const response = await getEmailTemplateRequest(id)
    if (response && response.flag) {
      return {
        id,
        emailTemplateItem: response.data,
        actionFlag: "EDIT_ITEM",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        emailTemplateItem: emailTemplateItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getEmailTemplate catch ", error)
    return {
      id,
      emailTemplateItem: emailTemplateItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateEmailTemplateRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emailTemplates.update}`, payload).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const updateEmailTemplate = createAsyncThunk('appEmailTemplate/updateEmailTemplate', async (payload) => {
  try {
    const response = await updateEmailTemplateRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "UPDATED_ITEM",
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
    console.log("updateEmailTemplate catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteEmailTemplateRequest(id) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.delete}/${id}`).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const deleteEmailTemplate = createAsyncThunk('appEmailTemplate/deleteEmailTemplate', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteEmailTemplateRequest(id)
    if (response && response.flag) {
      await dispatch(getEmailTemplateList(getState().emailTemplate.params))
      return {
        actionFlag: "DELETED",
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
    console.log("deleteEmailTemplate catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function viewEmailTemplateRequest(id) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.viewTemplate}/${id}`).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const viewEmailTemplate = createAsyncThunk('appEmailTemplate/viewEmailTemplate', async (id) => {
  try {
    const response = await viewEmailTemplateRequest(id)
    if (response && response.flag) {
      return {
        id,
        emailTemplateItem: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        emailTemplateItem: emailTemplateItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("viewEmailTemplate catch ", error)
    return {
      id,
      emailTemplateItem: emailTemplateItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

/* Email Template Attachment */
async function getEmailTemplateAttachmentListRequest(params) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.attachmentList}`, { params }).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const getEmailTemplateAttachmentList = createAsyncThunk('appEmailTemplate/getEmailTemplateAttachmentList', async (params) => {
  try {
    const response = await getEmailTemplateAttachmentListRequest(params)
    if (response && response.flag) {
      return {
        attachParams: params,
        emailTemplateAttachmentItems: response.data,
        emailTemplateAttachmentItem: emailTemplateAttachmentItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        attachParams: params,
        emailTemplateAttachmentItems: [],
        emailTemplateAttachmentItem: emailTemplateAttachmentItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getEmailTemplateAttachmentList catch ", error)
    return {
      attachParams: params,
      emailTemplateAttachmentItems: [],
      emailTemplateAttachmentItem: emailTemplateAttachmentItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createEmailTemplateAttachmentRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emailTemplates.attachmentCreate}`, payload).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const createEmailTemplateAttachment = createAsyncThunk('appEmailTemplate/createEmailTemplateAttachment', async (payload) => {
  try {
    const response = await createEmailTemplateAttachmentRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "ATTACHMENT_CREATED",
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
    console.log("createEmailTemplateAttachment catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getEmailTemplateAttachmentRequest(id) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.attachmentView}/${id}`).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const getEmailTemplateAttachment = createAsyncThunk('appEmailTemplate/getEmailTemplateAttachment', async (id) => {
  try {
    const response = await getEmailTemplateAttachmentRequest(id)
    if (response && response.flag) {
      return {
        emailTemplateAttachmentItem: response.data,
        actionFlag: "EDIT_ATTACHMENT_ITEM",
        success: "",
        error: ""
      }
    } else {
      return {
        emailTemplateAttachmentItem: emailTemplateAttachmentItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getEmailTemplateAttachment catch ", error)
    return {
      emailTemplateAttachmentItem: emailTemplateAttachmentItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateEmailTemplateAttachmentRequest(payload) {
  return axios.post(`${API_ENDPOINTS.emailTemplates.attachmentUpdate}`, payload).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const updateEmailTemplateAttachment = createAsyncThunk('appEmailTemplate/updateEmailTemplateAttachment', async (payload) => {
  try {
    const response = await updateEmailTemplateAttachmentRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "ATTACHMENT_UPDATED",
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
    console.log("updateEmailTemplateAttachment catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteEmailTemplateAttachmentRequest(id) {
  return axios.get(`${API_ENDPOINTS.emailTemplates.attachmentDelete}/${id}`).then((emailTemplate) => emailTemplate.data).catch((error) => error)
}

export const deleteEmailTemplateAttachment = createAsyncThunk('appEmailTemplate/deleteEmailTemplateAttachment', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteEmailTemplateAttachmentRequest(id)
    if (response && response.flag) {
      await dispatch(getEmailTemplateAttachmentList(getState().emailTemplate.attachParams))
      return {
        actionFlag: "ATTACHMENT_DELETED",
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
    console.log("deleteEmailTemplateAttachment catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Email Template Attachment */

export const appEmailTemplateSlice = createSlice({
  name: 'appEmailTemplate',
  initialState: {
    params: {},
    attachParams: {},
    emailTemplateItems: [],
    emailTemplateItem: emailTemplateItem,
    emailTemplateAttachmentItems: [],
    emailTemplateAttachmentItem: emailTemplateAttachmentItem,
    sortCodeType: "",
    sortCodeTypes: [{ id: "case", value: "Case" }, { id: "contact", value: "Contact" }, { id: "user", value: "User" }],
    sortCodes: [],
    pagination: null,
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    clearEmailTemplateAttachment: (state, action) => {
      state.attachParams = {}
      state.emailTemplateAttachmentItems = action.payload || []
      state.emailTemplateAttachmentItem = emailTemplateAttachmentItem
    },

    getSortCodes: (state, action) => {
      const caseCode = [
        { key: "[CaseID]", value: "Case id" },
        { key: "[ContactID]", value: "Contact id" },
        { key: "[LaywerID]", value: "Lawyer id" },
        { key: "[CaseTypeID]", value: "Case type id" },
        { key: "[CaseName]", value: "Case name" },
        { key: "[Date]", value: "Case date" },
        { key: "[Status]", value: "Case status" }
      ]
      const contactCode = [
        { key: "[ContactID]", value: "Contact id" },
        { key: "[ContactName]", value: "Name" },
        { key: "[ContactEmail]", value: "Email" },
        { key: "[Subject]", value: "Subject" },
        { key: "[PhoneNo]", value: "Phone no" },
        { key: "[IsCase]", value: "Iscase converted into case or not" },
        { key: "[message_id]", value: "" }
      ]

      const userCode = [
        { key: "[name]", value: "Name" },
        { key: "[email]", value: "Email" },
        { key: "[Status]", value: "Status" },
        { key: "[Contact]", value: "Contact number" },
        { key: "[Company]", value: "Company name" },
        { key: "[DOB]", value: "Date of birth" },
        { key: "[Gender]", value: "Gender" },
        { key: "[Address]", value: "Address 1" },
        { key: "[Address1]", value: "Address 2" },
        { key: "[Postcode]", value: "Postal code" },
        { key: "[City]", value: "City" },
        { key: "[State]", value: "State" },
        { key: "[Country]", value: "Country" }
      ]

      if (action.payload.type && (action.payload.sortCodeTypes && action.payload.sortCodeTypes.length)) {
        const index = action.payload.sortCodeTypes.findIndex(x => x.id === action.payload.type)
        if (index !== -1) {
          state.sortCodeType = action.payload.sortCodeTypes[index].value

          if (action.payload.type === action.payload.sortCodeTypes[0].id) {
            state.sortCodes = caseCode
          }

          if (action.payload.type === action.payload.sortCodeTypes[1].id) {
            state.sortCodes = contactCode
          }

          if (action.payload.type === action.payload.sortCodeTypes[2].id) {
            state.sortCodes = userCode
          }
        }
      }
    },

    clearSortCode: (state, action) => {
      state.sortCodeType = ""
      state.sortCodes = action.payload || []
    },

    updateEmailTemplateLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearEmailTemplateMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmailTemplateList.fulfilled, (state, action) => {
        state.emailTemplateItems = action.payload.emailTemplateItems
        state.pagination = action.payload.pagination
        state.emailTemplateItem = action.payload.emailTemplateItem
        state.params = action.payload.params
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createEmailTemplate.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getEmailTemplate.fulfilled, (state, action) => {
        state.emailTemplateItem = action.payload.emailTemplateItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateEmailTemplate.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteEmailTemplate.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(viewEmailTemplate.fulfilled, (state, action) => {
        state.emailTemplateItem = action.payload.emailTemplateItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* Email Template Attachment */
      .addCase(getEmailTemplateAttachmentList.fulfilled, (state, action) => {
        state.attachParams = action.payload.attachParams
        state.emailTemplateAttachmentItems = action.payload.emailTemplateAttachmentItems
        state.emailTemplateAttachmentItem = action.payload.emailTemplateAttachmentItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createEmailTemplateAttachment.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getEmailTemplateAttachment.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateEmailTemplateAttachment.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteEmailTemplateAttachment.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  getSortCodes,
  clearSortCode,
  clearEmailTemplateAttachment,
  updateEmailTemplateLoader,
  clearEmailTemplateMessage
} = appEmailTemplateSlice.actions

export default appEmailTemplateSlice.reducer
