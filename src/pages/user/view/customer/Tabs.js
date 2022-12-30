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
    Monitor,
    FileText,
    Briefcase
} from 'react-feather'

/* User tab view components */
import BillingsTab from './BillingsTab'
import DocumentsTab from './DocumentsTab'
import RecentDevicesTab from './RecentDevicesTab'

// ** Translation
import { T } from '@localization'

const UserTabs = ({
    id,
    active,
    toggleTab
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
            </TabContent>
        </Fragment>
    )
}
export default UserTabs