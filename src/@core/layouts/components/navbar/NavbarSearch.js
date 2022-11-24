// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import classnames from 'classnames'
import * as Icon from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  handleSearchQuery,
  getNavGlobalSearch,
  clearNavGlobalSearchMessage
} from '@store/navGlobalSearch'

// ** Custom Components
import Autocomplete from '@components/autocomplete/custom'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

const NavbarSearch = () => {
  // ** HooksVars
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const store = useSelector(state => state.navGlobalSearch)

  // ** States
  const [navbarSearch, setNavbarSearch] = useState(false)

  // ** ComponentDidMount
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearNavGlobalSearchMessage())
    }
  }, [store.success, store.error, store.actionFlag])
  // console.log("store >>> ", store)

  // ** Removes query in store
  const handleClearQueryInStore = () => dispatch(handleSearchQuery(''))

  // ** Function to handle external Input click
  const handleExternalClick = () => {
    if (navbarSearch === true) {
      setNavbarSearch(false)
      handleClearQueryInStore()
    }
  }

  // ** Function to clear input value
  const handleClearInput = (setUserInput) => {
    if (!navbarSearch) {
      setUserInput('')
      handleClearQueryInStore()
    }
  }

  // ** Function to close search on ESC & ENTER Click
  const onKeyDown = (event) => {
    if (event.keyCode === 27 || event.keyCode === 13) {
      setTimeout(() => {
        setNavbarSearch(false)
        handleClearQueryInStore()
      }, 1)
    }
  }

  // ** Function to handle search suggestion Click
  const handleSuggestionItemClick = () => {
    setNavbarSearch(false)
    handleClearQueryInStore()
  }

  // ** Function to handle search list Click
  const handleListItemClick = (func, link, event) => {
    func(link, event)
    setTimeout(() => {
      setNavbarSearch(false)
    }, 1)
    handleClearQueryInStore()
  }

  /* Global search */
  const handleGlobalSearch = (value) => {
    dispatch(getNavGlobalSearch({ search: value || "" }))
  }
  /* /Global search */

  /* Render global searched user */
  const renderUserSuggestions = (
    item,
    i,
    filteredData,
    activeSuggestion,
    onSuggestionItemClick,
    onSuggestionItemHover
    // userInput,
    // headerTitle
  ) => {
    return (
      <li
        key={`user-${i}`}
        className={classnames("suggestion-item", {
          active: filteredData.indexOf(item) === activeSuggestion
        })}
        onClick={(event) => handleListItemClick(onSuggestionItemClick, `${adminRoot}/user/view/${item.id}`, event)}
        onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
      >
        <div className="">
          <div className="item-container d-flex">
            <Icon.User size={17} className="mt-25" />
            <div className="item-info ms-1">
              <p className="align-middle mb-0">{item.name}</p>
              {item.email ? (
                <small className="text-break">{item.email ? item.email : null}</small>
              ) : null}
            </div>
          </div>
        </div>
      </li>
    )
  }
  /* /Render global searched user */

  /* Render global searched invoice */
  const renderInvoiceSuggestions = (
    item,
    i,
    filteredData,
    activeSuggestion,
    onSuggestionItemClick,
    onSuggestionItemHover
  ) => {
    return (
      <li
        className={classnames("suggestion-item", {
          active: filteredData.indexOf(item) === activeSuggestion
        })}
        key={`invoice-${i}`}
        onClick={(event) => handleListItemClick(onSuggestionItemClick, `${adminRoot}/invoice/view/${item.id}`, event)}
        onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
      >
        <div className="">
          <div className="item-container d-flex">
            <Icon.Briefcase size={17} />
            <div className="item-info ms-1">
              <p className="align-middle mb-0">{item.invoice_no}</p>
            </div>
          </div>
        </div>
      </li>
    )
  }
  /* /Render global searched invoice */

  /* Render global searched case */
  const renderCaseSuggestions = (
    item,
    i,
    filteredData,
    activeSuggestion,
    onSuggestionItemClick,
    onSuggestionItemHover
  ) => {
    return (
      <li
        className={classnames("suggestion-item", {
          active: filteredData.indexOf(item) === activeSuggestion
        })}
        key={`case-${i}`}
        onClick={(event) => handleListItemClick(onSuggestionItemClick, `${adminRoot}/case/view/${item.CaseID}`, event)}
        onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
      >
        <div className="">
          <div className="item-container d-flex">
            <Icon.User size={17} />
            <div className="item-info ms-1">
              <p className="align-middle mb-0">{item.Name}</p>
            </div>
          </div>
        </div>
      </li>
    )
  }
  /* /Render global searched case */

  return store ? (
    <NavItem className='nav-search' onClick={() => setNavbarSearch(true)}>
      <NavLink className='nav-link-search'>
        <Icon.Search className='ficon' />
      </NavLink>
      <div
        className={classnames('search-input', {
          open: navbarSearch === true
        })}
      >
        <div className='search-input-icon'>
          <Icon.Search />
        </div>
        {navbarSearch ? (
          <Autocomplete
            className='form-control'
            suggestions={store.globalSearchItems || []}
            filterKey='title'
            filterHeaderKey='groupTitle'
            grouped={true}
            placeholder={`${t("Search for")}...`}
            autoFocus={true}
            adminRoot={adminRoot}
            onSuggestionItemClick={handleSuggestionItemClick}
            externalClick={handleExternalClick}
            clearInput={(userInput, setUserInput) => handleClearInput(setUserInput)}
            onKeyDown={onKeyDown}
            onChange={(event) => handleGlobalSearch(event.target.value)}
            customRender={(
              item,
              i,
              filteredData,
              activeSuggestion,
              onSuggestionItemClick,
              onSuggestionItemHover,
              userInput,
              headerTitle
            ) => {
              const IconTag = Icon[item.icon ? item.icon : 'X']
              if (headerTitle === "Users") {
                return renderUserSuggestions(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover,
                  userInput,
                  headerTitle
                )
              } else if (headerTitle === "Invoices") {
                return renderInvoiceSuggestions(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover,
                  userInput,
                  headerTitle
                )
              } else if (headerTitle === "Cases") {
                return renderCaseSuggestions(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover,
                  userInput,
                  headerTitle
                )
              } else {
                return (
                  <li
                    className={classnames('suggestion-item', {
                      active: filteredData.indexOf(item) === activeSuggestion
                    })}
                    key={i}
                    onClick={(event) => handleListItemClick(onSuggestionItemClick, item.link, event)}
                    onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
                  >
                    <div
                      className={classnames({
                        'd-flex justify-content-between align-items-center': item.file || item.img
                      })}
                    >
                      <div className='item-container d-flex'>
                        {item.icon ? (
                          <IconTag size={17} />
                        ) : item.file ? (
                          <img src={item.file} height='36' width='28' alt={item.title} />
                        ) : item.img ? (
                          <img className='rounded-circle mt-25' src={item.img} height='28' width='28' alt={item.title} />
                        ) : null}
                        <div className='item-info ms-1'>
                          <p className='align-middle mb-0'>{item.title}</p>
                          {item.by || item.email ? (
                            <small className='text-muted'>{item.by ? item.by : item.email ? item.email : null}</small>
                          ) : null}
                        </div>
                      </div>
                      {item.size || item.date ? (
                        <div className='meta-container'>
                          <small className='text-muted'>{item.size ? item.size : item.date ? item.date : null}</small>
                        </div>
                      ) : null}
                    </div>
                  </li>
                )
              }
            }}
          />
        ) : null}
        <div className='search-input-close'>
          <Icon.X
            className='ficon'
            onClick={(event) => {
              event.stopPropagation()
              setNavbarSearch(false)
            }}
          />
        </div>
      </div>
    </NavItem>
  ) : null
}

export default NavbarSearch
