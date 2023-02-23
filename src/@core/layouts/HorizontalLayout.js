/* eslint-disable object-shorthand */

// ** React Imports
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  handleMenuHidden,
  createSiteSetting,
  clearLayoutMessage,
  handleContentWidth,
  handleCustomizerOpen
} from '@store/layout'

// ** Third Party Components
import classnames from 'classnames'
import { ArrowUp } from 'react-feather'

// ** Reactstrap Imports
import { Navbar, NavItem, Button } from 'reactstrap'

// ** Configs
import themeConfig from '@configs/themeConfig'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Custom Components
import Customizer from '@components/customizer'
import ScrollToTop from '@components/scrolltop'
import NavbarComponent from './components/navbar'
import FooterComponent from './components/footer'
import MenuComponent from './components/menu/horizontal-menu'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
import { useSkin } from '@hooks/useSkin'
import { useLayout } from '@hooks/useLayout'
import { useNavbarType } from '@hooks/useNavbarType'
import { useFooterType } from '@hooks/useFooterType'
import { useNavbarColor } from '@hooks/useNavbarColor'

// ** SiteSetting in utils
import {
  getSiteLayoutSetting,
  setSiteLayoutSetting
} from '@utils'

// ** Styles
import '@styles/base/core/menu/menu-types/horizontal-menu.scss'

// ** Translation
import { T } from '@localization'

