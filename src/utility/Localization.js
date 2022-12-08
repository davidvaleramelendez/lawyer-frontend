import { getCurrentUser, getLanguageLabels } from "./Utils"


export const L10nKeys = {
    //** Menus
    Dashboards: 'Dashboards',
    Email: 'Email',
    Documents: 'Documents',
    Chat: 'Chat',
    Task: 'Task',
    Calendar: 'Calendar',
    Respites: 'Respites',
    Outbox: 'Outbox',
    Bills: 'Bills',
    Inquiry: 'Inquiry',
    Contact: 'Contact',
    Account: 'Account',
    User: 'User',
    EmailTemplate: 'Email Template',
    CloudServer: 'Cloud Server',
    CalendarSetting: 'Calendar Setting',
    //** /Menus

    //** Dashboards
    Hello: 'Hello',
    YouHave: 'You have',
    OpenCases: 'Open cases',
    ViewAllCases: 'View all cases',
    DashboardOverview: 'Dashboard Overview',
    Statistics: 'Statistics',
    OpenTicket: 'Open ticket',
    OpenInvoices: 'Open invoices',
    AmountsOutstanding: 'Amounts outstanding',
    TodoList: 'Todo List',
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
    See_All: 'See all',
    File: 'File',
    Client: 'Client',
    Lawyer: 'Lawyer',
    TakeoverDate: 'Takeover Date',
    Stage: 'Stage',
    NewInquiry: 'New inquiry',
    InvoiceNo: 'Invoice No.',
    Total: 'Total',
    DueDate: 'Due date',
    OpenAmount: 'Open amount',
    NewChats: 'New Chats',
    NoChatsFound: 'No chats found',
    //** /Dashboard

    //** Email App
    Inbox: 'Inbox',
    Draft: 'Drafts',
    Important: 'Important',
    Spam: 'Spam',
    Sent: 'Sent',
    Trash: 'Trash',
    Compose: 'Compose',
    SearchEmail: 'Search email',
    SelectAll: 'Select All',
    NoItemsFound: 'No Items Found',
    NoSubject: 'no subject',
    ComposeMail: 'Compose Mail',
    Subject: 'Subject',
    To: 'To',
    Message: 'Message',
    Select: 'Select',
    Send: 'Send',
    Save: 'Save',
    ToEmailIsRequired: 'To email is required!',
    //** /Email App

    //** Documents App
    Show: 'Show',
    Search: 'Search',
    SearchCase: 'Search Case',
    SelectStatus: 'Select Status',
    Hold: 'Hold',
    Open: 'Open',

    Name: 'Name',
    LastName: 'Last Name',
    Client: 'Client',
    Stadium: 'Stadium',
    Group: 'Group',
    Land: 'Land',
    Telephone: 'Telephone',
    E_Mail: 'E-Mail',
    Date: 'Date',
    Address: 'Address',
    Surname: 'Surname',
    Updated: 'Updated',
    UploadDocument: 'Upload document',
    WriteALetterNow: 'Write a letter now',
    AddTimeTracking: 'Add Time Tracking',
    AddANote: 'Add a note',
    DetailsOnFile: 'Details on file',

    Subject: 'Subject',
    Done: 'Done',
    Action: 'Action',

    Opponent: 'Opponent',
    History: 'History',
    Details: 'Details',
    Lawyer: 'Lawyer',

    Title: 'Title',
    Content: 'Content',
    Message: 'Message',
    Files: 'Files',
    File: 'File',

    Add: 'Add',
    Record: 'Record',
    of: 'of',
    View: 'View',
    Upload: 'Upload',
    Download: 'Download',
    document: 'document',
    Create: 'Create',
    Delete: 'Delete',
    WriteLetter: 'Write letter',
    AddNotesOrFile: 'Add notes or file',
    AddNotes: 'Add notes',
    AddFile: 'Add file',
    SendEMail: 'Send E-Mail',
    Now: 'now',
    EnterTheTime: 'Enter the time',
    NameIsRequired: 'Name is required!',
    InvalidEmailAddress: 'Invalid email address!',
    TelephoneIsRequired: 'Telephone is required!',
    AttorneyIsRequired: 'Attorney is required!',
    GroupIsRequired: 'Group is required!',
    StatusIsRequired: 'Status is required!',
    LastNameIsRequired: 'Last Name is required!',
    EmailIsRequired: 'Email is required!',
    Attorney: 'Attorney',
    TelephoneMustBe10Digit: 'Telephone must be 10 digit!',
    City: 'City',
    PostalCode: 'Postal code',
    SelectAttorney: 'Select Attorney',
    SelectGroup: 'Select Group',
    Submit: 'Submit',
    Cancel: 'Cancel',
    Country: 'Country',

    ReferenceNumber: 'Reference Number',
    Status: 'Status',
    //** /Documents App

    //** Chat App
    Chats: 'Chats',
    Contacts: 'Contacts',
    SearchOrStartNewAChat: 'Search or start new a chat',
    StartConversation: 'Start Conversation',
    //** /Chat App
    
    //** Task App
    MyTask: 'My Tasks',
    Completed: 'Completed',
    Deleted: 'Deleted',
    Tags: 'Tags',
    Team: 'Team',
    Update: 'Update',
    SearchTask: 'Search Task',
    SortAZ: 'Sort A-Z',
    SortZA: 'Sort Z-A',
    SortAssignee: 'Sort Assignee',
    SortDueDate: 'Sort Due Date',
    ResetSort: 'Reset Sort',
    // Important: 'Important', // already defined
    // Low: 'Low', // already defined
    // Medium: 'Medium', // already defined
    // High: 'High', // already defined
    //** /Task App

    //** Calendar App
    Register: 'Register',
    Filter: 'Filter',
    ViewAll: 'View All',
    MyAppointments: 'My Appointments',
    CourtDate: 'Court Date',
    Holiday: 'Holiday',
    Month: 'Month',
    Week: 'Week',
    Day: 'Day',
    List: 'List',
    //** /Calendar App

    //** Respites App
    LetterDeadline: 'Letter Deadline',
    InvoiceDeadline: 'Invoice Deadline',
    SearchLetter: 'Search Letter',
    SearchInvoice: 'Search Invoice',
    Case: 'Case',
    CaseType: 'Case Type',
    FirstAnniversary: 'First anniversary',
    PDFDocument: 'PDF document',
    DeadlineDate: 'Deadline Date',
    // ReferenceNumber: 'Reference Number', // already defined
    // Done: 'Done', // already defined
    Amount: 'Amount',
    // File: 'File', // already defined
    // Subject: 'Subject', // already defined
    //** /Respites App
    
    //** Outbox App
    DATE: 'DATE',
    SUBJECT: 'SUBJECT',
    PRINTED: 'PRINTED',
    DONE: 'DONE',
    VIEW: 'VIEW',
    // Show: 'Show', // already defined
    // Search: 'Search', // already defined
    // SearchLetter: 'Search Letter', // already defined
    // ReferenceNumber: 'REFERENCE NUMBER', // already defined
    //** /Outbox App
    
    //** Bills App
    CreateInvoice: 'Create Invoice',
    INVOICE_NUMBER: 'INVOICE_NUMBER',
    DUE_DATE: 'DUE DATE', // already defined
    Showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    // DueDate: 'Due Date', // already defined
    // Total: 'Total', // already defined
    // Show: 'Show', // already defined
    // Search: 'Search', // already defined
    // SelectStatus: 'Select Status', // already defined
    // STATUS: 'STATUS', // already defined
    // CLIENT: 'CLIENT', // already defined
    // TOTAL: 'TOTAL', // already defined
    // ACTION: 'ACTION', // already defined
    //** /Bills App

    //** Inquiry App
    AddContact: 'Add Contact',
    SearchContact: 'Search Contact',
    TICKET: 'TICKET',
    NAME: 'NAME',
    EMAIL: 'EMAIL',
    ThereAreNoRecordsToDisplay: 'There are no records to display',
    // Show: 'Show', // already defined
    // Search: 'Search', // already defined
    // ACTION: 'ACTION', // already defined
    //** /Inquiry App
    
    //** Contact App
    //** /Contact App

    //** User App
    Admin: 'Admin',
    Partner: 'Partner',
    Customer: 'Customer',
    SearchFilter: 'Search & Filter',
    Entries: 'Entries',
    SearchUser: 'Search User',
    SelectRole: 'Select Role',
    AddNewUser: 'Add New User',
    NAME: 'NAME',
    EMAIL: 'EMAIL', // already defined
    ROLE: 'ROLE',
    CONTACT: 'CONTACT',
    Lawyer: 'Lawyer',
    // Show: 'Show', // already defined
    // Search: 'Search', // already defined
    // STATUS: 'STATUS', // already defined
    // ACTION: 'ACTION', // already defined
    //** /User App

    //** Account App
    // Account: 'Account', // already defined
    Change: 'Change',
    Username: 'Username',
    Name: 'Name',
    Company: 'Company',
    Language: 'Language',
    SaveChange: 'Save Change',
    LanguageLabels: 'Language Labels',
    Menu: 'Menu',
    Pages: 'Pages',
    Common: 'Common',
    Errors: 'Errors',
    IMAPInformation: 'IMAP information',
    IMAPHost: 'IMAP Host',
    IMAPPort: 'IMAP Port',
    Secure: 'Secure',
    UseSSL: 'Use SSL',
    IMAPEmail: 'IMAP Email',
    IMAPPassword: 'IMAP Password',
    // Email: 'Email', // already defined
    SelectRole: 'Select Role',
    RoleIsRequired: 'Role is required!',
    //** /Account App

    //** Email Template App
    AddEmailTemplate: 'Add Email Template',
    SearchEmailTemplate: 'Search Email Template',
    // Show: 'Show', // already defined
    // Search: 'Search', // already defined
    // SUBJECT: 'SUBJECT', // already defined
    // STATUS: 'STATUS', // already defined
    // ACTION: 'ACTION', // already defined
    // Showing: 'Showing', // already defined
    // to: 'to', // already defined
    // of: 'of', // already defined
    // entries: 'entries', // already defined
    //** /Email Template App

    //** Cloud Server App
    AddNew: 'Add New',
    MyDrive: 'My Drive',
    Recents: 'Recents',
    STOREAGE_STATUS: 'STORAGE STATUS',
    usedOf: 'used of',
    Filename: 'Filename',
    Created: 'Created',
    Actions: 'Actions',
    // Important: 'Important', // already defined
    // Trash: 'Trash', // already defined
    // Search: 'Search', // already defined
    //** /Cloud Server App

    //** UI Setting
    ThemeCustomizer: 'Theme Customizer',
    CusomizePreviewInRealTime: 'Customize & Preview in Real Time',
    Skin: 'Skin',
    Bordered: 'Bordered',
    Dark: 'Dark',
    SemiDark: 'Semi Dark',
    ContentWidth: 'Content Width',
    FullWidth: 'Full Width',
    Boxed: 'Boxed',
    MenuCollapsed: 'Menu Collapsed',
    MenuHidden: 'Menu Hidden',
    NavbarColor: 'Navbar Color',
    NavbarType: 'Navbar Type',
    Floating: 'Floating',
    Sticky: 'Sticky',
    Static: 'Static',
    Hidden: 'Hidden',
    FooterType: 'Footer Type',
    ApplySave: 'Apply & Save',

    //** /UI Setting

    //** Common
    APPS_MENU: 'APPS & MENU',
    REQUEST_SETTINGS: 'REQUEST & SETTINGS',
    Profile: 'Profile',
    Logout: 'Logout',
    //** /Common

    //** Error    
    Success: 'Success',
    Failed: 'Failed',
    Error: 'Error',
    Warning: 'Warning',
    //** /Error

    Status: 'Status',
    Action: 'Action'
}

