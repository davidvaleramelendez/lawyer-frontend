/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Api endpoints
import { API_ENDPOINTS } from '@src/utility/ApiEndPoints'

// Constant
import { formBuilderDeleteItem } from '@constant/reduxConstant'

// ** Axios Imports
import axios from 'axios'

// ** Third Party Module Import
import _ from "lodash"

async function getFormListRequest() {
  return axios.get(`${API_ENDPOINTS.formBuilder.getFormList}`).then((response) => response.data).catch((error) => error)
}

export const getFormList = createAsyncThunk('appFormBuilderSlice/getFormList', async () => {
  try {
    const response = await getFormListRequest()
    if (response && response.flag) {
      return {
        formList: response.data,
        success: response.message,
        error: ""
      }
    } else {
      return {
        formList: [],
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getFormList catch ", error)
    return {
      formList: [],
      success: "",
      error: error
    }
  }
})

async function createFormRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.createForm}`, params)
    .then((response) => response.data)
    .catch((error) => error)
}

export const createForm = createAsyncThunk('appFormBuilderSlice/createForm', async (params) => {
  try {
    const response = await createFormRequest(params)
    if (response && response.flag) {
      return {
        newForm: response.data,
        actionFlag: "CREATE_FORM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        newForm: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createForm catch ", error)
    return {
      newForm: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateFormRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.updateForm}/${params.id}`, params)
    .then((response) => response.data)
    .catch((error) => error)
}

