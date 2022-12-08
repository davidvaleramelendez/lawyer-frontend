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
    Emial_Template: 'Email Template',
    Cloud_Server: 'Cloud Server',
    Calendar_Setting: 'Calendar Setting',
    //** /Menus

    //** Dashboards
    Hello: 'Hello',
    You_Have: 'You have',
    Open_cases: 'Open cases',
    View_all_cases: 'View all cases',
    Dashboard_Overview: 'Dashboard Overview',
    Statistics: 'Statistics',
    Open_ticket: 'Open ticket',
    Open_invoices: 'Open invoices',
    Amounts_outstanding: 'Amounts outstanding',
    Todo_List: 'Todo List',
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
    See_All: 'See all',
    File: 'File',
    Client: 'Client',
    Lawyer: 'Lawyer',
    Takeover_Date: 'Takeover Date',
    Stage: 'Stage',
    New_inquiry: 'New inquiry',
    Invoice_No: 'Invoice No.',
    Total: 'Total',
    Due_date: 'Due date',
    Open_amount: 'Open amount',
    New_Chats: 'New Chats',
    No_chats_found: 'No chats found',
    //** /Dashboard

    //** Email App
    Inbox: 'Inbox',
    Draft: 'Draft',
    Important: 'Important',
    Spam: 'Spam',
    Sent: 'Sent',
    Trash: 'Trash',
    Compose: 'Compose',
    Search_email: 'Search email',
    Select_All: 'Select All',
    No_Items_Found: 'No Items Found',
    no_subject: 'no subject',
    Compose_Mail: 'Compose Mail',
    Subject: 'Subject',
    To: 'To',
    Message: 'Message',
    Select: 'Select',
    Send: 'Send',
    Save: 'Save',
    //** /Email App

    //** Documents App
    Show: 'Show',
    Search: 'Search',
    Search_Case: 'Search Case',
    Select_Status: 'Select Status',
    Hold: 'Hold',
    Open: 'Open',
    REFERENCE_NUMBER: 'REFERENCE NUMBER',
    ATTORNEY: 'ATTORNEY',
    DATUM: 'DATUM',
    STATUS: 'STATUS',
    GROUP: 'GROUP',
    ACTION: 'ACTION',
    // CLIENT: 'CLIENT', // already defined
    //** /Documents App

    //** Chat App
    Chats: 'Chats',
    Contacts: 'Contacts',
    Search_Or_Start_New_A_Chat: 'Search or start new a chat',
    Start_Converation: 'Start Conversation',
    //** /Chat App
    
    //** Task App
    MyTask: 'My Tasks',
    Completed: 'Completed',
    Deleted: 'Deleted',
    Tags: 'Tags',
    Team: 'Team',
    Update: 'Update',
    Search_Task: 'Search Task',
    Sort_A_Z: 'Sort A-Z',
    Sort_Z_A: 'Sort Z-A',
    Sort_Assignee: 'Sort Assignee',
    Sort_Due_Date: 'Sort Due Date',
    Reset_Sort: 'Reset Sort',
    // Important: 'Important', // already defined
    // Low: 'Low', // already defined
    // Medium: 'Medium', // already defined
    // High: 'High', // already defined
    //** /Task App

    //** Calendar App
    Register: 'Register',
    Filter: 'Filter',
    View_All: 'View All',
    My_Appointments: 'My Appointments',
    CourtDate: 'Court Date',
    Holiday: 'Holiday',
    Month: 'Month',
    Week: 'Week',
    Day: 'Day',
    List: 'List',
    //** /Calendar App

    //** Respites App
    Letter_Deadline: 'Letter Deadline',
    Invoice_Deadline: 'Invoice Deadline',
    Search_Letter: 'Search Letter',
    Search_Invoice: 'Search Invoice',
    Case: 'Case',
    Case_Type: 'Case Type',
    First_anniversary: 'First anniversary',
    PDF_document: 'PDF document',
    Deadline_Date: 'Deadline Date',
    Reference_number: 'Reference number',
    Done: 'Done',
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
    // Search_Letter: 'Search Letter', // already defined
    // REFERENCE_NUMBER: 'REFERENCE NUMBER', // already defined
    //** /Outbox App
    
    //** Bills App
    Create_Invoice: 'Create Invoice',
    INVOICE_NUMBER: 'INVOICE_NUMBER',
    DUE_DATE: 'DUE DATE', // already defined
    Showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    Due_Date: 'Due Date',
    // Total: 'Total', // already defined
    // Show: 'Show', // already defined
    // Search: 'Search', // already defined
    // Select_Status: 'Select Status', // already defined
    // STATUS: 'STATUS', // already defined
    // CLIENT: 'CLIENT', // already defined
    // TOTAL: 'TOTAL', // already defined
    // ACTION: 'ACTION', // already defined
    //** /Bills App

    //** Inquiry App
    Add_Contact: 'Add Contact',
    Search_Contact: 'Search Contact',
    TICKET: 'TICKET',
    NAME: 'NAME',
    EMAIL: 'EMAIL',
    There_are_no_records_to_display: 'There are no records to display',
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
    Search_Filter: 'Search & Filter',
    Entries: 'Entries',
    Search_User: 'Search User',
    Select_Role: 'Select Role',
    Add_New_User: 'Add New User',
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
    Save_Change: 'Save Change',
    Language_Labels: 'Language Labels',
    Menu: 'Menu',
    Pages: 'Pages',
    Common: 'Common',
    Errors: 'Errors',
    IMAP_information: 'IMAP information',
    IMAP_Host: 'IMAP Host',
    IMAP_Port: 'IMAP Port',
    Secure: 'Secure',
    Use_SSL: 'Use SSL',
    IMAP_Email: 'IMAP Email',
    IMAP_Password: 'IMAP Password',
    // Email: 'Email', // already defined
    //** /Account App

    //** Email Template App
    Add_Email_Template: 'Add Email Template',
    Search_Email_Template: 'Search Email Template',
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
    Add_New: 'Add New',
    My_Drive: 'My Drive',
    Recents: 'Recents',
    STOREAGE_STATUS: 'STORAGE STATUS',
    used_of: 'used of',
    Filename: 'Filename',
    Created: 'Created',
    Actions: 'Actions',
    // Important: 'Important', // already defined
    // Trash: 'Trash', // already defined
    // Search: 'Search', // already defined
    //** /Cloud Server App

    //** UI Setting
    Theme_Customizer: 'Theme Customizer',
    Customize_Preview_in_Real_Time: 'Customize & Preview in Real Time',
    Skin: 'Skin',
    Bordered: 'Bordered',
    Dark: 'Dark',
    Semi_Dark: 'Semi Dark',
    Content_Width: 'Content Width',
    Full_Width: 'Full Width',
    Boxed: 'Boxed',
    Menu_Collapsed: 'Menu Collapsed',
    Menu_Hidden: 'Menu Hidden',
    Navbar_Color: 'Navbar Color',
    Navbar_Type: 'Navbar Type',
    Floating: 'Floating',
    Sticky: 'Sticky',
    Static: 'Static',
    Hidden: 'Hidden',
    Footer_Type: 'Footer Type',
    Apply_Save: 'Apply & Save',

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

    Date: 'Date',
    Showing: 'Showing',
    entries: 'entries',
    Status: 'Status',
    Action: 'Action'
}

