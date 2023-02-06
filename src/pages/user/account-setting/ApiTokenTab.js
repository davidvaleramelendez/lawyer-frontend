// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Card,
    CardBody
} from 'reactstrap'

// ** React-Tab
import {
    Tab,
    Tabs,
    TabList,
    TabPanel
} from 'react-tabs'

// ** Api token components
import PdfApiToken from './PdfApiToken'
import PlacetelCallApiToken from './PlacetelCallApiToken'
import DropboxApiToken from './DropboxApiToken'

// ** Translation
import { T } from '@localization'

// ** Styles
import 'react-tabs/style/react-tabs.css'

const ApiTokenTab = () => {

    return (
        <Fragment>
            <Card className="user-edit-card">
                <CardBody className="user-edit-card-body pl-4 pr-4">
                    <Tabs>
                        <TabList>
                            <Tab>{T("PDF")}</Tab>
                            <Tab>{T("Placetel Call")}</Tab>
                            <Tab>{T("Dropbox")}</Tab>
                        </TabList>

                        <TabPanel>
                            <PdfApiToken />
                        </TabPanel>

                        <TabPanel>
                            <PlacetelCallApiToken />
                        </TabPanel>

                        <TabPanel>
                            <DropboxApiToken />
                        </TabPanel>
                    </Tabs>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default ApiTokenTab