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
    Monitor,
    Briefcase,
    CheckSquare,
    MessageCircle
} from 'react-feather'

/* User tab view components */
import DocumentsTab from './DocumentsTab'
import RecentDevicesTab from './RecentDevicesTab'
import EmailComponent from '../components/email'
import ChatComponent from '../components/chat'
import TaskComponent from '../components/todo'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    active,
    toggleTab,
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

                <NavItem>
                    <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
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
                        {/* Emails */}
                        <div className="email-application user-detail-email">
                            <div className="content-area-wrapper container-xxl p-0">
                                <EmailComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /Emails */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(10) ? (
                    <TabPane tabId="3">
                        {/* Chats */}
                        <div className="chat-application user-detail-chat">
                            <div className="content-area-wrapper container-xxl p-0">
                                <ChatComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /Chats */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(12) ? (
                    <TabPane tabId="4">
                        <div className="todo-application user-detail-todo">
                            <div className="content-area-wrapper container-xxl p-0">
                                <TaskComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                    </TabPane>
                ) : null}

                <TabPane tabId="5">
                    {/* Device Log History listing */}
                    <RecentDevicesTab id={id} />
                    {/* /Device Log History listing */}
                </TabPane>
            </TabContent>
        </Fragment>
    )
}

export default UserTabs