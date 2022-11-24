/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  contactItem
} from '@constant/reduxConstant'

// ** Axios Imports
import axios from 'axios'

async function getContactListRequest(params) {
  return axios.get(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/api/admin/get_contact_list`, { params }).then((contact) => contact.data).catch((error) => error)
}

export const getContactList = createAsyncThunk('appContact/getContactList', async (params) => {
  try {
    const response = await getContactListRequest(params)
    if (response && response.flag) {
      return {
        params,
        contactItems: response.data,
        pagination: response.pagination,
        contactItem: contactItem,
        noteItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        contactItems: [],
        pagination: null,
        contactItem: contactItem,
        noteItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getContactList catch ", error)
    return {
      params,
      contactItems: [],
      pagination: null,
      contactItem: contactItem,
      noteItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getContactViewRequest(id) {
  return axios.get(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/api/admin/contact/view/${id}`).then((contact) => contact.data).catch((error) => error)
}

export const getContactView = createAsyncThunk('appContact/getContactView', async (id) => {
  try {
    const response = await getContactViewRequest(id)
    if (response && response.flag) {
      return {
        id,
        contactItem: response.data.contact,
        laywerItems: response.data.laywers,
        typeItems: response.data.types,
        noteItems: response.data.notes,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        contactItem: contactItem,
        laywerItems: [],
        typeItems: [],
        noteItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getContactView catch ", error)
    return {
      id,
      contactItem: contactItem,
      laywerItems: [],
      typeItems: [],
      noteItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function addContactRequest(payload) {
  return axios.post(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/api/admin/add_contact`, payload).then((contact) => contact.data).catch((error) => error)
}

export const addContact = createAsyncThunk('appContact/addContact', async (payload, { dispatch, getState }) => {
  try {
    const response = await addContactRequest(payload)
    if (response && response.flag) {
      await dispatch(getContactList(getState().contact.params))
      return {
        actionFlag: "ADDED_ITEM",
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
    console.log("addContact catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function addContactNoteRequest(payload) {
  return axios.post(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/api/admin/contact/add_note`, payload).then((contact) => contact.data).catch((error) => error)
}

export const addContactNote = createAsyncThunk('appContact/addContactNote', async (payload, { dispatch }) => {
  try {
    const response = await addContactNoteRequest(payload)
    if (response && response.flag) {
      await dispatch(getContactView(payload.ContactID))
      return {
        actionFlag: "NOTE_ADDED",
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
    console.log("addContactNote catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function convertContactToCaseRequest(payload) {
  return axios.post(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/api/admin/convert_contact_to_case`, payload).then((contact) => contact.data).catch((error) => error)
}

export const convertContactToCase = createAsyncThunk('appContact/convertContactToCase', async (payload, { dispatch }) => {
  try {
    const response = await convertContactToCaseRequest(payload)
    if (response && response.flag) {
      await dispatch(getContactView(payload.ContactID))
      return {
        actionFlag: "CASE_ADDED",
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
    console.log("convertContactToCase catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteContactRequest(id) {
  return axios.get(`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/api/admin/contact/delete/${id}`).then((contact) => contact.data).catch((error) => error)
}

export const deleteContact = createAsyncThunk('appContact/deleteContact', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteContactRequest(id)
    if (response && response.flag) {
      await dispatch(getContactList(getState().contact.params))
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
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appContactSlice = createSlice({
  name: 'appContact',
  initialState: {
    params: {},
    contactItems: [],
    pagination: null,
    contactItem: contactItem,
    laywerItems: [],
    typeItems: [],
    noteItems: [],
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    updateContactLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearContactMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContactList.fulfilled, (state, action) => {
        state.contactItems = action.payload.contactItems
        state.pagination = action.payload.pagination
        state.params = action.payload.params
        state.contactItem = action.payload.contactItem
        state.noteItems = action.payload.noteItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getContactView.fulfilled, (state, action) => {
        state.id = action.payload.id
        state.contactItem = action.payload.contactItem
        state.laywerItems = action.payload.laywerItems
        state.typeItems = action.payload.typeItems
        state.noteItems = action.payload.noteItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(addContactNote.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(convertContactToCase.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  updateContactLoader,
  clearContactMessage
} = appContactSlice.actions

export default appContactSlice.reducer
