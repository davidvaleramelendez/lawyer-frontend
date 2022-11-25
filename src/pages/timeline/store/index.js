/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getTimelineListRequest(params) {
  return axios.get(`${API_ENDPOINTS.timelines.list}`, { params }).then((timeline) => timeline.data).catch((error) => error)
}

export const getTimelineList = createAsyncThunk('appTimeline/getTimelineList', async (params) => {
  try {
    const response = await getTimelineListRequest(params)
    if (response && response.flag) {
      return {
        params,
        letterItems: response.data.letters,
        invoiceItems: response.data.invoices,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        letterItems: [],
        invoiceItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getTimelineList catch ", error)
    return {
      params,
      letterItems: [],
      invoiceItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function changeTimelineStatusRequest(payload) {
  return axios.post(`${API_ENDPOINTS.timelines.save}`, payload).then((timeline) => timeline.data).catch((error) => error)
}

export const changeTimelineStatus = createAsyncThunk('appTimeline/changeTimelineStatus', async (payload, { dispatch, getState }) => {
  try {
    const response = await changeTimelineStatusRequest(payload)
    if (response && response.flag) {
      await dispatch(getTimelineList(getState().timeline.params))
      return {
        actionFlag: "",
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
    console.log("changeTimelineStatus catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appTimelineSlice = createSlice({
  name: 'appTimeline',
  initialState: {
    params: {},
    letterItems: [],
    invoiceItems: [],
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    clearTimelineMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimelineList.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.letterItems = action.payload.letterItems
        state.invoiceItems = action.payload.invoiceItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(changeTimelineStatus.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  clearTimelineMessage
} = appTimelineSlice.actions

export default appTimelineSlice.reducer
