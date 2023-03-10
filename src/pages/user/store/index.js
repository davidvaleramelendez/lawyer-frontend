/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Constant
import {
  TN_USER,
  TN_RECENT_DEVICE_LOGS
} from '@constant/defaultValues'
import {
  userItem,
  imapItem,
  pdfApiItem,
  accountItem,
  companyItem,
  dropboxApiTokenItem,
  placetelSipUserIdItem,
  placetelCallApiTokenItem,
  placetelIncomingSipItem
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

import { L10nKeys } from '../../../utility/Localization'

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
    if (response && response.flag) {
      if (response.pagination) {
        setTotalNumber(TN_USER, response.pagination.totalRecord || 0)
      }

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
      await dispatch(getUserStatsList({}))
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
    console.log("getUserPermission catch ", error)
    return {
      permissions: [],
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
        userItem: response.data.userItem,
        authUserItem: response.data.authUser,
        actionFlag: "EDIT_USER",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        userItem: userItem,
        authUserItem: userItem,
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
      authUserItem: userItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateUserRequest(payload) {
  return axios.post(`${API_ENDPOINTS.users.update}`, payload).then((user) => user.data).catch((error) => error)
}

export const updateUser = createAsyncThunk('appUser/updateUser', async (payload, { dispatch, getState }) => {
  try {
    const response = await updateUserRequest(payload)
    if (response && response.flag) {
      await dispatch(getUserPermission(getState().user.id))
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
        pdfApiItem: pdfApiItem,
        placetelCallApiTokenItem: placetelCallApiTokenItem,
        dropboxApiTokenItem: dropboxApiTokenItem,
        placetelSipUserIdItem: placetelSipUserIdItem,
        placetelIncomingSipItem: placetelIncomingSipItem,
        imapItem: response.data.imap,
        actionFlag: "ACCOUNT_SETTING",
        success: "",
        error: ""
      }
    } else {
      return {
        userItem: userItem,
        roleItems: [],
        accountItem: accountItem,
        pdfApiItem: pdfApiItem,
        placetelCallApiTokenItem: placetelCallApiTokenItem,
        dropboxApiTokenItem: dropboxApiTokenItem,
        placetelSipUserIdItem: placetelSipUserIdItem,
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
      pdfApiItem: pdfApiItem,
      placetelCallApiTokenItem: placetelCallApiTokenItem,
      dropboxApiTokenItem: dropboxApiTokenItem,
      placetelSipUserIdItem: placetelSipUserIdItem,
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
      if (response.data.languageChanged) {
        location.reload()
      }
      return {
        userItem: response.data.userData,
        roleItems: response.data.roles,
        accountItem: response.data.account,
        imapItem: response.data.imap,
        actionFlag: "ACCOUNT_SETTING",
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
        actionFlag: "ACCOUNT_SETTING",
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

async function updateAccountPasswordRequest(payload) {
  return axios.post(`${API_ENDPOINTS.account.updateAccountPassword}`, payload).then((user) => user.data).catch((error) => error)
}

export const updateAccountPassword = createAsyncThunk('appUser/updateAccountPassword', async (payload) => {
  try {
    const response = await updateAccountPasswordRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "PASSWORD_UPDATED",
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
    console.log("updateAccountPassword catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateAccountProfileImageRequest(payload) {
  return axios.post(`${API_ENDPOINTS.account.updateProfileImage}`, payload).then((user) => user.data).catch((error) => error)
}

export const updateAccountProfileImage = createAsyncThunk('appUser/updateAccountProfileImage', async (payload) => {
  try {
    const response = await updateAccountProfileImageRequest(payload)
    if (response && response.flag) {
      if (response.data) {
        response.data.ability = [{ action: "manage", subject: "all" }]
        setCurrentUser(response.data)
      }

      return {
        userItem: response.data || userItem,
        actionFlag: "IMAGE_UPDATED",
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
    console.log("updateAccountProfileImage catch ", error)
    return {
      userItem: userItem,
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
      if (response.pagination) {
        setTotalNumber(TN_RECENT_DEVICE_LOGS, response.pagination.totalRecord || 0)
      }
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

/* Companies */
async function getCompanyDetailRequest() {
  return axios.get(`${API_ENDPOINTS.companies.detail}`).then((user) => user.data).catch((error) => error)
}

export const getCompanyDetail = createAsyncThunk('appUser/getCompanyDetail', async () => {
  try {
    const response = await getCompanyDetailRequest()
    if (response && response.flag) {
      return {
        companyItem: response.data || companyItem,
        actionFlag: "COMPANY_DETAIL",
        success: "",
        error: ""
      }
    } else {
      return {
        companyItem: companyItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getCompanyDetail catch ", error)
    return {
      companyItem: companyItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createUpdateCompanyRequest(payload) {
  return axios.post(`${API_ENDPOINTS.companies.createUpdate}`, payload).then((user) => user.data).catch((error) => error)
}

export const createUpdateCompany = createAsyncThunk('appUser/createUpdateCompany', async (payload) => {
  try {
    const response = await createUpdateCompanyRequest(payload)
    if (response && response.flag) {
      return {
        companyItem: response.data || companyItem,
        actionFlag: "COMPANY_DETAIL",
        success: response.message,
        error: ""
      }
    } else {
      return {
        companyItem: companyItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createUpdateCompany catch ", error)
    return {
      companyItem: companyItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Companies */

/* Pdf Api */
async function getPdfApiDetailRequest(params) {
  return axios.get(`${API_ENDPOINTS.pdfApis.detail}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getPdfApiDetail = createAsyncThunk('appUser/getPdfApiDetail', async (params) => {
  try {
    const response = await getPdfApiDetailRequest(params)
    if (response && response.flag) {
      return {
        pdfApiItem: response.data || pdfApiItem,
        actionFlag: "PDF_API_DETAIL",
        success: "",
        error: ""
      }
    } else {
      return {
        pdfApiItem: pdfApiItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getPdfApiDetail catch ", error)
    return {
      pdfApiItem: pdfApiItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createUpdatePdfApiRequest(payload) {
  return axios.post(`${API_ENDPOINTS.pdfApis.createUpdate}`, payload).then((user) => user.data).catch((error) => error)
}

export const createUpdatePdfApi = createAsyncThunk('appUser/createUpdatePdfApi', async (payload) => {
  try {
    const response = await createUpdatePdfApiRequest(payload)
    if (response && response.flag) {
      return {
        pdfApiItem: response.data || pdfApiItem,
        actionFlag: "PDF_API_DETAIL",
        success: response.message,
        error: ""
      }
    } else {
      return {
        pdfApiItem: pdfApiItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createUpdatePdfApi catch ", error)
    return {
      pdfApiItem: pdfApiItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Pdf Api */

/* Placetel Call Api Token */
async function getPlacetelCallApiTokenDetailRequest(params) {
  return axios.get(`${API_ENDPOINTS.placetelCallTokenApis.detail}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getPlacetelCallApiTokenDetail = createAsyncThunk('appUser/getPlacetelCallApiTokenDetail', async (params) => {
  try {
    const response = await getPlacetelCallApiTokenDetailRequest(params)
    if (response && response.flag) {
      return {
        placetelCallApiTokenItem: response.data || placetelCallApiTokenItem,
        actionFlag: "PLACETEL_CALL_API_TOKEN_DETAIL",
        success: "",
        error: ""
      }
    } else {
      return {
        placetelCallApiTokenItem: placetelCallApiTokenItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getPlacetelCallApiTokenDetail catch ", error)
    return {
      placetelCallApiTokenItem: placetelCallApiTokenItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createUpdatePlacetelCallApiTokenRequest(payload) {
  return axios.post(`${API_ENDPOINTS.placetelCallTokenApis.createUpdate}`, payload).then((user) => user.data).catch((error) => error)
}

export const createUpdatePlacetelCallApiToken = createAsyncThunk('appUser/createUpdatePlacetelCallApiToken', async (payload) => {
  try {
    const response = await createUpdatePlacetelCallApiTokenRequest(payload)
    if (response && response.flag) {
      return {
        placetelCallApiTokenItem: response.data || placetelCallApiTokenItem,
        actionFlag: "PLACETEL_CALL_API_TOKEN_DETAIL",
        success: response.message,
        error: ""
      }
    } else {
      return {
        placetelCallApiTokenItem: placetelCallApiTokenItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createUpdatePlacetelCallApiToken catch ", error)
    return {
      placetelCallApiTokenItem: placetelCallApiTokenItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Placetel Call Api Token */

/* Dropbox Api Token */
async function getDropboxApiTokenDetailRequest(params) {
  return axios.get(`${API_ENDPOINTS.dropboxTokenApis.detail}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getDropboxApiTokenDetail = createAsyncThunk('appUser/getDropboxApiTokenDetail', async (params) => {
  try {
    const response = await getDropboxApiTokenDetailRequest(params)
    if (response && response.flag) {
      return {
        dropboxApiTokenItem: response.data || dropboxApiTokenItem,
        actionFlag: "DROPBOX_API_TOKEN_DETAIL",
        success: "",
        error: ""
      }
    } else {
      return {
        dropboxApiTokenItem: dropboxApiTokenItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getDropboxApiTokenDetail catch ", error)
    return {
      dropboxApiTokenItem: dropboxApiTokenItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createUpdateDropboxApiTokenRequest(payload) {
  return axios.post(`${API_ENDPOINTS.dropboxTokenApis.createUpdate}`, payload).then((user) => user.data).catch((error) => error)
}

export const createUpdateDropboxApiToken = createAsyncThunk('appUser/createUpdateDropboxApiToken', async (payload) => {
  try {
    const response = await createUpdateDropboxApiTokenRequest(payload)
    if (response && response.flag) {
      return {
        dropboxApiTokenItem: response.data || dropboxApiTokenItem,
        actionFlag: "DROPBOX_API_TOKEN_DETAIL",
        success: response.message,
        error: ""
      }
    } else {
      return {
        dropboxApiTokenItem: dropboxApiTokenItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createUpdateDropboxApiToken catch ", error)
    return {
      dropboxApiTokenItem: dropboxApiTokenItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Dropbox Api Token */

/* Placetel Sip User Id */
async function getPlacetelSipUserIdListRequest(params) {
  return axios.get(`${API_ENDPOINTS.placetelApiSipuids.list}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getPlacetelSipUserIdList = createAsyncThunk('appUser/getPlacetelSipUserIdList', async (params) => {
  try {
    const response = await getPlacetelSipUserIdListRequest(params)
    if (response && response.flag) {
      return {
        placetelSipUserIdItems: response.data || [],
        actionFlag: "PLACETEL_SIP_USERID_LIST",
        success: "",
        error: ""
      }
    } else {
      return {
        placetelSipUserIdItems: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getPlacetelSipUserIdList catch ", error)
    return {
      placetelSipUserIdItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getPlacetelSipUserIdDetailRequest(params) {
  return axios.get(`${API_ENDPOINTS.placetelApiSipuids.detail}`, { params }).then((user) => user.data).catch((error) => error)
}

export const getPlacetelSipUserIdDetail = createAsyncThunk('appUser/getPlacetelSipUserIdDetail', async (params) => {
  try {
    const response = await getPlacetelSipUserIdDetailRequest(params)
    if (response && response.flag) {
      return {
        placetelSipUserIdItem: response.data || placetelSipUserIdItem,
        actionFlag: "PLACETEL_SIP_USERID_DETAIL",
        success: "",
        error: ""
      }
    } else {
      return {
        placetelSipUserIdItem: placetelSipUserIdItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getPlacetelSipUserIdDetail catch ", error)
    return {
      placetelSipUserIdItem: placetelSipUserIdItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createUpdatePlacetelSipUserIdRequest(payload) {
  return axios.post(`${API_ENDPOINTS.placetelApiSipuids.createUpdate}`, payload).then((user) => user.data).catch((error) => error)
}

export const createUpdatePlacetelSipUserId = createAsyncThunk('appUser/createUpdatePlacetelSipUserId', async (payload) => {
  try {
    const response = await createUpdatePlacetelSipUserIdRequest(payload)
    if (response && response.flag) {
      return {
        placetelSipUserIdItem: response.data || placetelSipUserIdItem,
        actionFlag: "PLACETEL_SIP_USERID_DETAIL",
        success: response.message,
        error: ""
      }
    } else {
      return {
        placetelSipUserIdItem: placetelSipUserIdItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createUpdatePlacetelSipUserId catch ", error)
    return {
      placetelSipUserIdItem: placetelSipUserIdItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Placetel Sip User Id */

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState: {
    params: {},
    logParams: {},
    userItems: [],
    userStatItems: null,
    userItem: userItem,
    authUserItem: userItem,
    userDeviceLogs: [],
    languageLabels: {},
    deviceLogPagination: null,
    accountItem: accountItem,
    imapItem: imapItem,
    companyItem: companyItem,
    pdfApiItem: pdfApiItem,
    placetelCallApiTokenItem: placetelCallApiTokenItem,
    dropboxApiTokenItem: dropboxApiTokenItem,
    placetelSipUserIdItem: placetelSipUserIdItem,
    notAllowedIncomingItems: [],
    placetelSipUserIdItems: [],
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
        state.authUserItem = action.payload.authUserItem
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
        state.pdfApiItem = action.payload.pdfApiItem
        state.placetelCallApiTokenItem = action.payload.placetelCallApiTokenItem
        state.dropboxApiTokenItem = action.payload.dropboxApiTokenItem
        state.placetelSipUserIdItem = action.payload.placetelSipUserIdItem
        state.placetelIncomingSipItem = action.payload.placetelIncomingSipItem
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
        state.imapItem = action.payload.imapItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateAccountPassword.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateAccountProfileImage.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
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
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Login History */

      /* Companies */
      .addCase(getCompanyDetail.fulfilled, (state, action) => {
        state.companyItem = action.payload.companyItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })

      .addCase(createUpdateCompany.fulfilled, (state, action) => {
        state.companyItem = action.payload.companyItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Companies */

      /* Pdf Api */
      .addCase(getPdfApiDetail.fulfilled, (state, action) => {
        state.pdfApiItem = action.payload.pdfApiItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createUpdatePdfApi.fulfilled, (state, action) => {
        state.pdfApiItem = action.payload.pdfApiItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Pdf Api */

      /* Placetel Call Api Token */
      .addCase(getPlacetelCallApiTokenDetail.fulfilled, (state, action) => {
        state.placetelCallApiTokenItem = action.payload.placetelCallApiTokenItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createUpdatePlacetelCallApiToken.fulfilled, (state, action) => {
        state.placetelCallApiTokenItem = action.payload.placetelCallApiTokenItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Placetel Call Api Token */

      /* Dropbox Api Token */
      .addCase(getDropboxApiTokenDetail.fulfilled, (state, action) => {
        state.dropboxApiTokenItem = action.payload.dropboxApiTokenItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createUpdateDropboxApiToken.fulfilled, (state, action) => {
        state.dropboxApiTokenItem = action.payload.dropboxApiTokenItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Dropbox Api Token */

      /* Placetel Sip User Id */
      .addCase(getPlacetelSipUserIdList.fulfilled, (state, action) => {
        state.placetelSipUserIdItems = action.payload.placetelSipUserIdItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getPlacetelSipUserIdDetail.fulfilled, (state, action) => {
        state.placetelSipUserIdItem = action.payload.placetelSipUserIdItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createUpdatePlacetelSipUserId.fulfilled, (state, action) => {
        state.placetelSipUserIdItem = action.payload.placetelSipUserIdItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
    /* /Placetel Sip User Id */
  }
})

export const {
  resetDeviceLogHistory,
  updateUserLoader,
  clearUserMessage
} = appUserSlice.actions

export default appUserSlice.reducer
