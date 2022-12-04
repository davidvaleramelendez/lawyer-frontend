// ** React Imports
import { lazy } from 'react'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// Contact
const ContactList = lazy(() => import('@src/pages/contact/list'))
const ContactView = lazy(() => import('@src/pages/contact/view'))

// User
const UserList = lazy(() => import('@src/pages/user/list'))
const UserView = lazy(() => import('@src/pages/user/view'))
const UserEdit = lazy(() => import('@src/pages/user/edit'))
const UserAccountSetting = lazy(() => import('@src/pages/user/account-setting'))

// Email
const Email = lazy(() => import('@src/pages/email'))
const EmailView = lazy(() => import('@src/pages/email/view'))

// Chat
const Chat = lazy(() => import('@src/pages/chat'))

// Case
const CaseList = lazy(() => import('@src/pages/case/list'))
const CaseView = lazy(() => import('@src/pages/case/view'))

// Todo
const Todo = lazy(() => import('@src/pages/todo'))

// Calendar
const Calendar = lazy(() => import('@src/pages/calendar'))

// Timeline
const Timeline = lazy(() => import('@src/pages/timeline'))

// Letter
const LetterList = lazy(() => import('@src/pages/letter/list'))

// Invoice
const InvoiceList = lazy(() => import('@src/pages/invoice/list'))
const InvoiceAdd = lazy(() => import('@src/pages/invoice/add'))
const InvoiceView = lazy(() => import('@src/pages/invoice/view'))
const InvoiceEdit = lazy(() => import('@src/pages/invoice/edit'))

// EmailTemplate
const EmailTemplateList = lazy(() => import('@src/pages/emailTemplate/list'))
const EmailTemplateAdd = lazy(() => import('@src/pages/emailTemplate/add'))
const EmailTemplateEdit = lazy(() => import('@src/pages/emailTemplate/edit'))
const EmailTemplateView = lazy(() => import('@src/pages/emailTemplate/view'))

// CloudStorage
const CloudStorage = lazy(() => import('@src/pages/cloudStorage'))

const AppRoutes = [
  /* Contact */
  {
    path: `${adminRoot}/contact`,
    element: <ContactList />,
    meta: {
      id: 'contactApp'
    }
  },
  {
    path: `${adminRoot}/contact/view/:id`,
    element: <ContactView />,
    meta: {
      id: 'contactApp'
    }
  },
  /* User */
  {
    path: `${adminRoot}/user`,
    element: <UserList />,
    meta: {
      id: 'userApp'
    }
  },
  {
    path: `${adminRoot}/user/view/:id`,
    element: <UserView />,
    meta: {
      id: 'userApp'
    }
  },
  {
    path: `${adminRoot}/user/edit/:id`,
    element: <UserEdit />,
    meta: {
      id: 'userApp'
    }
  },
  /* Account Setting */
  {
    path: `${adminRoot}/account-setting`,
    element: <UserAccountSetting />,
    meta: {
      id: 'accountApp'
    }
  },
  /* Email */
  {
    path: `${adminRoot}/email`,
    element: <Email />,
    meta: {
      appLayout: true,
      className: 'email-application',
      id: 'emailApp'
    }
  },
  {
    path: `${adminRoot}/email/:folder`,
    element: <Email />,
    meta: {
      appLayout: true,
      className: 'email-application',
      id: 'emailApp'
    }
  },
  {
    path: `${adminRoot}/email/view/:id`,
    element: <EmailView />,
    meta: {
      layout: 'blank',
      id: 'emailApp'
    }
  },
  /* Chat */
  {
    path: `${adminRoot}/chat`,
    element: <Chat />,
    meta: {
      appLayout: true,
      className: 'chat-application',
      id: 'chatApp'
    }
  },
  /* Case */
  {
    path: `${adminRoot}/case`,
    element: <CaseList />,
    meta: {
      id: 'documentApp'
    }
  },
  {
    path: `${adminRoot}/case/view/:id`,
    element: <CaseView />,
    meta: {
      id: 'documentApp'
    }
  },
  /* Todo */
  {
    path: `${adminRoot}/todo`,
    element: <Todo />,
    meta: {
      appLayout: true,
      className: 'todo-application',
      id: 'taskApp'
    }
  },
  {
    path: `${adminRoot}/todo/:filter`,
    element: <Todo />,
    meta: {
      appLayout: true,
      className: 'todo-application',
      id: 'taskApp'
    }
  },
  {
    path: `${adminRoot}/todo/tag/:tag`,
    element: <Todo />,
    meta: {
      appLayout: true,
      className: 'todo-application',
      id: 'taskApp'
    }
  },
  /* Calendar */
  {
    path: `${adminRoot}/calendar`,
    element: <Calendar />,
    meta: {
      id: 'calendarApp'
    }
  },
  /* Timeline */
  {
    path: `${adminRoot}/timeline`,
    element: <Timeline />,
    meta: {
      id: 'respiteApp'
    }
  },
  /* Letter */
  {
    path: `${adminRoot}/letter`,
    element: <LetterList />,
    meta: {
      id: 'outboxApp'
    }
  },
  /* Invoice */
  {
    path: `${adminRoot}/invoice`,
    element: <InvoiceList />,
    meta: {
      id: 'billsApp'
    }
  },
  {
    path: `${adminRoot}/invoice/add`,
    element: <InvoiceAdd />,
    meta: {
      id: 'billsApp'
    }
  },
  {
    path: `${adminRoot}/invoice/view/:id`,
    element: <InvoiceView />,
    meta: {
      id: 'billsApp'
    }
  },
  {
    path: `${adminRoot}/invoice/edit/:id`,
    element: <InvoiceEdit />,
    meta: {
      id: 'billsApp'
    }
  },
  /* EmailTemplate */
  {
    path: `${adminRoot}/email-template`,
    element: <EmailTemplateList />,
    meta: {
      id: 'emailTemplateApp'
    }
  },
  {
    path: `${adminRoot}/email-template/add`,
    element: <EmailTemplateAdd />,
    meta: {
      id: 'emailTemplateApp'
    }
  },
  {
    path: `${adminRoot}/email-template/edit/:id`,
    element: <EmailTemplateEdit />,
    meta: {
      id: 'emailTemplateApp'
    }
  },
  {
    path: `${adminRoot}/email-template/view/:id`,
    element: <EmailTemplateView />,
    meta: {
      id: 'emailTemplateApp'
    }
  },
  /* CloudStorage */
  {
    path: `${adminRoot}/cloud-storage`,
    element: <CloudStorage />,
    meta: {
      appLayout: true,
      className: 'file-manager-application',
      id: 'cloudServerApp'
    }
  },
  {
    path: `${adminRoot}/cloud-storage/:slug`,
    element: <CloudStorage />,
    meta: {
      appLayout: true,
      className: 'file-manager-application',
      id: 'cloudServerApp'
    }
  }
]

export default AppRoutes
