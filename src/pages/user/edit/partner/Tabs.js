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

// ** Icons Import
import {
    User,
    Lock
} from 'react-feather'

// ** Utils
import {
    encryptData,
    onImageSrcError,
    getWebPreviewUrl,
    getTransformDate
} from '@utils'

/* User tab view components */
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    active,
    toggleTab
}) => {
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
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    <AccountTab
                        id={id}
                        onImageSrcError={onImageSrcError}
                        getTransformDate={getTransformDate}
                        getWebPreviewUrl={getWebPreviewUrl}
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
            </TabContent>
        </Fragment>
    )
}
export default UserTabs