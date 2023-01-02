// ** React Imports
import { Fragment, useState } from 'react'

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
    Unlock,
    Monitor,
    FileText,
    Briefcase
} from 'react-feather'

// ** Utils
import {
    getCurrentUser
} from '@utils'

/* User tab view components */
import BillingsTab from './BillingsTab'
import DocumentsTab from './DocumentsTab'
import PermissionsTab from './PermissionsTab'
import RecentDevicesTab from './RecentDevicesTab'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    type,
    active,
    userItem,
    toggleTab,
    permissions,
    authUserItem
}) => {
    // ** State
    const [userData] = useState(getCurrentUser)

    /* Check user permission access */
    const onCheckPermissionAccess = (roleId = 10) => {
        const customerRoleId = 11
        const lawyerRoleId = 14
        const partnerRoleId = 12
        /* Logged in user */
        if (authUserItem && authUserItem.role_id === roleId) {
            /* Selected user */
            if ((userItem && userItem.role_id === customerRoleId)) {
                if (active === "4") {
                    toggleTab("1")
                }
                return false
            } else if ((
                (userItem && userItem.role_id !== roleId) &&
                (userItem && userItem.role_id !== lawyerRoleId) &&
                (userItem && userItem.role_id !== partnerRoleId)
            ) && type) {
                if (active === "4") {
                    toggleTab("1")
                }
                return false
            }
            /* /Selected user */
            return true
        } else if (userData && userData.role_id === roleId) {
            /* Selected user */
            if ((userItem && userItem.role_id === customerRoleId)) {
                if (active === "4") {
                    toggleTab("1")
                }
                return false
            } else if ((
                (userItem && userItem.role_id !== roleId) &&
                (userItem && userItem.role_id !== lawyerRoleId) &&
                (userItem && userItem.role_id !== partnerRoleId)
            ) && type) {
                if (active === "4") {
                    toggleTab("1")
                }
                return false
            }
            /* /Selected user */
            return true
        }
        /* /Logged in user */
        return false
    }
    /* /Check user permission access */

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
                        <FileText size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Bills")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                        <Monitor size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Recent devices")}</span>
                    </NavLink>
                </NavItem>

                {onCheckPermissionAccess() ? (
                    <NavItem>
                        <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                            <Unlock size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Permissions")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    {/* Case listing */}
                    <DocumentsTab id={id} />
                    {/* /Case listing */}
                </TabPane>

                <TabPane tabId="2">
                    {/* Invoice listing */}
                    <BillingsTab id={id} />
                    {/* /Invoice listing */}
                </TabPane>

                <TabPane tabId="3">
                    {/* Device Log History listing */}
                    <RecentDevicesTab id={id} />
                    {/* /Device Log History listing */}
                </TabPane>

                <TabPane tabId="4">
                    <PermissionsTab permissions={permissions} />
                </TabPane>
            </TabContent>
        </Fragment>
    )
}
export default UserTabs