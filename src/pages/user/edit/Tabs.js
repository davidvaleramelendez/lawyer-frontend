// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import {
    Nav,
    NavLink,
    TabPane,
    NavItem,
    TabContent
} from 'reactstrap'

// ** Icons Import
import {
    User,
    Lock,
    Unlock
} from 'react-feather'

// ** Utils
import {
    encryptData,
    getCurrentUser,
    onImageSrcError,
    getTransformDate
} from '@utils'

/* User tab view components */
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'
import PermissionsTab from './PermissionsTab'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    type,
    active,
    userItem,
    toggleTab,
    authUserItem
}) => {
    // ** State
    const [userData] = useState(getCurrentUser)

    /* Placeholder texts */
    const PlaceholderSchema = {
        fullname: "John Doe",
        first_name: "John",
        last_name: "Doe",
        emailAddress: "john.doe@example.com",
        status: `${T("Select Status")}...`,
        roleId: `${T("Select Role")}...`,
        company: T("Company"),
        DOB: "YYYY-MM-DD",
        contact: T("Mobile"),
        address: `${T('Address Line')}1`,
        address1: "T-78, Groove Street",
        postcode: "597626",
        city: T("City"),
        state: "Manhattan",
        country: "United States",
        password: "********",
        retypePassword: "********"
    }

    /* Check user permission access */
    const onCheckPermissionAccess = (roleId, customerRoleId = 11) => {
        /* Logged in user */
        if (authUserItem && authUserItem.role_id === roleId) {
            /* Selected user */
            if ((userItem && userItem.role_id === customerRoleId)) {
                if (active === "3") {
                    toggleTab("1")
                }
                return false
            } else if ((userItem && userItem.role_id !== roleId) && type) {
                if (active === "3") {
                    toggleTab("1")
                }
                return false
            }
            /* /Selected user */
            return true
        } else if (userData && userData.role_id === roleId) {
            /* Selected user */
            if ((userItem && userItem.role_id === customerRoleId)) {
                if (active === "3") {
                    toggleTab("1")
                }
                return false
            } else if ((userItem && userItem.role_id !== roleId) && type) {
                if (active === "3") {
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
                        <User className="font-medium-3 me-50" />
                        <span className="fw-bold d-none d-sm-block">{T("Account")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                        <Lock className="font-medium-3 me-50" />
                        <span className="fw-bold d-none d-sm-block">{T("Security")}</span>
                    </NavLink>
                </NavItem>

                {onCheckPermissionAccess(10) ? (
                    <NavItem>
                        <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                            <Unlock className="font-medium-3 me-50" />
                            <span className="fw-bold d-none d-sm-block">{T("Permissions")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    <AccountTab
                        id={id}
                        onImageSrcError={onImageSrcError}
                        getTransformDate={getTransformDate}
                        PlaceholderSchema={PlaceholderSchema}
                    />
                </TabPane>

                <TabPane tabId="2">
                    <SecurityTab
                        id={id}
                        encryptData={encryptData}
                        PlaceholderSchema={PlaceholderSchema}
                    />
                </TabPane>

                <TabPane tabId="3">
                    <PermissionsTab id={id} />
                </TabPane>
            </TabContent>
        </Fragment>
    )
}
export default UserTabs