/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Todo App Components
import Tasks from './Tasks'
import Sidebar from './Sidebar'
import TaskSidebar from './TaskSidebar'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getUserList,
  getTodoList,
  getTaskItem,
  reOrderTasks,
  trashTodoItem,
  deleteTodoItem,
  restoreTodoItem,
  createUpdateTodo,
  completeTodoItem,
  importantTodoItem,
  resetTaskItems,
  updateTaskLoader,
  clearTodoMessage
} from './store'

// ** Utils
import {
  isUserLoggedIn,
  getTotalNumber,
  getTransformDate
} from '@utils'

// ** Custom Components
import Notification from '@components/toast/notification'

// Constant
import {
  root,
  TN_TASK
} from '@constant/defaultValues'

// ** Styles
import '@styles/react/apps/app-todo.scss'

// ** Translation
import { T } from '@localization'

const TodoApp = () => {
  // ** Hooks
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.todo)

  // ** States
  const [placeholderTasks] = useState(getTotalNumber(TN_TASK) ?? 0)
  const [loadFirst, setLoadFirst] = useState(true)
  const [sort, setSort] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(getTotalNumber(TN_TASK) ?? 0)
  const [dateInput, setDateInput] = useState('')
  const [mainSidebar, setMainSidebar] = useState(false)
  const [openTaskSidebar, setOpenTaskSidebar] = useState(false)
  const [userOptions, setuserOptions] = useState([])

  // ** URL Params
  const paramsURL = useParams()
  const params = {
    filter: paramsURL.filter || '',
    search: searchInput || '',
    sortBy: sort || '',
    tag: paramsURL.tag || ''
  }

  // ** Function to handle Left sidebar & Task sidebar
  const handleMainSidebar = () => setMainSidebar(!mainSidebar)

  const handleTodoLists = (filter = paramsURL.filter, search = searchInput, date = dateInput, sortBy = sort, tag = paramsURL.tag, perPage = rowsPerPage) => {
    dispatch(
      getTodoList({
        filter: filter || '',
        search: search || '',
        date: date || '',
        sortBy: sortBy || '',
        tag: tag || '',
        perPage: perPage || 10
      })
    )
  }

  // ** Get Tasks on mount & based on dependency change
  useEffect(() => {
    /* if user not logged then navigate */
    if (isUserLoggedIn() === null) {
      navigate(root)
    }

    if (loadFirst) {
      handleTodoLists(
        paramsURL.filter || '',
        searchInput || '',
        dateInput || '',
        sort || '',
        paramsURL.tag || ''
      )
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
      dispatch(clearTodoMessage())
    }

    /* For reset form data and closing modal */
    if (store.actionFlag && (store.actionFlag === "CREATED_UPDATED" || store.actionFlag === "DELETED" || store.actionFlag === "COMPLETED" || store.actionFlag === "IMPORTANT")) {
      setOpenTaskSidebar(false)
    }

    /* Succes toast notification */
    if (store.success) {
      Notification(T("Success"), store.success, "success")
    }

    /* Error toast notification */
    if (store.error) {
      Notification(T("Error"), store.error, "warning")
    }
  }, [store.userItems, paramsURL.filter, paramsURL.tag, store.success, store.error, store.actionFlag, searchInput, sort, loadFirst])
  // console.log("store >>> ", store)

  return (
    <Fragment>
      <Sidebar
        store={store}
        params={params}
        dispatch={dispatch}
        getTodoList={getTodoList}
        mainSidebar={mainSidebar}
        urlFilter={paramsURL.filter}
        setMainSidebar={setMainSidebar}
        resetTaskItems={resetTaskItems}
        updateTaskLoader={updateTaskLoader}
        setOpenTaskSidebar={setOpenTaskSidebar}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: mainSidebar === true
              })}
              onClick={handleMainSidebar}
            ></div>

            {store ? (
              <Tasks
                sort={sort}
                store={store}
                params={params}
                MySwal={MySwal}
                setSort={setSort}
                dispatch={dispatch}
                dateInput={dateInput}
                paramsURL={paramsURL}
                rowsPerPage={rowsPerPage}
                getTaskItem={getTaskItem}
                searchInput={searchInput}
                setDateInput={setDateInput}
                reOrderTasks={reOrderTasks}
                setRowsPerPage={setRowsPerPage}
                setSearchInput={setSearchInput}
                deleteTodoItem={deleteTodoItem}
                restoreTodoItem={restoreTodoItem}
                handleTodoLists={handleTodoLists}
                getTransformDate={getTransformDate}
                placeholderTasks={placeholderTasks}
                completeTodoItem={completeTodoItem}
                handleMainSidebar={handleMainSidebar}
                setOpenTaskSidebar={setOpenTaskSidebar}
              />
            ) : null}

            <TaskSidebar
              store={store}
              params={params}
              MySwal={MySwal}
              dispatch={dispatch}
              paramsURL={paramsURL}
              open={openTaskSidebar}
              getTaskItem={getTaskItem}
              userOptions={userOptions}
              trashTodoItem={trashTodoItem}
              createUpdateTodo={createUpdateTodo}
              completeTodoItem={completeTodoItem}
              updateTaskLoader={updateTaskLoader}
              importantTodoItem={importantTodoItem}
              handleTaskSidebar={() => setOpenTaskSidebar(!openTaskSidebar)}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TodoApp
