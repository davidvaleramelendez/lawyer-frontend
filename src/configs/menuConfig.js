// You can customize the layout of dashboard per user's role

const menuConfig = {
  Admin: {
    Inquiry: false,
    Chat: true,
    Invoice: false,
    Documents: true,
    Task: true
  },
  Lawyer: {
    Inquiry: true,
    Chat: true,
    Invoice: true,
    Documents: true,
    Task: true
  },
  Partner: {
    Inquiry: true,
    Chat: true,
    Invoice: true,
    Documents: true,
    Task: true
  },
  Customer: {
    Inquiry: true,
    Chat: true,
    Invoice: true,
    Documents: true,
    Task: true
  }
}

export default menuConfig
