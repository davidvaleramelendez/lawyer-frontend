
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
        emailList: `/api/admin/top-notification-email`,
        getAcceptedNotification: `/api/admin/placetel-api-sip-user/accepted_notification`
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
        saveAccountImap: `/api/admin/profile/save_account_imap`,
        updateAccountPassword: `/api/auth/user/change-password`,
        updateProfileImage: `/api/admin/profile/update-image`
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
        sendMessage: `/api/admin/chat/send_chat`,
        markImportant: `/api/admin/chat/mark_important`
    },
    /* /Chat module */

    /* Attachments */
    attachments: {
        create: `/api/admin/attachment/create`,
        delete: `/api/admin/attachment/delete`,
        multipleDelete: `/api/admin/attachment/multiple/delete`
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
        letterList: `/api/admin/case/letter/list`,
        createLetter: `/api/admin/case/add_letter`,
        updateLetter: `/api/admin/case/update_letter`,
        deleteLetter: `/api/admin/case/delete_letter`,
        isErledigtLetter: `/api/admin/case/letter_erledigt`,
        createTimeRecord: `/api/admin/case/case_records/time/create`,
        updateTimeRecord: `/api/admin/case/case_records/time/update`,
        deleteTimeRecord: `/api/admin/case/case_records/time/delete`,
        getTimeRecord: `/api/admin/case/case_record/times`,
        emails: `/api/admin/case/emails`,
        sendEmail: `/api/admin/case/email/send`,
        replyEmail: `/api/admin/case/email/reply`
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
        userList: `/api/admin/cloud/get_users`,
        markImportant: `/api/admin/cloud/mark-important`,
        markRestore: `/api/admin/cloud/mark-restore`,
        markShare: `/api/admin/cloud/mark-share`
    },
    /* /Cloud storage module */

    /* Contact module */
    contacts: {
        list: `/api/admin/get_contact_list`,
        view: `/api/admin/contact/view`,
        create: `/api/admin/add_contact`,
        createNote: `/api/admin/contact/add_note`,
        convertToCase: `/api/admin/convert_contact_to_case`,
        delete: `/api/admin/contact/delete`,
        imapCron: `/api/contact/contact-imap/cron`
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
        updateStatus: `/api/admin/letter/update_status`,
        generateDownloadTemplate: `/api/admin/case/letter/template/download/generate`
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
    },
    /* /Companies */

    /* Inquiry Imap */
    inquiryImap: {
        createUpdate: `/api/admin/inquiry-imap/create_update`,
        detail: `/api/admin/inquiry-imap/detail`,
        delete: `/api/admin/inquiry-imap/delete`
    },
    /* /Inquiry Imap */

    /* Pdf Apis */
    pdfApis: {
        createUpdate: `/api/admin/pdf-api/create_update`,
        detail: `/api/admin/pdf-api/detail`,
        delete: `/api/admin/pdf-api/delete`
    },
    /* /Pdf Apis */

    /* Voice Recordings */
    voiceRecordings: {
        list: `/api/admin/voice-recording/list`,
        view: `/api/admin/voice-recording`,
        create: `/api/admin/voice-recording/create`,
        update: `/api/admin/voice-recording/update`,
        delete: `/api/admin/voice-recording/delete`,
        isErledigt: `/api/admin/voice-recording/is-erledigt`
    },
    /* /Voice Recordings */

    /* Voice Recordings */
    importLetterFiles: {
        list: `/api/admin/import-letter-file/list`,
        view: `/api/admin/import-letter-file`,
        create: `/api/admin/import-letter-file/create`,
        update: `/api/admin/import-letter-file/update`,
        delete: `/api/admin/import-letter-file/delete`,
        isErledigt: `/api/admin/import-letter-file/is-erledigt`,
        createMultiple: `/api/admin/import-letter-file/create-multiple`,
        moveToLetter: `/api/admin/import-letter-file/move-to-letter`,
        cronDropBoxImportPdf: `/api/import-letter-file/cron/import-pdf`
    },
    /* /Voice Recordings */

    /* Placetel Calls */
    placetelCalls: {
        statsCount: `/api/admin/placetel-call/stats-count`,
        list: `/api/admin/placetel-call/list`,
        view: `/api/admin/placetel-call`,
        create: `/api/admin/placetel-call/create`,
        update: `/api/admin/placetel-call/update`,
        delete: `/api/admin/placetel-call/delete`,
        deleteMultiple: `/api/admin/placetel-call/delete-multiple`,
        fetchIncomingCallsApi: `/api/admin/placetel-call/fetch/incoming-calls`
    },
    /* /Placetel Calls */

    /* Placetel Call Api Token */
    placetelCallTokenApis: {
        createUpdate: `/api/admin/placetel-call-api-token/create_update`,
        detail: `/api/admin/placetel-call-api-token/detail`,
        delete: `/api/admin/placetel-call-api-token/delete`
    },
    /* /Placetel Call Api Token */

    /* Dropbox Api Token */
    dropboxTokenApis: {
        createUpdate: `/api/admin/dropbox-api-token/create_update`,
        detail: `/api/admin/dropbox-api-token/detail`,
        delete: `/api/admin/dropbox-api-token/delete`
    },
    /* /Dropbox Api Token */

    /* Placetel Api Sipuid */
    placetelApiSipuids: {
        list: `/api/admin/placetel-api-sip-user/list`,
        createUpdate: `/api/admin/placetel-api-sip-user/create_update`,
        detail: `/api/admin/placetel-api-sip-user/detail`,
        delete: `/api/admin/placetel-api-sip-user/delete`,
        initiateCall: `/api/admin/placetel-api-sip-user/initiate/call`,
        incomingDetail: `/api/admin/placetel-api-sip-user/incoming_detail`,
        createUpdateIncoming: `/api/admin/placetel-api-sip-user/incoming_create_update`
    },
    /* /Placetel Api Sipuid */

    /* Form Builder */
    formBuilder: {
        getFormList: `/api/admin/form-builder/form`,
        createForm: `/api/admin/form-builder/form/create`,
        publishForm: `/api/admin/form-builder/form/publish`,
        updateForm: `/api/admin/form-builder/form/update`,
        deleteForm: `/api/admin/form-builder/form/delete`,

        getStepList: `/api/admin/form-builder/step`,
        getStepListByLink: `/api/form-builder/link`,
        addStepItem: `/api/admin/form-builder/step/create`,
        deleteStepItem: `/api/admin/form-builder/step/delete`,
        getStepDetails: `/api/admin/form-builder/step/details`,
        updateStepItem: `/api/admin/form-builder/step/update`,
        updateStepContent: `/api/admin/form-builder/step/update_content`,
        reorderStepItem: `/api/admin/form-builder/step/reorder`
    }
    /* /Form Builder */
}