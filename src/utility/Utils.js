/* eslint object-shorthand: 0 */

// Constant
import {
  cryptoIv,
  cryptoKey,
  storageUserKeyName,
  storageTokenKeyName,
  storageLoggedAtKeyName,
  storageRefreshTokenKeyName,
  storageTokenExpiresKeyName,
  storageTotalNumberName,
  storageSiteSetting,
  storageLanguageLabels,
  storageTimeCounter,
  storageRememberMeAuth
} from '@constant/defaultValues'

import {
  DefaultRoute
} from '../router/routes'

/* Date library */
import moment from "moment"

/* Imports for Encryption */
const CryptoJS = require('crypto-js')
const CryptoJSAES = require('crypto-js/aes')
const CryptoEncHex = require('crypto-js/enc-hex')
const padZeroPadding = require('crypto-js/pad-zeropadding')

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Function to capitalize the first letter of string
export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

// Replace underscore and capitalize first letter of word in string
export const capitalizeWordFirstLetter = (words) => {
  return words.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) { return key.toUpperCase() })
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
/* To check user is logged or not */
export const isUserLoggedIn = () => localStorage.getItem(storageUserKeyName)
export const getUserData = () => JSON.parse(localStorage.getItem(storageUserKeyName))

/* Get logged user from local storage */
export const getCurrentUser = () => {
  let user = null
  try {
    user = localStorage.getItem(storageUserKeyName) !== null ? JSON.parse(localStorage.getItem(storageUserKeyName)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getCurrentUser -> error', error)
    user = null
  }
  return user
}

/* Set logged user on local storage  */
export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(storageUserKeyName, JSON.stringify(user))
    } else {
      localStorage.removeItem(storageUserKeyName)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setCurrentUser -> error', error)
  }
}

/* Get access token or token from local storage */
export const getAccessToken = () => {
  let token = null
  try {
    token = localStorage.getItem(storageTokenKeyName) !== null ? JSON.parse(localStorage.getItem(storageTokenKeyName)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getAccessToken -> error', error)
    token = null
  }
  return token
}

/* Set access token or token on local storage */
export const setAccessToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(storageTokenKeyName, JSON.stringify(token))
    } else {
      localStorage.removeItem(storageTokenKeyName)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setAccessToken -> error', error)
  }
}

