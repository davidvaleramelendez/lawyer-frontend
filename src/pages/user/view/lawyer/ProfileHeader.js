// ** React Imports
import { Fragment, useState } from 'react'

// ** Icons Imports
import {
    AlignJustify
} from 'react-feather'

// ** Reactstrap Imports
import {
    Card,
    Navbar,
    Button,
    CardImg,
    Collapse
} from 'reactstrap'

// ** Custom Components
import LoadingPlaceHolder from '@components/loadingPlaceHolder/LoadingPlaceHolder'

// ** Default Images
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'
import defaultCover from '@src/assets/images/profile/user-uploads/profile-banner.png'

// ** User view Components
import Tabs from './Tabs'

const ProfileHeader = ({
    id,
    active,
    userItem,
    toggleTab,
    permissions,
    authUserItem,
    getCurrentUser,
    onImageSrcError,
    getWebPreviewUrl
}) => {
    // ** States
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    /* Rendering user image */
    const renderUserProfilePicture = () => {
        if (userItem && userItem.profile_photo_path) {
            return getWebPreviewUrl(userItem.profile_photo_path)
        }

        return false
    }
    /* /Rendering user image */

    return (
        <Fragment>
            <Card className='profile-header user-profile-header mb-2'>
                <div className="position-relative">
                    {userItem && !userItem.id ? (
                        <LoadingPlaceHolder
                            customClassName="card-img-top"
                            extraStyles={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                        />
                    ) : null}

                    <CardImg src={defaultCover} alt='User Profile Image' top />
                </div>

                <div className='position-relative'>
                    <div className='profile-img-container d-flex align-items-center'>
                        <div className='profile-img position-relative'>
                            {userItem && userItem.profile_photo_path ? (
                                <img
                                    className='rounded img-fluid'
                                    src={renderUserProfilePicture() || defaultAvatar}
                                    onError={(currentTarget) => onImageSrcError(currentTarget)}
                                    alt='Card image'
                                />
                            ) : (<>
                                {userItem && !userItem.id ? (
                                    <LoadingPlaceHolder
                                        customClassName="rounded img-fluid"
                                        extraStyles={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                                    />
                                ) : null}
                                <img
                                    className='rounded img-fluid'
                                    src={defaultAvatar}
                                    onError={(currentTarget) => onImageSrcError(currentTarget)}
                                    alt='Card image'
                                />
                            </>)}
                        </div>
                        <div className='profile-title ms-3'>
                            <h2 className='text-white'>{(userItem && userItem.name) || ""}</h2>
                            <p className='text-white'>{(userItem && userItem.role && userItem.role.RoleName) || ""}</p>
                        </div>
                    </div>
                </div>

                <div className='profile-header-nav'>
                    <Navbar container={false} className='justify-content-end justify-content-md-between w-100' expand='md' light>
                        <Button color='' className='btn-icon navbar-toggler' onClick={toggle}>
                            <AlignJustify size={21} />
                        </Button>
                        <Collapse isOpen={isOpen} navbar>
                            <div className='profile-tabs d-flex justify-content-between flex-wrap mt-1 mt-md-0'>
                                <Tabs
                                    id={id}
                                    active={active}
                                    toggleTab={toggleTab}
                                    permissions={permissions}
                                    authUserItem={authUserItem}
                                    getCurrentUser={getCurrentUser}
                                />
                            </div>
                        </Collapse>
                    </Navbar>
                </div>
            </Card>
        </Fragment>
    )
}

export default ProfileHeader
