/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig'

// Constant
import {
  siteSettingItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getSiteSettingRequest(params) {
  return axios.get(`${API_ENDPOINTS.layout.siteSetting}`, { params }).then((layout) => layout.data).catch((error) => error)
}

export const getSiteSetting = createAsyncThunk('layout/getSiteSetting', async (params) => {
  const isRTL = themeConfig.layout.isRTL
  const layout = themeConfig.layout.type
  let skin = themeConfig.layout.skin
  let footerType = themeConfig.layout.footer.type
  let navbarType = themeConfig.layout.navbar.type
  let menuHidden = themeConfig.layout.menu.isHidden
  let navbarColor = themeConfig.layout.navbar.backgroundColor
  let contentWidth = themeConfig.layout.contentWidth
  let menuCollapsed = themeConfig.layout.menu.isCollapsed
  try {
    const response = await getSiteSettingRequest(params)
    if (response && response.flag) {

      if (response.data) {
        if (response.data.value) {
          if (response.data.value.skin) {
            skin = response.data.value.skin
          }

          if (response.data.value.contentWidth) {
            contentWidth = response.data.value.contentWidth
          }

          if (response.data.value.navbarColor) {
            navbarColor = response.data.value.navbarColor
          }

          if (response.data.value.navbarType) {
            navbarType = response.data.value.navbarType
          }

          if (response.data.value.footerType) {
            footerType = response.data.value.footerType
          }

          if (response.data.value.menuCollapsed) {
            menuCollapsed = response.data.value.menuCollapsed
          }

          if (response.data.value.menuHidden) {
            menuHidden = response.data.value.menuHidden
          }
        }
      }

      return {
        isRTL: isRTL,
        layout: layout,
        skin: skin,
        navbarType: navbarType,
        menuHidden: menuHidden,
        footerType: footerType,
        navbarColor: navbarColor,
        contentWidth: contentWidth,
        menuCollapsed: menuCollapsed,
        siteSettingItem: response.data,
        actionFlag: "SETTING_ITEM",
        success: "",
        error: ""
      }
    } else {
      return {
        isRTL: isRTL,
        layout: layout,
        skin: skin,
        navbarType: navbarType,
        menuHidden: menuHidden,
        footerType: footerType,
        navbarColor: navbarColor,
        contentWidth: contentWidth,
        menuCollapsed: menuCollapsed,
        siteSettingItem: siteSettingItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getSiteSetting catch ", error)
    return {
      isRTL: isRTL,
      layout: layout,
      skin: skin,
      navbarType: navbarType,
      menuHidden: menuHidden,
      footerType: footerType,
      navbarColor: navbarColor,
      contentWidth: contentWidth,
      menuCollapsed: menuCollapsed,
      siteSettingItem: siteSettingItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createSiteSettingRequest(payload) {
  return axios.post(`${API_ENDPOINTS.layout.createSiteSetting}`, payload).then((layout) => layout.data).catch((error) => error)
}

export const createSiteSetting = createAsyncThunk('layout/createSiteSetting', async (payload) => {
  try {
    const response = await createSiteSettingRequest(payload)
    if (response && response.flag) {
      return {
        siteSettingItem: response.data,
        actionFlag: "CREATED_ITEM",
        success: response.message,
        error: ""
      }
    } else {
      return {
        siteSettingItem: siteSettingItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createSiteSetting catch ", error)
    return {
      siteSettingItem: siteSettingItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    skin: themeConfig.layout.skin,
    isRTL: themeConfig.layout.isRTL,
    layout: themeConfig.layout.type,
    lastLayout: themeConfig.layout.type,
    menuCollapsed: themeConfig.layout.menu.isCollapsed,
    footerType: themeConfig.layout.footer.type,
    navbarType: themeConfig.layout.navbar.type,
    menuHidden: themeConfig.layout.menu.isHidden,
    contentWidth: themeConfig.layout.contentWidth,
    navbarColor: themeConfig.layout.navbar.backgroundColor,
    siteSettingItem: siteSettingItem,
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    handleRTL: (state, action) => {
      state.isRTL = action.payload
    },

    handleSkin: (state, action) => {
      state.skin = action.payload
    },

    handleLayout: (state, action) => {
      state.layout = action.payload
    },

    handleFooterType: (state, action) => {
      state.footerType = action.payload
    },

    handleNavbarType: (state, action) => {
      state.navbarType = action.payload
    },
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload
    },

    handleLastLayout: (state, action) => {
      state.lastLayout = action.payload
    },

    handleNavbarColor: (state, action) => {
      state.navbarColor = action.payload
    },

    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload
    },

    handleMenuCollapsed: (state, action) => {
      state.menuCollapsed = action.payload
    },

    clearLayoutMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSiteSetting.fulfilled, (state, action) => {
        state.isRTL = action.payload.isRTL
        state.layout = action.payload.layout
        state.skin = action.payload.skin
        state.navbarType = action.payload.navbarType
        state.menuHidden = action.payload.menuHidden
        state.footerType = action.payload.footerType
        state.navbarColor = action.payload.navbarColor
        state.contentWidth = action.payload.contentWidth
        state.menuCollapsed = action.payload.menuCollapsed
        state.siteSettingItem = action.payload.siteSettingItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createSiteSetting.fulfilled, (state, action) => {
        state.siteSettingItem = action.payload.siteSettingItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  handleRTL,
  handleSkin,
  handleLayout,
  handleLastLayout,
  handleMenuHidden,
  handleNavbarType,
  handleFooterType,
  handleNavbarColor,
  handleContentWidth,
  handleMenuCollapsed,
  clearLayoutMessage
} = layoutSlice.actions

export default layoutSlice.reducer
