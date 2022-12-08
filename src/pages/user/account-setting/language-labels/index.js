/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Col,
  Nav,
  Row,
  Card,
  Form,
  Label,
  Input,
  Button,
  NavLink,
  TabPane,
  NavItem,
  CardBody,
  TabContent
} from 'reactstrap'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Icons Import
import {
  Mail,
  User,
  Send,
  Codepen,
  FileText,
  Settings,
  Calendar,
  HardDrive,
  Briefcase,
  CheckCircle,
  CheckSquare,
  MessageCircle,
  MessageSquare
} from 'react-feather'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import '@styles/react/apps/app-users.scss'
import '@styles/react/libs/editor/editor.scss'

// ** localization keys
import { L10nKeys, L10nOrgKeys, L10nMenuItemIDKeys, T } from '@localization'

// ** API calling components
import axios from 'axios'
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** React-Tab
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import LabelsForm from './LabelsForm'

import menuConfig from '@configs/menuConfig'
import { updateLanguageLabels } from '../../../auth/store'

const LanguageLabels = () => {

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.user)
  const userRole = useSelector(state => state.auth.userItem.role?.RoleName || null)

  /* State */
  const [loadFirst, setLoadFirst] = useState(true)
  const [active, setActive] = useState(0)
  const [languages, setLanguages] = useState([])
  const [selLanguage, setSelLanguage] = useState(store.userItem.language)
  const [translation, setTranslation] = useState(null)

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

          if (!langList.includes('Dutch')) {
            langList.push('Dutch')
          }
          setLanguages(langList)
        })
        .catch((error) => {
          Notification("Error", error, "Error")
        })
  }

  const getLanguageTranslation = (lang) => {
    axios.get(`${API_ENDPOINTS.language.labels}?language=${lang}`)
      .then((res) => {
        const data = res.data.data[lang] ? res.data.data[lang] : {}
        const labels = {}
        Object.keys(L10nKeys).forEach(key => {
          const origin = L10nKeys[key]
          labels[origin] = origin
          if (data[origin] !== undefined && data[origin] !== null && data[origin] !== '') {
            labels[origin] = data[origin]
          }
        })

        console.log('data: ', labels)
        setTranslation(labels)
      })
      .catch((error) => {
        Notification("Error", error, "warning")
      })
  }

  async function setLanguageLabelsRequest(params) {
    return axios.post(`${API_ENDPOINTS.language.labels}`, params).then((resp) => resp.data).catch((error) => error)
  }

  const setLanguageLabels = async (params) => {
    try {
      const response = await setLanguageLabelsRequest(params)
      if (response && response.flag) {
        Notification("Success", response.message, "success")

        const updatedLabels = response.data     
        const labels = {}   
        Object.keys(updatedLabels).forEach(type => {
          Object.keys(L10nKeys).forEach(key => {
            if (labels[type] === undefined) labels[type] = {}

            const origin = L10nKeys[key]
            labels[type][origin] = origin
            if (updatedLabels[type][origin] !== undefined 
              && updatedLabels[type][origin] !== null
              && updatedLabels[type][origin] !== '') {
                labels[type][origin] = updatedLabels[type][origin]
            }
          })
        })
        
        dispatch(updateLanguageLabels(labels))
      } else {
        Notification("Error", response.message, "warning")
      }
    } catch (error) {
      Notification("Error", error, "warning")
    }
  }

  // ** Get language labels
  useEffect(() => {
    /* Calling first time */
    if (loadFirst) {
      getLanguages()
      getLanguageTranslation(selLanguage)
      setLoadFirst(false)
    }
  }, [loadFirst])

  const onChangeLanguage = (value) => {
    setSelLanguage(value)
    getLanguageTranslation(value)
  }

  const isVisibleMenuItem = itemId => {
    if (!userRole)  return false
    if (menuConfig[userRole][itemId] === undefined) return true
    return menuConfig[userRole][itemId]
  }

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onChangeTranslation = (origin, value) => {
    const values = {...translation}
    values[origin] = value
    setTranslation(values)
  }

  const onSubmit = (category, values) => {
    console.log(`values: `, values)
    const params = {
      language: selLanguage,
      labels: values
    }
    console.log(`params: `, params)

    setLanguageLabels(params)
  }

  const getPageIconComponent = (page) => {
    switch (page) {
      case "Email":
        return <Mail size={14} />
      case "Documents":
        return <Briefcase size={14} />
      case "Chat":
        return <MessageCircle size={14} />
      case "Task":
        return <CheckSquare size={14} />
      case "Calendar":
        return <Calendar size={14} />
      case "Respites":
        return <CheckCircle size={14} />
      case "Outbox":
        return <Send size={14} />
      case "Bills":
        return <FileText size={14} />
      case "Inquiry":
        return <MessageSquare size={14} />
      case "Contact":
        return <FileText size={14} />
      case "User":
        return <User size={14} />
      case "Account":
        return <Settings size={14} />
      case "Email Template":
        return <Codepen size={14} />
      case "Cloud-Server":
        return <HardDrive size={14} />
      case "Calendar Setting":
        return <Calendar size={14} />
    }
  }

  return (<>
    <div className="app-user-view">
      <div className="d-flex align-items-center me-2" style={{ width: '300px', marginBottom: '30px' }}>
        <label htmlFor="language-select">{T('Language')}</label>
        <Input
          type="select"
          id="language-select"
          value={selLanguage}
          onChange={(event) => onChangeLanguage(event.target.value)}
          className="form-control ms-50 pe-3"
        >
          {languages && languages.length ? (<>
              {languages.map((item, index) => (
                  <option key={`row-${index}`} value={item}>{item}</option>
              ))}
          </>) : null}
        </Input>
      </div>
      <Tabs>
        <TabList>
          {Object.keys(L10nOrgKeys).map(tabName => {
            return <Tab key={tabName}>{T(tabName)}</Tab>
          })}
        </TabList>

        {Object.keys(L10nOrgKeys).map((tabName) => {
          return Array.isArray(L10nOrgKeys[tabName]) ? (
              <TabPanel key={tabName}>
                <LabelsForm category={tabName} 
                    originKeys={L10nOrgKeys[tabName]} 
                    translation={translation}
                    formId={tabName}
                    isVisibleMenuItem={isVisibleMenuItem}
                    onChangeTranslation={onChangeTranslation}
                    onSubmitParent={onSubmit}/>
              </TabPanel>
            ) : (
              <TabPanel key={tabName}>
                <Nav pills className="mb-2">
                  {Object.keys(L10nOrgKeys[tabName]).map((subTabName, i) => {
                    return isVisibleMenuItem(L10nMenuItemIDKeys[subTabName]) ? (
                      <NavItem key={subTabName + i}>
                        <NavLink active={active === i} onClick={() => toggleTab(i)}>
                          {getPageIconComponent(subTabName)}
                          <span className="fw-bold d-none d-sm-block">{T(subTabName)}</span>
                        </NavLink>
                      </NavItem>
                    ) : null
                  })}
                </Nav>
                <TabContent activeTab={active}>
                  {Object.keys(L10nOrgKeys[tabName]).map((subTabName, i) => {
                    return isVisibleMenuItem(L10nMenuItemIDKeys[subTabName]) ? (
                      <TabPane tabId={i} key={subTabName + i}>
                        <LabelsForm category={subTabName} 
                            originKeys={L10nOrgKeys[tabName][subTabName]} 
                            translation={translation}
                            formId={subTabName}
                            isVisibleMenuItem={isVisibleMenuItem}
                            onChangeTranslation={onChangeTranslation}
                            onSubmitParent={onSubmit}/>
                      </TabPane>
                    ) : null
                  })}
                </TabContent>
              </TabPanel>
          )          
        })}
      </Tabs>
    </div>
  </>)

}
export default LanguageLabels