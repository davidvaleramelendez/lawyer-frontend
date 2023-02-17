/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Constant
import {
    TN_VOICE_RECORDING
} from '@constant/defaultValues'
import {
    voiceRecordingItem
} from '@constant/reduxConstant'

// ** Utils
import {
    setTotalNumber
} from '@utils'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getVoiceRecordingListRequest(params) {
    return axios.get(`${API_ENDPOINTS.voiceRecordings.list}`, { params }).then((voiceRecording) => voiceRecording.data).catch((error) => error)
}

export const getVoiceRecordingList = createAsyncThunk('appVoiceRecording/getVoiceRecordingList', async (params) => {
    try {
        const response = await getVoiceRecordingListRequest(params)
        if (response && response.flag) {
            if (response.pagination) {
                setTotalNumber(TN_VOICE_RECORDING, response.pagination.totalRecord || 0)
            }

            return {
                params,
                voiceRecordingItems: response.data,
                pagination: response.pagination,
                voiceRecordingItem: voiceRecordingItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                voiceRecordingItems: [],
                pagination: null,
                voiceRecordingItem: voiceRecordingItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getVoiceRecordingList catch ", error)
        return {
            params,
            voiceRecordingItems: [],
            pagination: null,
            voiceRecordingItem: voiceRecordingItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getVoiceRecordingRequest(id) {
    return axios.get(`${API_ENDPOINTS.voiceRecordings.view}/${id}`).then((voiceRecording) => voiceRecording.data).catch((error) => error)
}

export const getVoiceRecording = createAsyncThunk('appVoiceRecording/getVoiceRecording', async (id) => {
    try {
        const response = await getVoiceRecordingRequest(id)
        if (response && response.flag) {
            return {
                id,
                voiceRecordingItem: response.data,
                actionFlag: "VIEW_RECORDING",
                success: "",
                error: ""
            }
        } else {
            return {
                id,
                voiceRecordingItem: voiceRecordingItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getVoiceRecording catch ", error)
        return {
            id,
            voiceRecordingItem: voiceRecordingItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createVoiceRecordingRequest(payload) {
    return axios.post(`${API_ENDPOINTS.voiceRecordings.create}`, payload).then((voiceRecording) => voiceRecording.data).catch((error) => error)
}

export const createVoiceRecording = createAsyncThunk('appVoiceRecording/createVoiceRecording', async (payload, { dispatch, getState }) => {
    try {
        const response = await createVoiceRecordingRequest(payload)
        if (response && response.flag) {
            await dispatch(getVoiceRecordingList(getState().voiceRecording.params))

            return {
                actionFlag: "RECORDING_CREATED",
                success: response.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "",
                success: "",
                error: response.error
            }
        }
    } catch (error) {
        console.log("createVoiceRecording catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function updateVoiceRecordingRequest(payload) {
    return axios.post(`${API_ENDPOINTS.voiceRecordings.update}`, payload).then((voiceRecording) => voiceRecording.data).catch((error) => error)
}

export const updateVoiceRecording = createAsyncThunk('appVoiceRecording/updateVoiceRecording', async (payload, { dispatch, getState }) => {
    try {
        const response = await updateVoiceRecordingRequest(payload)
        if (response && response.flag) {
            await dispatch(getVoiceRecordingList(getState().voiceRecording.params))

            return {
                actionFlag: "RECORDING_UPDATED",
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
        console.log("updateVoiceRecording catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deleteVoiceRecordingRequest(id) {
    return axios.get(`${API_ENDPOINTS.voiceRecordings.delete}/${id}`).then((voiceRecording) => voiceRecording.data).catch((error) => error)
}

export const deleteVoiceRecording = createAsyncThunk('appVoiceRecording/deleteVoiceRecording', async (id, { dispatch, getState }) => {
    try {
        const response = await deleteVoiceRecordingRequest(id)
        if (response && response.flag) {
            await dispatch(getVoiceRecordingList(getState().voiceRecording.params))
            return {
                actionFlag: "RECORDING_DELETED",
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
        console.log("deleteVoiceRecording catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function markDoneVoiceRecordingRequest(id) {
    return axios.get(`${API_ENDPOINTS.voiceRecordings.isErledigt}/${id}`).then((voiceRecording) => voiceRecording.data).catch((error) => error)
}

export const markDoneVoiceRecording = createAsyncThunk('appVoiceRecording/markDoneVoiceRecording', async (id, { dispatch, getState }) => {
    try {
        const response = await markDoneVoiceRecordingRequest(id)
        if (response && response.flag) {
            await dispatch(getVoiceRecordingList(getState().voiceRecording.params))
            return {
                actionFlag: "RECORDING_MARKED",
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
        console.log("markDoneVoiceRecording catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

export const appVoiceRecordingSlice = createSlice({
    name: 'appVoiceRecording',
    initialState: {
        params: {},
        voiceRecordingItem: voiceRecordingItem,
        voiceRecordingItems: [],
        pagination: null,
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        updateVoiceRecordingLoader: (state, action) => {
            state.loading = action.payload || false
        },

        createVoiceRecordItem: (state, action) => {
            state.voiceRecordingItem = (action.payload && action.payload.data) || voiceRecordingItem
            state.actionFlag = (action.payload && action.payload.message) || ""
        },

        setVoiceRecordingItem: (state, action) => {
            state.voiceRecordingItem = action.payload || voiceRecordingItem
        },

        resetVoiceRecordItem: (state) => {
            state.voiceRecordingItem = voiceRecordingItem
        },

        clearVoiceRecordingMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVoiceRecordingList.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.voiceRecordingItems = action.payload.voiceRecordingItems
                state.pagination = action.payload.pagination
                state.voiceRecordingItem = action.payload.voiceRecordingItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getVoiceRecording.fulfilled, (state, action) => {
                state.voiceRecordingItem = action.payload.voiceRecordingItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(createVoiceRecording.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updateVoiceRecording.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deleteVoiceRecording.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(markDoneVoiceRecording.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
    }
})

export const {
    resetVoiceRecordItem,
    setVoiceRecordingItem,
    createVoiceRecordItem,
    updateVoiceRecordingLoader,
    clearVoiceRecordingMessage
} = appVoiceRecordingSlice.actions

export default appVoiceRecordingSlice.reducer
