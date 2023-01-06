// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import classnames from 'classnames'

// ** Reactstrap Imports
import {
  Label,
  Input,
  Button,
  CardBody
} from 'reactstrap'

// Constant
import {
  calendarFilter
} from '@constant/defaultValues'

// ** illustration import
import illustration from '@src/assets/images/pages/calendar-illustration.png'

// ** Translation
import { T } from '@localization'

const SidebarLeft = props => {
  // ** Props
  const {
    store,
    dispatch,
    updateFilter,
    toggleSidebar,
    updateAllFilters,
    setAddEventModalOpen,
    onCheckUserPermission
  } = props

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    toggleSidebar(false)
    setAddEventModalOpen(true)
  }

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
          {onCheckUserPermission(15) ? (
            <Button color='primary' block onClick={handleAddEventClick}>
              <span className='align-middle'>{T('Register')}</span>
            </Button>
          ) : null}
        </CardBody>
        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>{T('Filter')}</span>
          </h5>

          <div className='form-check mb-1'>
            <Input
              id='view-all'
              type='checkbox'
              label='View All'
              className='select-all'
              checked={store.selectedCalendars.length === calendarFilter.length}
              onChange={(event) => dispatch(updateAllFilters(event.target.checked))}
            />
            <Label className='form-check-label' for='view-all'>
              {T('View All')}
            </Label>
          </div>

          <div className='calendar-events-filter'>
            {calendarFilter.length &&
              calendarFilter.map(filter => {
                return (
                  <div
                    key={`${filter.value}-key`}
                    className={classnames('form-check', {
                      [filter.className]: filter.className
                    })}
                  >
                    <Input
                      type='checkbox'
                      key={filter.value}
                      label={filter.label}
                      className='input-filter'
                      id={`${filter.value}-event`}
                      checked={store.selectedCalendars.includes(filter.value)}
                      onChange={() => {
                        dispatch(updateFilter(filter.value))
                      }}
                    />
                    <Label className='form-check-label' for={`${filter.value}-event`}>
                      {T(filter.label)}
                    </Label>
                  </div>
                )
              })}
          </div>
        </CardBody>
      </div>
      <div>
        <img className='img-fluid' src={illustration} alt='illustration' />
      </div>
    </Fragment>
  )
}

export default SidebarLeft
