// ** React Imports

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  X
} from 'react-feather'

// ** Reactstrap Imports
import { Button, Input, Label } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

// ** Translation
import { T } from '@localization'

const Customizer = (props) => {
  // ** Props
  const {
    skin,
    // isRtl,
    layout,
    setSkin,
    // setIsRtl,
    menuHidden,
    navbarType,
    footerType,
    navbarColor,
    handleToggle,
    contentWidth,
    setMenuHidden,
    menuCollapsed,
    setNavbarType,
    setFooterType,
    openCustomizer,
    setNavbarColor,
    setContentWidth,
    setMenuCollapsed,
    handleMenuLayout,
    onThemeSettingSubmit
  } = props

  // ** State
  // const [openCustomizer, setOpenCustomizer] = useState(false)

  // ** Toggles Customizer
  // const handleToggle = (event) => {
  //   event.preventDefault()
  //   dispatch(handleCustomizerOpen(!openCustomizer))
  // }

  // ** Render Layout Skin Options
  const renderSkinsRadio = () => {
    const skinsArr = [
      {
        name: 'light',
        label: T('Light'),
        checked: skin === 'light'
      },
      {
        name: 'bordered',
        label: T('Bordered'),
        checked: skin === 'bordered'
      },
      {
        name: 'dark',
        label: T('Dark'),
        checked: skin === 'dark'
      },
      {
        name: 'semi-dark',
        label: T('Semi Dark'),
        checked: skin === 'semi-dark'
      }
    ]

    return skinsArr.map((radio, index) => {
      const marginCondition = index !== skinsArr.length - 1

      if (layout === 'horizontal' && radio.name === 'semi-dark') {
        return null
      }

      return (
        <div key={index} className={classnames('form-check', { 'mb-2 me-1': marginCondition })}>
          <Input type='radio' id={radio.name} checked={radio.checked} onChange={() => setSkin(radio.name)} />
          <Label className='form-check-label' for={radio.name}>
            {radio.label}
          </Label>
        </div>
      )
    })
  }

  // ** Render Navbar Colors Options
  const renderNavbarColors = () => {
    const colorsArr = ['white', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark']

    return colorsArr.map(color => (
      <li
        key={color}
        className={classnames(`color-box bg-${color}`, {
          selected: navbarColor === color,
          border: color === 'white'
        })}
        onClick={() => setNavbarColor(color)}
      ></li>
    ))
  }

  // ** Render Navbar Type Options
  const renderNavbarTypeRadio = () => {
    const navbarTypeArr = [
      {
        name: 'floating',
        label: T('Floating'),
        checked: navbarType === 'floating'
      },
      {
        name: 'sticky',
        label: T('Sticky'),
        checked: navbarType === 'sticky'
      },
      {
        name: 'static',
        label: T('Static'),
        checked: navbarType === 'static'
      },
      {
        name: 'hidden',
        label: T('Hidden'),
        checked: navbarType === 'hidden'
      }
    ]

    return navbarTypeArr.map((radio, index) => {
      const marginCondition = index !== navbarTypeArr.length - 1

      if (layout === 'horizontal' && radio.name === 'hidden') {
        return null
      }

      return (
        <div key={index} className={classnames('form-check', { 'mb-2 me-1': marginCondition })}>
          <Input type='radio' id={radio.name} checked={radio.checked} onChange={() => setNavbarType(radio.name)} />
          <Label className='form-check-label' for={radio.name}>
            {radio.label}
          </Label>
        </div>
      )
    })
  }

  // ** Render Footer Type Options
  const renderFooterTypeRadio = () => {
    const footerTypeArr = [
      {
        name: 'sticky',
        label: T('Sticky'),
        checked: footerType === 'sticky'
      },
      {
        name: 'static',
        label: T('Static'),
        checked: footerType === 'static'
      },
      {
        name: 'hidden',
        label: T('Hidden'),
        checked: footerType === 'hidden'
      }
    ]

    return footerTypeArr.map((radio, index) => {
      const marginCondition = index !== footerTypeArr.length - 1

      return (
        <div key={index} className={classnames('form-check', { 'mb-2 me-1': marginCondition })}>
          <Input
            type='radio'
            checked={radio.checked}
            id={`footer-${radio.name}`}
            onChange={() => setFooterType(radio.name)}
          />
          <Label className='form-check-label' for={`footer-${radio.name}`}>
            {radio.label}
          </Label>
        </div>
      )
    })
  }

  return (
    <div
      className={classnames('customizer d-none d-md-block', {
        open: openCustomizer
      })}
    >
      {/* <a href='/' className='customizer-toggle d-flex align-items-center justify-content-center' onClick={handleToggle}>
        <Settings size={14} className='spinner' />
      </a> */}

      <PerfectScrollbar className='customizer-content' options={{ wheelPropagation: false }}>
        <div className='customizer-header px-2 pt-1 pb-0 position-relative'>
          <h4 className='mb-0'>{T('Theme Customizer')}</h4>
          <p className='m-0'>{T('Customize & Preview in Real Time')}</p>
          <a href='/' className='customizer-close' onClick={handleToggle}>
            <X />
          </a>
        </div>

        <hr />

        <div className='px-2'>
          <div className='mb-2'>
            <p className='fw-bold'>{T('Skin')}</p>
            <div className='d-flex'>{renderSkinsRadio()}</div>
          </div>

          <div className='mb-2'>
            <p className='fw-bold'>{T('Content Width')}</p>
            <div className='d-flex'>
              <div className='form-check me-1'>
                <Input
                  type='radio'
                  id='full-width'
                  checked={contentWidth === 'full'}
                  onChange={() => setContentWidth('full')}
                />
                <Label className='form-check-label' for='full-width'>
                  {T('Full Width')}
                </Label>
              </div>

              <div className='form-check'>
                <Input
                  id='boxed'
                  type='radio'
                  checked={contentWidth === 'boxed'}
                  onChange={() => setContentWidth('boxed')}
                />
                <Label className='form-check-label' for='boxed'>
                  Boxed
                </Label>
              </div>
            </div>
          </div>

          {/* <div className='form-switch mb-2 ps-0'>
            <div className='d-flex'>
              <p className='fw-bold me-auto mb-0'>RTL</p>
              <Input type='switch' id='rtl' name='RTL' checked={isRtl} onChange={() => setIsRtl(!isRtl)} />
            </div>
          </div> */}
        </div>

        <hr />

        <div className='px-2'>
          <p className='fw-bold'>{T("Menu Layout")}</p>
          <div className='mb-2'>
            <div className='d-flex align-items-center'>
              <div className='form-check me-1'>
                <Input
                  type='radio'
                  id='vertical-layout'
                  checked={layout === 'vertical'}
                  onChange={() => handleMenuLayout('vertical')}
                />
                <Label className='form-check-label' for='vertical-layout'>
                  {T("Vertical")}
                </Label>
              </div>

              <div className='form-check'>
                <Input
                  type='radio'
                  id='horizontal-layout'
                  checked={layout === 'horizontal'}
                  onChange={() => handleMenuLayout('horizontal')}
                />
                <Label className='form-check-label' for='horizontal-layout'>
                  {T("Horizontal")}
                </Label>
              </div>
            </div>
          </div>

          {layout !== 'horizontal' ? (
            <div className='form-switch mb-2 ps-0'>
              <div className='d-flex align-items-center'>
                <p className='fw-bold me-auto mb-0'>{T('Menu Collapsed')}</p>
                <Input
                  type='switch'
                  id='menu-collapsed'
                  name='menu-collapsed'
                  checked={menuCollapsed}
                  onChange={() => setMenuCollapsed(!menuCollapsed)}
                />
              </div>
            </div>
          ) : null}

          <div className='form-switch mb-2 ps-0'>
            <div className='d-flex align-items-center'>
              <p className='fw-bold me-auto mb-0'>{T('Menu Hidden')}</p>
              <Input
                type='switch'
                id='menu-hidden'
                name='menu-hidden'
                checked={menuHidden}
                onChange={() => setMenuHidden(!menuHidden)}
              />
            </div>
          </div>
        </div>

        <hr />

        <div className='px-2'>
          {layout !== 'horizontal' ? (
            <div className='mb-2'>
              <p className='fw-bold'>{T('Navbar Color')}</p>
              <ul className='list-inline unstyled-list'>{renderNavbarColors()}</ul>
            </div>
          ) : null}

          <div className='mb-2'>
            <p className='fw-bold'>{layout === 'horizontal' ? T('Menu Type') : T('Navbar Type')}</p>
            <div className='d-flex'>{renderNavbarTypeRadio()}</div>
          </div>
        </div>

        <hr />

        <div className='px-2'>
          <div className='mb-2'>
            <p className='fw-bold'>{T('Footer Type')}</p>
            <div className='d-flex'>{renderFooterTypeRadio()}</div>
          </div>

          <div className='mb-2'>
            <Button
              type="button"
              color="primary"
              onClick={() => onThemeSettingSubmit()}
            >
              {T('Apply & Save')}
            </Button>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default Customizer
