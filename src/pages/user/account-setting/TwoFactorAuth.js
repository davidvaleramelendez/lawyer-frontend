// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import {
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader
} from 'reactstrap'

const TwoFactorAuth = () => {
    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Two-step verification</CardTitle>
                </CardHeader>
                <CardBody className='my-2 py-25'>
                    <p className='fw-bolder'>Two factor authentication is not enabled yet.</p>
                    <p>
                        Two-factor authentication adds an additional layer of security to your account by requiring <br />
                        more than just a password to log in. Learn more.
                    </p>
                    <Button
                        type="button"
                        color="primary"
                    >
                        Enable two-factor authentication
                    </Button>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default TwoFactorAuth