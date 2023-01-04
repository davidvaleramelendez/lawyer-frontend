// ** React Imports
import { Fragment } from "react"

// ** Reactstrap Imports
import {
    Card,
    Input,
    Table,
    CardTitle,
    CardHeader
} from 'reactstrap'

// ** Translation
import { T } from '@localization'

const PermissionsTab = ({
    permissions
}) => {

    const getPermissionCheck = (value) => {
        if (permissions && permissions.length) {
            const index = permissions.findIndex((x) => x.permission_id === value)
            if (index !== -1) {
                return true
            }
            return false
        }
        return false
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T("Permissions")}</CardTitle>
                </CardHeader>

                <Table className="text-nowrap text-center mb-3" responsive>
                    <thead>
                        <tr>
                            <th className="text-start">{T('Type')}</th>
                            <th>{T('Allow')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-start">{T('See All Users')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(2)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-start">{T('Add User')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(7)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-start">{T('Delete Users')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(1)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-start">{T('See Contacts')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(3)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-start">{T('See All Cases')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(4)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-start">{T('Update Cases')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(5)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-start">{T('See Letters')}</td>
                            <td>
                                <div className="d-flex form-check justify-content-center">
                                    <Input
                                        disabled
                                        type="checkbox"
                                        className="opacity-100"
                                        checked={getPermissionCheck(6)}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </Fragment>
    )
}

export default PermissionsTab