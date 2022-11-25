// ** React Imports
import { Fragment } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

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
    onImageSrcError,
    getTransformDate
} from '@utils'

/* User tab view components */
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'
import PermissionsTab from './PermissionsTab'

const UserTabs = ({
    id,
    active,
    toggleTab
}) => {
    /* Hook */
    const { t } = useTranslation()

    /* Placeholder texts */
    const PlaceholderSchema = {
        username: "john.doe@example.com",
        fullname: "John Doe",
        emailAddress: "john.doe@example.com",
        status: `Select ${t("Status")}...`,
        roleId: `Select ${t("Role")}...`,
        company: "Company",
        DOB: "YYYY-MM-DD",
        contact: "Mobile",
        address: "Address Line 1",
        address1: "T-78, Groove Street",
        postcode: "597626",
        city: "City",
        state: "Manhattan",
        country: "United States",
        password: "********",
        retypePassword: "********"
    }

    return (
        <Fragment>
            <Nav pills className="mb-2">
                <NavItem>
                    <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
                        <User className="font-medium-3 me-50" />
                        <span className="fw-bold d-none d-sm-block">{t("Account")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
                        <Lock className="font-medium-3 me-50" />
                        <span className="fw-bold d-none d-sm-block">{t("Security")}</span>
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
                        <Unlock className="font-medium-3 me-50" />
                        <span className="fw-bold d-none d-sm-block">{t("Permissions")}</span>
                    </NavLink>
                </NavItem>
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