const HorizontalLayout = (props) => {
  // ** Props
  const { navbar, menuData, footer, children, menu } = props

  // ** Hooks
  const { skin, setSkin } = useSkin()
  const [isRtl, setIsRtl] = useRTL()
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()

  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [navbarScrolled, setNavbarScrolled] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector(state => state.layout)

  // ** Vars
  const {
    openCustomizer,
    contentWidth,
    menuCollapsed,
    menuHidden
  } = layoutStore

  // ** Toggles Customizer
  const handleToggle = (event) => {
    if (event) {
      event.preventDefault()
    }

    dispatch(handleCustomizerOpen(!openCustomizer))
  }

  // ** Handles Content Width
  const setContentWidth = (val) => dispatch(handleContentWidth(val))

  // ** Handles Content Width
  const setMenuHidden = (val) => dispatch(handleMenuHidden(val))

  // ** Handles Menu Layouts
  const handleMenuLayout = (val = "vertical") => {
    const setting = getSiteLayoutSetting()
    setSiteLayoutSetting({
      ...setting,
      layout: val,
      skin: skin,
      contentWidth: contentWidth,
      menuCollapsed: menuCollapsed,
      footerType: footerType,
      navbarType: navbarType,
      navbarColor: navbarColor,
      menuHidden: menuHidden
    })

    setLayout(val)
    setLastLayout(val)
  }

  const onThemeSettingSubmit = () => {
    const siteSettingData = {
      skin: skin,
      layout: layout,
      navbarType: navbarType,
      contentWidth: contentWidth,
      menuCollapsed: menuCollapsed,
      menuHidden: menuHidden,
      navbarColor: navbarColor,
      footerType: footerType
    }

    dispatch(createSiteSetting(siteSettingData))
    // console.log("onThemeSettingSubmit ", siteSettingData)
  }

  // ** UseEffect Cleanup
  const cleanup = () => {
    setIsMounted(false)
    setNavbarScrolled(false)
  }

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 65 && navbarScrolled === false) {
        setNavbarScrolled(true)
      }
      if (window.pageYOffset < 65) {
        setNavbarScrolled(false)
      }
    })
    return () => cleanup()
  }, [])

  useEffect(() => {
    /* Close customizer sidebar */
    if (layoutStore.actionFlag && layoutStore.actionFlag === "CREATED_ITEM") {
      handleToggle()
    }

    /* For blank message api called inside */
    if (layoutStore && (layoutStore.success || layoutStore.error || layoutStore.actionFlag)) {
      dispatch(clearLayoutMessage())
    }

    /* Succes toast notification */
    if (layoutStore && layoutStore.success) {
      Notification(T("Success"), layoutStore.success, "success")
    }

    /* Error toast notification */
    if (layoutStore && layoutStore.error) {
      Notification(T("Error"), layoutStore.error, "warning")
    }
  }, [layoutStore.success, layoutStore.error, layoutStore.actionFlag])

  // ** Vars
  const footerClasses = {
    static: 'footer-static',
    sticky: 'footer-fixed',
    hidden: 'footer-hidden'
  }

  const navbarWrapperClasses = {
    floating: 'navbar-floating',
    sticky: 'navbar-sticky',
    static: 'navbar-static'
  }

  const navbarClasses = {
    floating: contentWidth === 'boxed' ? 'floating-nav container-xxl' : 'floating-nav',
    sticky: 'fixed-top'
  }

  const bgColorCondition = navbarColor !== '' && navbarColor !== 'light' && navbarColor !== 'white'

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames(
        `wrapper horizontal-layout horizontal-menu ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${footerClasses[footerType] || 'footer-static'
        } menu-expanded`
      )}
      {...(menuHidden ? { 'data-col': '1-column' } : {})}
    >
      <Navbar
        expand='lg'
        container={false}
        className={classnames('header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center', {
          'navbar-scrolled': navbarScrolled
        })}
      >
        {!navbar && (
          <div className='navbar-header d-xl-block d-none'>
            <ul className='nav navbar-nav'>
              <NavItem>
                <Link to='/' className='navbar-brand'>
                  <span className='brand-logo'>
                    <img src={themeConfig.app.appLogoImage} alt='logo' />
                  </span>
                  <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>
                </Link>
              </NavItem>
            </ul>
          </div>
        )}

        <div className='navbar-container d-flex content'>
          {navbar ? navbar({ skin, setSkin }) : <NavbarComponent skin={skin} setSkin={setSkin} />}
        </div>
      </Navbar>

      {!menuHidden ? (
        <div className='horizontal-menu-wrapper'>
          <Navbar
            tag='div'
            expand='sm'
            light={skin !== 'dark'}
            dark={skin === 'dark' || bgColorCondition}
            className={classnames(`header-navbar navbar-horizontal navbar-shadow menu-border`, {
              [navbarClasses[navbarType]]: navbarType !== 'static',
              'floating-nav': (!navbarClasses[navbarType] && navbarType !== 'static') || navbarType === 'floating'
            })}
          >
            {menu ? menu({ menuData, routerProps, currentActiveItem }) : <MenuComponent menuData={menuData} />}
          </Navbar>
        </div>
      ) : null}

      {children}
      {themeConfig.layout.customizer === true ? (
        <Customizer
          skin={skin}
          isRtl={isRtl}
          layout={layout}
          setSkin={setSkin}
          setIsRtl={setIsRtl}
          menuHidden={menuHidden}
          footerType={footerType}
          navbarType={navbarType}
          themeConfig={themeConfig}
          navbarColor={navbarColor}
          handleToggle={handleToggle}
          contentWidth={contentWidth}
          setMenuHidden={setMenuHidden}
          setFooterType={setFooterType}
          setNavbarType={setNavbarType}
          openCustomizer={openCustomizer}
          setNavbarColor={setNavbarColor}
          setContentWidth={setContentWidth}
          handleMenuLayout={handleMenuLayout}
          onThemeSettingSubmit={onThemeSettingSubmit}
        />
      ) : null}

      <footer
        className={classnames(`footer footer-light ${footerClasses[footerType] || 'footer-static'}`, {
          'd-none': footerType === 'hidden'
        })}
      >
        {footer ? footer : <FooterComponent footerType={footerType} footerClasses={footerClasses} />}
      </footer>


      {themeConfig.layout.scrollTop === true ? (
        <div className='scroll-to-top'>
          <ScrollToTop showOffset={300} className='scroll-top d-block'>
            <Button className='btn-icon' color='primary'>
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  )
}
export default HorizontalLayout