export const L10nOrgKeys = {
    Menu: ['Email', 'Documents', 'Chat', 'Task', 'Calendar', 'Respites', 'Outbox', 'Bills', 'Inquiry', 'Contact', 'User', 'Account', 'Emial_Template', 'Cloud_Server', 'Calendar_Setting'],
    Dashboards: ['Hello', 'You_Have', 'Open_cases', 'View_all_cases', 'Dashboard_Overview', 'Statistics', 'Open_ticket', 'Open_invoices', 'Amounts_outstanding', 'Todo_List', 'Low', 'Medium', 'High', 'See_All', 'File', 'Client', 'Lawyer', 'Takeover_Date', 'Stage', 'New_inquiry', 'Invoice_No', 'Total', 'Due_date', 'Open_amount', 'New_Chats', 'No_chats_found'],
    Pages: {
        Email: ['Inbox', 'Draft', 'Important', 'Spam', 'Sent', 'Trash', 'Compose', 'Search_email', 'Select_All', 'No_Items_Found', 'no_subject', 'Compose_Mail', 'Subject', 'To', 'Message', 'Select', 'Send', 'Save'],
        Documents: ['Show', 'Search', 'Search_Case', 'Select_Status', 'Hold', 'Open', 'REFERENCE_NUMBER', 'ATTORNEY', 'DATUM', 'STATUS', 'GROUP', 'ACTION', 'CLIENT'],
        Chat: ['Chats', 'Contacts', 'Search_Or_Start_New_A_Chat', 'Start_Converation'],
        Task: ['MyTask', 'Completed', 'Deleted', 'Tags', 'Team', 'Update', 'Search_Task', 'Sort_A_Z', 'Sort_Z_A', 'Sort_Assignee', 'Sort_Due_Date', 'Reset_Sort', 'Important', 'Low', 'Medium', 'High'],
        Calendar: ['Register', 'Filter', 'View_All', 'My_Appointments', 'CourtDate', 'Holiday', 'Month', 'Week', 'Day', 'List'],
        Respites: ['Letter_Deadline', 'Invoice_Deadline', 'Search_Letter', 'Search_Invoice', 'Case', 'Case_Type', 'First_anniversary', 'PDF_document', 'Deadline_Date', 'Reference_number', 'Done', 'File', 'Amount', 'Subject'],
        Outbox: ['DATE', 'SUBJECT', 'PRINTED', 'DONE', 'VIEW', 'Show', 'Search', 'Search_Letter', 'REFERENCE_NUMBER'],
        Bills: ['Create_Invoice', 'INVOICE_NUMBER', 'DUE_DATE', 'Showing', 'to', 'of', 'entries', 'Total', 'Due_Date', 'Show', 'Search', 'Select_Status', 'STATUS', 'CLIENT', 'TOTAL', 'ACTION'],
        Inquiry: ['Add_Contact', 'Search_Contact', 'TICKET', 'NAME', 'EMAIL', 'There_are_no_records_to_display', 'Show', 'Search', 'ACTION'],
        Contact: [],
        User: ['Admin', 'Lawyer', 'Partner', 'Customer', 'Search_Filter', 'Entries', 'Search_User', 'Select_Role', 'Add_New_User', 'NAME', 'EMAIL', 'ROLE', 'CONTACT', 'Show', 'Search', 'STATUS', 'ACTION'],
        Account: ['Change', 'Username', 'Name', 'Company', 'Language', 'Save_Change', 'Language_Labels', 'Menu', 'Dashboards', 'Pages', 'Common', 'Errors', 'IMAP_information', 'IMAP_Host', 'IMAP_Port', 'Secure', 'Use_SSL', 'IMAP_Email', 'IMAP_Password', 'Email'],
        Emial_Template: ['Add_Email_Template', 'Search_Email_Template', 'Show', 'Search', 'SUBJECT', 'STATUS', 'ACTION', 'Showing', 'to', 'of', 'entries'],
        Cloud_Server: ['Add_New', 'My_Drive', 'Recents', 'STOREAGE_STATUS', 'used_of', 'Filename', 'Created', 'Actions', 'Important', 'Trash', 'Search'],
        Calendar_Setting: []
    },
    'UI Setting': ['Theme_Customizer', 'Customize_Preview_in_Real_Time', 'Skin', 'Bordered', 'Dark', 'Semi_Dark', 'Content_Width', 'Full_Width', 'Boxed', 'Menu_Collapsed', 'Menu_Hidden', 'Navbar_Color', 'Navbar_Type', 'Floating', 'Sticky', 'Static', 'Hidden', 'Footer_Type', 'Apply_Save'],
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
    Email_Template: 'emailTemplateApp',
    Cloud_Server: 'cloudServerApp'
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