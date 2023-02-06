// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Translation
import { T } from '@localization'

// ** Store & Actions
import {
  getCompanyDetail,
  getAccountSetting,
  clearUserMessage,
  getPlacetelSipUserIdList,
  getPlacetelSipUserIdDetail
} from '@src/pages/user/store'
import {
  getInquiryImapDetail
} from '@src/pages/contact/store'
import { useDispatch, useSelector } from 'react-redux'

// ** API calling components
import axios from 'axios'
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Utils
import {
  isUserLoggedIn,
  getCurrentUser
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Account view Components
import Tabs from './Tabs'

// ** Styles
import '@styles/react/apps/app-users.scss'


const AccountSettingApp = () => {
  /* Hooks */
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.user)

  // ** State
  const [loadFirst, setLoadFirst] = useState(true)
  const [active, setActive] = useState('1')
  const [languages, setLanguages] = useState([])
  const [userData, setUserData] = useState(getCurrentUser)
  const [selLanguage, setSelLanguage] = useState(store.userItem.language)

  // ** Get languages 
  const getLanguages = () => {
    axios.get(`${API_ENDPOINTS.language.languages}`)
      .then((res) => {
        let langList = res.data.data
        if (langList === undefined || langList === null) {
          langList = []
        }

        if (!langList.includes('English')) {
          langList.push('English')
        }

        if (!langList.includes('Deutsch')) {
          langList.push('Deutsch')
        }
        setLanguages(langList)
      })
      .catch((error) => {
        Notification("Error", error, "Error")
      })
  }

  // ** Get user on mount based on id
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (isUserLoggedIn() !== null) {
      setUserData(getCurrentUser)
    }

    /* Calling first time */
    if (loadFirst) {
      dispatch(getAccountSetting({}))
      dispatch(getCompanyDetail({}))
      dispatch(getInquiryImapDetail({}))
      dispatch(getPlacetelSipUserIdList({}))
      dispatch(getPlacetelSipUserIdDetail({}))
      getLanguages()
      setSelLanguage(store.userItem.language)
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearUserMessage())
    }

    /* Succes toast notification */
    if (store && store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store && store.error) {
      Notification(T("Error"), store.error, "warning")
    }
  }, [store.roleItems, store.success, store.error, store.actionFlag, loadFirst])

  useEffect(() => {
    setSelLanguage(store.userItem.language)
  }, [store.userItem])

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div className="app-user-view">
      <Tabs
        active={active}
        userData={userData}
        toggleTab={toggleTab}
        languages={languages}
        selLanguage={selLanguage}
        setSelLanguage={setSelLanguage}
      />
    </div>
  )
}

export default AccountSettingApp
