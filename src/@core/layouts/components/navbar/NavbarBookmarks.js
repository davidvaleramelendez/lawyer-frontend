// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Icons Import
import * as Icon from 'react-feather'

// ** Third Party Components
import classnames from 'classnames'

// ** Custom Component
import Autocomplete from '@components/autocomplete'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

// Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  NavLink,
  NavItem,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown
} from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getBookmarks,
  updateBookmarked,
  handleSearchQuery,
  clearNavBookmarksMessage
} from '@store/navBookmark'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Translation
import { T } from '@localization'

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props

  /* Hook */
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const store = useSelector(state => state.navBookmark)

  // ** State
  const [loadFirst, setLoadFirst] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [openSearch, setOpenSearch] = useState(false)

  // ** ComponentDidMount
  useEffect(() => {
    if (loadFirst) {
      dispatch(getBookmarks({}))
      setLoadFirst(false)
    }

    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearNavBookmarksMessage())
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }
  }, [store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

  // ** Loops through Bookmarks Array to return Bookmarks
  const renderBookmarks = () => {
    if (store && store.bookmarkItems && store.bookmarkItems.length) {
      return store.bookmarkItems.map(item => {
        const IconTag = Icon[item.icon]
        return (
          <NavItem key={item.target} className='d-none d-lg-block'>
            <NavLink
              tag={Link}
              to={`${adminRoot}/${item.link}`}
              id={item.target}
            >
              <IconTag className='ficon' />
              <UncontrolledTooltip
                target={item.target}
              >
                {t(item.title)}
              </UncontrolledTooltip>
            </NavLink>
          </NavItem>
        )
      }).slice(0, 10)
    } else {
      return null
    }
  }

  // ** If user has more than 10 bookmarks then add the extra Bookmarks to a dropdown
  const renderExtraBookmarksDropdown = () => {
    if (store && store.bookmarkItems && store.bookmarkItems.length >= 11) {
      return (
        <NavItem className="d-none d-lg-block">
          <NavLink tag="span">
            <UncontrolledDropdown>
              <DropdownToggle tag="span">
                <Icon.ChevronDown className="ficon" />
              </DropdownToggle>
              <DropdownMenu end>
                {store.bookmarkItems
                  .map(item => {
                    const IconTag = Icon[item.icon]
                    return (
                      <DropdownItem tag={Link} to={`${adminRoot}/${item.link}`} key={item.target}>
                        <IconTag className="me-50" size={14} />
                        <span className="align-middle">{item.title}</span>
                      </DropdownItem>
                    )
                  })
                  .slice(10)}
              </DropdownMenu>
            </UncontrolledDropdown>
          </NavLink>
        </NavItem>
      )
    } else {
      return null
    }
  }

  // ** Removes query in store
  const handleClearQueryInStore = () => dispatch(handleSearchQuery(''))

  // ** Loops through Bookmarks Array to return Bookmarks
  const onKeyDown = (event) => {
    if (event.keyCode === 27 || event.keyCode === 13) {
      setTimeout(() => {
        setOpenSearch(false)
        handleClearQueryInStore()
      }, 1)
    }
  }

  // ** Function to toggle Bookmarks
  const handleBookmarkUpdate = (item) => {
    item = { ...item, is_bookmarked: !item.is_bookmarked }
    dispatch(updateBookmarked(item || ""))
  }

  // ** Function to handle Bookmarks visibility
  const handleBookmarkVisibility = () => {
    setOpenSearch(!openSearch)
    setSearchInput('')
    handleClearQueryInStore()
  }

  // ** Function to handle Input change
  const handleInputChange = (value) => {
    setSearchInput(value)
    dispatch(handleSearchQuery(value))
  }

  const handleExternalClick = () => {
    if (openSearch === true) {
      setOpenSearch(false)
      handleClearQueryInStore()
    }
  }

  // ** Function to clear input value
  const handleClearInput = (setUserInput) => {
    if (!openSearch) {
      setUserInput('')
      handleClearQueryInStore()
    }
  }

  /* Language translation in array value */
  const renderTranslateBookmarkItems = (items) => {
    if (items && items.length) {
      items = items.map((item) => {
        item = { ...item, title: t(item.title) }
        return item
      })

      return items
    }

    return []
  }
  /* /Language translation in array value */

  /* To check is bookmarked or not from suggestions */
  const handleCheckBookmarked = (item) => {
    if (store.bookmarkItems && store.bookmarkItems.length) {
      if (item && item.bookmark_id) {
        const index = store.bookmarkItems.findIndex(x => x.bookmark_id === item.bookmark_id)
        if (index !== -1) {
          const isBookmarked = store.bookmarkItems[index].is_bookmarked
          return isBookmarked
        }
        return 0
      }
      return 0
    }
    return 0
  }
  /* /To check is bookmarked or not from suggestions */

  return store ? (
    <Fragment>
      <ul className="navbar-nav d-xl-none">
        <NavItem className="mobile-menu me-auto">
          <NavLink className="nav-menu-main menu-toggle hidden-xs is-active" onClick={() => setMenuVisibility(true)}>
            <Icon.Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <ul className="nav navbar-nav bookmark-icons">
        {renderBookmarks()}
        {renderExtraBookmarksDropdown()}
        <NavItem className='nav-item d-none d-lg-block'>
          <NavLink className='bookmark-star' onClick={handleBookmarkVisibility}>
            <Icon.Star className='ficon text-warning' />
          </NavLink>
          <div className={classnames('bookmark-input search-input', { show: openSearch })}>
            <div className='bookmark-input-icon'>
              <Icon.Search size={14} />
            </div>
            {openSearch && store.suggestionItems && store.suggestionItems.length ? (
              <Autocomplete
                wrapperClass={classnames('search-list search-list-bookmark', {
                  show: openSearch
                })}
                className='form-control'
                suggestions={renderTranslateBookmarkItems(store.suggestionItems)}
                // suggestions={!searchInput.length ? renderTranslateBookmarkItems(store.bookmarkItems) : renderTranslateBookmarkItems(store.suggestionItems)}
                filterKey='title'
                autoFocus={true}
                adminRoot={adminRoot}
                defaultSuggestions
                suggestionLimit={store.suggestionItems.length}
                // suggestionLimit={!searchInput.length ? store.bookmarkItems.length : 6}
                placeholder='Search...'
                externalClick={handleExternalClick}
                clearInput={(userInput, setUserInput) => handleClearInput(setUserInput)}
                onKeyDown={onKeyDown}
                value={searchInput}
                onChange={(event) => handleInputChange(event.target.value)}
                customRender={(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover
                ) => {
                  const IconTag = Icon[item.icon ? item.icon : 'X']
                  return (
                    <li
                      key={i}
                      onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
                      className={classnames('suggestion-item d-flex align-items-center justify-content-between', {
                        active: filteredData.indexOf(item) === activeSuggestion
                      })}
                    >
                      <Link
                        to={`${adminRoot}/${item.link}`}
                        className='d-flex align-items-center justify-content-between p-0'
                        onClick={() => {
                          setOpenSearch(false)
                          handleClearQueryInStore()
                        }}
                        style={{
                          width: 'calc(90%)'
                        }}
                      >
                        <div className='d-flex justify-content-start align-items-center overflow-hidden'>
                          <IconTag size={17.5} className='me-75' />
                          <span className='text-truncate'>{t(item.title)}</span>
                        </div>
                      </Link>

                      <Icon.Star
                        size={17.5}
                        className={classnames('bookmark-icon float-end', {
                          'text-warning': handleCheckBookmarked(item)
                        })}
                        onClick={() => handleBookmarkUpdate(item)}
                      />
                    </li>
                  )
                }}
              />
            ) : null}
          </div>
        </NavItem>
      </ul>
    </Fragment>
  ) : null
}

export default NavbarBookmarks
