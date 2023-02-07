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
                downloadTemplatePath: null,
                actionFlag: "EDIT_ITEM",
                success: "",
                error: ""
            }
        } else {
            return {
                id,
                letterTemplateItem: letterTemplateItem,
                downloadTemplatePath: null,
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
            downloadTemplatePath: null,
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

/* Letter */
async function generateLetterTemplateDownloadRequest(payload) {
    return axios.post(`${API_ENDPOINTS.letters.generateDownloadTemplate}`, payload).then((letters) => letters.data).catch((error) => error)
}

export const generateLetterTemplateDownload = createAsyncThunk('appLetterTemplate/generateLetterTemplateDownload', async (payload) => {
    try {
        const response = await generateLetterTemplateDownloadRequest(payload)
        if (response && response.flag) {
            return {
                downloadTemplatePath: response.data,
                actionFlag: "PATH_GENERATED",
                success: response.message,
                error: ""
            }
        } else {
            return {
                downloadTemplatePath: null,
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("generateLetterTemplateDownload catch ", error)
        return {
            downloadTemplatePath: null,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* Letter */

export const appLetterTemplateSlice = createSlice({
    name: 'appLetterTemplate',
    initialState: {
        params: {},
        letterTemplateItems: [],
        letterTemplateItem: letterTemplateItem,
        sortCodeType: "",
        sortCodeTypes: [{ id: "case", value: "Case" }, { id: "contact", value: "Contact" }, { id: "user", value: "User" }],
        sortCodes: [],
        downloadTemplatePath: null,
        pagination: null,
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
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
                state.downloadTemplatePath = action.payload.downloadTemplatePath
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

            /* Letter */
            .addCase(generateLetterTemplateDownload.fulfilled, (state, action) => {
                state.downloadTemplatePath = action.payload.downloadTemplatePath
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
        /* /Letter */
    }
})

export const {
    getSortCodes,
    clearSortCode,
    updateLetterTemplateLoader,
    clearLetterTemplateMessage
} = appLetterTemplateSlice.actions

export default appLetterTemplateSlice.reducer
