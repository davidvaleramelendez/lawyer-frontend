/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  userItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Utils
import {
  setLoggedAt,
  getLoggedAt,
  getAccessToken,
  setCurrentUser,
  getCurrentUser,
  setAccessToken,
  setTokenExpires,
  getTokenExpires,
  getRefreshToken,
  setRefreshToken,
  getTransformDate,
  getLanguageLabels,
  setLanguageLabels
} from '@utils'

// ** Axios Imports
import axios from 'axios'
import { L10nKeys, getDefaultLanguageLabels } from '../../../utility/Localization'

async function loginRequest(payload) {
  return axios.post(`${API_ENDPOINTS.auth.login}`, payload).then((auth) => auth.data).catch((error) => error)
}

export const login = createAsyncThunk('appAuth/login', async (payload) => {
  try {
    const response = await loginRequest(payload)
    if (response && response.flag) {
      response.data.userData.ability = [{ action: "manage", subject: "all" }]
      // response.data.userData.role = 'admin'
      const tokenExpires = { access: response.data.expiresIn }
      const loggedAt = await getTransformDate(new Date(), 'YYYY-MM-DD HH:mm')
      await setCurrentUser(response.data.userData)
      await setAccessToken(response.data.accessToken)
      await setTokenExpires(tokenExpires)
      await setLoggedAt(loggedAt)

      const labels = getDefaultLanguageLabels()
      const respLangLabels = response.data.languageLabels
      if (Object.keys(respLangLabels).length) {
        Object.keys(respLangLabels).forEach(type => {
          if (labels[type] === undefined) labels[type] = {}

          Object.keys(L10nKeys).forEach(key => {
            const origin = L10nKeys[key]
            labels[type][origin] = origin
            if (respLangLabels[type] && respLangLabels[type][origin] !== undefined 
              && respLangLabels[type][origin] !== null
              && respLangLabels[type][origin] !== '') {
              labels[type][origin] = respLangLabels[type][origin]
            }
          })
        })
      }
      await setLanguageLabels(labels)

      return {
        userItem: response.data.userData,
        accessToken: response.data.accessToken,
        refreshToken: getRefreshToken(),
        tokenExpires: tokenExpires,
        languageLabels: labels,
        loggedAt: loggedAt,
        actionFlag: "LOGGED",
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
    console.log("login catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function refreshTokenRequest() {
  return axios.get(`${API_ENDPOINTS.auth.refreshToken}`).then((auth) => auth.data).catch((error) => error)
}

export const refreshToken = createAsyncThunk('appAuth/refreshToken', async () => {
  try {
    const response = await refreshTokenRequest()
    // console.log("refreshToken >>>>> ", response)
    if (response && response.flag) {
      const tokenExpires = { refresh: response.data.expiresIn }
      await setAccessToken(response.data.accessToken)
      await setRefreshToken(response.data.accessToken)
      await setTokenExpires(tokenExpires)
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.accessToken,
        languageLabels: response.data.languageLabels,
        tokenExpires: tokenExpires,
        actionFlag: "REFRESH",
        success: response.message,
        error: ""
      }
    } else {
      return {
        accessToken: null,
        refreshToken: null,
        tokenExpires: null,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("refreshToken catch ", error)
    return {
      accessToken: null,
      refreshToken: null,
      tokenExpires: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function logoutRequest() {
  return axios.get(`${API_ENDPOINTS.auth.logout}`).then((auth) => auth.data).catch((error) => error)
}

export const logout = createAsyncThunk('appAuth/logout', async () => {
  try {
    const response = await logoutRequest()
    await setCurrentUser()
    await setAccessToken()
    await setRefreshToken()
    await setTokenExpires()
    await setLoggedAt()
    if (response && response.flag) {
      return {
        actionFlag: "LOGOUT",
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
    console.log("logout catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appAuthSlice = createSlice({
  name: 'appAuth',
  initialState: {
    userItem: getCurrentUser() ? getCurrentUser() : userItem,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    tokenExpires: getTokenExpires(),
    loggedAt: getLoggedAt(),
    languageLabels: getLanguageLabels() ? getLanguageLabels() : getDefaultLanguageLabels(),
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    updateAuthLoader: (state, action) => {
      state.loading = action.payload || false
    },

    cleanAuthMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }, 

    updateLanguageLabels: (state, action) => {
      state.languageLabels = action.payload
      setLanguageLabels(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.userItem = action.payload.userItem
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.tokenExpires = action.payload.tokenExpires
        state.loggedAt = action.payload.loggedAt
        
        if (action.payload.languageLabels !== undefined) {
          state.languageLabels = action.payload.languageLabels
        }

        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.tokenExpires = action.payload.tokenExpires
        state.loggedAt = getLoggedAt()
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userItem = userItem
        state.accessToken = getAccessToken()
        state.refreshToken = getRefreshToken()
        state.tokenExpires = getTokenExpires()
        state.loggedAt = getLoggedAt()        
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  updateAuthLoader,
  cleanAuthMessage,
  updateLanguageLabels
} = appAuthSlice.actions

export default appAuthSlice.reducer
