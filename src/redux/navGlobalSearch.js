// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getNavGlobalSearchRequest(params) {
    return axios.get(`${API_ENDPOINTS.navGlobalSearch.search}`, { params }).then((navGlobalSearch) => navGlobalSearch.data).catch((error) => error)
}

export const getNavGlobalSearch = createAsyncThunk('appNavGlobalSearch/getNavGlobalSearch', async (params) => {
    try {
        const response = await getNavGlobalSearchRequest(params)
        if (response && response.flag) {
            return {
                params,
                globalSearchItems: response.data,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                globalSearchItems: [],
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getNavGlobalSearch catch ", error)
        return {
            params,
            globalSearchItems: [],
            actionFlag: "",
            success: "",
            error
        }
    }
})

export const navGlobalSearchSlice = createSlice({
    name: 'appNavGlobalSearch',
    initialState: {
        params: {
            search: ""
        },
        globalSearchItems: [],
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        handleSearchQuery: (state, action) => {
            state.params.search = action.payload || ""
        },

        clearNavGlobalSearchMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNavGlobalSearch.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.globalSearchItems = action.payload.globalSearchItems
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
    }
})

export const {
    handleSearchQuery,
    clearNavGlobalSearchMessage
} = navGlobalSearchSlice.actions

export default navGlobalSearchSlice.reducer
