// ** React Imports
import { lazy } from 'react'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// Contact
const ContactList = lazy(() => import('@src/pages/contact/list'))
const ContactView = lazy(() => import('@src/pages/contact/view'))

/* User */
const UserList = lazy(() => import('@src/pages/user/list'))

/* User edit */
const UserAdminEdit = lazy(() => import('@src/pages/user/edit/admin'))
const UserLawyerEdit = lazy(() => import('@src/pages/user/edit/lawyer'))
const UserPartnerEdit = lazy(() => import('@src/pages/user/edit/partner'))
const UserCustomerEdit = lazy(() => import('@src/pages/user/edit/customer'))
/* /User edit */

/* User view */
const UserAdminView = lazy(() => import('@src/pages/user/view/admin'))
const UserLawyerView = lazy(() => import('@src/pages/user/view/lawyer'))
const UserPartnerView = lazy(() => import('@src/pages/user/view/partner'))
const UserCustomerView = lazy(() => import('@src/pages/user/view/customer'))
/* /User view */
/* /User */

// Auth user profile
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

// Letter Template
const LetterTemplateList = lazy(() => import('@src/pages/letterTemplate/list'))
const LetterTemplateAdd = lazy(() => import('@src/pages/letterTemplate/add'))
const LetterTemplateEdit = lazy(() => import('@src/pages/letterTemplate/edit'))
const CaseLetterTemplateAdd = lazy(() => import('@src/pages/letterTemplate/caseLetter/add'))
const CaseLetterTemplateEdit = lazy(() => import('@src/pages/letterTemplate/caseLetter/edit'))

