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

// ** Custom Components
import LoadingPlaceHolder from '@components/loadingPlaceHolder/LoadingPlaceHolder'

// Constant
import {
    adminRoot
} from '@constant/defaultValues'

// ** Translation
import { T } from '@localization'

const UserInfoCard = ({
    id,
    userItem,
    onDeleteUser,
    authUserItem
}) => {
    /* Check permission */
    const onCheckPermission = (id) => {
        if (authUserItem && authUserItem.permission && authUserItem.permission.length) {
            const index = authUserItem.permission.findIndex((x) => x.permission_id === id)
            if (index !== -1) {
                return true
            }
        }
        return false
    }
    /* /Check permission */

    return (
        <Fragment>
            <Card>
                <CardBody>
                    <h4 className="fw-bolder border-bottom pb-50 mb-1">{T("ABOUT")}</h4>
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
                        {userItem && userItem.id ? (
                            <Fragment>
                                <Button
                                    tag={Link}
                                    color="primary"
                                    className={`mb-1`}
                                    disabled={userItem && !userItem.id}
                                    to={`${adminRoot}/user/lawyer/edit/${userItem.id}`}
                                >
                                    {T("Edit")}
                                </Button>

                                {onCheckPermission(1) ? (
                                    <Button
                                        color="danger"
                                        className={`ms-1 mb-1`}
                                        disabled={userItem && !userItem.id}
                                        onClick={() => onDeleteUser(id)}
                                    >
                                        {T("Clear")}
                                    </Button>
                                ) : null}
                            </Fragment>
                        ) : (
                            <LoadingPlaceHolder
                                extraStyles={{
                                    height: "39px",
                                    width: 'max-content',
                                    minWidth: "170px",
                                    borderRadius: "10px"
                                }}
                            />
                        )}
                    </div>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default UserInfoCard