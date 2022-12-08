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
    SeeAll: 'See all',
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
    NoChatsFound1: 'No chats found',
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
    // Client: 'Client',
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
    // Subject: 'Subject',
    Done: 'Done',
    Action: 'Action',
    Opponent: 'Opponent',
    History: 'History',
    Details: 'Details',
    // Lawyer: 'Lawyer',
    Title: 'Title',
    Content: 'Content',
    // Message: 'Message',
    Files: 'Files',
    // File: 'File',
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
    LoadMore: 'Load More',
    ViewContact: 'View Contact',
    ClearChat: 'Clear Chat',
    // Send: 'Send',
    NoChatsFound2: 'No Chats Found',
    Settings: 'Settings',
    Notification: 'Notification',
    InviceFriends: 'Invite Friends',
    PersonalInformation: 'Personal Information',
    //** /Chat App
    
    //** Task App
    MyTasks: 'My Tasks',
    Completed: 'Completed',
    Deleted: 'Deleted',
    Tags: 'Tags',
    Team: 'Team',
    Update: 'Update',
    SearchTask: 'Search task',
    SortAZ: 'Sort A-Z',
    SortZA: 'Sort Z-A',
    SortAssignee: 'Sort Assignee',
    SortDueDate: 'Sort Due Date',
    ResetSort: 'Reset Sort',
    AddTask: 'Add Task',
    AreYouSure: 'Are you sure?',
    YouWontBeAbleToRevertThis: "You won't be able to revert this!",
    YouCanAlsoRevertThis: 'You can also revert this!',
    YesDeleteIt: 'Yes, delete it!',
    // NoItemsFound: 'No Items Found',
    // Title: 'Title',
    TitleIsRequired: 'Title is required!',
    SelectAssignee: 'Select Assignee',
    AssigneeIsRequired: 'Assignee is required!',
    DueDateIsRequired: 'Due date is required!',
    SelectTag: 'Select Tag',
    TagIsRequired: 'Tag is required!',
    Description: 'Description',
    MarkComplete: 'Mark Complete',
    // Delete: 'Delete',
    // Cancel: 'Cancel',
    // DueDate: 'Due Date',
    Assignee: 'Assignee',
    // Important: 'Important',
    // Low: 'Low',
    // Medium: 'Medium',
    // High: 'High',
    //** /Task App

    //** Calendar App
    Register: 'Register',
    Filter: 'Filter',
    ViewAll: 'View All',
    MyAppointments: 'My Appointments',
    CourtDate: 'Court Date',
    Holiday: 'Holiday',
    // Title: 'Title',
    // TitleIsRequired: 'Title is required!',
    StartDate: 'Start Date',
    EndDate: 'End Date',
    Guests: 'Guests',
    Label: 'Label',
    SelectLabel: 'Select Label',
    LabelIsRequired: 'Label is required!',
    StartDateIsRequired: 'Start date is required!',
    EndDateIsRequired: 'End date is required!',
    SelectGuest: 'Select Guest',
    GuestIsRequired: 'Guest is required!',
    InvalidAppointmentUrl: 'Invalid appointment url!',
    EnterLocation: 'Enter location',
    // Description: 'Description',
    // AreYouSure: 'Are you sure?',
    // YouWontBeAbleToRevertThis: "You won't be able to revert this!",
    // YesDeleteIt: 'Yes, delete it!',
    AllDay: 'All Day',
    AppointmentURL: 'Appointment URL',
    AddLocation: 'Add Location',
    AppointmentDescription: 'Appointment Description',
    // Add: 'Add',
    AddEvent: 'Add Event',
    UpdateEvent: 'Update Event',
    //** /Calendar App

    //** Respites App
    FirstAnniversary: 'First anniversary',
    // File: 'File',
    DeadlineDate: 'Deadline Date',
    Amount: 'Amount',
    // Done: 'Done',
    LetterDeadline: 'Letter Deadline',
    // Subject: 'Subject',
    PDFDocuments: 'PDF documents',
    Referencenumber: 'Reference number',
    InvoiceDeadline: 'Invoice Deadline',
    SearchLetter: 'Search Letter',
    SearchInvoice: 'Search Invoice',
    // AreYouSure: 'Are you sure?',
    YouWantToDoneThisTimeline: 'You want to Done this timeline?',
    Yes: 'Yes',
    //** /Respites App
    
    //** Outbox App
    DATE: 'DATE',
    SUBJECT: 'SUBJECT',
    PRINTED: 'PRINTED',
    DONE: 'DONE',
    VIEW: 'VIEW',
    // Show: 'Show',
    // Search: 'Search',
    // SearchLetter: 'Search Letter',
    // ReferenceNumber: 'REFERENCE NUMBER',
    //** /Outbox App
    
    //** Bills App
    CreateInvoice: 'Create Invoice',
    INVOICE_NUMBER: 'INVOICE_NUMBER',
    DUE_DATE: 'DUE DATE',
    Showing: 'Showing',
    to: 'to',
    // of: 'of',
    entries: 'entries',
    // DueDate: 'Due Date',
    // Total: 'Total',
    // Show: 'Show',
    // Search: 'Search',
    // SelectStatus: 'Select Status',
    // STATUS: 'STATUS',
    // CLIENT: 'CLIENT',
    // TOTAL: 'TOTAL',
    // ACTION: 'ACTION',
    //** /Bills App

    //** Inquiry App
    AddContact: 'Add Contact',
    SearchContact: 'Search Contact',
    TICKET: 'TICKET',
    NAME: 'NAME',
    EMAIL: 'EMAIL',
    ThereAreNoRecordsToDisplay: 'There are no records to display',
    // Show: 'Show',
    // Search: 'Search',
    // ACTION: 'ACTION',
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
    EMAIL: 'EMAIL',
    ROLE: 'ROLE',
    CONTACT: 'CONTACT',
    // Lawyer: 'Lawyer',
    // Show: 'Show',
    // Search: 'Search',
    // STATUS: 'STATUS',
    // ACTION: 'ACTION',
    //** /User App

    //** Account App
    // Account: 'Account',
    Change: 'Change',
    Username: 'Username',
    // Name: 'Name',
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
    // Email: 'Email',
    SelectRole: 'Select Role',
    RoleIsRequired: 'Role is required!',
    //** /Account App

    //** Email Template App
    AddEmailTemplate: 'Add Email Template',
    SearchEmailTemplate: 'Search Email Template',
    // Show: 'Show',
    // Search: 'Search',
    // SUBJECT: 'SUBJECT',
    // STATUS: 'STATUS',
    // ACTION: 'ACTION',
    // Showing: 'Showing',
    // to: 'to',
    // of: 'of',
    // entries: 'entries',
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
    // Important: 'Important',
    // Trash: 'Trash',
    // Search: 'Search',
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
    Warning: 'Warning'
    //** /Error

}

