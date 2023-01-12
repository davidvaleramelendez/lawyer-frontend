// ** React Imports
import { Fragment, useState } from 'react'

// ** Icons Imports
import {
    Rss,
    Edit,
    Info,
    Image,
    Users,
    AlignJustify
} from 'react-feather'

// ** Reactstrap Imports
import {
    Nav,
    Card,
    Navbar,
    Button,
    CardImg,
    NavItem,
    NavLink,
    Collapse
} from 'reactstrap'

// ** Custom Components
import LoadingPlaceHolder from '@components/loadingPlaceHolder/LoadingPlaceHolder'

// ** Default Avatar Image
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
    onImageSrcError
}) => {
    // ** States
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (<Fragment>
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
                                src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${userItem.profile_photo_path}`}
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
                                src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/images/avatars/avatar-blank.png`}
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
                            {/* <Nav className='mb-0' pills>
                                <NavItem>
                                    <NavLink className='fw-bold' active>
                                        <span className='d-none d-md-block'>Feed</span>
                                        <Rss className='d-block d-md-none' size={14} />
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='fw-bold'>
                                        <span className='d-none d-md-block'>About</span>
                                        <Info className='d-block d-md-none' size={14} />
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='fw-bold'>
                                        <span className='d-none d-md-block'>Photos</span>
                                        <Image className='d-block d-md-none' size={14} />
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='fw-bold'>
                                        <span className='d-none d-md-block'>Friends</span>
                                        <Users className='d-block d-md-none' size={14} />
                                    </NavLink>
                                </NavItem>
                            </Nav> */}
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
    </Fragment>)
}

export default ProfileHeader
