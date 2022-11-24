/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  addEventItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getUserListRequest(params) {
  return axios.get(`${API_ENDPOINTS.eventCalendar.userList}`, { params }).then((todo) => todo.data).catch((error) => error)
}

export const getUserList = createAsyncThunk('appCalendar/getUserList', async (params) => {
  try {
    const response = await getUserListRequest(params)
    if (response && response.flag) {
      return {
        userItems: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        userItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getUserList catch ", error)
    return {
      userItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getEventListRequest(params) {
  return axios.get(`${API_ENDPOINTS.eventCalendar.list}`, { params }).then((todo) => todo.data).catch((error) => error)
}

export const getEventList = createAsyncThunk('appCalendar/getEventList', async (params) => {
  try {
    const response = await getEventListRequest(params)
    if (response && response.flag) {
      return {
        params,
        eventItems: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        eventItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getEventList catch ", error)
    return {
      params,
      eventItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createEventRequest(payload) {
  return axios.post(`${API_ENDPOINTS.eventCalendar.create}`, payload).then((todo) => todo.data).catch((error) => error)
}

export const createEvent = createAsyncThunk('appCalendar/createEvent', async (payload, { dispatch, getState }) => {
  try {
    const response = await createEventRequest(payload)
    if (response && response.flag) {
      await dispatch(getEventList(getState().calendar.params))
      return {
        actionFlag: "CREATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createEvent catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateEventRequest(payload) {
  return axios.post(`${API_ENDPOINTS.eventCalendar.update}`, payload).then((todo) => todo.data).catch((error) => error)
}

export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (payload, { dispatch, getState }) => {
  try {
    const response = await updateEventRequest(payload)
    if (response && response.flag) {
      await dispatch(getEventList(getState().calendar.params))
      return {
        actionFlag: "UPDATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateEvent catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteEventRequest(id) {
  return axios.get(`${API_ENDPOINTS.eventCalendar.delete}/${id}`).then((todo) => todo.data).catch((error) => error)
}

export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteEventRequest(id)
    if (response && response.flag) {
      await dispatch(getEventList(getState().calendar.params))
      return {
        actionFlag: "DELETED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteEvent catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const updateFilter = createAsyncThunk('appCalendar/updateFilter', async (filter, { dispatch, getState }) => {
  if (getState().calendar.selectedCalendars.includes(filter)) {
    await dispatch(getEventList({ filter: JSON.stringify(getState().calendar.selectedCalendars.filter(i => i !== filter)) }))
  } else {
    await dispatch(getEventList({ filter: JSON.stringify([...getState().calendar.selectedCalendars, filter]) }))
  }
  return filter
})

export const updateAllFilters = createAsyncThunk('appCalendar/updateAllFilters', async (value, { dispatch }) => {
  if (value === true) {
    await dispatch(getEventList({
      filter: JSON.stringify(
        ['my_appointments', 'court_date', 'holiday']
      )
    }))
  } else {
    await dispatch(getEventList({ filter: "[]" }))
  }
  return value
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    params: {},
    events: [],
    eventItems: [],
    userItems: [],
    eventItem: addEventItem,
    selectedCalendars: [
      'my_appointments',
      'court_date',
      'holiday'
    ],
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    getEventItem: (state, action) => {
      state.eventItem = action.payload
    },

    updateCalendarLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearCalendarMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userItems = action.payload.userItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getEventList.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.eventItems = action.payload.eventItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateFilter.fulfilled, (state, action) => {
        if (state.selectedCalendars.includes(action.payload)) {
          state.selectedCalendars.splice(state.selectedCalendars.indexOf(action.payload), 1)
        } else {
          state.selectedCalendars.push(action.payload)
        }
      })
      .addCase(updateAllFilters.fulfilled, (state, action) => {
        const value = action.payload
        let selected = []
        if (value === true) {
          selected = [
            'my_appointments',
            'court_date',
            'holiday'
          ]
        } else {
          selected = []
        }
        state.selectedCalendars = selected
      })
  }
})

export const {
  getEventItem,
  updateCalendarLoader,
  clearCalendarMessage
} = appCalendarSlice.actions

export default appCalendarSlice.reducer
