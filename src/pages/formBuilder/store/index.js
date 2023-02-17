/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import { API_ENDPOINTS } from '@src/utility/ApiEndPoints'

// Constant
import { formBuilderDeleteItem } from '@constant/reduxConstant'

// ** Axios Imports
import axios from 'axios'

async function getPreviewListRequest() {
  return axios.get(`${API_ENDPOINTS.formBuilder.getPreviewList}`).then((response) => response.data).catch((error) => error)
}

export const getPreviewList = createAsyncThunk('appFormBuilderSlice/getPreviewList', async () => {
  try {
    const response = await getPreviewListRequest()
    if (response) {
      return {
        formPreviewList: response.data,
        success: response.message,
        error: ""
      }
    } else {
      return {
        formPreviewList: [],
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getPreviewList catch ", error)
    return {
      formPreviewList: [],
      success: "",
      error: error
    }
  }
})

async function updatePreviewListRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.updatePreviewList}`, {content: JSON.stringify(params)})
    .then((response) => response.data)
    .catch((error) => error)
}

export const updatePreviewList = createAsyncThunk('appFormBuilderSlice/updatePreviewList', async (params, { dispatch, getState }) => {
  const prevFormPreviewList = getState().formBuilder.formPreviewList
  try {
    // eslint-disable-next-line no-use-before-define
    dispatch(setFormPreviewList(params))
    const response = await updatePreviewListRequest(params)
    if (response && response.flag) {
      return {
        formPreviewList: params,
        actionFlag: "UPDATE_PREVIEW_LIST",
        success: response.message,
        error: ""
      }
    } else {
      return {
        formPreviewList: prevFormPreviewList,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updatePreviewList catch ", error)
    return {
      formPreviewList: prevFormPreviewList,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appFormBuilderSlice = createSlice({
  name: 'appFormBuilder',
  initialState: {
    formPreviewList: [],
    selectedItem: {},
    deleteItem: formBuilderDeleteItem,
    success: "",
    error: "",
    actionFlag: "",
    loading: true
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setFormPreviewList: (state, action) => {
      state.formPreviewList = action.payload || []
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload || {}
    },
    setDeleteItem: (state, action) => {
      state.deleteItem = action.payload || formBuilderDeleteItem
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPreviewList.fulfilled, (state, action) => {
        state.formPreviewList = action.payload.formPreviewList
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(updatePreviewList.fulfilled, (state, action) => {
        state.formPreviewList = action.payload.formPreviewList
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  setLoading,
  setFormPreviewList,
  setSelectedItem,
  setDeleteItem
} = appFormBuilderSlice.actions

export default appFormBuilderSlice.reducer
  