export const L10nOrgKeys = {
    Menu: ['Email', 'Documents', 'Chat', 'Task', 'Calendar', 'Respites', 'Outbox', 'Bills', 'Inquiry', 'Contact', 'User', 'Account', 'EmailTemplate', 'CloudServer', 'CalendarSetting'],
    Dashboards: ['Hello', 'YouHave', 'OpenCases', 'ViewAllCases', 'DashboardOverview', 'Statistics', 'OpenTicket', 'OpenInvoices', 'AmountsOutstanding', 'TodoList', 'Low', 'Medium', 'High', 'See_All', 'File', 'Client', 'Lawyer', 'TakeoverDate', 'Stage', 'NewInquiry', 'InvoiceNo', 'Total', 'DueDate', 'OpenAmount', 'NewChats', 'NoChatsFound'],
    Pages: {
        Email: ['Inbox', 'Draft', 'Important', 'Spam', 'Sent', 'Trash', 'Compose', 'SearchEmail', 'SelectAll', 'NoItemsFound', 'NoSubject', 'ComposeMail', 'Subject', 'To', 'Message', 'Select', 'Send', 'Save', 'ToEmailIsRequired'],
        Documents: [
                'Show', 'Search', 'SearchCase', 'SelectStatus', 'Hold', 
                'Open', 'Name', 'LastName', 'Client', 'Stadium', 
                'Group', 'Land', 'Telephone', 'E_Mail', 'Date', 
                'Address', 'Surname', 'Updated', 'UploadDocument', 'WriteALetterNow', 
                'AddTimeTracking', 'AddANote', 'DetailsOnFile', 'Subject', 'Done', 
                'Action', 'Opponent', 'History', 'Details', 'Lawyer', 
                'Title', 'Content', 'Message', 'Files', 'File', 
                'Add', 'Record', 'of', 'View', 'Upload', 
                'Download', 'document', 'Create', 'Delete', 'WriteLetter', 
                'AddNotesOrFile', 'AddNotes', 'AddFile', 'SendEMail', 'Now', 
                'EnterTheTime', 'NameIsRequired', 'InvalidEmailAddress', 'TelephoneIsRequired', 'AttorneyIsRequired', 
                'GroupIsRequired', 'StatusIsRequired', 'LastNameIsRequired', 'EmailIsRequired', 'Attorney', 
                'TelephoneMustBe10Digit', 'City', 'PostalCode', 'SelectAttorney', 'SelectGroup', 
                'Submit', 'Cancel', 'Country', 'ReferenceNumber', 'Status'
        ],
        Chat: ['Chats', 'Contacts', 'SearchOrStartNewAChat', 'StartConversation'],
        Task: ['MyTask', 'Completed', 'Deleted', 'Tags', 'Team', 'Update', 'SearchTask', 'SortAZ', 'SortZA', 'SortAssignee', 'SortDueDate', 'ResetSort', 'Important', 'Low', 'Medium', 'High'],
        Calendar: ['Register', 'Filter', 'ViewAll', 'MyAppointments', 'CourtDate', 'Holiday', 'Month', 'Week', 'Day', 'List'],
        Respites: ['LetterDeadline', 'InvoiceDeadline', 'SearchLetter', 'SearchInvoice', 'Case', 'CaseType', 'FirstAnniversary', 'PDFDocument', 'DeadlineDate', 'ReferenceNumber', 'Done', 'File', 'Amount', 'Subject'],
        Outbox: ['DATE', 'SUBJECT', 'PRINTED', 'DONE', 'VIEW', 'Show', 'Search', 'SearchLetter', 'ReferenceNumber'],
        Bills: ['CreateInvoice', 'INVOICE_NUMBER', 'DUE_DATE', 'Showing', 'to', 'of', 'entries', 'Total', 'DueDate', 'Show', 'Search', 'SelectStatus', 'STATUS', 'CLIENT', 'TOTAL', 'ACTION'],
        Inquiry: ['AddContact', 'SearchContact', 'TICKET', 'NAME', 'EMAIL', 'ThereAreNoRecordsToDisplay', 'Show', 'Search', 'ACTION'],
        Contact: [],
        User: ['Admin', 'Lawyer', 'Partner', 'Customer', 'SearchFilter', 'Entries', 'SearchUser', 'SelectRole', 'AddNewUser', 'NAME', 'EMAIL', 'ROLE', 'CONTACT', 'Show', 'Search', 'STATUS', 'ACTION'],
        Account: [
            'Change', 'Username', 'Name', 'Company', 'Language', 
            'SaveChange', 'LanguageLabels', 'Menu', 'Dashboards', 'Pages', 
            'Common', 'Errors', 'IMAPInformation', 'IMAPHost', 'IMAPPort', 
            'Secure', 'UseSSL', 'IMAPEmail', 'IMAPPassword', 'Email', 
            'SelectRole', 'RoleIsRequired'
        ],
        EmailTemplate: ['AddEmailTemplate', 'SearchEmailTemplate', 'Show', 'Search', 'SUBJECT', 'STATUS', 'ACTION', 'Showing', 'to', 'of', 'entries'],
        CloudServer: ['AddNew', 'MyDrive', 'Recents', 'STOREAGE_STATUS', 'usedOf', 'Filename', 'Created', 'Actions', 'Important', 'Trash', 'Search'],
        CalendarSetting: []
    },
    'UI Setting': ['ThemeCustomizer', 'CusomizePreviewInRealTime', 'Skin', 'Bordered', 'Dark', 'SemiDark', 'ContentWidth', 'FullWidth', 'Boxed', 'MenuCollapsed', 'MenuHidden', 'NavbarColor', 'NavbarType', 'Floating', 'Sticky', 'Static', 'Hidden', 'FooterType', 'ApplySave'],
    Common: ['APPS_MENU', 'REQUEST_SETTINGS', 'Profile', 'Logout'],
    Errors: ['Success', 'Failed', 'Error', 'Warning']
}

export const L10nMenuItemIDKeys = {
    Email: 'emailApp',
    Documents: 'documentApp',
    Chat: 'chatApp',
    Task: 'taskApp',
    Calendar: 'calendarApp',
    Respites: 'respiteApp',
    Outbox: 'outboxApp',
    Bills: 'billsApp',
    Contact: 'contactApp',
    User: 'userApp',
    Account: 'accountApp',
    EmailTemplate: 'emailTemplateApp',
    CloudServer: 'cloudServerApp'
}

export const getDefaultLanguageLabels = () => {
    const labels = {
        English: {}
    }
    Object.keys(L10nKeys).forEach(key => {
        const origin = L10nKeys[key]
        labels.English[origin] = origin
    })

    return labels
}

export const T = (origin) => {
    const userItem = getCurrentUser()
    const language = userItem ? userItem.language : 'English'
    let labels = getLanguageLabels()
    if (!labels) {
        labels = getDefaultLanguageLabels()
    }

    if (labels[language] === undefined || labels[language][origin] === undefined) {
        return origin
    }

    return labels[language][origin]
}