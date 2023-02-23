// You can customize the template with the help of this file
// Template config options

// ** Constant
import {
  storageSiteSetting
} from '@constant/defaultValues'

const _siteSettingLayout = localStorage.getItem(storageSiteSetting) !== null ? JSON.parse(localStorage.getItem(storageSiteSetting)) : null

/* Check initial values */
const getThemeInitialValue = (id) => {
  if (_siteSettingLayout && _siteSettingLayout[id]) {
    return _siteSettingLayout[id]
  }

  return null
}
/* Check initial values */

const themeConfig = {
  app: {
    appName: 'Lawyer',
    appLogoImage: require('@src/assets/images/logo/logo.svg').default
  },
  layout: {
    isRTL: false,
    skin: getThemeInitialValue('skin') ?? 'semi-dark', // light, dark, bordered, semi-dark
    type: getThemeInitialValue('layout') ?? 'vertical', // vertical, horizontal
    contentWidth: _siteSettingLayout ? _siteSettingLayout.contentWidth : 'boxed', // full, boxed
    menu: {
      isHidden: getThemeInitialValue('menuHidden') ?? false,
      isCollapsed: getThemeInitialValue('menuCollapsed') ?? false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: getThemeInitialValue('navbarType') ?? 'floating', // static , sticky , floating, hidden
      backgroundColor: getThemeInitialValue('navbarColor') ?? 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: getThemeInitialValue('footerType') ?? 'hidden' // static, sticky, hidden
    },
    customizer: true,
    scrollTop: true, // Enable scroll to top button
    toastPosition: 'top-right' // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
