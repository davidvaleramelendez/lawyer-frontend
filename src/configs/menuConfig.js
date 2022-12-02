// You can customize the layout of dashboard per user's role

const menuConfig = {
  Admin: {
    emailApp: false,
    documentApp: true,
    chatApp: true,
    taskApp: true,
    calendarApp: true,
    respiteApp: true,
    outboxApp: true,
    billsApp: true,
    contactApp: true,
    userApp: true,
    accountApp: true,
    emailTemplateApp: true,
    cloudServerApp: true
  },
  Lawyer: {
    emailApp: true,
    documentApp: true,
    chatApp: true,
    taskApp: true,
    calendarApp: true,
    respiteApp: true,
    outboxApp: true,
    billsApp: true,
    contactApp: true,
    userApp: true,
    accountApp: true,
    emailTemplateApp: true,
    cloudServerApp: true
  },
  Partner: {
    emailApp: true,
    documentApp: true,
    chatApp: true,
    taskApp: true,
    calendarApp: true,
    respiteApp: true,
    outboxApp: true,
    billsApp: true,
    contactApp: true,
    userApp: true,
    accountApp: true,
    emailTemplateApp: true,
    cloudServerApp: true
  },
  Customer: {
    emailApp: true,
    documentApp: true,
    chatApp: true,
    taskApp: true,
    calendarApp: true,
    respiteApp: true,
    outboxApp: true,
    billsApp: true,
    contactApp: true,
    userApp: true,
    accountApp: true,
    emailTemplateApp: true,
    cloudServerApp: true
  }
}

export default menuConfig