const AppRoutes = [
  /* Contact */
  {
    path: `${adminRoot}/contact`,
    element: <ContactList />,
    meta: {
      id: "contactApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/contact/view/:id`,
    element: <ContactView />,
    meta: {
      id: "contactApp",
      restrictRole: [11]
    }
  },

  /* User */
  {
    path: `${adminRoot}/user`,
    element: <UserList />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  /* User edit */
  {
    path: `${adminRoot}/user/admin/edit/:id`,
    element: <UserAdminEdit />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/user/lawyer/edit/:id`,
    element: <UserLawyerEdit />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/user/partner/edit/:id`,
    element: <UserPartnerEdit />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/user/customer/edit/:id`,
    element: <UserCustomerEdit />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  /* /User edit */
  /* User view */
  {
    path: `${adminRoot}/user/admin/view/:id`,
    element: <UserAdminView />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/user/lawyer/view/:id`,
    element: <UserLawyerView />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/user/partner/view/:id`,
    element: <UserPartnerView />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/user/customer/view/:id`,
    element: <UserCustomerView />,
    meta: {
      id: "userApp",
      restrictRole: [11]
    }
  },
  /* /User view */
  /* /User */

  /* Account Setting */
  {
    path: `${adminRoot}/account-setting`,
    element: <UserAccountSetting />,
    meta: {
      id: "accountApp"
    }
  },
  /* /Account Setting */

  /* Email */
  {
    path: `${adminRoot}/email`,
    element: <Email />,
    meta: {
      id: "emailApp",
      appLayout: true,
      className: "email-application",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/email/:folder`,
    element: <Email />,
    meta: {
      id: "emailApp",
      appLayout: true,
      className: "email-application",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/email/view/:id`,
    element: <EmailView />,
    meta: {
      id: "emailApp",
      layout: "blank",
      restrictRole: [11]
    }
  },
  /* /Email */

  /* Chat */
  {
    path: `${adminRoot}/chat`,
    element: <Chat />,
    meta: {
      id: "chatApp",
      appLayout: true,
      className: "chat-application",
      restrictRole: [11]
    }
  },
  /* /Chat */

  /* Case */
  {
    path: `${adminRoot}/case`,
    element: <CaseList />,
    meta: {
      id: "documentApp"
    }
  },
  {
    path: `${adminRoot}/case/view/:id`,
    element: <CaseView />,
    meta: {
      id: "documentApp"
    }
  },
  /* /Case */

  /* Todo */
  {
    path: `${adminRoot}/todo`,
    element: <Todo />,
    meta: {
      id: "taskApp",
      appLayout: true,
      className: "todo-application",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/todo/:filter`,
    element: <Todo />,
    meta: {
      id: "taskApp",
      appLayout: true,
      className: "todo-application",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/todo/tag/:tag`,
    element: <Todo />,
    meta: {
      id: "taskApp",
      appLayout: true,
      className: "todo-application",
      restrictRole: [11]
    }
  },
  /* /Todo */

  /* Calendar */
  {
    path: `${adminRoot}/calendar`,
    element: <Calendar />,
    meta: {
      id: "calendarApp"
    }
  },
  /* /Calendar */

  /* Timeline */
  {
    path: `${adminRoot}/timeline`,
    element: <Timeline />,
    meta: {
      id: "respiteApp",
      restrictRole: [11]
    }
  },
  /* /Timeline */

  /* Letter */
  {
    path: `${adminRoot}/letter`,
    element: <LetterList />,
    meta: {
      id: "outboxApp",
      restrictRole: [11]
    }
  },
  /* /Letter */

  /* Invoice */
  {
    path: `${adminRoot}/invoice`,
    element: <InvoiceList />,
    meta: {
      id: "billsApp"
    }
  },
  {
    path: `${adminRoot}/invoice/add`,
    element: <InvoiceAdd />,
    meta: {
      id: "billsApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/invoice/view/:id`,
    element: <InvoiceView />,
    meta: {
      id: "billsApp"
    }
  },
  {
    path: `${adminRoot}/invoice/edit/:id`,
    element: <InvoiceEdit />,
    meta: {
      id: "billsApp",
      restrictRole: [11]
    }
  },
  /* /Invoice */

  /* EmailTemplate */
  {
    path: `${adminRoot}/email-template`,
    element: <EmailTemplateList />,
    meta: {
      id: "emailTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/email-template/add`,
    element: <EmailTemplateAdd />,
    meta: {
      id: "emailTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/email-template/edit/:id`,
    element: <EmailTemplateEdit />,
    meta: {
      id: "emailTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/email-template/view/:id`,
    element: <EmailTemplateView />,
    meta: {
      id: "emailTemplateApp",
      restrictRole: [11]
    }
  },
  /* /EmailTemplate */

  /* CloudStorage */
  {
    path: `${adminRoot}/cloud-storage`,
    element: <CloudStorage />,
    meta: {
      id: "cloudServerApp",
      appLayout: true,
      className: "file-manager-application",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/cloud-storage/:slug`,
    element: <CloudStorage />,
    meta: {
      id: "cloudServerApp",
      appLayout: true,
      className: "file-manager-application",
      restrictRole: [11]
    }
  },
  /* /CloudStorage */

  /* Letter Template */
  {
    path: `${adminRoot}/letter-template`,
    element: <LetterTemplateList />,
    meta: {
      id: "letterTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/letter-template/add`,
    element: <LetterTemplateAdd />,
    meta: {
      id: "letterTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/letter-template/edit/:id`,
    element: <LetterTemplateEdit />,
    meta: {
      id: "letterTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/case/letter-template/add/:caseId/:letterTemplateId`,
    element: <CaseLetterTemplateAdd />,
    meta: {
      layout: "blank",
      id: "letterTemplateApp",
      restrictRole: [11]
    }
  },
  {
    path: `${adminRoot}/case/letter-template/edit/:caseId/:letterId`,
    element: <CaseLetterTemplateEdit />,
    meta: {
      layout: "blank",
      id: "letterTemplateApp",
      restrictRole: [11]
    }
  }
  /* /Letter Template */
]

export default AppRoutes
