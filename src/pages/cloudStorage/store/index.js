/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Constant
import {
    cloudStorageItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

/* Common */
async function getCloudStorageListRequest(params) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.list}`, { params }).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const getCloudStorageList = createAsyncThunk('appCloudStorage/getCloudStorageList', async (params) => {
    try {
        const response = await getCloudStorageListRequest(params)
        if (response && response.flag) {
            return {
                params,
                cloudStorageItems: response.data,
                cloudStorageItem: cloudStorageItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                cloudStorageItems: null,
                cloudStorageItem: cloudStorageItem,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getCloudStorageList catch ", error)
        return {
            params,
            cloudStorageItems: null,
            cloudStorageItem: cloudStorageItem,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* /Common */

/* Cloud Storage Folder */
async function getTreeFolderListRequest(params) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.treeList}`, { params }).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const getTreeFolderList = createAsyncThunk('appCloudStorage/getTreeFolderList', async (params) => {
    try {
        const response = await getTreeFolderListRequest(params)
        if (response && response.flag) {
            return {
                treeParams: params,
                treeFolderItems: response.data,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                treeParams: params,
                treeFolderItems: [],
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getTreeFolderList catch ", error)
        return {
            treeParams: params,
            treeFolderItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createCloudStorageFolderRequest(payload) {
    return axios.post(`${API_ENDPOINTS.cloudStorage.createFolder}`, payload).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const createCloudStorageFolder = createAsyncThunk('appCloudStorage/createCloudStorageFolder', async (payload, { dispatch, getState }) => {
    try {
        const response = await createCloudStorageFolderRequest(payload)
        if (response && response.flag) {
            await dispatch(getTreeFolderList(getState().cloudStorage.treeParams))
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FOLDER_CREATED",
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
        console.log("createCloudStorageFolder catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function updateCloudStorageFolderRequest(payload) {
    return axios.post(`${API_ENDPOINTS.cloudStorage.updateFolder}`, payload).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const updateCloudStorageFolder = createAsyncThunk('appCloudStorage/updateCloudStorageFolder', async (payload, { dispatch, getState }) => {
    try {
        const response = await updateCloudStorageFolderRequest(payload)
        if (response && response.flag) {
            await dispatch(getTreeFolderList())
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FOLDER_UPDATED",
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
        console.log("updateCloudStorageFolder catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function trashCloudStorageFolderRequest(id) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.trashFolder}/${id}`).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const trashCloudStorageFolder = createAsyncThunk('appCloudStorage/trashCloudStorageFolder', async (id, { dispatch, getState }) => {
    try {
        const response = await trashCloudStorageFolderRequest(id)
        if (response && response.flag) {
            await dispatch(getTreeFolderList())
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FOLDER_TRASHED",
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
        console.log("trashCloudStorageFolder catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deleteCloudStorageFolderRequest(id) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.deleteFolder}/${id}`).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const deleteCloudStorageFolder = createAsyncThunk('appCloudStorage/deleteCloudStorageFolder', async (id, { dispatch, getState }) => {
    try {
        const response = await deleteCloudStorageFolderRequest(id)
        if (response && response.flag) {
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FOLDER_DELETED",
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
        console.log("deleteCloudStorageFolder catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* /Cloud Storage Folder */

/* Cloud Storage File */
async function createCloudStorageFileRequest(payload) {
    return axios.post(`${API_ENDPOINTS.cloudStorage.createFile}`, payload).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const createCloudStorageFile = createAsyncThunk('appCloudStorage/createCloudStorageFile', async (payload, { dispatch, getState }) => {
    try {
        const response = await createCloudStorageFileRequest(payload)
        if (response && response.flag) {
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FILE_CREATED",
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
        console.log("createCloudStorageFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function updateCloudStorageFileRequest(payload) {
    return axios.post(`${API_ENDPOINTS.cloudStorage.updateFile}`, payload).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const updateCloudStorageFile = createAsyncThunk('appCloudStorage/updateCloudStorageFile', async (payload, { dispatch, getState }) => {
    try {
        const response = await updateCloudStorageFileRequest(payload)
        if (response && response.flag) {
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FILE_UPDATED",
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
        console.log("updateCloudStorageFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function trashCloudStorageFileRequest(id) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.trashFile}/${id}`).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const trashCloudStorageFile = createAsyncThunk('appCloudStorage/trashCloudStorageFile', async (id, { dispatch, getState }) => {
    try {
        const response = await trashCloudStorageFileRequest(id)
        if (response && response.flag) {
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FILE_TRASHED",
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
        console.log("trashCloudStorageFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function deleteCloudStorageFileRequest(id) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.deleteFile}/${id}`).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const deleteCloudStorageFile = createAsyncThunk('appCloudStorage/deleteCloudStorageFile', async (id, { dispatch, getState }) => {
    try {
        const response = await deleteCloudStorageFileRequest(id)
        if (response && response.flag) {
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "FILE_DELETED",
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
        console.log("deleteCloudStorageFile catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* /Cloud Storage File */

/* /Common */
async function markImportantCloudItemRequest(params) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.markImportant}`, { params }).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const markImportantCloudItem = createAsyncThunk('appCloudStorage/markImportantCloudItem', async (id, { dispatch, getState }) => {
    try {
        const response = await markImportantCloudItemRequest(id)
        if (response && response.flag) {
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "IMPORTANT_MARKED",
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
        console.log("markImportantCloudItem catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function markRestoreCloudItemRequest(params) {
    return axios.get(`${API_ENDPOINTS.cloudStorage.markRestore}`, { params }).then((cloudStorage) => cloudStorage.data).catch((error) => error)
}

export const markRestoreCloudItem = createAsyncThunk('appCloudStorage/markRestoreCloudItem', async (id, { dispatch, getState }) => {
    try {
        const response = await markRestoreCloudItemRequest(id)
        if (response && response.flag) {
            await dispatch(getTreeFolderList())
            await dispatch(getCloudStorageList(getState().cloudStorage.params))
            return {
                actionFlag: "RESTORE_MARKED",
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
        console.log("markRestoreCloudItem catch ", error)
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* /Common */

export const appCloudStorageSlice = createSlice({
    name: 'appCloudStorage',
    initialState: {
        params: {},
        treeParams: {},
        cloudStorageItems: null,
        cloudStorageItem: cloudStorageItem,
        treeFolderItems: [],
        expandTreeFolder: [],
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        getCloudStorageItem: (state, action) => {
            state.actionFlag = action.payload.flag || ""
            state.cloudStorageItem = action.payload.payload || cloudStorageItem
        },

        defaultCloudStorageItems: (state) => {
            state.cloudStorageItems = null
        },

        defaultCloudStorageItem: (state) => {
            state.cloudStorageItem = cloudStorageItem
        },

        changeExpandedValue: (state, action) => {
            state.expandTreeFolder = action.payload || []
        },

        updateCloudStorageLoader: (state, action) => {
            state.loading = action.payload || false
        },

        clearCloudStorageMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            /* Common */
            .addCase(getCloudStorageList.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.cloudStorageItems = action.payload.cloudStorageItems
                state.cloudStorageItem = action.payload.cloudStorageItem
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(markImportantCloudItem.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(markRestoreCloudItem.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            /* /Common */

            /* Cloud Storage Folder */
            .addCase(getTreeFolderList.fulfilled, (state, action) => {
                state.treeParams = action.payload.treeParams
                state.treeFolderItems = action.payload.treeFolderItems
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(createCloudStorageFolder.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updateCloudStorageFolder.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(trashCloudStorageFolder.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deleteCloudStorageFolder.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            /* /Cloud Storage Folder */

            /* Cloud Storage File */
            .addCase(createCloudStorageFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updateCloudStorageFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(trashCloudStorageFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(deleteCloudStorageFile.fulfilled, (state, action) => {
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
        /* /Cloud Storage File */
    }
})

export const {
    changeExpandedValue,
    getCloudStorageItem,
    defaultCloudStorageItem,
    defaultCloudStorageItems,
    updateCloudStorageLoader,
    clearCloudStorageMessage
} = appCloudStorageSlice.actions

export default appCloudStorageSlice.reducer
