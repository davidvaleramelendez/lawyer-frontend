// ** React Imports
import { Fragment } from 'react'

// ** Components
import ChangePassword from './ChangePassword'
import TwoFactorAuth from './TwoFactorAuth'

const SecurityTab = ({
    encryptData
}) => {

    return (
        <Fragment>
            <ChangePassword
                encryptData={encryptData}
            />

            <TwoFactorAuth />
        </Fragment>
    )
}

export default SecurityTab
