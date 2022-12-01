// ** React Imports
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Badge,
  Table,
  Button,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap'

// ** Utils
import {
  getCurrentUser,
  isUserLoggedIn,
  getTransformDate,
  getDecimalFormat
} from '@utils'

// Constant
import {
  root,
  adminRoot
} from '@constant/defaultValues'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  dashboard,
  cleanDashboardMessage
} from './store'

// ** MenuConfig Import
import menuConfig from '@configs/menuConfig'

// Translation
import { useTranslation } from 'react-i18next'

// ** Icons Import
import {
  User,
  CheckSquare,
  PhoneForwarded,
  MessageSquare
} from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Demo Components
import CardMedal from '@components/cards/advance/CardMedal'
import StatsCard from '@components/cards/statistics/StatsCard'

// ** Images
import illustration from '@src/assets/images/illustration/email.svg'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const EcommerceDashboard = () => {
  // ** Hooks
  const { t } = useTranslation()
  const navigate = useNavigate()

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.dashboard)

  // ** State
  const [loadFirst, setLoadFirst] = useState(true)
  const [userData, setUserData] = useState(getCurrentUser)

  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (isUserLoggedIn() !== null) {
      setUserData(getCurrentUser)
    }

    if (loadFirst) {
      dispatch(dashboard({}))
      setLoadFirst(false)
    }
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(cleanDashboardMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

  // ** Renders todo tags
  const renderTags = (tags) => {
    const badgeColor = {
      team: 'light-primary',
      low: 'light-success',
      medium: 'light-warning',
      high: 'light-danger',
      update: 'light-info'
    }

    return tags.map(item => (
      <Badge className='text-capitalize' key={item} color={badgeColor[item]} pill>
        {item}
      </Badge>
    ))
  }

  /* Rendering todos */
  const renderTodos = () => {
    if (store && store.dashboardItems && store.dashboardItems.todos && store.dashboardItems.todos.length) {
      return store.dashboardItems.todos.map((todo, index) => {
        let tag = "success"
        if (tag === "Medium") {
          tag = "warning"
        }
        if (tag === "High") {
          tag = "danger"
        }

        return (
          <div key={`todo_${index}`} className='transaction-item'>
            <div className='d-flex'>
              <Avatar className='rounded' color={`light-${tag}`} icon={<CheckSquare size={18} />} />
              <div>
                <h6 className='transaction-title text-capitalize'>{todo.title}</h6>
                <small>{todo.created_at ? `${getTransformDate(todo.created_at, "DD.MM.YYYY")} at ${getTransformDate(todo.created_at, "hh:mm a")}` : null}</small>
              </div>
            </div>
            {/* <div className={`fw-bolder ${`text-${tag}`} text-capitalize`}>{todo.tag}</div> */}
            {todo && todo.tag ? (
              <div className='badge-wrapper'>{renderTags(todo.tag.split(','))}</div>
            ) : null}
          </div>
        )
      })
    }
  }

  /* Rendering contacts */
  const renderContacts = () => {
    if (store && store.dashboardItems && store.dashboardItems.contacts && store.dashboardItems.contacts.length) {
      return store.dashboardItems.contacts.map((contact, index) => {
        return (
          <div key={`contact_${index}`} className='transaction-item'>
            <div className='d-flex'>
              <Avatar className='rounded' color='light-info' icon={<PhoneForwarded size={18} />} />
              <div>
                <h6 className='transaction-title text-capitalize'>{contact.Name}</h6>
                <small>ID: {contact && contact.ContactID}</small>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  /* Rendering last open cases */
  const renderLastOpenCases = () => {
    if (store && store.dashboardItems && store.dashboardItems.last_open_cases && store.dashboardItems.last_open_cases.length) {
      return store.dashboardItems.last_open_cases.map((item, index) => {
        return (
          <tr key={`case_${index}`}>
            <td>{item.CaseID}</td>
            <td>
              <div>
                <div className='fw-bolder'>{(item && item.user && item.user.name) || ""}</div>
                <div className='font-small-2 text-muted'>{(item && item.user && item.user.email) || ""}</div>
              </div>
            </td>
            <td>
              <div className='d-flex align-items-center'>
                <Avatar className='me-1' color="light-primary" icon={<User size={18} />} />
                <span>{(item && item.laywer && item.laywer.name) || ""}</span>
              </div>
            </td>
            <td>{(item && item.Date && getTransformDate(item.Date, "DD-MM-YYYY")) || ""}</td>
            <td>{(item && item.type && item.type.CaseTypeName) || ""}</td>
          </tr>)
      })
    }
  }

  /* Rendering invoices */
  const renderInvoices = () => {
    if (store && store.dashboardItems && store.dashboardItems.invoices && store.dashboardItems.invoices.length) {
      return store.dashboardItems.invoices.map((invoice, index) => {
        return (
          <tr key={`invoice_${index}`}>
            <td>{invoice.invoice_no}</td>
            <td>{invoice.CaseID}</td>

            <td>
              <div>
                <div className='fw-bolder'>{(invoice && invoice.customer && invoice.customer.name) || ""}</div>
                <div className='font-small-2 text-muted'>{(invoice && invoice.customer && invoice.customer.email) || ""}</div>
              </div>
            </td>

            <td>
              <div className='d-flex align-items-center'>
                <span>{(invoice && `€ ${getDecimalFormat(invoice.total_price)}`) || ""}</span>
              </div>
            </td>

            <td>{(invoice && invoice.invoice_due_date && getTransformDate(invoice.invoice_due_date, "DD-MM-YYYY")) || ""}</td>

            <td>{(invoice && `€ ${getDecimalFormat(invoice.remaining_amount)}`) || ""}</td>
          </tr>)
      })
    }
  }

  /* Rendering chats */
  const renderChats = () => {
    if (store && store.dashboardItems && store.dashboardItems.chats && store.dashboardItems.chats.length) {
      return store.dashboardItems.chats.map((chat, index) => {
        return (
          <div key={`chat_${index}`} className='d-flex align-items-center mb-1'>
            <Avatar color='light-info' className='rounded me-1' icon={<MessageSquare size={18} />} />
            <div>
              <h6 className='mb-0 text-capitalize'>{(chat && chat.sender && chat.sender.name) || ""}</h6>
              <small>{(chat && chat.message) || ""}</small>
              <div className="fw-bolder text-danger">
                <span>{(chat && getTransformDate(chat.created_at, "DD.MM.YYYY hh:mm a")) || ""}</span>
              </div>
            </div>
          </div>
        )
      })
    }
  }
  const checkDashboardComponent = (role, component) => {
    return menuConfig[role][component]
  }
  return store ? (
    <div id="dashboard-ecommerce">
      {!store.loading ? (
        <Spinner
          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
        />
      ) : null}

      <Row className="match-height">
      { checkDashboardComponent(userData.role.RoleName, 'Documents') ? <>
        <Col xl={4} md={6} xs={12}>
          <CardMedal
            t={t}
            userName={(userData && userData.name) || ""}
            caseCount={(store.dashboardItems && store.dashboardItems.open_cases_count) || 0}
          />
        </Col>
        </> : null }

        <Col xl={8} md={6} xs={12}>
          <StatsCard
            t={t}
            cols={{ xl: "3", sm: "6" }}
            openCasesCount={(store.dashboardItems && store.dashboardItems.open_cases_count) || 0}
            holdCasesCount={(store.dashboardItems && store.dashboardItems.hold_cases) || 0}
            openInvoicesCount={(store.dashboardItems && store.dashboardItems.open_invoices) || 0}
            totalAmount={(store.dashboardItems && store.dashboardItems.total_amount) || 0}
          />
        </Col>
      </Row>

      <Row className="match-height">
        { (checkDashboardComponent(userData.role.RoleName, 'Inquiry') || checkDashboardComponent(userData.role.RoleName, 'Task')) ? <>
        <Col lg={4} md={12}>
          <Row className="match-height">
            <Col lg={12} md={6} xs={12}>
              {/* Todos */}
              { checkDashboardComponent(userData.role.RoleName, 'Task') ? <>
              <Card className='card-transaction'>
                <CardHeader>
                  <CardTitle tag='h4'>{t("Todo List")}</CardTitle>
                </CardHeader>
                <CardBody>
                  {store.dashboardItems && store.dashboardItems.todos && store.dashboardItems.todos.length ? <>
                    {renderTodos()}
                  </> : null}

                  <div className="border-top text-center">
                    <Button
                      tag={Link}
                      className="mt-1"
                      to={`${adminRoot}/todo`}
                      color="primary"
                    >
                      {t("See all")}
                    </Button>
                  </div>
                </CardBody>
              </Card>
              </> : null }
              {/* /Todos */}

              {/* Contacts */}
              { checkDashboardComponent(userData.role.RoleName, 'Inquiry') ? <>
              <Card className='card-transaction'>
                <CardHeader>
                  <CardTitle tag='h4'>{t("New inquiry")}</CardTitle>
                </CardHeader>
                <CardBody>
                  {store.dashboardItems && store.dashboardItems.contacts && store.dashboardItems.contacts.length ? <>
                    {renderContacts()}
                  </> : null}

                  <div className="border-top text-center">
                    <Button
                      tag={Link}
                      className="mt-1"
                      to={`${adminRoot}/contact`}
                      color="primary"
                    >
                      {t("See all")}
                    </Button>
                  </div>
                </CardBody>
              </Card>
              </> : null }
              {/* /Contacts */}
            </Col>
          </Row>
        </Col>
        </> : null }
        <Col lg={8} md={12}>
          {/* Last open cases */}
          { checkDashboardComponent(userData.role.RoleName, 'Documents') ? <>
          <Card className='card-company-table'>
            <CardHeader>
              <CardTitle tag='h4'>{t("Open cases")}</CardTitle>
            </CardHeader>

            <Table responsive>
              <thead>
                <tr>
                  <th>{t("File")}</th>
                  <th>{t("Client")}</th>
                  <th>{t("Lawyer")}</th>
                  <th>{t("Takeover Date")}</th>
                  <th>{t("Stage")}</th>
                </tr>
              </thead>
              {store.dashboardItems && store.dashboardItems.last_open_cases && store.dashboardItems.last_open_cases.length ? <>
                <tbody>{renderLastOpenCases()}</tbody>
              </> : null}
            </Table>
          </Card>
          </> : null }
          {/* /Last open cases */}
        </Col>
      </Row>

      <Row className="match-height">
        { checkDashboardComponent(userData.role.RoleName, 'Invoice') ? <>
        <Col lg={8} md={12}>
          {/* Invoices */}
          <Card className='card-company-table'>
            <CardHeader>
              <CardTitle tag='h4'>{t("Open invoices")}</CardTitle>
            </CardHeader>

            <Table responsive>
              <thead>
                <tr>
                  <th>{t("Invoice No.")}</th>
                  <th>{t("File")}</th>
                  <th>{t("Client")}</th>
                  <th>{t("Total")}</th>
                  <th>{t("Due date")}</th>
                  <th>{t("Open amount")}</th>
                </tr>
              </thead>
              {store.dashboardItems && store.dashboardItems.invoices && store.dashboardItems.invoices.length ? <>
                <tbody>{renderInvoices()}</tbody>
              </> : null}
            </Table>
          </Card>
          {/* /Invoices */}
        </Col>
         </> : null }

        { checkDashboardComponent(userData.role.RoleName, 'Chat') ? <>
        <Col lg={4} md={6} xs={12}>
          {/* Chats */}
          <Card className='card-developer-meetup'>
            <CardHeader>
              <CardTitle tag='h4'>{t("New Chats")}</CardTitle>
            </CardHeader>
            <div className='meetup-img-wrapper rounded-top text-center'>
              <img src={illustration} height='170' />
            </div>
            <CardBody>
              {store.dashboardItems && store.dashboardItems.chats && store.dashboardItems.chats.length ? <>
                {renderChats()}

                <div className="border-top text-center">
                  <Button
                    tag={Link}
                    to={`${adminRoot}/chat`}
                    className="mt-1"
                    color="primary"
                  >
                    {t("See all")}
                  </Button>
                </div>
              </> : `${t("No chats found")}`}

            </CardBody>
          </Card>
          {/* /Chats */}
        </Col>
        </> : null }
      </Row>
    </div>
  ) : null
}

export default EcommerceDashboard
