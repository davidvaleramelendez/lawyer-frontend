// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Nav,
    TabPane,
    NavItem,
    NavLink,
    TabContent
} from 'reactstrap'

// ** Icons Imports
import {
    Mail,
    Unlock,
    Monitor,
    Calendar,
    HardDrive,
    Briefcase,
    CheckSquare,
    MessageCircle
} from 'react-feather'

/* User tab view components */
import DocumentsTab from './DocumentsTab'
import PermissionsTab from './PermissionsTab'
import RecentDevicesTab from './RecentDevicesTab'
import EmailComponent from '../components/email'
import ChatComponent from '../components/chat'
import TaskComponent from '../components/todo'
import CalendarComponent from '../components/calendar'
import CloudStorageComponent from '../components/cloudStorage'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    active,
    toggleTab,
    permissions,
    authUserItem,
    getCurrentUser
}) => {
    /* Checking item from array */
    const onCheckItemIndex = (arrayItems = [], key = "", value = "") => {
        const index = arrayItems.findIndex((x) => x[key] === value)
        if (index !== -1) {
            return true
        }
        return false
    }
    /* /Checking item from array */

    /* Checking auth User permission */
    const onCheckUserPermission = (id) => {
        let currentUser = getCurrentUser()
        if (authUserItem && authUserItem.id) {
            currentUser = authUserItem
        }

        if (currentUser && currentUser.id) {
            if (currentUser.permission && currentUser.permission.length) {
                if (onCheckItemIndex(currentUser.permission, "permission_id", id)) {
                    return true
                }
            }
        }
        return false
    }
    /* /Checking auth User permission */

    return (
        <Fragment>
            <Nav pills className="mb-2">
                <NavItem>
                    <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                        <Briefcase size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Documents")}</span>
                    </NavLink>
                </NavItem>

                {onCheckUserPermission(8) ? (
                    <NavItem>
                        <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                            <Mail size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Email")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(10) ? (
                    <NavItem>
                        <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                            <MessageCircle size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Chat")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(12) ? (
                    <NavItem>
                        <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                            <CheckSquare size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Task")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(14) ? (
                    <NavItem>
                        <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
                            <Calendar size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Calendar")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(16) ? (
                    <NavItem>
                        <NavLink active={active === "6"} onClick={() => toggleTab("6")}>
                            <HardDrive size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Cloud Storage")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                <NavItem>
                    <NavLink active={active === "7"} onClick={() => toggleTab("7")}>
                        <Unlock size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Permissions")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "8"} onClick={() => toggleTab("8")}>
                        <Monitor size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Recent devices")}</span>
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    {/* Case listing */}
                    <DocumentsTab id={id} />
                    {/* /Case listing */}
                </TabPane>

                {onCheckUserPermission(8) ? (
                    <TabPane tabId="2">
                        {/* User Emails */}
                        <div className="email-application user-detail-email">
                            <div className="content-area-wrapper container-xxl p-0">
                                <EmailComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User Emails */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(10) ? (
                    <TabPane tabId="3">
                        {/* User Chats */}
                        <div className="chat-application user-detail-chat">
                            <div className="content-area-wrapper container-xxl p-0">
                                <ChatComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User Chats */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(12) ? (
                    <TabPane tabId="4">
                        {/* User Tasks */}
                        <div className="todo-application user-detail-todo">
                            <div className="content-area-wrapper container-xxl p-0">
                                <TaskComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User Tasks */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(14) ? (
                    <TabPane tabId="5">
                        {/* User Calendars */}
                        <CalendarComponent
                            userId={id}
                            onCheckUserPermission={onCheckUserPermission}
                        />
                        {/* /User Calendars */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(16) ? (
                    <TabPane tabId="6">
                        {/* User CloudStorage */}
                        <div className="file-manager-application user-detail-file-manager">
                            <div className="content-area-wrapper container-xxl p-0">
                                <CloudStorageComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User CloudStorage */}
                    </TabPane>
                ) : null}

                <TabPane tabId="7">
                    {/* User permissions */}
                    <PermissionsTab permissions={permissions} />
                    {/* /User permissions */}
                </TabPane>

                <TabPane tabId="8">
                    {/* Device Log History listing */}
                    <RecentDevicesTab id={id} />
                    {/* /Device Log History listing */}
                </TabPane>
            </TabContent>
        </Fragment>
    )
}

export default UserTabs