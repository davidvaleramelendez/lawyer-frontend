/* eslint-disable object-shorthand */

// ** React Imports
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  handleMenuHidden,
  createSiteSetting,
  handleContentWidth,
  clearLayoutMessage,
  handleMenuCollapsed,
  handleCustomizerOpen
} from '@store/layout'

// ** Third Party Components
import classnames from 'classnames'
import { ArrowUp } from 'react-feather'

// ** Reactstrap Imports
import { Navbar, Button } from 'reactstrap'

// ** Configs
import themeConfig from '@configs/themeConfig'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Custom Components
import Customizer from '@components/customizer'
import ScrollToTop from '@components/scrolltop'
import FooterComponent from './components/footer'
import NavbarComponent from './components/navbar'
import SidebarComponent from './components/menu/vertical-menu'

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
import '@styles/base/core/menu/menu-types/vertical-menu.scss'
import '@styles/base/core/menu/menu-types/vertical-overlay-menu.scss'

// ** Translation
import { T } from '@localization'

const VerticalLayout = (props) => {
  // ** Props
  const { menu, navbar, footer, children, menuData } = props

  // ** Hooks
  const [isRtl, setIsRtl] = useRTL()
  const { skin, setSkin } = useSkin()
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()

  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // ** Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector(state => state.layout)

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  // ** Vars
  const location = useLocation()
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

  // ** Toggles Menu Collapsed
  const setMenuCollapsed = (val) => dispatch(handleMenuCollapsed(val))

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

  //** This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false)
    }
  }, [location])

  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }
  }, [windowWidth])

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
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
  // console.log("layoutStore >>> ", layoutStore)

  // ** Vars
  const footerClasses = {
    static: 'footer-static',
    sticky: 'footer-fixed',
    hidden: 'footer-hidden'
  }

  const navbarWrapperClasses = {
    floating: 'navbar-floating',
    sticky: 'navbar-sticky',
    static: 'navbar-static',
    hidden: 'navbar-hidden'
  }

  const navbarClasses = {
    floating: contentWidth === 'boxed' ? 'floating-nav container-xxl' : 'floating-nav',
    sticky: 'fixed-top',
    static: 'navbar-static-top',
    hidden: 'd-none'
  }

  const bgColorCondition = navbarColor !== '' && navbarColor !== 'light' && navbarColor !== 'white'

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${footerClasses[footerType] || 'footer-static'
        }`,
        {
          // Modern Menu
          'vertical-menu-modern': windowWidth >= 1200,
          'menu-collapsed': menuCollapsed && windowWidth >= 1200,
          'menu-expanded': !menuCollapsed && windowWidth > 1200,

          // Overlay Menu
          'vertical-overlay-menu': windowWidth < 1200,
          'menu-hide': !menuVisibility && windowWidth < 1200,
          'menu-open': menuVisibility && windowWidth < 1200
        }
      )}
      {...(menuHidden ? { 'data-col': '1-column' } : {})}
    >
      {!menuHidden ? (
        <SidebarComponent
          skin={skin}
          menu={menu}
          menuData={menuData}
          menuCollapsed={menuCollapsed}
          menuVisibility={menuVisibility}
          setMenuCollapsed={setMenuCollapsed}
          setMenuVisibility={setMenuVisibility}
        />
      ) : null}

      <Navbar
        expand='lg'
        container={false}
        light={skin !== 'dark'}
        dark={skin === 'dark' || bgColorCondition}
        color={bgColorCondition ? navbarColor : undefined}
        className={classnames(
          `header-navbar navbar align-items-center ${navbarClasses[navbarType] || 'floating-nav'} navbar-shadow`
        )}
      >
        <div className='navbar-container d-flex content'>
          {navbar ? (
            navbar({ skin, setSkin, setMenuVisibility })
          ) : (
            <NavbarComponent setMenuVisibility={setMenuVisibility} skin={skin} setSkin={setSkin} />
          )}
        </div>
      </Navbar>
      {children}

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames('sidenav-overlay', {
          show: menuVisibility
        })}
        onClick={() => setMenuVisibility(false)}
      ></div>
      {/* Vertical Nav Menu Overlay */}

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
          setFooterType={setFooterType}
          setNavbarType={setNavbarType}
          menuCollapsed={menuCollapsed}
          setMenuHidden={setMenuHidden}
          openCustomizer={openCustomizer}
          setNavbarColor={setNavbarColor}
          setContentWidth={setContentWidth}
          setMenuCollapsed={setMenuCollapsed}
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

export default VerticalLayout
