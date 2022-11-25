/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getLetterListRequest(params) {
  return axios.get(`${API_ENDPOINTS.letters.list}`, { params }).then((letter) => letter.data).catch((error) => error)
}

export const getLetterList = createAsyncThunk('appLetter/getLetterList', async (params) => {
  try {
    const response = await getLetterListRequest(params)
    if (response && response.flag) {
      return {
        params,
        letterItems: response.data,
        pagination: response.pagination,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        letterItems: [],
        pagination: null,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getLetterList catch ", error)
    return {
      params,
      letterItems: [],
      pagination: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function archiveLetterRequest(id, params) {
  return axios.get(`${API_ENDPOINTS.letters.archive}/${id}`, { params }).then((letter) => letter.data).catch((error) => error)
}

export const archiveLetter = createAsyncThunk('appLetter/archiveLetter', async (params, { dispatch, getState }) => {
  try {
    const response = await archiveLetterRequest(params.id, params.payload)
    if (response && response.flag) {
      await dispatch(getLetterList(getState().letter.params))
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
    console.log("archiveLetter catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updatePrintStatusRequest(id, params) {
  return axios.get(`${API_ENDPOINTS.letters.archive}/${id}`, { params }).then((letter) => letter.data).catch((error) => error)
}

export const updatePrintStatus = createAsyncThunk('appLetter/updatePrintStatus', async (params, { dispatch, getState }) => {
  try {
    const response = await updatePrintStatusRequest(params.id, params.payload)
    if (response && response.flag) {
      await dispatch(getLetterList(getState().letter.params))
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
    console.log("updatePrintStatus catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appLetterSlice = createSlice({
  name: 'appLetter',
  initialState: {
    params: {},
    letterItems: [],
    pagination: null,
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    clearLetterMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLetterList.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.letterItems = action.payload.letterItems
        state.pagination = action.payload.pagination
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(archiveLetter.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updatePrintStatus.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  clearLetterMessage
} = appLetterSlice.actions

export default appLetterSlice.reducer
