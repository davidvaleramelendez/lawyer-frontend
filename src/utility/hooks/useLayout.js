/* eslint-disable object-shorthand */

//** React Imports
import { useEffect } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { handleLayout, handleLastLayout } from '@store/layout'

// ** SiteSetting in utils
import {
  getSiteLayoutSetting,
  setSiteLayoutSetting
} from '@utils'

export const useLayout = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.layout)

  // ** Vars
  const {
    skin,
    layout,
    footerType,
    navbarType,
    lastLayout,
    navbarColor,
    contentWidth,
    menuCollapsed,
    menuHidden
  } = store

  const setLayout = (value) => {
    dispatch(handleLayout(value))
  }

  const setLastLayout = (value) => {
    dispatch(handleLastLayout(value))
  }

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
  }

  if (window) {
    const breakpoint = 1200

    useEffect(() => {
      if (window.innerWidth < breakpoint) {
        handleMenuLayout('vertical')
      }

      window.addEventListener('resize', () => {
        if (window.innerWidth <= breakpoint && lastLayout !== 'vertical' && layout !== 'vertical') {
          setLayout('vertical')
          handleMenuLayout('vertical')
        }

        if (window.innerWidth >= breakpoint && lastLayout !== layout) {
          handleMenuLayout(lastLayout)
          setLayout(lastLayout)
        }
      })
    }, [layout])
  }

  return { layout: layout, setLayout, lastLayout: lastLayout, setLastLayout }
}
