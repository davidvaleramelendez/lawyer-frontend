// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Store & Actions
import {
    updateUserLoader,
    updatePermission
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
    Card,
    Input,
    Table,
    Button,
    CardTitle,
    CardHeader
} from 'reactstrap'

const PermissionsTab = ({
    id
}) => {
    // ** Hooks
    const { t } = useTranslation()

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** States
    const [permission, setPermission] = useState(store.permissions || [])

    // ** Get user on mount based on id
    useEffect(() => {
        if (store && store.actionFlag && (store.actionFlag === "USER_PERMISSION" || store.actionFlag === "PERMISSION_ADDED")) {
            setPermission(store.permissions)
        }
    }, [store.actionFlag])

    /* Permission */
    const onPermissionCheckboxChange = (checked, value) => {
        const permissionData = [...permission]
        if (value) {
            const checkIndex = permissionData.findIndex(x => x.permission_id === value)
            if (checkIndex !== -1) {
                if (checked) {
                    permissionData[checkIndex].permission_id = value
                } else {
                    permissionData.splice(checkIndex, 1)
                }
            } else {
                permissionData.push({ permission_id: value })
            }
        }
        setPermission([...permissionData])
    }

    const getPermissionChecked = (value) => {
        if (permission && permission.length) {
            const index = permission.findIndex((x) => x.permission_id === value)
            if (index !== -1) {
                return true
            }
            return false
        }
        return false
    }

    const onPermissionSubmit = () => {
        if (permission && permission.length) {
            const userData = {
                user_id: id,
                permissions: permission
            }
            dispatch(updateUserLoader(false))
            dispatch(updatePermission(userData))
        }
    }
    /* /Permission */

    return (
        <Fragment>
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{t("Permissions")}</CardTitle>
                </CardHeader>

                <Table className='text-nowrap text-center border-bottom' responsive>
                    <thead>
                        <tr>
                            <th className='text-start'>Type</th>
                            <th>Allow</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-start'>Delete Users</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="admin-read"
                                        value={1}
                                        checked={getPermissionChecked(1)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 1)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>See All Users</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="staff-read"
                                        value={2}
                                        checked={getPermissionChecked(2)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 2)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>See Contacts</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="author-read"
                                        value={3}
                                        checked={getPermissionChecked(3)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 3)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>See All Cases</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="contributor-read"
                                        value={4}
                                        checked={getPermissionChecked(4)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 4)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>Update Cases</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="user-read"
                                        value={5}
                                        checked={getPermissionChecked(5)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 5)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>See Letters</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="user-letters"
                                        value={6}
                                        checked={getPermissionChecked(6)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 6)}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <div className='d-flex flex-wrap p-2'>
                    <Button
                        type='button'
                        color='primary'
                        disabled={!store.loading}
                        onClick={() => onPermissionSubmit()}
                    >
                        {t("Update")}
                    </Button>
                </div>
            </Card>
        </Fragment>
    )
}
export default PermissionsTab