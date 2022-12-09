// ** React Imports
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Card,
    Badge,
    Button,
    CardBody
} from 'reactstrap'

// ** Utils
import {
    onImageSrcError
} from '@utils'

// Constant
import {
    adminRoot,
    roleColors
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'

const UserInfoCard = ({
    id,
    userItem,
    onDeleteUser
}) => {

    return (
        <Fragment>
            <Card>
                <CardBody>
                    <div
                        className={`user-avatar-section ${userItem && userItem.ids ? '' : 'placeholder-glow'}`}
                    >
                        <div className="d-flex align-items-center flex-column">
                            {userItem && userItem.profile_photo_path ? <>
                                <img
                                    height="110"
                                    width="110"
                                    alt="user-avatar"
                                    className={`img-fluid rounded mt-3 mb-2 ${userItem && userItem.id ? '' : 'placeholder'}`}
                                    src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${userItem.profile_photo_path}`}
                                    onError={(currentTarget) => onImageSrcError(currentTarget)}
                                />
                            </> : <>
                                <img
                                    height="110"
                                    width="110"
                                    alt="user-avatar"
                                    className={`img-fluid rounded mt-3 mb-2 ${userItem && userItem.id ? '' : 'placeholder'}`}
                                    src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
                                    onError={(currentTarget) => onImageSrcError(currentTarget)}
                                />
                            </>}

                            <div className="d-flex flex-column align-items-center text-center w-100">
                                <div className="user-info w-100">
                                    <h4
                                        className={`${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                    >
                                        {(userItem && userItem.name)}
                                    </h4>

                                    {userItem && userItem.role && userItem.role.role_id ? (
                                        <Badge
                                            className={`text-capitalize ${userItem && userItem.id ? '' : 'placeholder'}`}
                                            color={roleColors[userItem.role.role_id] || roleColors[11]}
                                        >
                                            {(userItem.role && userItem.role.RoleName)}
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h4 className="fw-bolder border-bottom pb-50 mb-1">{T("Details")}</h4>
                    <div
                        className={`info-container ${userItem && userItem.id ? '' : 'placeholder-glow'}`}
                    >
                        <ul className="list-unstyled">
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("Username")}:</span>
                                <span
                                    className={`${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {(userItem && userItem.email)}
                                </span>
                            </li>

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("Email")}:</span>
                                <span
                                    className={`${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {(userItem && userItem.email)}
                                </span>
                            </li>

                            {userItem && userItem.Status ? (
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>{T("Status")}:</span>
                                    <Badge
                                        className={`text-capitalize ${userItem && userItem.id ? '' : 'placeholder'}`}
                                        color={`${userItem.Status === "Active" ? 'light-success' : 'light-warning'}`}>
                                        {(userItem && userItem.Status)}
                                    </Badge>
                                </li>
                            ) : null}

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("Role")}:</span>
                                <span
                                    className={`text-capitalize ${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {(userItem && userItem.role && userItem.role.RoleName)}
                                </span>
                            </li>

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("Contact")}:</span>
                                <span
                                    className={`${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {userItem && userItem.Contact}
                                </span>
                            </li>

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("Address")}:</span>
                                <span
                                    className={`${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {userItem && userItem.Address}
                                    {userItem && userItem.Address1 ? (`, ${userItem.Address1}`) : null}
                                </span>
                            </li>

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("City")}:</span>
                                <span
                                    className={`text-capitalize ${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {(userItem && userItem.City)}
                                </span>
                            </li>

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("State")}:</span>
                                <span
                                    className={`text-capitalize ${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {(userItem && userItem.State)}
                                </span>
                            </li>

                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>{T("Country")}:</span>
                                <span
                                    className={`text-capitalize ${userItem && userItem.id ? '' : 'placeholder w-50'}`}
                                >
                                    {(userItem && userItem.Country)}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div
                        className={`d-flex justify-content-center flex-wrap pt-2 ${userItem && userItem.id ? '' : 'placeholder-glow'}`}
                    >
                        <Button
                            tag={Link}
                            color="primary"
                            className={`me-1 mb-1 ${userItem && userItem.id ? '' : 'placeholder'}`}
                            to={`${adminRoot}/user/edit/${userItem.id}`}
                        >
                            {T("Edit")}
                        </Button>

                        <Button
                            color="danger"
                            className={`mb-1 ${userItem && userItem.id ? '' : 'placeholder'}`}
                            onClick={() => onDeleteUser(id)}
                        >
                            {T("Clear")}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default UserInfoCard