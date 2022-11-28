/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  todoItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

import { setTotalNumber } from '@utils'
import { TN_TASK } from '@constant/defaultValues'

async function getUserListRequest(params) {
  return axios.get(`${API_ENDPOINTS.todos.userList}`, { params }).then((todo) => todo.data).catch((error) => error)
}

export const getUserList = createAsyncThunk('appTodo/getUserList', async (params) => {
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
        error: ""
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

async function getTodoListRequest(params) {
  return axios.get(`${API_ENDPOINTS.todos.list}`, { params }).then((todo) => todo.data).catch((error) => error)
}

export const getTodoList = createAsyncThunk('appTodo/getTodoList', async (params) => {
  try {
    const response = await getTodoListRequest(params)
    setTotalNumber(TN_TASK, response.pagination.totalRecord)
    if (response && response.flag) {
      return {
        params,
        taskItems: response.data,
        pagination: response.pagination,
        todoItem: todoItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        taskItems: [],
        pagination: null,
        todoItem: todoItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getTodoList catch ", error)
    return {
      params,
      taskItems: [],
      pagination: null,
      todoItem: todoItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createUpdateTodoRequest(payload) {
  return axios.post(`${API_ENDPOINTS.todos.create}`, payload).then((todo) => todo.data).catch((error) => error)
}

export const createUpdateTodo = createAsyncThunk('appTodo/createUpdateTodo', async (payload, { dispatch, getState }) => {
  try {
    const response = await createUpdateTodoRequest(payload)
    if (response && response.flag) {
      await dispatch(getTodoList(getState().todo.params))
      return {
        actionFlag: "CREATED_UPDATED",
        success: "",
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("createUpdateTodo catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function completeTodoItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.todos.complete}/${id}`).then((todo) => todo.data).catch((error) => error)
}

export const completeTodoItem = createAsyncThunk('appTodo/completeTodoItem', async (id, { dispatch, getState }) => {
  try {
    const response = await completeTodoItemRequest(id)
    if (response && response.flag) {
      await dispatch(getTodoList(getState().todo.params))
      return {
        actionFlag: "COMPLETED",
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
    console.log("completeTodoItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function importantTodoItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.todos.important}/${id}`).then((todo) => todo.data).catch((error) => error)
}

export const importantTodoItem = createAsyncThunk('appTodo/importantTodoItem', async (id, { dispatch, getState }) => {
  try {
    const response = await importantTodoItemRequest(id)
    if (response && response.flag) {
      await dispatch(getTodoList(getState().todo.params))
      return {
        actionFlag: "IMPORTANT",
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
    console.log("importantTodoItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function trashTodoItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.todos.trash}/${id}`).then((todo) => todo.data).catch((error) => error)
}

export const trashTodoItem = createAsyncThunk('appTodo/trashTodoItem', async (id, { dispatch, getState }) => {
  try {
    const response = await trashTodoItemRequest(id)
    if (response && response.flag) {
      await dispatch(getTodoList(getState().todo.params))
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
    console.log("trashTodoItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function restoreTodoItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.todos.restore}/${id}`).then((todo) => todo.data).catch((error) => error)
}

export const restoreTodoItem = createAsyncThunk('appTodo/restoreTodoItem', async (id, { dispatch, getState }) => {
  try {
    const response = await restoreTodoItemRequest(id)
    if (response && response.flag) {
      await dispatch(getTodoList(getState().todo.params))
      return {
        actionFlag: "RESTORED",
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
    console.log("restoreTodoItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteTodoItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.todos.delete}/${id}`).then((todo) => todo.data).catch((error) => error)
}

export const deleteTodoItem = createAsyncThunk('appTodo/deleteTodoItem', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteTodoItemRequest(id)
    if (response && response.flag) {
      await dispatch(getTodoList(getState().todo.params))
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
    console.log("deleteTodoItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appTodoSlice = createSlice({
  name: 'appTodo',
  initialState: {
    userItems: [],
    taskItems: [],
    pagination: null,
    todoItem: todoItem,
    params: {
      filter: '',
      search: '',
      sort: '',
      tag: ''
    },
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    reOrderTasks: (state, action) => {
      state.taskItems = action.payload
    },
    getTaskItem: (state, action) => {
      state.todoItem = action.payload
    },

    updateTaskLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearTodoMessage: (state) => {
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
      .addCase(getTodoList.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.taskItems = action.payload.taskItems
        state.pagination = action.payload.pagination
        state.todoItem = action.payload.todoItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createUpdateTodo.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(completeTodoItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(importantTodoItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(trashTodoItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(restoreTodoItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteTodoItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  reOrderTasks,
  getTaskItem,
  updateTaskLoader,
  clearTodoMessage
} = appTodoSlice.actions

export default appTodoSlice.reducer
