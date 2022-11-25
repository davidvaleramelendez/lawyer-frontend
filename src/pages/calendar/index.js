// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Calendar App Component Imports
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
import ModalAddEvent from './modals/ModalAddEvent'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  getUserList,
  createEvent,
  updateEvent,
  deleteEvent,
  updateFilter,
  getEventList,
  getEventItem,
  updateAllFilters,
  clearCalendarMessage
} from './store'

// ** Utils
import {
  isUserLoggedIn,
  getTransformDate,
  selectThemeColors,
  underscoreCapitalizeWord,
  increaseCustomDateFormat
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// Constant
import {
  root,
  calendarFilterColor
} from '@constant/defaultValues'

// ** Styles
import '@styles/react/apps/app-calendar.scss'

const CalendarApp = () => {
  // ** Hooks
  const [isRtl] = useRTL()
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.calendar)

  const MySwal = withReactContent(Swal)

  // ** states
  const [loadFirst, setLoadFirst] = useState(true)
  const [calendarApi, setCalendarApi] = useState(null)
  const [loadingCalendar, setLoadingCalendar] = useState(true)
  const [addEventModalOpen, setAddEventModalOpen] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [userOptions, setuserOptions] = useState([])


  // ** LeftSidebar Toggle Function
  const toggleSidebar = (val) => setLeftSidebarOpen(val)

  // ** refetchEvents
  const refetchEvents = () => {
    if (calendarApi !== null) {
      // console.log("refetchEvents >>> ", calendarApi)
      calendarApi.refetchEvents()
    }
  }

  // ** Fetch Events On Mount
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      dispatch(getEventList({ filter: JSON.stringify(store.selectedCalendars) }))
      dispatch(getUserList({}))
      setLoadFirst(false)
    }

    let list1 = []
    if (store.userItems && store.userItems.length) {
      list1 = store.userItems.map(user => {
        return {
          value: user.id,
          label: user.name,
          img: user.profile_photo_path ? user.profile_photo_path : 'images/avatars/avatar-blank.png'
        }
      })
    }
    setuserOptions(list1)

    /* For blank message api called inside */
    if (store.success || store.error || store.actionFlag) {
      dispatch(clearCalendarMessage())
    }

    /* For reset form data and closing modal */
    if (store.actionFlag && (store.actionFlag === "CREATED" || store.actionFlag === "UPDATED" || store.actionFlag === "DELETED")) {
      setAddEventModalOpen(false)
    }

    /* Succes toast notification */
    if (store.success) {
      Notification("Success", store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification("Error", store.error, "warning")
    }
  }, [store.userItems, store.success, store.error, store.actionFlag, loadFirst])
  // console.log("store >>> ", store)

  return store ? (
    <Fragment>
      <div
        className={`app-calendar overflow-hidden border ${!store.loading ? 'calendar-placeholder-img' : ''}`}
      >
        <Row className="g-0">
          <Col
            id="app-calendar-sidebar"
            className={classnames("col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column", {
              show: leftSidebarOpen
            })}
          >
            <SidebarLeft
              store={store}
              dispatch={dispatch}
              updateFilter={updateFilter}
              toggleSidebar={toggleSidebar}
              updateAllFilters={updateAllFilters}
              setAddEventModalOpen={setAddEventModalOpen}
            />
          </Col>

          <Col className="position-relative">
            <Calendar
              isRtl={isRtl}
              store={store}
              dispatch={dispatch}
              calendarApi={calendarApi}
              updateEvent={updateEvent}
              getEventItem={getEventItem}
              toggleSidebar={toggleSidebar}
              setCalendarApi={setCalendarApi}
              loadingCalendar={loadingCalendar}
              getTransformDate={getTransformDate}
              calendarsColor={calendarFilterColor}
              setLoadingCalendar={setLoadingCalendar}
              setAddEventModalOpen={setAddEventModalOpen}
              increaseCustomDateFormat={increaseCustomDateFormat}
            />
          </Col>

          <div
            className={classnames("body-content-overlay", {
              show: leftSidebarOpen === true
            })}
            onClick={() => toggleSidebar(false)}
          ></div>
        </Row>
      </div>

      <ModalAddEvent
        store={store}
        MySwal={MySwal}
        dispatch={dispatch}
        open={addEventModalOpen}
        createEvent={createEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
        calendarApi={calendarApi}
        userOptions={userOptions}
        getEventItem={getEventItem}
        refetchEvents={refetchEvents}
        getTransformDate={getTransformDate}
        calendarsColor={calendarFilterColor}
        selectThemeColors={selectThemeColors}
        underscoreCapitalizeWord={underscoreCapitalizeWord}
        toggleAddEventModal={() => setAddEventModalOpen(!addEventModalOpen)}
      />
    </Fragment>
  ) : null
}

export default CalendarApp
