// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Nav,
    NavLink,
    TabPane,
    NavItem,
    TabContent
} from 'reactstrap'

// ** Translation
import { T } from '@localization'

// ** Icons Import
import {
    Key,
    Info,
    Lock,
    User,
    Settings
} from 'react-feather'

// ** Utils
import {
    encryptData,
    getCurrentUser,
    onImageSrcError,
    getWebPreviewUrl
} from '@utils'

/* User tab view components */
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'
import LanguageLabels from './language-labels'
import ImapTab from './ImapTab'
import CompanySettingTab from './CompanySettingTab'
import ApiTokenTab from './ApiTokenTab'

const Tabs = ({
    active,
    userData,
    toggleTab,
    languages,
    selLanguage,
    setSelLanguage
}) => {
    /* Not able to accessible based on role */
    const denyTabPermissionAccess = (roleId) => {
        if (userData && userData.id) {
            if (userData.role_id === roleId) {
                if (active !== "1") {
                    toggleTab("1")
                }
                return false
            }
            return true
        }
        return true
    }
    /* /Not able to accessible based on role */

    /* Only accessible based on role */
    const tabPermissionAccess = (roleId) => {
        if (userData && userData.id) {
            if (userData.role_id === roleId) {
                return true
            }
            return false
        }
        return false
    }
    /* /Only accessible based on role */

    return (
        <Fragment>
            <Nav pills className="mb-2">
                <NavItem>
                    <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                        <User size={14} className="me-50" />
                        <span className="fw-bold d-none d-sm-block">{T('Account')}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                        <Lock size={14} className="me-50" />
                        <span className="fw-bold d-none d-sm-block">{T('Security')}</span>
                    </NavLink>
                </NavItem>

                {denyTabPermissionAccess(11) ? (
                    <NavItem>
                        <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                            <Settings size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T("Company Setting")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {denyTabPermissionAccess(11) ? (
                    <NavItem>
                        <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                            <Info size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T('Language Labels')}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {denyTabPermissionAccess(11) ? (
                    <NavItem>
                        <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
                            <Info size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T('IMAP information')}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {tabPermissionAccess(10) ? (
                    <NavItem>
                        <NavLink active={active === "6"} onClick={() => toggleTab("6")}>
                            <Key size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T('Api Token')}</span>
                        </NavLink>
                    </NavItem>
                ) : null}
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    <AccountTab
                        userData={userData}
                        languages={languages}
                        selLanguage={selLanguage}
                        setSelLanguage={setSelLanguage}
                        getCurrentUser={getCurrentUser}
                        onImageSrcError={onImageSrcError}
                        getWebPreviewUrl={getWebPreviewUrl}
                    />
                </TabPane>

                <TabPane tabId="2">
                    <SecurityTab
                        encryptData={encryptData}
                    />
                </TabPane>

                {denyTabPermissionAccess(11) ? (
                    <TabPane tabId="3">
                        <CompanySettingTab
                            userData={userData}
                        />
                    </TabPane>
                ) : null}

                {denyTabPermissionAccess(11) ? (
                    <TabPane tabId="4">
                        <LanguageLabels />
                    </TabPane>
                ) : null}

                {denyTabPermissionAccess(11) ? (
                    <TabPane tabId="5">
                        <ImapTab />
                    </TabPane>
                ) : null}

                {tabPermissionAccess(10) ? (
                    <TabPane tabId="6">
                        <ApiTokenTab />
                    </TabPane>
                ) : null}
            </TabContent>
        </Fragment>
    )
}
export default Tabs