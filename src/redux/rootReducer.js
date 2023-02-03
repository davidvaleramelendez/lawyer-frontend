// ** Reducers Imports
import auth from '@src/pages/auth/store'
import layout from '@store/layout'
import user from '@src/pages/user/store'
import chat from '@src/pages/chat/store'
import todo from '@src/pages/todo/store'
import email from '@src/pages/email/store'
import cases from '@src/pages/case/store'
import letter from '@src/pages/letter/store'
import navBookmark from '@store/navBookmark'
import invoice from '@src/pages/invoice/store'
import contact from '@src/pages/contact/store'
import timeline from '@src/pages/timeline/store'
import calendar from '@src/pages/calendar/store'
import dashboard from '@src/pages/dashboard/store'
import navGlobalSearch from '@store/navGlobalSearch'
import cloudStorage from '@src/pages/cloudStorage/store'
import emailTemplate from '@src/pages/emailTemplate/store'
import navTopNotification from '@store/navTopNotification'
import letterTemplate from '@src/pages/letterTemplate/store'
import voiceRecording from '@src/pages/voiceRecording/store'
import importLetterFile from '@src/pages/importLetterFile/store'
import placetelCall from '@src/pages/placetelCall/store'

const rootReducer = {
  auth,
  user,
  chat,
  todo,
  email,
  cases,
  layout,
  letter,
  invoice,
  contact,
  timeline,
  calendar,
  dashboard,
  navBookmark,
  cloudStorage,
  emailTemplate,
  navGlobalSearch,
  navTopNotification,
  letterTemplate,
  voiceRecording,
  importLetterFile,
  placetelCall
}

export default rootReducer
