// ** Icons Import
import {
  Mic,
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
  MessageCircle,
  MessageSquare
} from 'react-feather'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

export default [
  {
    id: 'calendarApp',
    title: 'Calendar',
    icon: <Calendar size={20} />,
    navLink: `${adminRoot}/calendar`
  },
  {
    header: 'Apps & Menu'
  },
  {
    id: 'userApp',
    title: 'User',
    icon: <User size={20} />,
    navLink: `${adminRoot}/user`
  },
  {
    id: 'emailApp',
    title: 'Email',
    icon: <Mail size={20} />,
    navLink: `${adminRoot}/email`
  },
  {
    id: 'documentApp',
    title: 'Cases',
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
    title: 'Task',
    icon: <CheckSquare size={20} />,
    navLink: `${adminRoot}/todo`
  },
  {
    id: 'respiteApp',
    title: 'Deadline',
    icon: <CheckCircle size={20} />,
    navLink: `${adminRoot}/timeline`
  },
  {
    id: 'outboxApp',
    title: 'Outbox',
    icon: <Send size={20} />,
    navLink: `${adminRoot}/letter`
  },
  {
    id: 'voiceRecordingApp',
    title: 'Voice Recording',
    icon: <Mic size={20} />,
    navLink: `${adminRoot}/voice-recording`
  },
  {
    id: 'billsApp',
    title: 'Bills',
    icon: <FileText size={20} />,
    navLink: `${adminRoot}/invoice`
  },
  {
    id: 'cloudServerApp',
    title: 'Cloud-Storage',
    icon: <HardDrive size={20} />,
    navLink: `${adminRoot}/cloud-storage`
  },
  {
    id: 'contactApp',
    title: 'Inquiry',
    icon: <MessageSquare size={20} />,
    navLink: `${adminRoot}/contact`
  },
  {
    header: 'Einstellungen'
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
    id: 'calendarSettingApp',
    title: 'Calendar Setting',
    icon: <Calendar size={20} />,
    navLink: `${adminRoot}/dashboard#`
  }
]
