// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import classnames from 'classnames'

// ** Reactstrap Imports
import {
  Label,
  Input,
  Badge,
  Button,
  CardBody
} from 'reactstrap'

// ** React Dropdown Import
import Select from 'react-select'

// ** Icons Import
import {
  X
} from 'react-feather'

// ** Constant
import {
  calendarFilter
} from '@constant/defaultValues'

// ** illustration import
// import illustration from '@src/assets/images/pages/calendar-illustration.png'

// ** Translation
import { T } from '@localization'

const SidebarLeft = props => {
  // ** Props
  const {
    store,
    dispatch,
    updateFilter,
    toggleSidebar,
    handleEventLists,
    updateAllFilters,
    filterUserOptions,
    selectedUserFilter,
    setSelectedUserFilter,
    setAddEventModalOpen
  } = props

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    toggleSidebar(false)
    setAddEventModalOpen(true)
  }

  const handleUserFilter = (data) => {
    setSelectedUserFilter(data)
    const params = { ...store.params, user_id: (data && data.value) || "" }
    handleEventLists(params)
  }

  return (
    <Fragment>
      <div className="sidebar-wrapper">
        <CardBody className="card-body d-flex justify-content-center my-sm-0 mb-3">
          <Button color="primary" block onClick={handleAddEventClick}>
            <span className="align-middle">{T("Register")}</span>
          </Button>
        </CardBody>

        {selectedUserFilter && selectedUserFilter.label ? (
          <CardBody className="py-0">
            <Badge
              color="primary"
              className="text-wrap"
            >
              {`${selectedUserFilter.label}'s Calendar`}
              <X
                size={17}
                color="#FF0000"
                className="cursor-pointer ms-50"
                onClick={() => handleUserFilter(null)}
              />
            </Badge>
          </CardBody>
        ) : null}

        <CardBody>
          <h5 className="section-label mb-1">
            <span className="align-middle">{T("Filter")}</span>
          </h5>

          <div className="form-check mb-1">
            <Input
              id="view-all"
              type="checkbox"
              label="View All"
              className="select-all"
              checked={store.selectedCalendars.length === calendarFilter.length}
              onChange={(event) => dispatch(updateAllFilters(event.target.checked))}
            />
            <Label className="form-check-label" for="view-all">
              {T("View All")}
            </Label>
          </div>

          <div className="calendar-events-filter">
            {calendarFilter.length &&
              calendarFilter.map(filter => {
                return (
                  <div
                    key={`${filter.value}-key`}
                    className={classnames("form-check", {
                      [filter.className]: filter.className
                    })}
                  >
                    <Input
                      type="checkbox"
                      key={filter.value}
                      label={filter.label}
                      className="input-filter"
                      id={`${filter.value}-event`}
                      checked={store.selectedCalendars.includes(filter.value)}
                      onChange={() => {
                        dispatch(updateFilter(filter.value))
                      }}
                    />
                    <Label className="form-check-label" for={`${filter.value}-event`}>
                      {T(filter.label)}
                    </Label>
                  </div>
                )
              })}
          </div>
        </CardBody>
      </div>

      <div className="mx-2">
        <Select
          isClearable={true}
          className="react-select"
          classNamePrefix="select"
          id="select-calendar-user"
          name="select-calendar-user"
          value={selectedUserFilter}
          options={filterUserOptions}
          placeholder={`${T("Select User")}...`}
          onChange={(data) => handleUserFilter(data)}
        />
      </div>
    </Fragment>
  )
}

export default SidebarLeft
