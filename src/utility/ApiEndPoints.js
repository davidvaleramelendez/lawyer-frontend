
export const API_ENDPOINTS = {
    /* Layout */
    auth: {
        login: `/api/auth/login`,
        refreshToken: `/api/auth/refresh`,
        logout: `/api/auth/logout`
    },
    /* /Layout */

    /* Layout */
    layout: {
        siteSetting: `/api/admin/get-site-setting`,
        createSiteSetting: `/api/admin/site-setting`
    },
    /* /Layout */

    /* Navbar top notification */
    navTopNotification: {
        chatList: `/api/admin/top-notification-chat`,
        contactList: `/api/admin/top-notification-contacts`,
        emailList: `/api/admin/top-notification-email`
    },
    /* /Navbar top notification */

    /* Navbar bookmark */
    navBookmark: {
        list: `/api/admin/get-bookmark`,
        update: `/api/admin/update-bookmark`
    },
    /* /Navbar bookmark */

    /* Navbar global search */
    navGlobalSearch: {
        search: `/api/admin/global-search`
    },
    /* /Navbar global search */

    /* User module */
    dashboard: {
        list: `/api/dashboard`
    },
    /* /User module */

    /* User module */
    users: {
        roleStatsCount: `/api/admin/user/get-user-count`,
        list: `/api/admin/users`,
        create: `/api/admin/user/create`,
        view: `/api/admin/user`,
        update: `/api/admin/user/update`,
        delete: `/api/admin/user/delete`,
        updatePermission: `/api/admin/permissions/update`,
        getPermission: `/api/admin/permissions/get`,
        getDeviceLogs: `/api/get-user-logs`
    },
    /* /User module */

    /* Account Setting */
    account: {
        getAccountSetting: `/api/admin/profile/get_setting`,
        saveAccount: `/api/admin/profile/save_account`,
        saveAccountSetting: `/api/admin/profile/save_account_setting`,
        saveAccountImap: `/api/admin/profile/save_account_imap`
    },
    /* /Account Setting */

    /* Language & Labels */
    language: {
        languages: `/api/admin/language`,
        labels: `/api/admin/language/labels`
    },
    /* /Language & Labels */

    /* Role module */
    roles: {
        list: `/api/admin/roles`
    },
    /* /Role module */

    /* Chat module */
    chats: {
        list: `/api/admin/chat/get_users`,
        getChats: `/api/admin/chat/get_chat`,
        chatHistory: `/api/admin/chat/history`,
        sendMessage: `/api/admin/chat/send_chat`
    },
    /* /Chat module */

    /* Attachments */
    attachments: {
        create: `/api/admin/attachment/create`,
        delete: `/api/admin/attachment/delete`
    },
    /* /Attachments */

    /* Case module */
    cases: {
        list: `/api/admin/get_case_list`,
        view: `/api/admin/case/get`,
        update: `/api/admin/case/update_case`,
        close: `/api/admin/case/close_case`,
        createFighter: `/api/admin/case/add_fighter`,
        noteRecords: `/api/admin/case/note/case_records`,
        createNoteRecord: `/api/admin/case/note/case_record/create`,
        shareCase: `/api/admin/case/share_case`,
        documentList: `/api/admin/case/case_documents`,
        createDocument: `/api/admin/case/case_document_add`,
        updateDocument: `/api/admin/case/case_document_update`,
        isErledigtDocument: `/api/admin/case/case_document_isErledigt`,
        deleteDocument: `/api/admin/case/case_document_delete`,
        letterList: `/api/admin/letter/get_list`,
        createLetter: `/api/admin/case/add_letter`,
        updateLetter: `/api/admin/case/update_letter`,
        deleteLetter: `/api/admin/case/delete_letter`,
        isErledigtLetter: `/api/admin/case/letter_erledigt`,
        createTimeRecord: `/api/admin/case/case_records/time/create`,
        updateTimeRecord: `/api/admin/case/case_records/time/update`,
        deleteTimeRecord: `/api/admin/case/case_records/time/delete`,
        getTimeRecord: `/api/admin/case/case_record/times`,
        createCaseEmailSend: `/api/admin/case/case_records/email`,
        getCaseRecord: `/api/admin/case/case_records`
    },
    /* /Case module */

    /* Event calendar module */
    eventCalendar: {
        userList: `/api/admin/event/get_users`,
        list: `/api/admin/event/get_events`,
        create: `/api/admin/event/add_event`,
        update: `/api/admin/event/update`,
        delete: `/api/admin/event/delete`
    },
    /* /Event calendar module */

    /* Cloud storage module */
    cloudStorage: {
        list: `/api/admin/folders`,
        treeList: `/api/admin/tree/folder`,
        createFolder: `/api/admin/folder/create`,
        updateFolder: `/api/admin/folder/update`,
        trashFolder: `/api/admin/folder/trash`,
        deleteFolder: `/api/admin/folder/delete`,
        createFile: `/api/admin/file/create`,
        updateFile: `/api/admin/file/update`,
        trashFile: `/api/admin/file/trash`,
        deleteFile: `/api/admin/file/delete`,
        markImportant: `/api/admin/cloud/mark-important`,
        markRestore: `/api/admin/cloud/mark-restore`
    },
    /* /Cloud storage module */

    /* Contact module */
    contacts: {
        list: `/api/admin/get_contact_list`,
        view: `/api/admin/contact/view`,
        create: `/api/admin/add_contact`,
        createNote: `/api/admin/contact/add_note`,
        convertToCase: `/api/admin/convert_contact_to_case`,
        delete: `/api/admin/contact/delete`
    },
    /* /Contact module */

    /* Email module */
    emails: {
        imapList: `/api/admin/email/imap`,
        imapDetail: `/api/admin/email/details-imap`,
        send: `/api/admin/email/send_mail`,
        markTrash: `/api/admin/email/mark_trash`,
        markDelete: `/api/admin/email/mark_delete`,
        markRestore: `/api/admin/email/mark_restore`,
        markImportant: `/api/admin/email/mark_important`,
        createReply: `/api/admin/email/reply`,
        view: `/api/admin/email`,
        draft: `/api/admin/draft`,
        userMailCron: `/api/admin/email/email-imap/user/cron`
    },
    /* /Email module */

    /* Email Template module */
    emailTemplates: {
        list: `/api/admin/email-templates`,
        create: `/api/admin/email-template/create`,
        view: `/api/admin/email-template`,
        update: `/api/admin/email-template/update`,
        delete: `/api/admin/email-template/delete`,
        viewTemplate: `/api/admin/view-email-template`,
        attachmentList: `/api/admin/email-template-attachments`,
        attachmentCreate: `/api/admin/email-template-attachment/create`,
        attachmentView: `/api/admin/email-template-attachment`,
        attachmentUpdate: `/api/admin/email-template-attachment/update`,
        attachmentDelete: `/api/admin/email-template-attachment/delete`
    },
    /* /Email Template module */

    /* Invoice module */
    invoices: {
        list: `/api/admin/invoice/list`,
        info: `/api/admin/invoice/info`,
        view: `/api/admin/invoice`,
        save: `/api/admin/invoice/save`,
        update: `/api/admin/invoice/update`,
        delete: `/api/admin/invoice/delete`,
        send: `/api/admin/invoice/send`,
        pay: `/api/admin/invoice/pay`
    },
    /* /Invoice module */

    /* Letter module */
    letters: {
        list: `/api/admin/letter/get_list`,
        view: `/api/admin/letter`,
        archive: `/api/admin/letter/update_archived`,
        updateStatus: `/api/admin/letter/update_status`
    },
    /* /Letter module */

    /* Timeline module */
    timelines: {
        list: `/api/admin/timeline/get_all`,
        save: `/api/admin/timeline/save`
    },
    /* /Timeline module */

    /* Todo module */
    todos: {
        userList: `/api/admin/todo/get_users`,
        list: `/api/admin/todo/get_todos`,
        create: `/api/admin/todo/create`,
        complete: `/api/admin/todo/complete`,
        important: `/api/admin/todo/important`,
        trash: `/api/admin/todo/trash`,
        restore: `/api/admin/todo/restore`,
        delete: `/api/admin/todo/delete`
    },
    /* /Todo module */

    /* Companies */
    companies: {
        createUpdate: `/api/admin/companies/create_update`,
        detail: `/api/admin/companies/detail`,
        delete: `/api/admin/companies/delete`
    },
    /* /Companies */

    /* Letter Template */
    letterTemplates: {
        list: `/api/admin/letter-template/list`,
        view: `/api/admin/letter-template`,
        create: `/api/admin/letter-template/create`,
        update: `/api/admin/letter-template/update`,
        delete: `/api/admin/letter-template/delete`
    }
    /* /Companies */
}