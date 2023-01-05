// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Store & Actions
import {
    updateUserLoader,
    updatePermission
} from '@src/pages/user/store'
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

// ** Translation
import { T } from '@localization'

const PermissionsTab = ({
    id
}) => {

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
    /* Set or remove checked check for permission */
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
    /* /Set or remove checked check for permission */

    /* Check and set permission */
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
    /* /Check and set permission */

    /* Permission submit event */
    const onPermissionSubmit = () => {
        const userData = {
            user_id: id,
            permissions: permission || []
        }
        dispatch(updateUserLoader(false))
        dispatch(updatePermission(userData))
    }
    /* /Permission submit event */
    /* /Permission */

    return (
        <Fragment>
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">{T("Permissions")}</CardTitle>
                </CardHeader>

                <Table className='text-nowrap text-center border-bottom' responsive>
                    <thead>
                        <tr>
                            <th className='text-start'>{T('Type')}</th>
                            <th>Allow</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-start'>{T('See All Users')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="all-users-list"
                                        value={2}
                                        className="opacity-100"
                                        checked={getPermissionChecked(2)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 2)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Add User')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="add-user"
                                        value={7}
                                        className="opacity-100"
                                        checked={getPermissionChecked(7)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 7)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Delete Users')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="delete-user"
                                        value={1}
                                        className="opacity-100"
                                        checked={getPermissionChecked(1)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 1)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See Contacts')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-contacts"
                                        value={3}
                                        className="opacity-100"
                                        checked={getPermissionChecked(3)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 3)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See All Cases')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-cases"
                                        value={4}
                                        className="opacity-100"
                                        checked={getPermissionChecked(4)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 4)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Update Cases')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="update-case"
                                        value={5}
                                        className="opacity-100"
                                        checked={getPermissionChecked(5)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 5)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See Letters')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-letters"
                                        value={6}
                                        className="opacity-100"
                                        checked={getPermissionChecked(6)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 6)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See All Emails')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-emails"
                                        value={8}
                                        className="opacity-100"
                                        checked={getPermissionChecked(8)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 8)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Compose Email')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="compose-emails"
                                        value={9}
                                        className="opacity-100"
                                        checked={getPermissionChecked(9)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 9)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See All Chats')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-chats"
                                        value={10}
                                        className="opacity-100"
                                        checked={getPermissionChecked(10)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 10)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Chat with User')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="chat-with-user"
                                        value={11}
                                        className="opacity-100"
                                        checked={getPermissionChecked(11)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 11)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See All Tasks')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-tasks"
                                        value={12}
                                        className="opacity-100"
                                        checked={getPermissionChecked(12)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 12)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Add Task')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="add-task"
                                        value={13}
                                        className="opacity-100"
                                        checked={getPermissionChecked(13)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 13)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See All Appointments')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-appointments"
                                        value={14}
                                        className="opacity-100"
                                        checked={getPermissionChecked(14)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 14)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Create Appointment')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="create-appointment"
                                        value={15}
                                        className="opacity-100"
                                        checked={getPermissionChecked(15)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 15)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('See All Cloud Server')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="see-all-cloud-server"
                                        value={16}
                                        className="opacity-100"
                                        checked={getPermissionChecked(16)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 16)}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='text-start'>{T('Add Data Cloud')}</td>
                            <td>
                                <div className='d-flex form-check justify-content-center'>
                                    <Input
                                        type='checkbox'
                                        id="add-data-cloud-server"
                                        value={17}
                                        className="opacity-100"
                                        checked={getPermissionChecked(17)}
                                        onChange={(event) => onPermissionCheckboxChange(event.target.checked, 17)}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <div className="d-flex flex-wrap p-2">
                    <Button
                        type='button'
                        color='primary'
                        disabled={!store.loading}
                        onClick={() => onPermissionSubmit()}
                    >
                        {T("Update")}
                    </Button>
                </div>
            </Card>
        </Fragment>
    )
}
export default PermissionsTab