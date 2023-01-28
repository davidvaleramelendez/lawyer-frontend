// ** Icons Import
import {
  Mic,
  Box,
  Mail,
  User,
  Send,
  Codepen,
  FileText,
  Settings,
  Calendar,
  HardDrive,
  Briefcase,
  Codesandbox,
  CheckCircle,
  CheckSquare,
  UploadCloud,
  MessageCircle,
  MessageSquare
} from 'react-feather'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

export default [
  {
    id: 'Apps-&-Menu',
    title: 'Apps & Menu',
    icon: <Box />,
    children: [
      {
        id: 'emailApp',
        title: 'E-Mail',
        icon: <Mail size={20} />,
        navLink: `${adminRoot}/email`
      },
      {
        id: 'documentApp',
        title: 'Documents',
        icon: <Briefcase size={20} />,
        navLink: `${adminRoot}/case`
      },
      {
        id: 'chatApp',
        title: 'Chat',
        icon: <MessageCircle size={20} />,
        navLink: `${adminRoot}/chat`
      },
      {
        id: 'taskApp',
        title: 'Aufgaben',
        icon: <CheckSquare size={20} />,
        navLink: `${adminRoot}/todo`
      },
      {
        id: 'calendarApp',
        title: 'Calendar',
        icon: <Calendar size={20} />,
        navLink: `${adminRoot}/calendar`
      },
      {
        id: 'respiteApp',
        title: 'Fristen',
        icon: <CheckCircle size={20} />,
        navLink: `${adminRoot}/timeline`
      },
      {
        id: 'outboxApp',
        title: 'Postausgang',
        icon: <Send size={20} />,
        navLink: `${adminRoot}/letter`
      },
      {
        id: 'importLetterFileApp',
        title: 'Import Letter File',
        icon: <UploadCloud size={20} />,
        navLink: `${adminRoot}/import-letter-file`
      },
      {
        id: 'voiceRecordingApp',
        title: 'Voice Recording',
        icon: <Mic size={20} />,
        navLink: `${adminRoot}/voice-recording`
      },
      {
        id: 'billsApp',
        title: 'Rechnungen',
        icon: <FileText size={20} />,
        navLink: `${adminRoot}/invoice`
      }
    ]
  },
  {
    id: 'Request-&-Settings',
    title: 'Request & Settings',
    icon: <Box />,
    children: [
      {
        id: 'contactApp',
        title: 'Anfrage',
        icon: <MessageSquare size={20} />,
        navLink: `${adminRoot}/contact`
      },
      {
        id: 'userApp',
        title: 'User',
        icon: <User size={20} />,
        navLink: `${adminRoot}/user`
      },
      {
        id: 'accountApp',
        title: 'Account',
        icon: <Settings size={20} />,
        navLink: `${adminRoot}/account-setting`
      },
      {
        id: 'emailTemplateApp',
        title: 'Email Template',
        icon: <Codepen size={20} />,
        navLink: `${adminRoot}/email-template`
      },
      {
        id: 'letterTemplateApp',
        title: 'Letter Template',
        icon: <Codesandbox size={20} />,
        navLink: `${adminRoot}/letter-template`
      },
      {
        id: 'cloudServerApp',
        title: 'Cloud Server',
        icon: <HardDrive size={20} />,
        navLink: `${adminRoot}/cloud-storage`
      },
      {
        id: 'calendarSettingApp',
        title: 'Calendar Setting',
        icon: <Calendar size={20} />,
        navLink: `${adminRoot}/dashboard#`
      }
    ]
  }
]
