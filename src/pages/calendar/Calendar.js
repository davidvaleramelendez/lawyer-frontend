/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */

// ** React Import
import { useEffect, useRef, memo } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Reactstrap Imports
import {
  Card,
  CardBody
} from 'reactstrap'

// ** Icons Import
import {
  Menu
} from 'react-feather'

const Calendar = (props) => {
  // ** Refs
  const calendarRef = useRef(null)

  // ** Props
  const {
    store,
    isRtl,
    dispatch,
    updateEvent,
    calendarApi,
    getEventItem,
    toggleSidebar,
    setCalendarApi,
    calendarsColor,
    getTransformDate,
    setLoadingCalendar,
    setAddEventModalOpen,
    increaseCustomDateFormat
  } = props

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: store.eventItems.length ? store.eventItems : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 6,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    /* Calendar loading */
    loading(bool) {
      setLoadingCalendar(bool)
    },
    /* /Calendar loading */

    eventClassNames({ event: calendarEvent }) {
      // console.log("eventClassNames >>> ", calendarEvent)
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }) {
      let evntData = { ...store.eventItem }
      if (clickedEvent && clickedEvent.id) {
        if (store.eventItems && store.eventItems.length) {
          const index = store.eventItems.findIndex(x => JSON.stringify(x.id) === clickedEvent.id)
          if (index !== -1) {
            evntData = { ...store.eventItems[index] }
          }
        }
      }

      dispatch(getEventItem(evntData))
      setAddEventModalOpen(true)

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        text: <Menu className='d-xl-none d-block' />,
        click() {
          toggleSidebar(true)
        }
      }
    },

    dateClick(info) {
      // console.log("dateClick >>> ", info)
      const evntData = { ...store.eventItem }
      evntData.start_date = info.date
      evntData.end_date = info.date
      if (info.allDay) {
        evntData.allDay = info.allDay
      }

      if (!info.allDay) {
        evntData.end_date = increaseCustomDateFormat(
          'minutes',
          30,
          "YYYY-MM-DD HH:mm",
          info.date
        )
      }

      dispatch(getEventItem(evntData))
      setAddEventModalOpen(true)
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      let evntData = { ...store.eventItem }
      if (droppedEvent && droppedEvent.id) {
        if (store.eventItems && store.eventItems.length) {
          const index = store.eventItems.findIndex(x => JSON.stringify(x.id) === droppedEvent.id)
          if (index !== -1) {
            evntData = { ...store.eventItems[index] }
          }
        }
      }

      if (droppedEvent.start && typeof droppedEvent.start !== 'string' && droppedEvent.start.length) {
        evntData.startdate = getTransformDate(droppedEvent.start[0], "YYYY-MM-DD HH:mm")
      } else if (droppedEvent.start) {
        evntData.startdate = getTransformDate(droppedEvent.start, "YYYY-MM-DD HH:mm")
      }

      if (droppedEvent.end && typeof droppedEvent.end !== 'string' && droppedEvent.end.length) {
        evntData.enddate = getTransformDate(droppedEvent.end[0], "YYYY-MM-DD HH:mm")
      } else if (droppedEvent.end) {
        evntData.enddate = getTransformDate(droppedEvent.end, "YYYY-MM-DD HH:mm")
      }

      if (droppedEvent.allDay || droppedEvent.allDay === false) {
        evntData.allDay = droppedEvent.allDay
        if (!droppedEvent.end) {
          evntData.enddate = increaseCustomDateFormat(
            'hour',
            droppedEvent.allDay ? 0 : 1,
            "YYYY-MM-DD HH:mm",
            droppedEvent.start
          )
        }
      }

      if (evntData.user && evntData.user.length) {
        evntData.guest = evntData.user.map((t) => t.id)
      }


      // console.log("eventDrop >>> ", droppedEvent, evntData)
      dispatch(updateEvent(evntData))
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      let evntData = { ...store.eventItem }
      if (resizedEvent && resizedEvent.id) {
        if (store.eventItems && store.eventItems.length) {
          const index = store.eventItems.findIndex(x => JSON.stringify(x.id) === resizedEvent.id)
          if (index !== -1) {
            evntData = { ...store.eventItems[index] }
          }
        }
      }

      if (resizedEvent.start && typeof resizedEvent.start !== 'string' && resizedEvent.start.length) {
        evntData.startdate = getTransformDate(resizedEvent.start[0], "YYYY-MM-DD HH:mm")
      } else if (resizedEvent.start) {
        evntData.startdate = getTransformDate(resizedEvent.start, "YYYY-MM-DD HH:mm")
      }

      if (resizedEvent.end && typeof resizedEvent.end !== 'string' && resizedEvent.end.length) {
        evntData.enddate = getTransformDate(resizedEvent.end[0], "YYYY-MM-DD HH:mm")
      } else if (resizedEvent.end) {
        evntData.enddate = getTransformDate(resizedEvent.end, "YYYY-MM-DD HH:mm")
      }

      if (evntData.user && evntData.user.length) {
        evntData.guest = evntData.user.map((t) => t.id)
      }

      // console.log("eventResize >>> ", resizedEvent, evntData)
      dispatch(updateEvent(evntData))
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction: isRtl ? 'rtl' : 'ltr'
  }

  return (
    <Card className='shadow-none border-0 mb-0 rounded-0'>
      <CardBody className='pb-0'>
        <FullCalendar {...calendarOptions} />{' '}
      </CardBody>
    </Card>
  )
}

export default memo(Calendar)
