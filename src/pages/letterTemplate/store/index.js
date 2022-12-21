/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Constants
import {
    letterTemplateItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

import { setTotalNumber } from '@utils'
import { TN_LETTER_TEMPLATE } from '@constant/defaultValues'

async function getLetterTemplateListRequest(params) {
    return axios.get(`${API_ENDPOINTS.letterTemplates.list}`, { params }).then((letterTemplate) => letterTemplate.data).catch((error) => error)
}

export const getLetterTemplateList = createAsyncThunk('appLetterTemplate/getLetterTemplateList', async (params) => {
    try {
        const response = await getLetterTemplateListRequest(params)
        if (response && response.flag) {
            if (response.pagination) {
                setTotalNumber(TN_LETTER_TEMPLATE, response.pagination.totalRecord || 0)
            }

            return {
                params,
                letterTemplateItems: response.data,
                pagination: response.pagination,
                letterTemplateItem: letterTemplateItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                letterTemplateItems: [],
                pagination: null,
                letterTemplateItem: letterTemplateItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getLetterTemplateList catch ", error)
        return {
            params,
            letterTemplateItems: [],
            pagination: null,
            letterTemplateItem: letterTemplateItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createLetterTemplateRequest(payload) {
    return axios.post(`${API_ENDPOINTS.letterTemplates.create}`, payload).then((letterTemplate) => letterTemplate.data).catch((error) => error)
}

export const createLetterTemplate = createAsyncThunk('appLetterTemplate/createLetterTemplate', async (payload) => {
    try {
        const response = await createLetterTemplateRequest(payload)
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
        console.log("createLetterTemplate catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getLetterTemplateRequest(id) {
    return axios.get(`${API_ENDPOINTS.letterTemplates.view}/${id}`).then((letterTemplate) => letterTemplate.data).catch((error) => error)
}

export const getLetterTemplate = createAsyncThunk('appLetterTemplate/getLetterTemplate', async (id) => {
    try {
        const response = await getLetterTemplateRequest(id)
        if (response && response.flag) {
            return {
                id,
                letterTemplateItem: response.data || letterTemplateItem,
                actionFlag: "EDIT_ITEM",
                success: "",
                error: ""
            }
        } else {
            return {
                id,
                letterTemplateItem: letterTemplateItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getLetterTemplate catch ", error)
        return {
            id,
            letterTemplateItem: letterTemplateItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function updateLetterTemplateRequest(payload) {
    return axios.post(`${API_ENDPOINTS.letterTemplates.update}`, payload).then((letterTemplate) => letterTemplate.data).catch((error) => error)
}

export const updateLetterTemplate = createAsyncThunk('appLetterTemplate/updateLetterTemplate', async (payload) => {
    try {
        const response = await updateLetterTemplateRequest(payload)
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
        console.log("updateLetterTemplate catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deleteLetterTemplateRequest(id) {
    return axios.get(`${API_ENDPOINTS.letterTemplates.delete}/${id}`).then((letterTemplate) => letterTemplate.data).catch((error) => error)
}

export const deleteLetterTemplate = createAsyncThunk('appLetterTemplate/deleteLetterTemplate', async (id, { dispatch, getState }) => {
    try {
        const response = await deleteLetterTemplateRequest(id)
        if (response && response.flag) {
            await dispatch(getLetterTemplateList(getState().letterTemplate.params))
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
        console.log("deleteLetterTemplate catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

export const appLetterTemplateSlice = createSlice({
    name: 'appLetterTemplate',
    initialState: {
        params: {},
        letterTemplateItems: [],
        letterTemplateItem: letterTemplateItem,
        sortCodes: [],
        pagination: null,
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        updateLetterTemplateLoader: (state, action) => {
            state.loading = action.payload || false
        },

        clearLetterTemplateMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLetterTemplateList.fulfilled, (state, action) => {
                state.letterTemplateItems = action.payload.letterTemplateItems
                state.pagination = action.payload.pagination
                state.letterTemplateItem = action.payload.letterTemplateItem
                state.params = action.payload.params
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(createLetterTemplate.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getLetterTemplate.fulfilled, (state, action) => {
                state.letterTemplateItem = action.payload.letterTemplateItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updateLetterTemplate.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deleteLetterTemplate.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
    }
})

export const {
    updateLetterTemplateLoader,
    clearLetterTemplateMessage
} = appLetterTemplateSlice.actions

export default appLetterTemplateSlice.reducer
