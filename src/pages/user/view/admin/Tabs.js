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
    Briefcase,
    CheckSquare,
    MessageCircle
} from 'react-feather'

/* User tab view components */
import DocumentsTab from './DocumentsTab'
import PermissionsTab from './PermissionsTab'
import RecentDevicesTab from './RecentDevicesTab'
import EmailTab from './emailTab'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    active,
    toggleTab,
    permissions
}) => {
    return (
        <Fragment>
            <Nav pills className="mb-2">
                <NavItem>
                    <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                        <Briefcase size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Documents")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                        <Monitor size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Recent devices")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                        <Unlock size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Permissions")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                        <Mail size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Email")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
                        <MessageCircle size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Chat")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "6"} onClick={() => toggleTab("6")}>
                        <CheckSquare size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Task")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "7"} onClick={() => toggleTab("7")}>
                        <Calendar size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Calendar")}</span>
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    {/* Case listing */}
                    <DocumentsTab id={id} />
                    {/* /Case listing */}
                </TabPane>

                <TabPane tabId="2">
                    {/* Device Log History listing */}
                    <RecentDevicesTab id={id} />
                    {/* /Device Log History listing */}
                </TabPane>

                <TabPane tabId="3">
                    {/* User permissions */}
                    <PermissionsTab permissions={permissions} />
                    {/* /User permissions */}
                </TabPane>

                <TabPane tabId="4">
                    {/* Emails */}
                    <div className="email-application user-detail-email">
                        <div className="content-area-wrapper container-xxl p-0">
                            <EmailTab
                                userId={id}
                            />
                        </div>
                    </div>
                    {/* /Emails */}
                </TabPane>

                <TabPane tabId="5">
                </TabPane>

                <TabPane tabId="6">
                </TabPane>

                <TabPane tabId="7">
                </TabPane>
            </TabContent>
        </Fragment>
    )
}

export default UserTabs