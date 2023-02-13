/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Constant
import {
    TN_PLACETEL_CALL
} from '@constant/defaultValues'
import {
    placetelCallItem
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

async function getPlacetelCallStatsCountRequest(params) {
    return axios.get(`${API_ENDPOINTS.placetelCalls.statsCount}`, { params }).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const getPlacetelCallStatsCount = createAsyncThunk('appPlacetelCall/getPlacetelCallStatsCount', async (params) => {
    try {
        const response = await getPlacetelCallStatsCountRequest(params)
        if (response && response.flag) {
            return {
                placetelCallStatsCount: response.data || null,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                placetelCallStatsCount: null,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getPlacetelCallStatsCount catch ", error)
        return {
            placetelCallStatsCount: null,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getPlacetelCallListRequest(params) {
    return axios.get(`${API_ENDPOINTS.placetelCalls.list}`, { params }).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const getPlacetelCallList = createAsyncThunk('appPlacetelCall/getPlacetelCallList', async (params) => {
    try {
        const response = await getPlacetelCallListRequest(params)
        if (response && response.flag) {
            if (response.pagination) {
                setTotalNumber(TN_PLACETEL_CALL, response.pagination.totalRecord || 0)
            }

            return {
                params,
                placetelCallItems: response.data,
                pagination: response.pagination,
                placetelCallItem: placetelCallItem,
                selectedPlacetelCallIds: [],
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                placetelCallItems: [],
                pagination: null,
                placetelCallItem: placetelCallItem,
                selectedPlacetelCallIds: [],
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getPlacetelCallList catch ", error)
        return {
            params,
            placetelCallItems: [],
            pagination: null,
            placetelCallItem: placetelCallItem,
            selectedPlacetelCallIds: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getPlacetelCallRequest(id) {
    return axios.get(`${API_ENDPOINTS.placetelCalls.view}/${id}`).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const getPlacetelCall = createAsyncThunk('appPlacetelCall/getPlacetelCall', async (id) => {
    try {
        const response = await getPlacetelCallRequest(id)
        if (response && response.flag) {
            return {
                id,
                placetelCallItem: response.data,
                actionFlag: "VIEW_PLACETEL_CALL",
                success: "",
                error: ""
            }
        } else {
            return {
                id,
                placetelCallItem: placetelCallItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getPlacetelCall catch ", error)
        return {
            id,
            placetelCallItem: placetelCallItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createPlacetelCallRequest(payload) {
    return axios.post(`${API_ENDPOINTS.placetelCalls.create}`, payload).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const createPlacetelCall = createAsyncThunk('appPlacetelCall/createPlacetelCall', async (payload, { dispatch, getState }) => {
    try {
        const response = await createPlacetelCallRequest(payload)
        if (response && response.flag) {
            await dispatch(getPlacetelCallList(getState().placetelCall.params))
            return {
                actionFlag: "PLACETEL_CALL_CREATED",
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
        console.log("createPlacetelCall catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function updatePlacetelCallRequest(payload) {
    return axios.post(`${API_ENDPOINTS.placetelCalls.update}`, payload).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const updatePlacetelCall = createAsyncThunk('appPlacetelCall/updatePlacetelCall', async (payload, { dispatch, getState }) => {
    try {
        const response = await updatePlacetelCallRequest(payload)
        if (response && response.flag) {
            await dispatch(getPlacetelCallList(getState().placetelCall.params))
            return {
                actionFlag: "PLACETEL_CALL_UPDATED",
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
        console.log("updatePlacetelCall catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deletePlacetelCallRequest(id) {
    return axios.get(`${API_ENDPOINTS.placetelCalls.delete}/${id}`).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const deletePlacetelCall = createAsyncThunk('appPlacetelCall/deletePlacetelCall', async (id, { dispatch, getState }) => {
    try {
        const response = await deletePlacetelCallRequest(id)
        if (response && response.flag) {
            await dispatch(getPlacetelCallList(getState().placetelCall.params))
            return {
                actionFlag: "PLACETEL_CALL_DELETED",
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
        console.log("deletePlacetelCall catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deleteMultiplePlacetelCallRequest(payload) {
    return axios.post(`${API_ENDPOINTS.placetelCalls.deleteMultiple}`, payload).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const deleteMultiplePlacetelCall = createAsyncThunk('appPlacetelCall/deleteMultiplePlacetelCall', async (payload, { dispatch, getState }) => {
    try {
        const response = await deleteMultiplePlacetelCallRequest(payload)
        if (response && response.flag) {
            await dispatch(getPlacetelCallList(getState().placetelCall.params))
            return {
                actionFlag: "PLACETEL_CALLS_DELETED",
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
        console.log("deleteMultiplePlacetelCall catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function fetchIncomingCallsApiRequest(params) {
    return axios.get(`${API_ENDPOINTS.placetelCalls.fetchIncomingCallsApi}`, { params }).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const fetchIncomingCallsApi = createAsyncThunk('appPlacetelCall/fetchIncomingCallsApi', async (params, { dispatch, getState }) => {
    try {
        const response = await fetchIncomingCallsApiRequest(params)
        if (response && response.flag) {
            await dispatch(getPlacetelCallList(getState().placetelCall.params))
            return {
                actionFlag: "PLACETEL_FETCH_API_CALLED",
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
        console.log("fetchIncomingCallsApi catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

/* Placetel Api Sipuid */
async function initiatePlacetelCallRequest(payload) {
    return axios.post(`${API_ENDPOINTS.placetelApiSipuids.initiateCall}`, payload).then((placetelCall) => placetelCall.data).catch((error) => error)
}

export const initiatePlacetelCall = createAsyncThunk('appPlacetelCall/initiatePlacetelCall', async (payload) => {
    try {
        const response = await initiatePlacetelCallRequest(payload)
        if (response && response.flag) {
            return {
                initiatedCallItem: response.data || placetelCallItem,
                actionFlag: "PLACETEL_CALL_INITIATED",
                success: response.message,
                error: ""
            }
        } else {
            return {
                initiatedCallItem: placetelCallItem,
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("initiatePlacetelCall catch ", error)
        return {
            initiatedCallItem: placetelCallItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* /Placetel Api Sipuid */

export const appPlacetelCallSlice = createSlice({
    name: 'appPlacetelCall',
    initialState: {
        params: {},
        placetelCallStatsCount: null,
        placetelCallItem: placetelCallItem,
        initiatedCallItem: placetelCallItem,
        placetelCallItems: [],
        selectedPlacetelCallIds: [],
        pagination: null,
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        updatePlacetelCallLoader: (state, action) => {
            state.loading = action.payload || false
        },

        setPlacetelCallItem: (state, action) => {
            state.placetelCallItem = action.payload || placetelCallItem
        },

        setInitiateCallItem: (state, action) => {
            state.initiatedCallItem = action.payload || placetelCallItem
        },

        setSelectedPlacetelCallIds: (state, action) => {
            state.selectedPlacetelCallIds = action.payload || []
        },

        clearPlacetelCallMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPlacetelCallStatsCount.fulfilled, (state, action) => {
                state.placetelCallStatsCount = action.payload.placetelCallStatsCount
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getPlacetelCallList.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.placetelCallItems = action.payload.placetelCallItems
                state.pagination = action.payload.pagination
                state.placetelCallItem = action.payload.placetelCallItem
                state.selectedPlacetelCallIds = action.payload.selectedPlacetelCallIds
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getPlacetelCall.fulfilled, (state, action) => {
                state.placetelCallItem = action.payload.placetelCallItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(createPlacetelCall.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updatePlacetelCall.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deletePlacetelCall.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deleteMultiplePlacetelCall.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(fetchIncomingCallsApi.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })

            /* Placetel Api Sipuid */
            .addCase(initiatePlacetelCall.fulfilled, (state, action) => {
                state.initiatedCallItem = action.payload.initiatedCallItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            /* /Placetel Api Sipuid */
    }
})

export const {
    setSelectedPlacetelCallIds,
    clearPlacetelCallMessage,
    updatePlacetelCallLoader,
    setPlacetelCallItem,
    setInitiateCallItem
} = appPlacetelCallSlice.actions

export default appPlacetelCallSlice.reducer
