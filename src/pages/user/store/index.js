/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  userItem,
  imapItem,
  accountItem
} from '@constant/reduxConstant'

// ** Utils
import {
  setCurrentUser,
  setTotalNumber
} from '@utils'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

import { TN_USER } from '@constant/defaultValues'

/* User */
async function getUserStatsListRequest(params) {
  return axios.get(`${API_ENDPOINTS.users.roleStatsCount}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getUserStatsList = createAsyncThunk('appUser/getUserStatsList', async (params) => {
  try {
    const response = await getUserStatsListRequest(params)
    if (response && response.flag) {
      return {
        userStatItems: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        userStatItems: null,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getUserStatsList catch ", error)
    return {
      userStatItems: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getUserListRequest(params) {
  return axios.get(`${API_ENDPOINTS.users.list}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getUserList = createAsyncThunk('appUser/getUserList', async (params) => {
  try {
    const response = await getUserListRequest(params)
    setTotalNumber(TN_USER, response.pagination.totalRecord)
    if (response && response.flag) {
      return {
        params,
        userItems: response.data,
        pagination: response.pagination,
        userItem: userItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        userItems: [],
        userItem: userItem,
        pagination: null,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getUserList catch ", error)
    return {
      params,
      userItems: [],
      userItem: userItem,
      pagination: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getRoleListRequest(params) {
  return axios.get(`${API_ENDPOINTS.roles.list}`, { params }).then((role) => role.data).catch((error) => error)
}

export const getRoleList = createAsyncThunk('appUser/getRoleList', async (params) => {
  try {
    const response = await getRoleListRequest(params)
    if (response && response.flag) {
      return {
        roleItems: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        roleItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getRoleList catch ", error)
    return {
      roleItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function addUserRequest(payload) {
  return axios.post(`${API_ENDPOINTS.users.create}`, payload).then((user) => user.data).catch((error) => error)
}

export const addUser = createAsyncThunk('appUser/addUser', async (payload, { dispatch, getState }) => {
  try {
    const response = await addUserRequest(payload)
    if (response && response.flag) {
      await dispatch(getUserList(getState().user.params))
      return {
        userItem: response.data,
        actionFlag: "ADDED_ITEM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("addUser catch ", error)
    return {
      userItem: userItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getUserViewRequest(id) {
  return axios.get(`${API_ENDPOINTS.users.view}/${id}`).then((user) => user.data).catch((error) => error)
}

export const getUserView = createAsyncThunk('appUser/getUserView', async (id) => {
  try {
    const response = await getUserViewRequest(id)
    if (response && response.flag) {
      return {
        id,
        userItem: response.data,
        actionFlag: "EDIT_USER",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        userItem: userItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getUserView catch ", error)
    return {
      id,
      userItem: userItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateUserRequest(payload) {
  return axios.post(`${API_ENDPOINTS.users.update}`, payload).then((user) => user.data).catch((error) => error)
}

export const updateUser = createAsyncThunk('appUser/updateUser', async (payload) => {
  try {
    const response = await updateUserRequest(payload)
    if (response && response.flag) {
      return {
        userItem: response.data,
        actionFlag: "USER_UPDATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateUser catch ", error)
    return {
      userItem: userItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updatePermissionRequest(payload) {
  return axios.post(`${API_ENDPOINTS.users.updatePermission}`, payload).then((user) => user.data).catch((error) => error)
}

export const updatePermission = createAsyncThunk('appUser/updatePermission', async (payload) => {
  try {
    const response = await updatePermissionRequest(payload)
    if (response && response.flag) {
      return {
        permissions: response.data,
        actionFlag: "PERMISSION_ADDED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        permissions: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updatePermission catch ", error)
    return {
      permissions: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getUserPermissionRequest(id) {
  return axios.get(`${API_ENDPOINTS.users.getPermission}/${id}`).then((user) => user.data).catch((error) => error)
}

export const getUserPermission = createAsyncThunk('appUser/getUserPermission', async (id) => {
  try {
    const response = await getUserPermissionRequest(id)
    if (response && response.flag) {
      return {
        permissions: response.data,
        actionFlag: "USER_PERMISSION",
        success: "",
        error: ""
      }
    } else {
      return {
        permissions: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getUserView catch ", error)
    return {
      permissions: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteUserRequest(id) {
  return axios.get(`${API_ENDPOINTS.users.delete}/${id}`).then((user) => user.data).catch((error) => error)
}

export const deleteUser = createAsyncThunk('appUser/deleteUser', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteUserRequest(id)
    if (response && response.flag) {
      await dispatch(getUserList(getState().user.params))
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
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /User */

/* Account */
async function getAccountSettingRequest() {
  return axios.get(`${API_ENDPOINTS.account.getAccountSetting}`).then((user) => user.data).catch((error) => error)
}

export const getAccountSetting = createAsyncThunk('appUser/getAccountSetting', async () => {
  try {
    const response = await getAccountSettingRequest()
    if (response && response.flag) {
      return {
        userItem: response.data.userData,
        roleItems: response.data.roles,
        accountItem: response.data.account,
        imapItem: response.data.imap,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        roleItems: [],
        accountItem: accountItem,
        imapItem: imapItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getAccountSetting catch ", error)
    return {
      userItem: userItem,
      roleItems: [],
      accountItem: accountItem,
      imapItem: imapItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function saveAccountRequest(payload) {
  return axios.post(`${API_ENDPOINTS.account.saveAccount}`, payload).then((user) => user.data).catch((error) => error)
}

export const saveAccount = createAsyncThunk('appUser/saveAccount', async (payload) => {
  try {
    const response = await saveAccountRequest(payload)
    if (response && response.flag) {
      response.data.userData.ability = [{ action: "manage", subject: "all" }]
      setCurrentUser(response.data.userData)
      return {
        userItem: response.data.userData,
        roleItems: response.data.roles,
        accountItem: response.data.account,
        imapItem: response.data.imap,
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        roleItems: [],
        accountItem: accountItem,
        imapItem: imapItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("saveAccount catch ", error)
    return {
      userItem: userItem,
      roleItems: [],
      accountItem: accountItem,
      imapItem: imapItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function saveAccountSettingRequest(payload) {
  return axios.post(`${API_ENDPOINTS.account.saveAccountSetting}`, payload).then((user) => user.data).catch((error) => error)
}

export const saveAccountSetting = createAsyncThunk('appUser/saveAccountSetting', async (payload) => {
  try {
    const response = await saveAccountSettingRequest(payload)
    if (response && response.flag) {
      return {
        userItem: response.data.userData,
        roleItems: response.data.roles,
        accountItem: response.data.account,
        imapItem: response.data.imap,
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        roleItems: [],
        accountItem: accountItem,
        imapItem: imapItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("saveAccountSetting catch ", error)
    return {
      userItem: userItem,
      roleItems: [],
      accountItem: accountItem,
      imapItem: imapItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function saveAccountImapRequest(payload) {
  return axios.post(`${API_ENDPOINTS.account.saveAccountImap}`, payload).then((user) => user.data).catch((error) => error)
}

export const saveAccountImap = createAsyncThunk('appUser/saveAccountImap', async (payload) => {
  try {
    const response = await saveAccountImapRequest(payload)
    if (response && response.flag) {
      return {
        userItem: response.data.userData,
        roleItems: response.data.roles,
        accountItem: response.data.account,
        imapItem: response.data.imap,
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        roleItems: [],
        accountItem: accountItem,
        imapItem: imapItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("saveAccountImap catch ", error)
    return {
      userItem: userItem,
      roleItems: [],
      accountItem: accountItem,
      imapItem: imapItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Account */

/* Login History */
async function getUserDeviceLogsRequest(params) {
  return axios.get(`${API_ENDPOINTS.users.getDeviceLogs}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getUserDeviceLogs = createAsyncThunk('appUser/getUserDeviceLogs', async (params) => {
  try {
    const response = await getUserDeviceLogsRequest(params)
    if (response && response.flag) {
      return {
        logParams: params,
        userDeviceLogs: response.data,
        deviceLogPagination: response.pagination,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        logParams: params,
        userDeviceLogs: [],
        deviceLogPagination: null,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getUserDeviceLogs catch ", error)
    return {
      logParams: params,
      userDeviceLogs: [],
      deviceLogPagination: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Login History */

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState: {
    params: {},
    logParams: {},
    userItems: [],
    userStatItems: null,
    userItem: userItem,
    userDeviceLogs: [],
    deviceLogPagination: null,
    accountItem: accountItem,
    imapItem: imapItem,
    permissions: [],
    roleItems: [],
    pagination: null,
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    updateUserLoader: (state, action) => {
      state.loading = action.payload || false
    },

    resetDeviceLogHistory: (state) => {
      state.userDeviceLogs = []
      state.deviceLogPagination = null
    },

    clearUserMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      /* User */
      .addCase(getUserStatsList.fulfilled, (state, action) => {
        state.userStatItems = action.payload.userStatItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userItems = action.payload.userItems
        state.params = action.payload.params
        state.userItem = action.payload.userItem
        state.pagination = action.payload.pagination
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.roleItems = action.payload.roleItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getUserView.fulfilled, (state, action) => {
        state.id = action.payload.id
        state.userItem = action.payload.userItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.permissions = action.payload.permissions
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getUserPermission.fulfilled, (state, action) => {
        state.permissions = action.payload.permissions
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /User */

      /* Account */
      .addCase(getAccountSetting.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.roleItems = action.payload.roleItems
        state.accountItem = action.payload.accountItem
        state.imapItem = action.payload.imapItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(saveAccount.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.roleItems = action.payload.roleItems
        state.accountItem = action.payload.accountItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(saveAccountSetting.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.roleItems = action.payload.roleItems
        state.accountItem = action.payload.accountItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(saveAccountImap.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.roleItems = action.payload.roleItems
        state.accountItem = action.payload.accountItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Account */

      /* Login History */
      .addCase(getUserDeviceLogs.fulfilled, (state, action) => {
        state.logParams = action.payload.logParams
        state.userDeviceLogs = action.payload.userDeviceLogs
        state.deviceLogPagination = action.payload.deviceLogPagination
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
    /* /Login History */
  }
})

export const {
  resetDeviceLogHistory,
  updateUserLoader,
  clearUserMessage
} = appUserSlice.actions

export default appUserSlice.reducer
