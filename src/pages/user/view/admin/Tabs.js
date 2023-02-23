// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Nav,
    NavItem,
    NavLink
} from 'reactstrap'

// ** Icons Imports
import {
    Mail,
    Unlock,
    Calendar,
    HardDrive,
    Briefcase,
    UserCheck,
    CheckSquare,
    MessageCircle
} from 'react-feather'

// ** Translation
import { T } from '@localization'

const Tabs = ({
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
            <Nav pills className="mb-0">
                <NavItem>
                    <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                        <UserCheck size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Profile")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                        <Briefcase size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Case")}</span>
                    </NavLink>
                </NavItem>

                {onCheckUserPermission(8) ? (
                    <NavItem>
                        <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                            <Mail size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Email")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(10) ? (
                    <NavItem>
                        <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                            <MessageCircle size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Chat")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(12) ? (
                    <NavItem>
                        <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
                            <CheckSquare size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Task")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(14) ? (
                    <NavItem>
                        <NavLink active={active === "6"} onClick={() => toggleTab("6")}>
                            <Calendar size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Calendar")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {onCheckUserPermission(16) ? (
                    <NavItem>
                        <NavLink active={active === "7"} onClick={() => toggleTab("7")}>
                            <HardDrive size={18} />
                            <span className="fw-bold d-none d-sm-block ms-50">{T("Cloud")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                <NavItem>
                    <NavLink active={active === "8"} onClick={() => toggleTab("8")}>
                        <Unlock size={18} />
                        <span className="fw-bold d-none d-sm-block ms-50">{T("Permissions")}</span>
                    </NavLink>
                </NavItem>
            </Nav>
        </Fragment>
    )
}

export default Tabs