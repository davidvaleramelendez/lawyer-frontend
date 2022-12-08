// ** React Imports
import { NavLink } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { Badge, UncontrolledTooltip  } from 'reactstrap'

import { useSelector } from 'react-redux'
import { T } from '@localization'

const VerticalNavMenuLink = ({ item, activeItem }) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink


  // ** Hooks
  const layoutStore = useSelector(state => state.layout)

  return (
    <li
      id={item.title.split(' ').join('-')}
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/'
            }
          : {
              to: item.navLink || '/',
              className: ({ isActive }) => {
                if (isActive && !item.disabled) {
                  return 'd-flex align-items-center active'
                }
              }
            })}
        onClick={e => {
          if (item.navLink.length === 0 || item.navLink === '#' || item.disabled === true) {
            e.preventDefault()
          }
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate'>{T(item.title)}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ms-auto me-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
      { layoutStore.menuCollapsed === true ? (
          <UncontrolledTooltip placement='left' target={item.title.split(' ').join('-')}>
            {T(item.title)}
          </UncontrolledTooltip> 
        ) : ''
      }
    </li>
  )
}

export default VerticalNavMenuLink
