/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function dashboardRequest(params) {
  return axios.get(`${API_ENDPOINTS.dashboard.list}`, { params }).then((dashboard) => dashboard.data).catch((error) => error)
}

export const dashboard = createAsyncThunk('appDashboard/dashboard', async (params) => {
  try {
    const response = await dashboardRequest(params)
    if (response && response.flag) {
      return {
        params,
        dashboardItems: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        dashboardItems: {},
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("dashboard catch ", error)
    return {
      params,
      dashboardItems: {},
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appDashboardSlice = createSlice({
  name: 'appDashboard',
  initialState: {
    params: {},
    dashboardItems: {},
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    updateDashboardLoader: (state, action) => {
      state.loading = action.payload || false
    },

    cleanDashboardMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(dashboard.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.dashboardItems = action.payload.dashboardItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  updateDashboardLoader,
  cleanDashboardMessage
} = appDashboardSlice.actions

export default appDashboardSlice.reducer
