// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Card,
    CardBody
} from 'reactstrap'

// ** React-Tab
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

// ** Imap components
import EmailImap from './EmailImap'
import ContactImap from './ContactImap'

// ** Translation
import { T } from '@localization'

const ImapTab = () => {

    return (
        <Fragment>
            <Card className="user-edit-card">
                <CardBody className="user-edit-card-body pl-4 pr-4">
                    <Tabs>
                        <TabList>
                            <Tab>{T("Email")}</Tab>
                            <Tab>{T("Contact")}</Tab>
                        </TabList>

                        <TabPanel>
                            <EmailImap />
                        </TabPanel>

                        <TabPanel>
                            <ContactImap />
                        </TabPanel>
                    </Tabs>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default ImapTab