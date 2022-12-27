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
    Info,
    User,
    Settings
} from 'react-feather'

// ** Utils
import {
    onImageSrcError
} from '@utils'

/* User tab view components */
import AccountTab from './AccountTab'
import LanguageLabels from './language-labels'
import ImapTab from './ImapTab'
import CompanySettingTab from './CompanySettingTab'

const Tabs = ({
    active,
    userData,
    toggleTab,
    languages,
    selLanguage,
    setSelLanguage
}) => {
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

    return (
        <Fragment>
            <Nav pills className="mb-2">
                <NavItem>
                    <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                        <User size={14} className="me-50" />
                        <span className="fw-bold d-none d-sm-block">{T('Account')}</span>
                    </NavLink>
                </NavItem>

                {denyTabPermissionAccess(11) ? (
                    <NavItem>
                        <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                            <Settings size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T("Company Setting")}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {denyTabPermissionAccess(11) ? (
                    <NavItem>
                        <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                            <Info size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T('Language Labels')}</span>
                        </NavLink>
                    </NavItem>
                ) : null}

                {denyTabPermissionAccess(11) ? (
                    <NavItem>
                        <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
                            <Info size={14} className="me-50" />
                            <span className="fw-bold d-none d-sm-block">{T('IMAP information')}</span>
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
                        onImageSrcError={onImageSrcError}
                    />
                </TabPane>

                <TabPane tabId="2">
                    <CompanySettingTab
                        userData={userData}
                    />
                </TabPane>

                <TabPane tabId="3">
                    <LanguageLabels />
                </TabPane>

                <TabPane tabId="4">
                    <ImapTab />
                </TabPane>
            </TabContent>
        </Fragment>
    )
}
export default Tabs