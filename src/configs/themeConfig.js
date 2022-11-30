// You can customize the template with the help of this file

//Template config options
import {
  storageSiteSetting
} from '@constant/defaultValues'

const _siteSettingLayout = localStorage.getItem(storageSiteSetting) !== null ? JSON.parse(localStorage.getItem(storageSiteSetting)) : null

const themeConfig = {
  app: {
    appName: 'Lawyer',
    appLogoImage: require('@src/assets/images/logo/logo.svg').default
  },
  layout: {
    isRTL: false,
    skin: _siteSettingLayout ? _siteSettingLayout.skin : 'semi-dark', // light, dark, bordered, semi-dark
    type: 'vertical', // vertical, horizontal
    contentWidth: _siteSettingLayout ? _siteSettingLayout.contentWidth : 'boxed', // full, boxed
    menu: {
      isHidden: _siteSettingLayout ? _siteSettingLayout.menuHidden : false,
      isCollapsed: _siteSettingLayout ? _siteSettingLayout.menuCollapsed : false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: _siteSettingLayout ? _siteSettingLayout.navbarType : 'floating', // static , sticky , floating, hidden
      backgroundColor: _siteSettingLayout ? _siteSettingLayout.navbarColor : 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: _siteSettingLayout ? _siteSettingLayout.footerType : 'hidden' // static, sticky, hidden
    },
    customizer: true,
    scrollTop: true, // Enable scroll to top button
    toastPosition: 'top-right' // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
