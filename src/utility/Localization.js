/* eslint-disable array-bracket-newline */

import { getCurrentUser, getLanguageLabels } from "./Utils"

export const L10nKeys = {
    //** Menus
    Dashboards: 'Dashboards',
    Email: 'Email',
    Cases: 'Cases',
    Chat: 'Chat',
    Task: 'Task',
    Calendar: 'Calendar',
    Deadline: 'Deadline',
    CloudStorage: 'Cloud-Storage',
    Outbox: 'Outbox',
    Bills: 'Bills',
    Inquiry: 'Inquiry',
    Account: 'Account',
    User: 'User',
    'Email Template': 'Email Template',
    'Cloud-Storage': 'Cloud-Storage',
    'Calendar Setting': 'Calendar Setting',
    'Letter Template': 'Letter Template',
    "Voice Recording": "Voice Recording",
    "Import Letter File": 'Import Letter File',
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
    Addnotes: 'Add notes',
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
    TimeCounterWillBeExpiredSoon: 'Time counter will be expired soon',
    Stop: 'Stop',
    Terminal: 'Terminal',
    AreYouSure: 'Are you sure?',
    YouWantToCloseThisCase: 'You want to Close this Case?',
    YouWantToShareThisCaseRecord: 'You want to Share this case record?',
    YouWantToDoneThisDocument: 'You want to Done this document?',
    YouWantToDoneThisLetter: 'You want to Done this letter?',
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
    // Settings: 'Settings',
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
    // AreYouSure: 'Are you sure?',
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
    // Show: 'Show',
    // Search: 'Search',
    // SearchLetter: 'Search Letter',
    // AreYouSure: 'Are you sure?',
    YouWantToArchiveThis: 'You want to archive this!',
    YesArchiveIt: 'Yes, archive it!',
    // ReferenceNumber: 'Reference Number',
    // Date: 'Date',
    LastDate: 'Last Date',
    // Subject: 'Subject',
    Printed: 'Printed',
    // Done: 'Done',
    // View: 'View',
    // Status: 'Status',
    // Outbox: 'Outbox',
    //** /Outbox App

    //** Bills App
    Invoice: 'Invoice',
    CreateInvoice: 'Create Invoice',
    UpdateInvoice: 'Update Invoice',
    // Show: 'Show',
    // Search: 'Search',
    // SearchInvoice: 'Search Invoice',
    // SelectStatus: 'Select Status',
    Paid: 'Paid',
    // AreYouSure: 'Are you sure?'
    // YouWontBeAbleToRevertThis: "You won't be able to revert this!",
    // YesDeleteIt: 'Yes, delete it!',
    InvoiceNumber: 'Invoice Number',
    // Status: 'Status',
    // Client: 'Client',
    // Total: 'Total',
    // DueDate: 'Due Date',
    // Action: 'Action',
    SendMail: 'Send Mail',
    ViewInvoice: 'View Invoice',
    // Download: 'Download',
    Edit: 'Edit',
    // Delete: 'Delete',
    Duplicate: 'Duplicate',
    // Open: 'Open',
    CaseID: "CaseID",
    DateIsRequired: 'Date is required!',
    MaturityDateIsRequired: 'Maturity date is required!',
    CaseIDIsRequired: 'CaseID is required!',
    ClientIsRequired: 'Client is required!',
    DescriptionIsRequired: 'Description is required!',
    PriceIsRequired: 'Price is required!',
    PickAtLeast1Item: 'Pick at least 1 Item',
    ItemsIsRequired: 'Items is required!',
    MethodIsRequired: 'Method is required!',
    // StatusIsRequired: 'Status is required!',
    Number: 'Number',
    // Date: 'Date',
    Maturity: 'Maturity',
    SelectCaseID: 'Select CaseID',
    InvoiceTo: 'Invoice to',
    // Client: 'Client',
    // Description: 'Description',
    // Amount: 'Amount',
    Vat: 'Vat',
    AddInvoiceItem: 'Add invoice item',
    Net: 'Net',
    PaymentMethods: 'Payment methods',
    SelectMethod: 'Select Method',
    // SelectStatus: 'Select Status',
    SelectClient: 'Select Client',
    Balance: 'Balance',
    PaymentHistory: 'Payment History',
    Note: 'Note',
    SendInvoiceByEmail: 'Send invoice by e-mail',
    PrintOut: 'Print out',
    AddPayment: 'Add Payment',
    Created: 'Created',
    PaymentDetails: 'Payment details',
    // OpenAmount: 'Open amount',
    PreviewInvoice: 'Preview Invoice',
    AmountForPayment: 'Amount for payment',
    PaymentDate: 'Payment Date',
    InternalPaymentNote: 'Internal Payment Note',
    Abort: 'Abort',
    YourBill: 'Your bill',
    SendInvoice: 'Send Invoice',
    To: 'To',
    // Subject: 'Subject',
    // Message: 'Message',
    InvoiceAutomaticallyAttached: 'Invoice automatically attached',
    // Send: 'Send',
    InvoiceRegardingGoods: 'Invoice regarding goods',
    //** /Bills App

    //** Inquiry(Contact) App
    Contact: 'Contact',
    AddContact: 'Add Contact',
    SearchContact: 'Search Contact',
    Ticket: 'Ticket',
    ViewContact: 'View Contact',
    Accept: 'Accept',
    Notes: 'Notes',
    Clear: 'Clear',
    News: 'News',
    AcceptTheRequest: 'Accept the request',
    MobileIsRequired: 'Mobile is required!',
    MobileMustBe10Digit: 'Mobile Must be 10 digit!',
    AddNewContact: 'Add New Contact',
    FullName: 'Full Name',
    NoteIsRequired: 'Notes is required!',
    AddNotes: 'Add Notes',
    AddComment: 'Add Comment',
    //** /Inquiry(Contact) App

    //** User App
    Admin: 'Admin',
    Partner: 'Partner',
    SearchFilter: 'Search & Filter',
    Entries: 'Entries',
    SearchUser: 'Search User',
    SelectRole: 'Select Role',
    AddNewUser: 'Add New User',
    Role: 'Role',
    Customer: 'Customer',
    Contact: 'Contact',
    Active: 'Active',
    PasswordIsRequired: 'Password is required!',
    RetypePasswordIsRequired: 'Retype Password is required!',
    RoleIsRequired: 'Role is required!',
    PasswordMustBe6Digit: 'Password Must be 6 digit!',
    NewPasswordMustBe6Digit: 'New Password Must be 6 digit!',
    RetypePasswordMustMatchWithPassword: 'Retype Password must match with Password!',
    RetypeNewPasswordMustMatchWithNewPassword: 'Retype New Password must match with New Password!',
    MobileMustBe6Digit: 'Mobile Must be 6 digit!',
    MobileMustBe16Digit: 'Mobile Must be 16 digit!',
    Password: 'Password',
    ChangePassword: 'Change Password',
    CurrentPassword: 'Current Password',
    NewPassword: 'New Password',
    RetypePassword: 'Retype Password',
    UserRole: 'User Role',
    DetailsOf: 'Details of',
    Permissions: 'Permissions',
    Type: 'Type',
    Allow: 'Allow',
    DeleteUsers: 'Delete Users',
    SeeAllUsers: 'See All Users',
    SeeContacts: 'See Contacts',
    SeeAllCases: 'See All Cases',
    UpdateCases: 'Update Cases',
    SeeLetters: 'See Letters',
    YouDontHaveAnyPermissions: 'You do not have any permissions',
    RecentDevices: 'Recent devices',
    IpAddress: 'Ip Address',
    LoginDate: 'Login Date',
    Clear: 'Clear',
    Gender: 'Gender',
    BirthDate: 'Birth date',
    Mobile: 'Mobile',
    AddressLine: 'Address Line',
    Postcode: 'Postcode',
    // City: 'City',
    State: 'State',
    // Country: 'Country',
    // SaveChange: 'Save Change',
    Update: 'Update',
    Account: 'Account',
    Security: 'Security',
    //** /User App

    //** Account App
    // Account: 'Account',
    Key: 'Key',
    Change: 'Change',
    Username: 'Username',
    UsernameIsRequired: 'Username is required!',
    // NameIsRequired: 'Name is required!',
    InvalidUsername: 'Invalid username!',
    // EmailIsRequired: 'Email is required!',
    // StatusIsRequired: 'Status is required!',
    SelectRole: 'Select Role',
    // RoleIsRequired: 'Role is required!',
    BirthDateIsRequired: 'Birth date is required!',
    DateCannotBeInTheFuture: 'Date cannot be in the future!',
    GenderIsRequired: 'Gender is required!',
    AddressLine1IsRequired: 'Address line 1 is required!',
    PostcodeIsRequired: 'Postcode is required!',
    PostcodeNoMoreThan6Chracters: 'Postcode no more than 6 characters!',
    StateIsRequired: 'State is required!',
    CountryIsRequired: 'Country is required!',
    KeyIsRequired: 'Key is required!',
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
    PDFApi: 'PDF Api',
    IMAPHost: 'IMAP Host',
    IMAPPort: 'IMAP Port',
    Secure: 'Secure',
    UseSSL: 'Use SSL',
    IMAPEmail: 'IMAP Email',
    IMAPPassword: 'IMAP Password',
    // Email: 'Email',
    TranslationIsRequired: 'Translation is required!',
    NewPasswordIsRequired: 'New Password is required!',
    RetypeNewPasswordisrequired: 'Retype New Password is required!',
    //** /Account App

    //** Email Template App
    // Show: 'Show',
    AddEmailTemplate: 'Add Email Template',
    EditEmailTemplate: 'Edit Email Template',
    // Search: 'Search',
    SearchEmailTemplate: 'Search Email Template',
    HasAttachment: 'Has attachment',
    SubjectIsRequired: 'Subject is required!',
    // StatusIsRequired: 'Status is required!',
    ContentIsRequired: 'Content is required!',
    Sortcodes: 'Sort codes',
    Case: 'Case',
    Back: 'Back',
    Attachment: 'Attachment',
    //** /Email Template App

    //** Cloud Server App
    // AreYouSure: 'Are you sure?',
    YouRevertThisFromTrash: 'You revert this from trash!',
    MoveFolder: 'Move Folder',
    EditFolder: 'Edit Folder',
    CreateNewFolder: 'Create New Folder',
    FolderName: 'Folder Name',
    MoveFile: 'Move File',
    EditFile: 'Edit File',
    // Submit: 'Submit',
    // Cancel: 'Cancel',
    UploadNewFile: 'Upload New File',
    SelectParent: 'Select Parent',
    FileName: 'File Name',
    StorageStatus: 'Storage Status',
    UsedOf: 'used of',
    MyDrive: 'My Drive',
    Filename: 'Filename',
    Created: 'Created',
    // Actions: 'Actions',
    // Important: 'Important',
    // Delete: 'Delete',
    Restore: 'Restore',
    DeleteForever: 'Delete forever',
    FolderCreated: 'Folder Created',
    Move: 'Move',
    FileCreated: 'File Created',
    GridView: 'Grid view',
    ListView: 'List View',
    Recents: 'Recents',
    AddNew: 'Add New',
    Folder: 'Folder',
    // Trash: 'Trash',
    // Search: 'Search',
    //** /Cloud Server App

    //** UI Setting
    ThemeCustomizer: 'Theme Customizer',
    CusomizePreviewInRealTime: 'Customize & Preview in Real Time',
    Skin: 'Skin',
    Light: 'Light',
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
    AppsMenu: 'Apps & Menu',
    RequestSettings: 'Request & Settings',
    Settings: 'Settings',
    Profile: 'Profile',
    Cloud: 'Cloud',
    Logout: 'Logout',
    FileLimitExceeded: 'File limit exceeded!',
    FileUploadingSizeExceeded: 'File uploading size exceeded!',
    Okay: 'Okay',
    PleaseUploadMax: 'Please upload max',
    files: 'files',
    Showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    //** /Common

    //** Error    
    Success: 'Success',
    Failed: 'Failed',
    Error: 'Error',
    Warning: 'Warning',
    //** /Error

    /* Letter Template */
    AddLetterTemplate: 'Add Letter Template',
    EditLetterTemplate: 'Edit Letter Template',
    SearchLetterTemplate: 'Search Letter Template',
    LetterTemplateIsRequired: 'Letter Template is required!',
    ContentHeadingIsRequired: 'Content Heading is required!',
    BestRegardsIsRequired: 'Best Regards is required!',
    /* /Letter Template */

    WriteALetter: 'Write a letter',
    CreateLetter: 'Create Letter',
    UpdateLetter: 'Update Letter',
    VoiceRecording: "Voice Recording",
    SearchVoiceRecording: 'Search Voice Recording',

    MoveToLetter: 'Move to Letter',
    ImportLetterFile: 'Import Letter File',
    ImportFile: 'Import File',
    DeadlineDateIsRequired: 'Deadline Date is required!'
}

