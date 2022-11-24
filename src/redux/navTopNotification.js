/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getChatNotificationRequest(params) {
    return axios.get(`${API_ENDPOINTS.navTopNotification.chatList}`, { params }).then((notification) => notification.data).catch((error) => error)
}

export const getChatNotification = createAsyncThunk('navTopNotification/getChatNotification', async (params) => {
    try {
        const response = await getChatNotificationRequest(params)
        if (response && response.flag) {
            return {
                chatNotificationItems: response.data,
                actionFlag: "",
                success: response.message,
                error: ""
            }
        } else {
            return {
                chatNotificationItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("getChatNotification catch ", error)
        return {
            chatNotificationItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getContactNotificationRequest(params) {
    return axios.get(`${API_ENDPOINTS.navTopNotification.contactList}`, { params }).then((notification) => notification.data).catch((error) => error)
}

export const getContactNotification = createAsyncThunk('navTopNotification/getContactNotification', async (params) => {
    try {
        const response = await getContactNotificationRequest(params)
        if (response && response.flag) {
            return {
                contactNotificationItems: response.data,
                actionFlag: "",
                success: response.message,
                error: ""
            }
        } else {
            return {
                contactNotificationItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("getContactNotification catch ", error)
        return {
            contactNotificationItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getEmailNotificationRequest(params) {
    return axios.get(`${API_ENDPOINTS.navTopNotification.emailList}`, { params }).then((notification) => notification.data).catch((error) => error)
}

export const getEmailNotification = createAsyncThunk('navTopNotification/getEmailNotification', async (params) => {
    try {
        const response = await getEmailNotificationRequest(params)
        if (response && response.flag) {
            return {
                emailNotificationItems: response.data,
                actionFlag: "",
                success: response.message,
                error: ""
            }
        } else {
            return {
                emailNotificationItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("getEmailNotification catch ", error)
        return {
            emailNotificationItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

export const navTopNotificationSlice = createSlice({
    name: 'navTopNotification',
    initialState: {
        chatNotificationItems: [],
        contactNotificationItems: [],
        emailNotificationItems: [],
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        clearTopNavMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatNotification.fulfilled, (state, action) => {
                state.chatNotificationItems = action.payload.chatNotificationItems
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getContactNotification.fulfilled, (state, action) => {
                state.contactNotificationItems = action.payload.contactNotificationItems
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getEmailNotification.fulfilled, (state, action) => {
                state.emailNotificationItems = action.payload.emailNotificationItems
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
    }
})

export const {
    clearTopNavMessage
} = navTopNotificationSlice.actions

export default navTopNotificationSlice.reducer