export const L10nOrgKeys = {
    Menu: [
        'Email', 'Documents', 'Chat', 'Task', 'Calendar', 
        'Respites', 'Outbox', 'Bills', 'Inquiry', 'Contact', 
        'User', 'Account', 'EmailTemplate', 'CloudServer', 'CalendarSetting'
    ],
    Dashboards: [
        'Hello', 'YouHave', 'OpenCases', 'ViewAllCases', 'DashboardOverview', 
        'Statistics', 'OpenTicket', 'OpenInvoices', 'AmountsOutstanding', 'TodoList', 
        'Low', 'Medium', 'High', 'SeeAll', 'File', 
        'Client', 'Lawyer', 'TakeoverDate', 'Stage', 'NewInquiry', 
        'InvoiceNo', 'Total', 'DueDate', 'OpenAmount', 'NewChats', 
        'NoChatsFound1'
    ],
    Pages: {
        Email: [
            'Inbox', 'Draft', 'Important', 'Spam', 'Sent', 
            'Trash', 'Compose', 'SearchEmail', 'SelectAll', 'NoItemsFound', 
            'NoSubject', 'ComposeMail', 'Subject', 'To', 'Message', 
            'Select', 'Send', 'Save', 'ToEmailIsRequired'
        ],
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
        Chat: [
            'Chats', 'Contacts', 'SearchOrStartNewAChat', 'StartConversation', 'LoadMore',
            'ViewContact', 'ClearChat', 'Send', 'NoChatsFound2', 'Settings', 
            'Notification', 'InviceFriends', 'PersonalInformation'
        ],
        Task: [
            'MyTasks', 'Completed', 'Deleted', 'Tags', 'Team', 
            'Update', 'SearchTask', 'SortAZ', 'SortZA', 'SortAssignee', 
            'SortDueDate', 'ResetSort', 'Important', 'Low', 'Medium', 
            'High', 'AddTask', 'AreYouSure', 'YouWontBeAbleToRevertThis', 'YouCanAlsoRevertThis', 
            'YesDeleteIt', 'NoItemsFound', 'Title', 'TitleIsRequired', 'SelectAssignee', 
            'AssigneeIsRequired', 'DueDateIsRequired', 'SelectTag', 'TagIsRequired', 'Description', 
            'MarkComplete', 'Delete', 'Cancel', 'DueDate', 'Assignee'
        ],
        Calendar: [
            'Register', 'Filter', 'ViewAll', 'MyAppointments', 'CourtDate', 
            'Holiday', 'Title', 'TitleIsRequired', 'StartDate', 'EndDate', 
            'Guests', 'Label', 'SelectLabel', 'LabelIsRequired', 'StartDateIsRequired', 
            'EndDateIsRequired', 'SelectGuest', 'GuestIsRequired', 'InvalidAppointmentUrl', 'EnterLocation', 
            'Description', 'AreYouSure', 'YouWontBeAbleToRevertThis', 'YesDeleteIt', 'AllDay', 
            'AppointmentURL', 'AddLocation', 'AppointmentDescription', 'Add', 'AddEvent', 
            'UpdateEvent' 
        ],
        Respites: [
            'FirstAnniversary', 'File', 'DeadlineDate', 'Amount', 'Done', 
            'LetterDeadline', 'Subject', 'PDFDocuments', 'Referencenumber', 'InvoiceDeadline', 
            'SearchLetter', 'SearchInvoice', 'AreYouSure', 'YouWantToDoneThisTimeline', 'Yes'
        ],
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