export const updateForm = createAsyncThunk('appFormBuilderSlice/updateForm', async (params) => {
  try {
    const response = await updateFormRequest(params)
    if (response && response.flag) {
      return {
        data: response.data,
        actionFlag: "UPDATE_FORM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        data: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateForm catch ", error)
    return {
      data: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function publishFormRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.publishForm}/${params.id}`, params)
    .then((response) => response.data)
    .catch((error) => error)
}

export const publishForm = createAsyncThunk('appFormBuilderSlice/publishForm', async (params) => {
  try {
    const response = await publishFormRequest(params)
    if (response && response.flag) {
      return {
        data: response.data,
        actionFlag: "PUBLISH_FORM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        data: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("publishForm catch ", error)
    return {
      data: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteFormRequest(formId) {
  return axios
    .delete(`${API_ENDPOINTS.formBuilder.deleteForm}/${formId}`)
    .then((response) => response.data)
    .catch((error) => error)
}

export const deleteForm = createAsyncThunk('appFormBuilderSlice/deleteForm', async (formId) => {
  try {
    const response = await deleteFormRequest(formId)
    if (response && response.flag) {
      return {
        data: formId,
        actionFlag: "DELETE_FORM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        data: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteForm catch ", error)
    return {
      data: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getStepListRequest(form_id) {
  return axios.get(`${API_ENDPOINTS.formBuilder.getStepList}/${form_id}`).then((response) => response.data).catch((error) => error)
}

export const getStepList = createAsyncThunk('appFormBuilderSlice/getStepList', async (form_id) => {
  try {
    const response = await getStepListRequest(form_id)
    if (response && response.flag) {
      return {
        stepList: response.data.stepList,
        formDetails: response.data.form,
        success: response.message,
        error: ""
      }
    } else {
      return {
        stepList: [],
        formDetails: null,
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getStepList catch ", error)
    return {
      stepList: [],
      formDetails: null,
      success: "",
      error: error
    }
  }
})

async function getStepListByLinkRequest(link) {
  return axios.get(`${API_ENDPOINTS.formBuilder.getStepListByLink}/${link}`).then((response) => response.data).catch((error) => error)
}

export const getStepListByLink = createAsyncThunk('appFormBuilderSlice/getStepListByLink', async (link) => {
  try {
    const response = await getStepListByLinkRequest(link)
    if (response && response.flag) {
      return {
        stepList: response.data.stepList,
        formDetails: response.data.form,
        success: response.message,
        error: ""
      }
    } else {
      return {
        stepList: [],
        formDetails: null,
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getStepListByLink catch ", error)
    return {
      stepList: [],
      formDetails: null,
      success: "",
      error: error
    }
  }
})

async function addStepItemRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.addStepItem}/${params.formId}`, params)
    .then((response) => response.data)
    .catch((error) => error)
}

export const addStepItem = createAsyncThunk('appFormBuilderSlice/addStepItem', async (params) => {
  try {
    const response = await addStepItemRequest(params)
    if (response && response.flag) {
      return {
        newItem: response.data,
        actionFlag: "CREATE_STEP_ITEM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        newItem: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("addStepItem catch ", error)
    return {
      newItem: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteStepItemRequest(id) {
  return axios
    .delete(`${API_ENDPOINTS.formBuilder.deleteStepItem}/${id}`)
    .then((response) => response.data)
    .catch((error) => error)
}

export const deleteStepItem = createAsyncThunk('appFormBuilderSlice/deleteStepItem', async (id) => {
  try {
    const response = await deleteStepItemRequest(id)
    if (response && response.flag) {
      return {
        deletedId: id,
        actionFlag: "DELETE_STEP_ITEM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        deletedId: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteStepItem catch ", error)
    return {
      deletedId: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function reorderStepItemRequest(params) {
  return axios
    .get(`${API_ENDPOINTS.formBuilder.reorderStepItem}/${params.id1}/${params.id2}`)
    .then((response) => response.data)
    .catch((error) => error)
}

export const reorderStepItem = createAsyncThunk('appFormBuilderSlice/reorderStepItem', async (params) => {
  try {
    const response = await reorderStepItemRequest(params)
    if (response && response.flag) {
      return {
        data: params,
        actionFlag: "REORDER_STEP_ITEM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        data: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("reorderStepItem catch ", error)
    return {
      data: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getStepDetailsRequest(id) {
  return axios.get(`${API_ENDPOINTS.formBuilder.getStepDetails}/${id}`).then((response) => response.data).catch((error) => error)
}

export const getStepDetails = createAsyncThunk('appFormBuilderSlice/getStepDetails', async (id) => {
  try {
    const response = await getStepDetailsRequest(id)
    if (response) {
      return {
        stepDetails: response.data.content,
        stepInfo: {
          formId: response.data.formId,
          name: response.data.name
        },
        success: response.message,
        error: ""
      }
    } else {
      return {
        stepDetails: [],
        stepInfo: {},
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getStepDetails catch ", error)
    return {
      stepDetails: [],
      stepInfo: {},
      success: "",
      error: error
    }
  }
})

async function updateStepRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.updateStepItem}/${params.id}`, params)
    .then((response) => response.data)
    .catch((error) => error)
}

export const updateStep = createAsyncThunk('appFormBuilderSlice/updateStep', async (params) => {
  try {
    const response = await updateStepRequest(params)
    if (response && response.flag) {
      return {
        data: response.data,
        actionFlag: "UPDATE_STEP_ITEM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        data: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateStep catch ", error)
    return {
      data: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateStepDetailsRequest(params) {
  return axios
    .post(`${API_ENDPOINTS.formBuilder.updateStepContent}/${params.id}`, {content: JSON.stringify(params.data)})
    .then((response) => response.data)
    .catch((error) => error)
}

export const updateStepDetails = createAsyncThunk('appFormBuilderSlice/updateStepContent', async (params, { dispatch, getState }) => {
  
  const prevStepDetails = getState().formBuilder.stepDetails
  try {
    // eslint-disable-next-line no-use-before-define
    dispatch(setStepDetails(params.data))
    const response = await updateStepDetailsRequest(params)
    if (response && response.flag) {
      return {
        stepDetails: params.data,
        actionFlag: "UPDATE_STEP_CONTENT",
        success: response.message,
        error: ""
      }
    } else {
      return {
        stepDetails: prevStepDetails,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateStepDetails catch ", error)
    return {
      stepDetails: prevStepDetails,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appFormBuilderSlice = createSlice({
  name: 'appFormBuilder',
  initialState: {
    formList: [],
    formDetails: {},
    stepList: [],
    stepInfo: {}, // Step Name & Form ID
    stepDetails: [], // Step Content
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
    setStepDetails: (state, action) => {
      state.stepDetails = action.payload || []
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
      .addCase(getFormList.fulfilled, (state, action) => {
        state.formList = action.payload.formList
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(createForm.fulfilled, (state, action) => {
        if (action.payload.newForm) {
          state.formList = [...state.formList, action.payload.newForm]
        }
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        const {data} = action.payload
        if (data) {
          const index = state.formList.findIndex(item => item.id === data.id)
          state.formList[index] = data
        }
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(publishForm.fulfilled, (state, action) => {
        const {data} = action.payload
        if (data) {
          const index = state.formList.findIndex(item => item.id === data.id)
          state.formList[index] = data
        }
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        const {data} = action.payload
        if (data) {
          state.formList = state.formList.filter(item => item.id !== data)
        }
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(getStepList.fulfilled, (state, action) => {
        state.stepList = action.payload.stepList
        state.formDetails = action.payload.formDetails
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(getStepListByLink.fulfilled, (state, action) => {
        state.stepList = action.payload.stepList
        state.formDetails = action.payload.formDetails
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(addStepItem.fulfilled, (state, action) => {
        if (action.payload.newItem) {
          state.stepList = [...state.stepList, action.payload.newItem]
        }
        state.actionFlag = action.payload.actionFlag
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(reorderStepItem.fulfilled, (state, action) => {
        if (action.payload.data) {
          const {id1, id2} = action.payload.data
          const index1 = state.stepList.findIndex(item => item.id === id1)
          const index2 = state.stepList.findIndex(item => item.id === id2)

          const stepItem1 = _.cloneDeep(state.stepList[index1])
          const stepItem2 = _.cloneDeep(state.stepList[index2])
          state.stepList[index1] = {
            ...stepItem2,
            priority: stepItem1.priority
          }
          state.stepList[index2] = {
            ...stepItem1,
            priority: stepItem2.priority
          }
        }
        state.actionFlag = action.payload.actionFlag
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(deleteStepItem.fulfilled, (state, action) => {
        if (action.payload.deletedId) {
          state.stepList = state.stepList.filter(item => item.id !== action.payload.deletedId)
        }
        state.actionFlag = action.payload.actionFlag
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(getStepDetails.fulfilled, (state, action) => {
        state.stepDetails = action.payload.stepDetails
        state.stepInfo = action.payload.stepInfo
        state.success = action.payload.success
        state.error = action.payload.error
        state.loading = true
      })
      .addCase(updateStepDetails.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.stepDetails = action.payload.stepDetails
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateStep.fulfilled, (state, action) => {
        const {data} = action.payload
        if (data) {
          const index = state.stepList.findIndex(item => item.id === data.id)
          state.stepList[index] = data
        }
        state.actionFlag = action.payload.actionFlag
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  setLoading,
  setStepDetails,
  setSelectedItem,
  setDeleteItem
} = appFormBuilderSlice.actions

export default appFormBuilderSlice.reducer
  