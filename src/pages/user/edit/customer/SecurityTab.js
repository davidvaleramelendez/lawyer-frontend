// ** React Imports
import { Fragment } from 'react'

/* User tab view components */
import RecentDevices from './RecentDevices'
import ChangePassword from './ChangePassword'

const SecurityTab = ({
    id,
    encryptData,
    PlaceholderSchema
}) => {
    return (
        <Fragment>
            <ChangePassword
                id={id}
                encryptData={encryptData}
                PlaceholderSchema={PlaceholderSchema}
            />

            <RecentDevices id={id} />
        </Fragment>
    )
}
export default SecurityTab