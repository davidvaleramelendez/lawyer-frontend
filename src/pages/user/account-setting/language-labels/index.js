/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import Select from 'react-select'

// ** Store & Actions
import {
  setLanguageLabels
} from '../../store'
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
import { L10nKeys } from '@localization'

// ** API calling components
import axios from 'axios'
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** React-Tab
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import LabelsForm from './LabelsForm'

const LanguageLabels = () => {

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.user)

  console.log('user language: ', store.userItem.language)

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
        console.log('---------- translation api: ', res)
        const data = res.data.data
        Object.keys(L10nKeys).forEach(key => {
          if (!data[key]) data[key] = {}
        })

        Object.keys(L10nKeys.pages).forEach(key => {
          if (!data[key]) data[key] = {}
        })
        setTranslation(data)
      })
      .catch((error) => {
        Notification("Error", error, "warning")
      })
  }

  // ** Get user on mount based on id
  useEffect(() => {
    /* Calling first time */
    if (loadFirst) {
      getLanguages()
      getLanguageTranslation(selLanguage)
      setLoadFirst(false)
    }
  }, [loadFirst])

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const onChangeLanguage = (value) => {
    setSelLanguage(value)
    getLanguageTranslation(value)
  }

  const onChangeTranslation = (category, key, value) => {
    const values = {...translation}
    values[category][L10nKeys[category][key]] = value
    setTranslation(values)
  }

  const onSubmit = (category, values) => {
    console.log(`category: ${category}`)
    console.log(`values: `, values)
    const params = {
      language: selLanguage,
      category: category,
      labels: []
    }
    Object.keys(values).forEach(key => {
      params.labels.push({
        origin: key,
        translation: values[key]
      })
    })

    dispatch(setLanguageLabels(params))
  }

  const getPageIconComponent = (page) => {
    switch (page) {
      case "email":
        return <Mail size={14} />
      case "documents":
        return <Briefcase size={14} />
      case "chat":
        return <MessageCircle size={14} />
      case "task":
        return <CheckSquare size={14} />
      case "calendar":
        return <Calendar size={14} />
      case "respites":
        return <CheckCircle size={14} />
      case "outbox":
        return <Send size={14} />
      case "bills":
        return <FileText size={14} />
    }
  }

  return (<>
    <div className="app-user-view">
      <div className="d-flex align-items-center me-2" style={{ width: '300px', marginBottom: '30px' }}>
        <label htmlFor="language-select">Language</label>
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
          <Tab>Menu</Tab>
          <Tab>Common</Tab>
          <Tab>Pages</Tab>
          <Tab>Errors</Tab>
        </TabList>

        <TabPanel>
          <LabelsForm category={'menu'} 
              origin={L10nKeys.menu} 
              translation={translation ? translation['menu'] : null}
              formId={'menu'} 
              onChangeTranslation={onChangeTranslation}
              onSubmitParent={onSubmit}/>
        </TabPanel>
        <TabPanel>
          <LabelsForm category={'common'} 
              origin={L10nKeys.common} 
              translation={translation ? translation['common'] : null}
              formId={'common'}  
              onChangeTranslation={onChangeTranslation}
              onSubmitParent={onSubmit}/>
        </TabPanel>
        <TabPanel>
          <Nav pills className="mb-2">
            {Object.keys(L10nKeys.pages).map((page, i) => {
              return (
                <NavItem key={page + i}>
                  <NavLink active={active === i} onClick={() => toggleTab(i)}>
                    {getPageIconComponent(page)}
                    <span className="fw-bold d-none d-sm-block">{capitalizeFirstLetter(page)}</span>
                  </NavLink>
                </NavItem>
              )
            })}
          </Nav>
          <TabContent activeTab={active}>
            {Object.keys(L10nKeys.pages).map((page, i) => {
              return (
                <TabPane tabId={i} key={page + i}>
                  <LabelsForm category={page} 
                      origin={L10nKeys.pages[page]} 
                      translation={translation ? translation[page] : null}
                      formId={page}  
                      onChangeTranslation={onChangeTranslation}
                      onSubmitParent={onSubmit}/>
                </TabPane>
              )
            })}
          </TabContent>
        </TabPanel>
        <TabPanel>
          <LabelsForm category={'errors'} 
              translation={translation ? translation['errors'] : null}
              origin={L10nKeys.errors} 
              formId={'errors'} 
              onChangeTranslation={onChangeTranslation}
              onSubmitParent={onSubmit}/>
        </TabPanel>
      </Tabs>
    </div>
  </>)

}
export default LanguageLabels