// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Col,
    Row,
    TabPane,
    TabContent
} from 'reactstrap'

/* User tab view components */
import UserInfoCard from './UserInfoCard'
import DocumentsTab from './DocumentsTab'
import PermissionsTab from './PermissionsTab'
import RecentDevicesTab from './RecentDevicesTab'
import EmailComponent from '../components/email'
import ChatComponent from '../components/chat'
import TaskComponent from '../components/todo'
import CalendarComponent from '../components/calendar'
import CloudStorageComponent from '../components/cloudStorage'

const TabContents = ({
    id,
    active,
    userItem,
    permissions,
    onDeleteUser,
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
            <TabContent activeTab={active} className="mb-2">
                <TabPane tabId="1">
                    <Row>
                        <Col xl={4} lg={5} xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
                            {/* User profile info */}
                            <UserInfoCard
                                id={id}
                                userItem={userItem}
                                onDeleteUser={onDeleteUser}
                                authUserItem={authUserItem}
                            />
                            {/* User profile info */}
                        </Col>

                        <Col xl={8} lg={7} xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
                            {/* Device Log History listing */}
                            <RecentDevicesTab id={id} />
                            {/* /Device Log History listing */}
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tabId="2">
                    {/* Case listing */}
                    <DocumentsTab id={id} />
                    {/* /Case listing */}
                </TabPane>

                {onCheckUserPermission(8) ? (
                    <TabPane tabId="3">
                        {/* User Emails */}
                        <div className="email-application">
                            <div className="content-area-wrapper container-xxl p-0">
                                <EmailComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User Emails */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(10) ? (
                    <TabPane tabId="4">
                        {/* User Chats */}
                        <div className="chat-application">
                            <div className="content-area-wrapper container-xxl p-0">
                                <ChatComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User Chats */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(12) ? (
                    <TabPane tabId="5">
                        {/* User Tasks */}
                        <div className="todo-application">
                            <div className="content-area-wrapper container-xxl p-0">
                                <TaskComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User Tasks */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(14) ? (
                    <TabPane tabId="6">
                        {/* User Calendars */}
                        <CalendarComponent
                            userId={id}
                            userItem={userItem}
                            onCheckUserPermission={onCheckUserPermission}
                        />
                        {/* /User Calendars */}
                    </TabPane>
                ) : null}

                {onCheckUserPermission(16) ? (
                    <TabPane tabId="7">
                        {/* User CloudStorage */}
                        <div className="file-manager-application">
                            <div className="content-area-wrapper container-xxl p-0">
                                <CloudStorageComponent
                                    userId={id}
                                    onCheckUserPermission={onCheckUserPermission}
                                />
                            </div>
                        </div>
                        {/* /User CloudStorage */}
                    </TabPane>
                ) : null}

                <TabPane tabId="8">
                    {/* User permissions */}
                    <PermissionsTab permissions={permissions} />
                    {/* /User permissions */}
                </TabPane>
            </TabContent>
        </Fragment>
    )
}

export default TabContents