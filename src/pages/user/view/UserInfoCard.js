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

// ** Custom Components
import LoadingPlaceHolder from '@components/loadingPlaceHolder/LoadingPlaceHolder'

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
                    <div className={`user-avatar-section`}>
                        <div className="d-flex align-items-center flex-column">
                            {userItem && userItem.profile_photo_path ? (
                                <div
                                    className="mt-3 mb-2 zindex-1"
                                    style={{
                                        minWidth: '110px',
                                        minHeight: '110px'
                                    }}
                                >
                                    {userItem && !userItem.id ? (
                                        <LoadingPlaceHolder
                                            extraStyles={{ width: '110px', height: '110px', position: 'absolute', zIndex: 1, borderRadius: '0.357rem' }}
                                        />
                                    ) : null}
                                    <img
                                        height="110"
                                        width="110"
                                        alt="user-avatar"
                                        className={`img-fluid rounded`}
                                        src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${userItem.profile_photo_path}`}
                                        onError={(currentTarget) => onImageSrcError(currentTarget)}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="mt-3 mb-2 zindex-1"
                                    style={{
                                        minWidth: '110px',
                                        minHeight: '110px'
                                    }}
                                >
                                    {userItem && !userItem.id ? (
                                        <LoadingPlaceHolder
                                            extraStyles={{ width: '110px', height: '110px', position: 'absolute', zIndex: 1, borderRadius: '0.357rem' }}
                                        />
                                    ) : null}

                                    <img
                                        height="110"
                                        width="110"
                                        alt="user-avatar"
                                        className={`img-fluid rounded`}
                                        src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
                                        onError={(currentTarget) => onImageSrcError(currentTarget)}
                                    />
                                </div>
                            )}

                            <div className="d-flex flex-column align-items-center text-center w-100">
                                <div className="user-info w-100">
                                    {userItem && userItem.id ? (
                                        <h4>
                                            {(userItem && userItem.name) || ""}
                                        </h4>
                                    ) : (
                                        <Fragment>
                                            <LoadingPlaceHolder
                                                extraStyles={{ height: '20px', width: 'max-content', minWidth: '210px', borderRadius: '10px', margin: '0 auto' }}
                                            />

                                            <LoadingPlaceHolder
                                                extraStyles={{ height: '15px', width: 'max-content', minWidth: '76px', borderRadius: '10px', margin: '7px auto' }}
                                            />
                                        </Fragment>
                                    )}

                                    {userItem && userItem.role && userItem.role.role_id ? (
                                        <Badge
                                            className={`text-capitalize`}
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
                    <div className={`info-container`}>
                        <ul className="list-unstyled">
                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Username")}:</span>
                                        <span>{(userItem && userItem.email) || ""}</span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "268px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Email")}:</span>
                                        <span>{(userItem && userItem.email) || ""}</span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "268px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Status")}:</span>
                                        {userItem && userItem.Status ? (
                                            <Badge
                                                className={`text-capitalize`}
                                                color={`${userItem.Status === "Active" ? "light-success" : "light-warning"}`}>
                                                {(userItem && userItem.Status)}
                                            </Badge>
                                        ) : null}
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "109px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Role")}:</span>
                                        <span className={`text-capitalize`}>
                                            {(userItem && userItem.role && userItem.role.RoleName) || ""}
                                        </span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "110px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Contact")}:</span>
                                        <span>{(userItem && userItem.Contact) || ""}</span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "159px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Address")}:</span>
                                        <span>
                                            {userItem && userItem.Address}
                                            {userItem && userItem.Address1 ? (`, ${userItem.Address1}`) : null}
                                        </span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "268px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("City")}:</span>
                                        <span className={`text-capitalize`}>
                                            {(userItem && userItem.City) || ""}
                                        </span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "110px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("State")}:</span>
                                        <span className={`text-capitalize`}>
                                            {(userItem && userItem.State) || ""}
                                        </span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "110px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>

                            <li className="mb-75">
                                {userItem && userItem.id ? (
                                    <Fragment>
                                        <span className="fw-bolder me-25">{T("Country")}:</span>
                                        <span className={`text-capitalize`}>
                                            {(userItem && userItem.Country) || ""}
                                        </span>
                                    </Fragment>
                                ) : (
                                    <LoadingPlaceHolder
                                        extraStyles={{
                                            height: "18px",
                                            width: 'max-content',
                                            minWidth: "140px",
                                            borderRadius: "10px",
                                            marginTop: '13px'
                                        }}
                                    />
                                )}
                            </li>
                        </ul>
                    </div>

                    <div className={`d-flex justify-content-center flex-wrap pt-2`}>
                        <Button
                            tag={Link}
                            color="primary"
                            className={`me-1 mb-1`}
                            disabled={userItem && !userItem.id}
                            to={`${adminRoot}/user/edit/${userItem.id}`}
                        >
                            {T("Edit")}
                        </Button>

                        <Button
                            color="danger"
                            className={`mb-1`}
                            disabled={userItem && !userItem.id}
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