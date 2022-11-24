
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
        create: `/api/attachment/create`,
        delete: `/api/attachment/delete`
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
        isErledigtLetter: `/api/admin/case/letter_erledigt`
    },
    /* /Case module */

    /* Event calendar module */
    eventCalendar: {
        userList: `/api/admin/event/get_users`,
        list: `/api/admin/event/get_events`,
        create: `/api/admin/event/add_event`,
        update: `/api/admin/event/update`,
        delete: `/api/admin/event/delete`
    }
    /* /Event calendar module */
}