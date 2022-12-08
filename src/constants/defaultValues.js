export const root = '/'
export const adminRoot = '/apps'

// Local storage variables
export const storageUserKeyName = 'userData'
export const storageTokenKeyName = 'accessToken'
export const storageRefreshTokenKeyName = 'refreshToken'
export const storageTokenExpiresKeyName = 'tokenExpires'
export const storageLoggedAtKeyName = 'loggedAt'
export const storageRememberMeAuth = "LWY_KP_329"
export const storageTotalNumberName = "totalNubmer"
export const storageSiteSetting = "siteSetting"
export const storageTimeCounter = "timecounter"

/* Hexadecimal key for encryption */
export const cryptoKey = '731fc6d09baf51f8361fa6408f306ca9'
export const cryptoIv = '676d073fdac3ebc550290f58c6f9d0b7'

/* Loader color */
export const loaderColor = "primary"
/* /Loader color */

/* Used for datatable display entries */
export const defaultPerPageRow = 10

export const perPageRowItems = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 }
]
/* /Used for datatable display entries */

/* User for badge color */
export const roleColors = {
    10: 'light-danger',
    11: 'light-primary',
    12: 'light-primary',
    14: 'light-success'
}
/* /User for badge color */

/* Status */
export const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" }
]
/* /Status */

/* Case */
export const caseStatus = [
    { label: "Open", value: "Open" },
    { label: "Close", value: "Close" },
    { label: "Hold", value: "Hold" }
]

/* Calendar */
export const calendarFilter = [
    { label: 'My Appointments', value: "my_appointments", color: 'primary', className: 'form-check-primary mb-1' },
    { label: "Court Date", value: "court_date", color: "danger", className: "form-check-danger mb-1" },
    { label: "Holiday", value: "holiday", color: "success", className: "form-check-success mb-1" }
]

/* Calendar, CalendarColors */
export const calendarFilterColor = {
    my_appointments: 'primary',
    court_date: 'danger',
    holiday: 'success'
}

/* Bill (Invoice) */
export const paymentMethod = [
    { value: "bank_account", label: "IBAN" },
    { value: "paypal", label: "Bar" }
]


/* Total Number Titles */
export const TN_CASES = "case"
export const TN_OUTBOX = "outbox"
export const TN_INVOICE = "invoice"
export const TN_CONTACT = "contact"
export const TN_USER = "user"
export const TN_EMAIL_TEMPLATE = "email_template"
export const TN_CHAT = "chat"
export const TN_CHAT_CONTACT = "chat_contact"
export const TN_TASK = "task"