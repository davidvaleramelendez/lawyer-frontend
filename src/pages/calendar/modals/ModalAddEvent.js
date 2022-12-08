// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// Constant
import {
  calendarFilter
} from '@constant/defaultValues'
import {
  addEventItem
} from '@constant/reduxConstant'

// ** Third Party Components
import { X } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import Select, { components } from 'react-select'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import {
  Form,
  Modal,
  Label,
  Input,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Translation
import { T } from '@localization'

const ModalAddEvent = props => {
  // ** Props
  const {
    open,
    store,
    MySwal,
    dispatch,
    calendarApi,
    createEvent,
    updateEvent,
    deleteEvent,
    userOptions,
    getEventItem,
    refetchEvents,
    calendarsColor,
    getTransformDate,
    selectThemeColors,
    toggleAddEventModal,
    underscoreCapitalizeWord
  } = props

  /* Validating url */
  const isValidURL = (string) => {
    const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    return (res !== null)
  }

  // ** Vars & Hooks
  const eventItem = store.eventItem,
    {
      reset,
      watch,
      control,
      handleSubmit,
      formState: { errors }
    } = useForm({
      mode: 'all',
      defaultValues: eventItem
    })

  const ValidationSchema = {
    title: {
      placeholder: T("Title"),
      required: T("Title is required!")
    },
    business: {
      placeholder: `${T('Select Label')}...`,
      required: T(`Label is required!`)
    },
    start_date: {
      placeholder: "YYYY-MM-DD",
      required: T("Start date is required!")
    },
    end_date: {
      placeholder: "YYYY-MM-DD",
      required: T("End date is required!")
    },
    guestIds: {
      placeholder: `${T('Select Guest')}...`,
      required: T(`Guest is required!`)
    },
    event_url: {
      placeholder: "https://www.google.com",
      required: false,
      validate: (value) => {
        if (value) {
          return isValidURL(value) || T("Invalid appointment url!")
        }
        return true
      }
    },
    location: {
      placeholder: T("Enter location"),
      required: false
    },
    description: {
      placeholder: T("Description"),
      required: false
    }
  }

  // ** Custom select components
  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <span className={`bullet bullet-${data.color} bullet-sm me-50`}></span>
        {data.label}
      </components.Option>
    )
  }

  const GuestsComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar className='my-0 me-1' size='sm' img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${data.img}`} />
          <div>{data.label}</div>
        </div>
      </components.Option>
    )
  }

  // ** Reset Input Values on Close
  const handleSidebarClosed = () => {
    if (calendarApi && calendarApi.unselect()) {
      calendarApi.unselect()
    }

    reset(addEventItem)
    dispatch(getEventItem(addEventItem))
    refetchEvents()
  }

  // ** Set sidebar fields
  const handleSidebarOpened = () => {
    reset(eventItem)
  }

  const onDeleteEvent = (evntId) => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You won't be able to revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes, delete it!'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteEvent(evntId))
      }
    })
  }

  const guestDefaultDropdown = () => {
    if (eventItem && eventItem.user && eventItem.user.length) {
      return eventItem.user.map(user => {
        return {
          value: user.id,
          label: user.name,
          img: user.profile_photo_path ? user.profile_photo_path : 'images/avatars/avatar-blank.png'
        }
      })
    }
    return ""
  }

  const onSubmit = (values) => {
    if (values) {
      const eventData = {
        id: values.id,
        title: values.title,
        event_url: values.eventUrl,
        location: values.Location,
        description: values.Description
      }

      if (values.businessLbl && values.businessLbl.value) {
        eventData.business = values.businessLbl.value
      }

      if (values.allDay || values.allDay === false) {
        eventData.allDay = values.allDay
      }

      if (values.start_date && typeof values.start_date !== 'string' && values.start_date.length) {
        eventData.startdate = getTransformDate(values.start_date[0], "YYYY-MM-DD HH:mm")
      } else if (values.start_date) {
        eventData.startdate = getTransformDate(values.start_date, "YYYY-MM-DD HH:mm")
      }

      if (values.end_date && typeof values.end_date !== 'string' && values.end_date.length) {
        eventData.enddate = getTransformDate(values.end_date[0], "YYYY-MM-DD HH:mm")
      } else if (values.end_date) {
        eventData.enddate = getTransformDate(values.end_date, "YYYY-MM-DD HH:mm")
      }

      if (values.guestIds && values.guestIds.length) {
        eventData.guest = values.guestIds.map((t) => t.value)
      }

      // console.log("onSubmit >>> ", eventData)

      if (eventData && eventData.id) {
        dispatch(updateEvent(eventData))
      } else {
        dispatch(createEvent(eventData))
      }
    }
  }

  // ** Event Action buttons
  const EventActions = () => {
    if (eventItem && eventItem.id) {
      return (
        <Fragment>
          <Button className="me-1" type="submit" color="primary">
            {T('Update')}
          </Button>

          <Button color="danger" onClick={() => onDeleteEvent(eventItem.id)} outline>
            {T('Delete')}
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button className="me-1" type="submit" color="primary">
          {T('Add')}
          </Button>

          <Button color="secondary" type="reset" onClick={toggleAddEventModal} outline>
            {T('Cancel')}
          </Button>
        </Fragment>
      )
    }
  }

  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={toggleAddEventModal} />

  return (
    <Modal
      isOpen={open}
      backdrop="static"
      className='sidebar-lg'
      toggle={toggleAddEventModal}
      onOpened={handleSidebarOpened}
      onClosed={handleSidebarClosed}
      contentClassName="p-0 overflow-hidden"
      modalClassName="modal-slide-in event-sidebar"
    >
      <ModalHeader className="mb-1" toggle={toggleAddEventModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">
          {eventItem && eventItem.id ? T("Update Event") : T("Add Event")}
        </h5>
      </ModalHeader>
      <PerfectScrollbar
        className="media-list scrollable-container"
        options={{ wheelPropagation: true }}
      >
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <Form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-1">
              <Label className="form-label" for="title">
                {T('Title')} <span className="text-danger">*</span>
              </Label>
              <Controller
                defaultValue=""
                id="title"
                name="title"
                control={control}
                rules={ValidationSchema.title}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={ValidationSchema.title && ValidationSchema.title.placeholder}
                    invalid={errors.title && true}
                  />
                )}
              />
              {errors.title && <FormFeedback>{errors.title?.message}</FormFeedback>}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="businessLbl">
                {T("Label")} <span className="text-danger">*</span>
              </Label>
              <Controller
                defaultValue={eventItem && eventItem.business ? { label: underscoreCapitalizeWord(eventItem.business), value: eventItem.business, color: calendarsColor[eventItem.business] } : calendarFilter[0]}
                name="businessLbl"
                id="businessLbl"
                control={control}
                rules={ValidationSchema.business}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable={false}
                    name="businessLbl"
                    placeholder={ValidationSchema.business && ValidationSchema.business.placeholder}
                    options={calendarFilter}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    components={{ Option: OptionComponent }}
                  />
                )}
              />
              {errors.businessLbl && <FormFeedback className="d-block">{errors.businessLbl?.message}</FormFeedback>}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="start_date">
                {T('Start Date')} <span className="text-danger">*</span>
              </Label>
              <Controller
                defaultValue=""
                id="start_date"
                name="start_date"
                control={control}
                rules={ValidationSchema.start_date}
                render={({ field }) => <Flatpickr
                  {...field}
                  id="start_date"
                  className="form-control"
                  placeholder={ValidationSchema.start_date && ValidationSchema.start_date.placeholder}
                  options={{
                    enableTime: watch("allDay") === false,
                    dateFormat: "Y-m-d H:i",
                    time_24hr: true
                  }}
                />}
              />
              {errors.start_date && <FormFeedback className="d-block">{errors.start_date?.message}</FormFeedback>}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="end_date">
                {T('End Date')} <span className="text-danger">*</span>
              </Label>
              <Controller
                defaultValue=""
                id="end_date"
                name="end_date"
                control={control}
                rules={ValidationSchema.end_date}
                render={({ field }) => <Flatpickr
                  {...field}
                  id="end_date"
                  className="form-control"
                  placeholder={ValidationSchema.end_date && ValidationSchema.end_date.placeholder}
                  options={{
                    minDate: watch("start_date"),
                    enableTime: watch("allDay") === false,
                    dateFormat: "Y-m-d H:i",
                    time_24hr: true
                  }}
                />}
              />
              {errors.end_date && <FormFeedback className="d-block">{errors.end_date?.message}</FormFeedback>}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="guestIds">
                {T('Guests')} <span className="text-danger">*</span>
              </Label>
              <Controller
                defaultValue={guestDefaultDropdown}
                name="guestIds"
                id="guestIds"
                control={control}
                rules={ValidationSchema.guestIds}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    name="guestIds"
                    isClearable={false}
                    closeMenuOnSelect={false}
                    placeholder={ValidationSchema.guestIds && ValidationSchema.guestIds.placeholder}
                    options={userOptions}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    components={{ Option: GuestsComponent }}
                  />
                )}
              />
              {errors.guestIds && <FormFeedback className="d-block">{errors.guestIds?.message}</FormFeedback>}
            </div>

            <div className="form-switch mb-1">
              <Controller
                defaultChecked={eventItem && eventItem.allDay}
                id="allDay"
                name="allDay"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="allDay"
                    type="switch"
                    checked={field.value}
                    className="me-1"
                    invalid={errors.allDay && true}
                  />
                )}
              />
              <Label className="form-label" for="allDay">
                {T('All Day')}
              </Label>
            </div>

            <div className="mb-1">
              <Label className="form-label" for="event_url">
                {T('Appointment URL')}
              </Label>
              <Controller
                defaultValue={(eventItem && eventItem.event_url) || ""}
                id="eventUrl"
                name="eventUrl"
                control={control}
                rules={ValidationSchema.event_url}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={ValidationSchema.event_url && ValidationSchema.event_url.placeholder}
                    invalid={errors.eventUrl && true}
                  />
                )}
              />
              {errors.eventUrl && <FormFeedback>{errors.eventUrl?.message}</FormFeedback>}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="location">
                {T('Add Location')}
              </Label>
              <Controller
                defaultValue={(eventItem && eventItem.location) || ""}
                id="Location"
                name="Location"
                control={control}
                rules={ValidationSchema.location}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={ValidationSchema.location && ValidationSchema.location.placeholder}
                    invalid={errors.Location && true}
                  />
                )}
              />
              {errors.Location && <FormFeedback>{errors.Location?.message}</FormFeedback>}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="Description">
                {T('Appointment Description')}
              </Label>
              <Controller
                defaultValue={(eventItem && eventItem.description) || ""}
                id="Description"
                name="Description"
                control={control}
                rules={ValidationSchema.description}
                render={({ field }) => (
                  <Input
                    rows={3}
                    type="textarea"
                    {...field}
                    placeholder={ValidationSchema.description && ValidationSchema.description.placeholder}
                    invalid={errors.Description && true}
                  />
                )}
              />
              {errors.Description && <FormFeedback>{errors.Description?.message}</FormFeedback>}
            </div>

            <div className="d-flex mb-1">
              <EventActions />
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default ModalAddEvent
