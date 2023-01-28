/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Constant
import {
    TN_IMPORT_LETTER_FILE
} from '@constant/defaultValues'
import {
    importLetterFileItem
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

async function getImportLetterFileListRequest(params) {
    return axios.get(`${API_ENDPOINTS.importLetterFiles.list}`, { params }).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const getImportLetterFileList = createAsyncThunk('appImportLetterFile/getImportLetterFileList', async (params) => {
    try {
        const response = await getImportLetterFileListRequest(params)
        if (response && response.flag) {
            if (response.pagination) {
                setTotalNumber(TN_IMPORT_LETTER_FILE, response.pagination.totalRecord || 0)
            }

            return {
                params,
                importLetterFileItems: response.data,
                pagination: response.pagination,
                importLetterFileItem: importLetterFileItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                importLetterFileItems: [],
                pagination: null,
                importLetterFileItem: importLetterFileItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getImportLetterFileList catch ", error)
        return {
            params,
            importLetterFileItems: [],
            pagination: null,
            importLetterFileItem: importLetterFileItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getImportLetterFileRequest(id) {
    return axios.get(`${API_ENDPOINTS.importLetterFiles.view}/${id}`).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const getImportLetterFile = createAsyncThunk('appImportLetterFile/getImportLetterFile', async (id) => {
    try {
        const response = await getImportLetterFileRequest(id)
        if (response && response.flag) {
            return {
                id,
                importLetterFileItem: response.data,
                actionFlag: "VIEW_IMPORT_FILE",
                success: "",
                error: ""
            }
        } else {
            return {
                id,
                importLetterFileItem: importLetterFileItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getImportLetterFile catch ", error)
        return {
            id,
            importLetterFileItem: importLetterFileItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createImportLetterFileRequest(payload) {
    return axios.post(`${API_ENDPOINTS.importLetterFiles.create}`, payload).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const createImportLetterFile = createAsyncThunk('appImportLetterFile/createImportLetterFile', async (payload, { dispatch, getState }) => {
    try {
        const response = await createImportLetterFileRequest(payload)
        if (response && response.flag) {
            await dispatch(getImportLetterFileList(getState().importLetterFile.params))
            return {
                actionFlag: "IMPORT_FILE_CREATED",
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
        console.log("createImportLetterFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function updateImportLetterFileRequest(payload) {
    return axios.post(`${API_ENDPOINTS.importLetterFiles.update}`, payload).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const updateImportLetterFile = createAsyncThunk('appImportLetterFile/updateImportLetterFile', async (payload, { dispatch, getState }) => {
    try {
        const response = await updateImportLetterFileRequest(payload)
        if (response && response.flag) {
            await dispatch(getImportLetterFileList(getState().importLetterFile.params))
            return {
                actionFlag: "IMPORT_FILE_UPDATED",
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
        console.log("updateImportLetterFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deleteImportLetterFileRequest(id) {
    return axios.get(`${API_ENDPOINTS.importLetterFiles.delete}/${id}`).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const deleteImportLetterFile = createAsyncThunk('appImportLetterFile/deleteImportLetterFile', async (id, { dispatch, getState }) => {
    try {
        const response = await deleteImportLetterFileRequest(id)
        if (response && response.flag) {
            await dispatch(getImportLetterFileList(getState().importLetterFile.params))
            return {
                actionFlag: "IMPORT_FILE_DELETED",
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
        console.log("deleteImportLetterFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function markDoneImportLetterFileRequest(id) {
    return axios.get(`${API_ENDPOINTS.importLetterFiles.isErledigt}/${id}`).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const markDoneImportLetterFile = createAsyncThunk('appImportLetterFile/markDoneImportLetterFile', async (id, { dispatch, getState }) => {
    try {
        const response = await markDoneImportLetterFileRequest(id)
        if (response && response.flag) {
            await dispatch(getImportLetterFileList(getState().importLetterFile.params))
            return {
                actionFlag: "FILE_MARKED",
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
        console.log("markDoneImportLetterFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createMultipleImportLetterFileRequest(payload) {
    return axios.post(`${API_ENDPOINTS.importLetterFiles.createMultiple}`, payload).then((importLetterFile) => importLetterFile.data).catch((error) => error)
}

export const createMultipleImportLetterFile = createAsyncThunk('appImportLetterFile/createMultipleImportLetterFile', async (payload, { dispatch, getState }) => {
    try {
        const response = await createMultipleImportLetterFileRequest(payload)
        if (response && response.flag) {
            await dispatch(getImportLetterFileList(getState().importLetterFile.params))
            return {
                actionFlag: "IMPORT_FILES_CREATED",
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
        console.log("createMultipleImportLetterFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

export const appImportLetterFileSlice = createSlice({
    name: 'appImportLetterFile',
    initialState: {
        params: {},
        importLetterFileItem: importLetterFileItem,
        importLetterFileItems: [],
        pagination: null,
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        updateImportLetterFileLoader: (state, action) => {
            state.loading = action.payload || false
        },

        clearImportLetterFileMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getImportLetterFileList.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.importLetterFileItems = action.payload.importLetterFileItems
                state.pagination = action.payload.pagination
                state.importLetterFileItem = action.payload.importLetterFileItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(getImportLetterFile.fulfilled, (state, action) => {
                state.importLetterFileItem = action.payload.importLetterFileItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(createImportLetterFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updateImportLetterFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deleteImportLetterFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(markDoneImportLetterFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(createMultipleImportLetterFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
    }
})

export const {
    updateImportLetterFileLoader,
    clearImportLetterFileMessage
} = appImportLetterFileSlice.actions

export default appImportLetterFileSlice.reducer