export const L10nOrgKeys = {
    Menu: [
        'Email', 'Cases', 'Chat', 'Task', 'Calendar',
        'Deadline', 'Outbox', 'Bills', 'Inquiry', 'User',
        'Account', 'Email Template', 'CloudStorage', 'Calendar Setting', 'Letter Template', "Voice Recording", "Import Letter File"
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
            'AddNotesOrFile', 'Addnotes', 'AddFile', 'SendEMail', 'Now',
            'EnterTheTime', 'NameIsRequired', 'InvalidEmailAddress', 'TelephoneIsRequired', 'AttorneyIsRequired',
            'GroupIsRequired', 'StatusIsRequired', 'LastNameIsRequired', 'EmailIsRequired', 'Attorney',
            'TelephoneMustBe10Digit', 'City', 'PostalCode', 'SelectAttorney', 'SelectGroup',
            'Submit', 'Cancel', 'Country', 'ReferenceNumber', 'Status',
            'Terminal', 'Stop', 'TimeCounterWillBeExpiredSoon', 'AreYouSure', 'YouWantToCloseThisCase',
            'YouWantToShareThisCaseRecord', 'YouWantToDoneThisDocument', 'YouWantToDoneThisLetter'
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
        Outbox: [
            'Show', 'Search', 'SearchLetter', 'AreYouSure', 'YouWantToArchiveThis',
            'YesArchiveIt', 'ReferenceNumber', 'Date', 'LastDate', 'Subject',
            'Printed', 'Done', 'View', 'Status', 'Outbox'
        ],
        Bills: [
            'Invoice', 'CreateInvoice', 'UpdateInvoice', 'Show', 'Search',
            'SearchInvoice', 'SelectStatus', 'Paid', 'AreYouSure', 'YouWontBeAbleToRevertThis',
            'YesDeleteIt', 'InvoiceNumber', 'Status', 'Client', 'Total',
            'DueDate', 'Action', 'SendMail', 'ViewInvoice', 'Download',
            'Edit', 'Delete', 'Duplicate', 'Open', 'DateIsRequired',
            'MaturityDateIsRequired', 'CaseIDIsRequired', 'ClientIsRequired', 'DescriptionIsRequired', 'PriceIsRequired', 'CaseID',
            'PickAtLeast1Item', 'ItemsIsRequired', 'MethodIsRequired', 'StatusIsRequired', 'Number',
            'Date', 'Maturity', 'SelectCaseID', 'InvoiceTo', 'Client',
            'Description', 'Amount', 'Vat', 'AddInvoiceItem', 'Net',
            'PaymentMethods', 'SelectMethod', 'SelectStatus', 'SelectClient', 'Balance',
            'PaymentHistory', 'Note', 'SendInvoiceByEmail', 'PrintOut', 'AddPayment',
            'Created', 'PaymentDetails', 'OpenAmount', 'PreviewInvoice', 'AmountForPayment',
            'PaymentDate', 'InternalPaymentNote', 'Abort', 'YourBill', 'SendInvoice',
            'To', 'Subject', 'Message', 'InvoiceAutomaticallyAttached', 'Send',
            'InvoiceRegardingGoods'
        ],
        Inquiry: [
            'Contact', 'Show', 'Search', 'AddContact', 'SearchContact',
            'Ticket', 'Name', 'Email', 'Action', 'ViewContact',
            'Accept', 'Notes', 'Clear', 'News', 'AreYouSure',
            'YouWontBeAbleToRevertThis', 'YesDeleteIt', 'SelectAttorney', 'Address', 'City',
            'PostalCode', 'SelectGroup', 'AcceptTheRequest', 'Telephone', 'Attorney',
            'City', 'Address', 'Group', 'Create', 'Name',
            'NameIsRequired', 'InvalidEmailAddress', 'EmailIsRequired', 'MobileIsRequired', 'MobileMustBe10Digit',
            'Submit', 'Cancel', 'AddNewContact', 'FullName', 'NoteIsRequired',
            'AddNotes', 'AddComment'
        ],
        User: [
            'Admin', 'Partner', 'SearchFilter', 'Show', 'Entries',
            'Search', 'SearchUser', 'SelectRole', 'AddNewUser', 'Name',
            'Email', 'Role', 'Customer', 'Contact', 'Lawyer',
            'Status', 'Active', 'Action', 'View', 'Edit',
            'NameIsRequired', 'InvalidUsername', 'EmailIsRequired', 'InvalidEmailAddress', 'MobileIsRequired',
            'PasswordIsRequired', 'RetypePasswordIsRequired', 'RoleIsRequired', 'PasswordMustBe6Digit', 'RetypePasswordMustMatchWithPassword',
            'MobileMustBe6Digit', 'MobileMustBe16Digit', 'Password', 'ChangePassword', 'RetypePassword',
            'UserRole', 'Submit', 'Cancel', 'Telephone', 'FullName',
            'DetailsOf', 'Actions', 'Bills', 'ViewInvoice', 'InvoiceNumber',
            'Client', 'Total', 'DueDate', 'SearchInvoice', 'Hold',
            'ReferenceNumber', 'Attorney', 'Date', 'Group', 'Documents',
            'SearchCase', 'AreYouSure', 'YouWontBeAbleToRevertThis', 'YesDeleteIt', 'Permissions',
            'Type', 'Allow', 'DeleteUsers', 'SeeAllUsers', 'SeeContacts',
            'SeeAllCases', 'UpdateCases', 'SeeLetters', 'YouDontHaveAnyPermissions', 'RecentDevices',
            'IpAddress', 'LoginDate', 'Details', 'Username', 'Address',
            'Clear', 'Change', 'Company', 'Gender', 'BirthDate',
            'Mobile', 'AddressLine', 'Postcode', 'City', 'State',
            'Country', 'SaveChange', 'Update', 'Account', 'Security'
        ],
        Account: [
            'Account', 'Change', 'Username', 'UsernameIsRequired', 'NameIsRequired',
            'InvalidUsername', 'EmailIsRequired', 'StatusIsRequired', 'SelectRole', 'RoleIsRequired', 'ChangePassword', 'NewPassword', 'NewPasswordIsRequired',
            'Name', 'Company', 'Language', 'SaveChange', 'LanguageLabels', 'PasswordIsRequired',
            'Menu', 'Pages', 'Common', 'Errors', 'IMAPInformation', 'PasswordMustBe6Digit',
            'IMAPHost', 'IMAPPort', 'Secure', 'UseSSL', 'IMAPEmail', 'NewPasswordMustBe6Digit', 'RetypeNewPasswordisrequired', 'RetypeNewPasswordMustMatchWithNewPassword',
            'IMAPPassword', 'Email', 'Contact', 'TranslationIsRequired', 'CurrentPassword', 'PDFApi', 'Key', 'KeyIsRequired'
        ],
        'Email Template': [
            'Show', 'AddEmailTemplate', 'EditEmailTemplate', 'Search', 'SearchEmailTemplate',
            'AreYouSure', 'YouWontBeAbleToRevertThis', 'YesDeleteIt', 'Subject', 'Status',
            'Action', 'Edit', 'View', 'Delete', 'HasAttachment',
            'SubjectIsRequired', 'StatusIsRequired', 'ContentIsRequired', 'SelectStatus', 'Content',
            'Sortcodes', 'Case', 'Contact', 'User', 'Submit',
            'Back', 'Attachment'
        ],
        'Cloud-Server': [
            'AreYouSure', 'YouRevertThisFromTrash', 'YesDeleteIt', 'YouWontBeAbleToRevertThis', 'NameIsRequired',
            'MoveFolder', 'EditFolder', 'CreateNewFolder', 'FolderName', 'MoveFile',
            'EditFile', 'Submit', 'Cancel', 'UploadNewFile', 'SelectParent',
            'FileName', 'StorageStatus', 'UsedOf', 'MyDrive', 'Filename',
            'Created', 'Actions', 'Important', 'Delete', 'Restore',
            'DeleteForever', 'FolderCreated', 'Move', 'FileCreated', 'GridView',
            'ListView', 'Recents', 'AddNew', 'Folder', 'Trash',
            'Search'
        ],
        'Calendar Setting': [],
        "Letter Template": [
            'Show', 'AddLetterTemplate', 'EditLetterTemplate', 'Search', 'SearchLetterTemplate',
            'AreYouSure', 'YouWontBeAbleToRevertThis', 'YesDeleteIt', 'Subject', 'Status',
            'Action', 'Edit', 'Delete', 'SubjectIsRequired', 'StatusIsRequired', 'ContentIsRequired', 'SelectStatus', 'Content', 'Submit', 'Back', 'LetterTemplateIsRequired', 'ContentHeadingIsRequired', 'BestRegardsIsRequired', 'WriteALetter', 'CreateLetter', 'UpdateLetter'
        ],
        "Voice Recording": [
            "CaseID", "Subject", "VoiceRecording", "SearchVoiceRecording"
        ],
        "Import Letter File": [
            "ImportFile", "ImportLetterFile", "MoveToLetter", "DeadlineDateIsRequired"
        ]
    },
    'UI Setting': [
        'ThemeCustomizer', 'CusomizePreviewInRealTime', 'Skin', 'Light', 'Bordered',
        'Dark', 'SemiDark', 'ContentWidth', 'FullWidth', 'Boxed',
        'MenuCollapsed', 'MenuHidden', 'NavbarColor', 'NavbarType', 'Floating',
        'Sticky', 'Static', 'Hidden', 'FooterType', 'ApplySave'
    ],
    Common: [
        'AppsMenu', 'RequestSettings', 'Profile', 'Logout', 'FileLimitExceeded', 'FileUploadingSizeExceeded', 'Okay', 'PleaseUploadMax', 'files', 'Showing', 'to', 'of', 'entries', 'Cloud'
    ],
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
    Inquiry: 'contactApp',
    User: 'userApp',
    Account: 'accountApp',
    'Email Template': 'emailTemplateApp',
    'Cloud-Storage': 'cloudServerApp',
    'Letter Template': 'letterTemplateApp',
    'Voice Recording': 'voiceRecordingApp',
    'Import Letter File': 'importLetterFileApp'
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