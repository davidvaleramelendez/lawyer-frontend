// You can customize the layout of dashboard per user's role

const menuConfig = {
  Admin: {
    Email: true,
    Documents: true,
    Chat: true,
    Task: true,
    Calendar: true,
    Respites: true,
    Outbox: true,
    Bill: true,
    Inquiry: true,
    User: true,
    Account: true,
    Email_Template: true,
    Cloud_Server: true
  },
  Lawyer: {
    Email: true,
    Documents: true,
    Chat: true,
    Task: true,
    Calendar: true,
    Respites: true,
    Outbox: true,
    Bill: true,
    Inquiry: true,
    User: true,
    Account: true,
    Email_Template: true,
    Cloud_Server: true
  },
  Partner: {
    Email: true,
    Documents: true,
    Chat: true,
    Task: true,
    Calendar: true,
    Respites: true,
    Outbox: true,
    Bill: true,
    Inquiry: true,
    User: true,
    Account: true,
    Email_Template: true,
    Cloud_Server: true
  },
  Customer: {
    Email: true,
    Documents: true,
    Chat: true,
    Task: true,
    Calendar: true,
    Respites: true,
    Outbox: true,
    Bill: true,
    Inquiry: true,
    User: true,
    Account: true,
    Email_Template: true,
    Cloud_Server: true
  }
}

export default menuConfig
