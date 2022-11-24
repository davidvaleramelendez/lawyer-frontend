// ** React Imports
import { lazy } from 'react'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// Contact
const ContactList = lazy(() => import('@src/pages/contact'))
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
const CaseList = lazy(() => import('@src/pages/case'))
const CaseView = lazy(() => import('@src/pages/case/view'))

// Todo
const Todo = lazy(() => import('@src/pages/todo'))

// Calendar
const Calendar = lazy(() => import('@src/pages/calendar'))

// Timeline
const Timeline = lazy(() => import('@src/pages/timeline'))

// Letter
const Letter = lazy(() => import('@src/pages/letter'))

// Invoice
const Invoice = lazy(() => import('@src/pages/invoice'))
const InvoiceAdd = lazy(() => import('@src/pages/invoice/add'))
const InvoiceView = lazy(() => import('@src/pages/invoice/view'))
const InvoiceEdit = lazy(() => import('@src/pages/invoice/edit'))

// EmailTemplate
const EmailTemplate = lazy(() => import('@src/pages/emailTemplate'))
const EmailTemplateAdd = lazy(() => import('@src/pages/emailTemplate/add'))
const EmailTemplateEdit = lazy(() => import('@src/pages/emailTemplate/edit'))
const EmailTemplateView = lazy(() => import('@src/pages/emailTemplate/view'))

// CloudStorage
const CloudStorage = lazy(() => import('@src/pages/cloudStorage'))

const AppRoutes = [
  /* Contact */
  {
    path: `${adminRoot}/contact`,
    element: <ContactList />
  },
  {
    path: `${adminRoot}/contact/view/:id`,
    element: <ContactView />
  },
  /* User */
  {
    path: `${adminRoot}/user`,
    element: <UserList />
  },
  {
    path: `${adminRoot}/user/view/:id`,
    element: <UserView />
  },
  {
    path: `${adminRoot}/user/edit/:id`,
    element: <UserEdit />
  },
  {
    path: `${adminRoot}/account-setting`,
    element: <UserAccountSetting />
  },
  /* Email */
  {
    path: `${adminRoot}/email`,
    element: <Email />,
    meta: {
      appLayout: true,
      className: 'email-application'
    }
  },
  {
    path: `${adminRoot}/email/:folder`,
    element: <Email />,
    meta: {
      appLayout: true,
      className: 'email-application'
    }
  },
  {
    path: `${adminRoot}/email/view/:id`,
    element: <EmailView />,
    meta: {
      layout: 'blank'
    }
  },
  /* Chat */
  {
    path: `${adminRoot}/chat`,
    element: <Chat />,
    meta: {
      appLayout: true,
      className: 'chat-application'
    }
  },
  /* Case */
  {
    path: `${adminRoot}/case`,
    element: <CaseList />
  },
  {
    path: `${adminRoot}/case/view/:id`,
    element: <CaseView />
  },
  /* Todo */
  {
    path: `${adminRoot}/todo`,
    element: <Todo />,
    meta: {
      appLayout: true,
      className: 'todo-application'
    }
  },
  {
    path: `${adminRoot}/todo/:filter`,
    element: <Todo />,
    meta: {
      appLayout: true,
      className: 'todo-application'
    }
  },
  {
    path: `${adminRoot}/todo/tag/:tag`,
    element: <Todo />,
    meta: {
      appLayout: true,
      className: 'todo-application'
    }
  },
  /* Calendar */
  {
    path: `${adminRoot}/calendar`,
    element: <Calendar />
  },
  /* Timeline */
  {
    path: `${adminRoot}/timeline`,
    element: <Timeline />
  },
  /* Letter */
  {
    path: `${adminRoot}/letter`,
    element: <Letter />
  },
  /* Invoice */
  {
    path: `${adminRoot}/invoice`,
    element: <Invoice />
  },
  {
    path: `${adminRoot}/invoice/add`,
    element: <InvoiceAdd />
  },
  {
    path: `${adminRoot}/invoice/view/:id`,
    element: <InvoiceView />
  },
  {
    path: `${adminRoot}/invoice/edit/:id`,
    element: <InvoiceEdit />
  },
  /* EmailTemplate */
  {
    path: `${adminRoot}/email-template`,
    element: <EmailTemplate />
  },
  {
    path: `${adminRoot}/email-template/add`,
    element: <EmailTemplateAdd />
  },
  {
    path: `${adminRoot}/email-template/edit/:id`,
    element: <EmailTemplateEdit />
  },
  {
    path: `${adminRoot}/email-template/view/:id`,
    element: <EmailTemplateView />
  },
  /* CloudStorage */
  {
    path: `${adminRoot}/cloud-storage`,
    element: <CloudStorage />,
    meta: {
      appLayout: true,
      className: 'file-manager-application'
    }
  },
  {
    path: `${adminRoot}/cloud-storage/:slug`,
    element: <CloudStorage />,
    meta: {
      appLayout: true,
      className: 'file-manager-application'
    }
  }
]

export default AppRoutes