/* Get refresh token from local storage */
export const getRefreshToken = () => {
  let token = null
  try {
    token = localStorage.getItem(storageRefreshTokenKeyName) !== null ? JSON.parse(localStorage.getItem(storageRefreshTokenKeyName)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getRefreshToken -> error', error)
    token = null
  }
  return token
}

/* Set refersh token on local storage */
export const setRefreshToken = (token) => {
  // console.log("setRefreshToken ", storageRefreshTokenKeyName)
  try {
    if (token) {
      localStorage.setItem(storageRefreshTokenKeyName, JSON.stringify(token))
    } else {
      localStorage.removeItem(storageRefreshTokenKeyName)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setRefreshToken -> error', error)
  }
}

/* Get Expiration token from local storage */
export const getTokenExpires = () => {
  let expiresAt = null
  try {
    expiresAt = localStorage.getItem(storageTokenExpiresKeyName) !== null ? JSON.parse(localStorage.getItem(storageTokenExpiresKeyName)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getTokenExpires -> error', error)
    expiresAt = null
  }
  return expiresAt
}

/* Set Expiration token on local storage */
export const setTokenExpires = (time) => {
  // console.log("setTokenExpires ", storageTokenExpiresKeyName)
  try {
    if (time) {
      localStorage.setItem(storageTokenExpiresKeyName, JSON.stringify(time))
    } else {
      localStorage.removeItem(storageTokenExpiresKeyName)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setTokenExpires -> error', error)
  }
}

/* Get login date time from local storage */
export const getLoggedAt = () => {
  let loggedAt = null
  try {
    loggedAt = localStorage.getItem(storageLoggedAtKeyName) !== null ? JSON.parse(localStorage.getItem(storageLoggedAtKeyName)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getLoggedAt -> error', error)
    loggedAt = null
  }
  return loggedAt
}

/* Set login date time on local storage */
export const setLoggedAt = (dateTime) => {
  // console.log("setLoggedAt ", storageLoggedAtKeyName)
  try {
    if (dateTime) {
      localStorage.setItem(storageLoggedAtKeyName, JSON.stringify(dateTime))
    } else {
      localStorage.removeItem(storageLoggedAtKeyName)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setLoggedAt -> error', error)
  }
}

export const getTransformDate = (date, format = 'MM-DD-YYYY') => {
  return moment(new Date(date)).format(format)
}

/* To compare login time and expire time based on that calling refresh token api */
export const getCompareAndCallRefresh = () => {
  try {
    const expiresAt = localStorage.getItem(storageTokenExpiresKeyName) !== null ? JSON.parse(localStorage.getItem(storageTokenExpiresKeyName)) : null
    const loggedAt = localStorage.getItem(storageLoggedAtKeyName) !== null ? JSON.parse(localStorage.getItem(storageLoggedAtKeyName)) : null
    // console.log("expiresAt ", expiresAt)
    if (expiresAt && loggedAt) {
      if (expiresAt && expiresAt['access']) {
        const hours = Math.floor(expiresAt['access'] / 3600) //hours
        // extend date with token expiration time
        const loggedDate = moment(new Date(loggedAt)).add(hours, 'hours').format("YYYY-MM-DD HH:mm")
        // console.log("loggedDate ", loggedDate)
        const todayDate = moment(new Date()).format("YYYY-MM-DD HH:mm")
        // const dateIsSame = moment(loggedDate).isSame("2022-09-01 17:06")
        // const dateIsBefore = moment(loggedDate).isBefore("2022-09-01 17:06")
        const dateIsSame = moment(loggedDate).isSame(todayDate)
        const dateIsBefore = moment(loggedDate).isBefore(todayDate)
        if (dateIsSame || dateIsBefore) {
          return dateIsSame || dateIsBefore
        }
        return false
      }
      return false
    }
    return false
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : getCompareAndCallRefresh -> error', error)
    return false
  }
}

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return DefaultRoute
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

/* Encrypt data */
const encryptData = (data = "") => {
  try {
    const key = CryptoEncHex.parse(cryptoKey)
    const iv = CryptoEncHex.parse(cryptoIv)
    // Encrypt
    const Encrypted = CryptoJSAES.encrypt(data || "", key, { iv: iv, padding: padZeroPadding }).toString()
    return Encrypted
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : encryptData -> error', error)
    return false
  }
}

/* Return html value inside inner html */
export const setInnerHtml = (value = "", classValue = "m-0") => {
  return <div className={classValue} dangerouslySetInnerHTML={{ __html: value }} />
}

/* Return default image if server image not found */
export const onImageSrcError = ({ currentTarget }) => {
  if (currentTarget) {
    currentTarget.onerror = null
    currentTarget.src = "/images/avatar-blank.png"
  }
}

export const getRandColorClass = () => {
  const index = Math.floor(Math.random() * 6)
  const colorClass = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary']
  const color = colorClass[index]
  return color
}

// Replace underscore and capitalize first letter of word in string
export const underscoreCapitalizeWord = (words) => {
  return words.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) { return key.toUpperCase() })
}

// Formatting value to 2 decimal format
export const getDecimalFormat = (value) => {
  if (value) {
    return parseFloat(value).toFixed(2)
  }
  return 0.00
}

// getting percentage from a value
export const getPercentage = (num, per) => {
  return parseFloat((num / 100) * per).toFixed(2)
}

// Increase days in date with formatted
export const increaseDaysDateFormat = (day, format = 'MM-DD-YYYY', date = new Date()) => {
  try {
    return moment(new Date(date)).add(day, 'day').format(format)
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : increaseDaysDateFormat -> error', error)
    return new Date()
  }
}

// Increase custom type in date with formatted
export const increaseCustomDateFormat = (type, value, format = 'MM-DD-YYYY', date = new Date()) => {
  try {
    return moment(new Date(date)).add(type, value).format(format)
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : increaseCustomDateFormat -> error', error)
    return new Date()
  }
}

// Get current total number
export const getTotalNumber = (title) => {
  try {
    const total_numbers = JSON.parse(localStorage.getItem(storageTotalNumberName) ?? '{}')
    return total_numbers[title]
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setCurrentUser -> error', error)
  }
}

// Set current total number
export const setTotalNumber = (title, number) => {
  try {
    let total_numbers = JSON.parse(localStorage.getItem(storageTotalNumberName) ?? '{}')
    total_numbers = {
      ...total_numbers,
      [title]: number
    }
    localStorage.setItem(storageTotalNumberName, JSON.stringify(total_numbers))
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : getCurrentUser -> error', error)
  }
}
/* Get time counter from local storage */
export const getTimeCounter = () => {
    let timecounter = null
    try {
      timecounter = localStorage.getItem(storageTimeCounter) !== null ? JSON.parse(localStorage.getItem(storageTimeCounter)) : {
        interval_time: 0,
        current_time: 0,
        status: false
      }
    } catch (error) {
      console.log('>>>>: src/utility/Utils.js  : getTimeCounter -> error', error)
      timecounter = null
    }
    return timecounter
  }
  
  /* Set time counter on local storage  */
  export const setTimeCounter = (timecounter) => {
    try {
      if (timecounter) {
        localStorage.setItem(storageTimeCounter, JSON.stringify(timecounter))
      } else {
        localStorage.removeItem(storageTimeCounter)
      }
    } catch (error) {
      console.log('>>>>: src/utility/Utils.js : setTimeCounter -> error', error)
   }
  }

// Get current total number
export const getCurrentPageNumber = (title, rowsPerPage, currentPage) => {
  try {
    const total_numbers = JSON.parse(localStorage.getItem(storageTotalNumberName) ?? '{}')[title]
    return Math.min(total_numbers, rowsPerPage * currentPage) - (rowsPerPage * (currentPage - 1))
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setCurrentUser -> error', error)
  }
}

//Set Site layout Setting
export const setSiteLayoutSetting = (siteSetting) => {
  try {
    if (siteSetting) {
      localStorage.setItem(storageSiteSetting, JSON.stringify(siteSetting))
    } else {
      localStorage.removeItem(storageSiteSetting)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setSiteLayoutSetting -> error', error)
  }
}

// Get current Site Setting value
export const getSiteLayoutSetting = () => {
  let _sitesetting = null
  try {
    _sitesetting = localStorage.getItem(storageSiteSetting) !== null ? JSON.parse(localStorage.getItem(storageSiteSetting)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getSiteLayoutSetting -> error', error)
    _sitesetting = null
  }
  return _sitesetting
}

/* Decrypting data */
const decryptData = (encrypted = "") => {
    try {
      const key = CryptoEncHex.parse(cryptoKey)
      const iv = CryptoEncHex.parse(cryptoIv)
  
      /* Decrypting */
      let Decrypted = CryptoJSAES.decrypt(encrypted || "", key, { iv: iv, padding: padZeroPadding })
      if (Decrypted) {
        Decrypted = Decrypted.toString(CryptoJS.enc.Utf8)
      }
  
      return Decrypted
    } catch (error) {
      console.log('>>>>: src/utility/Utils.js  : decryptData -> error', error)
      return false
    }
  }
  /* /Decrypting data */
  
  /* Encrypting auth remember me and setting to storage */
  const setRememberMeAuthData = (data = null) => {
    try {
      let rememberMe = null
      if (data) {
        const Encrypted = encryptData(JSON.stringify(data || ""))
        if (Encrypted) {
          rememberMe = Encrypted
          localStorage.setItem(storageRememberMeAuth, JSON.stringify(Encrypted))
        } else {
          localStorage.removeItem(storageRememberMeAuth)
        }
      } else {
        rememberMe = null
       localStorage.removeItem(storageRememberMeAuth)
      }
      return rememberMe
   } catch (error) {
      console.log('>>>>: src/utility/Utils.js  : setRememberMeAuthData -> error', error)
     return data
    }
  }
  /* /Encrypting auth remember me and setting to storage */
  
  /* Decrypting auth remember me and getting from storage */

  const getRememberMeAuthData = () => {
    let rememberMe = null
    try {
      rememberMe = localStorage.getItem(storageRememberMeAuth) !== null ? JSON.parse(localStorage.getItem(storageRememberMeAuth)) : null
      if (rememberMe) {
        const Decrypted = decryptData(rememberMe)
        if (Decrypted) {
          rememberMe = JSON.parse(Decrypted)
        }
      }
   } catch (error) {
      console.log('>>>>: src/utility/Utils.js  : getRememberMeAuthData -> error', error)
      rememberMe = null
  }
   return rememberMe
  }
  
  /* /Decrypting auth remember me and getting from storage */
  /* Exporting functions */
  export {
  encryptData,
    decryptData,
    setRememberMeAuthData,
    getRememberMeAuthData
}
// Get language labels value
export const getLanguageLabels = () => {
  let _languageLabels = null
  try {
    _languageLabels = localStorage.getItem(storageLanguageLabels) !== null ? JSON.parse(localStorage.getItem(storageLanguageLabels)) : null
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js  : getLanguageLabels -> error', error)
    _languageLabels = null
  }
  return _languageLabels
}

// Set language labels value
export const setLanguageLabels = (labels) => {
  try {
    if (labels) {
      localStorage.setItem(storageLanguageLabels, JSON.stringify(labels))
    } else {
      localStorage.removeItem(storageLanguageLabels)
    }
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : setLanguageLabels -> error', error)
  }
}
/* /Decrypting auth remember me and getting from storage */

export const toTimeString = (seconds, mode = 'second') => {
  try {
    let hour = Math.floor(seconds / 3600)
    let min = Math.floor((seconds % 3600) / 60)
    let second = seconds % 60
    
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    second = (second < 10 ? '0' : '') + second
    if (mode === 'min') return `${hour} : ${min}`
    else return `${hour} : ${min} : ${second}`
  } catch (error) {
    console.log('>>>>: src/utility/Utils.js : toTimeString -> error', error)
  }
}