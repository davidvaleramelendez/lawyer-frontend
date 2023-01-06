/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  chatItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

import { setTotalNumber } from '@utils'
import { TN_CHAT, TN_CHAT_CONTACT } from '@constant/defaultValues'

async function getChatContactsRequest(params) {
  return axios.get(`${API_ENDPOINTS.chats.list}`, { params })
    .then((chat) => {
      const { chats, users } = chat.data.data
      setTotalNumber(TN_CHAT_CONTACT, users.length)
      setTotalNumber(TN_CHAT, Object.keys(chats).length)
      return chat.data
    })
    .catch((error) => error)
}

export const getChatContacts = createAsyncThunk('appContact/getChatContacts', async (params) => {
  try {
    const response = await getChatContactsRequest(params)
    if (response && response.flag) {
      return {
        params,
        userProfile: response.data.userData,
        contacts: response.data.users,
        chatItems: response.data.chats,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        userProfile: {},
        contacts: [],
        chatItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getChatContacts catch ", error)
    return {
      params,
      userProfile: {},
      contacts: [],
      chatItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getContactChatRequest(params) {
  return axios.get(`${API_ENDPOINTS.chats.getChats}`, { params }).then((chat) => chat.data).catch((error) => error)
}

export const getContactChat = createAsyncThunk('appContact/getContactChat', async (params, { dispatch, getState }) => {
  try {
    const response = await getContactChatRequest(params)
    if (response && response.flag) {
      await dispatch(getChatContacts(getState().chat.params))
      return {
        chats: response.data.chats,
        selectedUser: response.data.userData,
        chatCount: response.data.chatCount ?? 0,
        totalChatCount: response.data.totalChatCount ?? 0,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        chats: [],
        selectedUser: {},
        chatCount: 0,
        totalChatCount: 0,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getContactChat catch ", error)
    return {
      chats: [],
      selectedUser: {},
      chatCount: 0,
      totalChatCount: 0,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getChatHistoryRequest(id, params) {
  return axios.get(`${API_ENDPOINTS.chats.chatHistory}/${id}`, { params }).then((chat) => chat.data).catch((error) => error)
}

export const getChatHistory = createAsyncThunk('appContact/getChatHistory', async (params) => {
  try {
    const response = await getChatHistoryRequest(params.id, params.payload)
    if (response && response.flag) {
      return {
        chats: response.data.chats,
        chatCount: response.data.chatCount ?? 0,
        totalChatCount: response.data.totalChatCount ?? 0,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        chats: [],
        chatCount: 0,
        totalChatCount: 0,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getChatHistory catch ", error)
    return {
      chats: [],
      chatCount: 0,
      totalChatCount: 0,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function sendMessageRequest(payload) {
  return axios.post(`${API_ENDPOINTS.chats.sendMessage}`, payload).then((chat) => chat.data).catch((error) => error)
}

export const sendMessage = createAsyncThunk('appContact/sendMessage', async (payload, { dispatch, getState }) => {
  try {
    const response = await sendMessageRequest(payload)
    if (response && response.flag) {
      await dispatch(getChatHistory({ id: payload.receiver_id, payload: { chatCount: getState().chat.chatCount } }))
      return {
        actionFlag: "MESSAGE_SENT",
        success: "",
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("sendMessage catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    params: {},
    userProfile: {},
    selectedUser: {},
    chats: [],
    contacts: [],
    chatItems: [],
    chatItem: chatItem,
    chatCount: 0,
    totalChatCount: 0,
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    setDefaultVariables: (state) => {
      state.chats = []
      state.selectedUser = {}
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    },

    updateChatLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearChatMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatContacts.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.userProfile = action.payload.userProfile
        state.chatItems = action.payload.chatItems
        state.contacts = action.payload.contacts
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getContactChat.fulfilled, (state, action) => {
        state.chats = action.payload.chats
        state.selectedUser = action.payload.selectedUser
        state.chatCount = action.payload.chatCount
        state.totalChatCount = action.payload.totalChatCount
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.chats = action.payload.chats
        state.chatCount = action.payload.chatCount
        state.totalChatCount = action.payload.totalChatCount
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  updateChatLoader,
  setDefaultVariables,
  clearChatMessage
} = appChatSlice.actions

export default appChatSlice.reducer
