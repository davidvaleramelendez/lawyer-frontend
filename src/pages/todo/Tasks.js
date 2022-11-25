// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Blank Avatar Image
import blankAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Third Party Components
import classnames from 'classnames'
import { ReactSortable } from 'react-sortablejs'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  Menu,
  Trash,
  Search,
  RefreshCw,
  MoreVertical
} from 'react-feather'

// ** Reactstrap Imports
import {
  Input,
  Badge,
  InputGroup,
  DropdownMenu,
  DropdownItem,
  InputGroupText,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

const Tasks = (props) => {
  // ** Props
  const {
    sort,
    store,
    MySwal,
    setSort,
    dispatch,
    dateInput,
    paramsURL,
    taskItems,
    getTaskItem,
    searchInput,
    rowsPerPage,
    setDateInput,
    reOrderTasks,
    setSearchInput,
    setRowsPerPage,
    deleteTodoItem,
    restoreTodoItem,
    handleTodoLists,
    placeholderTasks,
    completeTodoItem,
    handleMainSidebar,
    setOpenTaskSidebar
  } = props

  // ** Function to getTaskItem on click
  const handleTaskClick = (obj) => {
    dispatch(getTaskItem(obj))
    setOpenTaskSidebar(true)
  }

  const onScrollDown = (container, value) => {
    const { scrollTop, scrollHeight, clientHeight } = container
    const { totalRecord } = store.pagination
    // console.log("onScrollDown >>> ", scrollTop, scrollHeight, clientHeight, totalRecord)
    if ((scrollTop + clientHeight) === (scrollHeight - 1) || (scrollTop + clientHeight) === (scrollHeight)) {
      if (value < totalRecord) {
        setRowsPerPage(value + 10)
        handleTodoLists(paramsURL.filter, searchInput, dateInput, sort, paramsURL.tag, value + 10)
      }
    }
  }

  // ** Returns avatar color based on task tag
  const resolveAvatarVariant = (tags) => {
    if (tags.includes('high')) return 'light-primary'
    if (tags.includes('medium')) return 'light-warning'
    if (tags.includes('low')) return 'light-success'
    if (tags.includes('update')) return 'light-danger'
    if (tags.includes('team')) return 'light-info'
    return 'light-primary'
  }

  // ** Renders task tags
  const renderTags = (tags) => {
    const badgeColor = {
      team: 'light-primary',
      low: 'light-success',
      medium: 'light-warning',
      high: 'light-danger',
      update: 'light-info'
    }

    return tags.map(item => (
      <Badge className='text-capitalize' key={item} color={badgeColor[item]} pill>
        {item}
      </Badge>
    ))
  }

  // ** Renders Avatar
  const renderAssignee = (task) => {
    const item = task && task.assign ? task.assign : null

    if (item && (item.profile_photo_path === undefined || item.profile_photo_path === null)) {
      return <Avatar color={resolveAvatarVariant(task.tag)} content={item.name} initials />
    } else if (item && item.profile_photo_path !== '') {
      return <Avatar img={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${item.profile_photo_path}`} imgHeight='32' imgWidth='32' />
    } else {
      return <Avatar img={blankAvatar} imgHeight='32' imgWidth='32' />
    }
  }

  // ** Function to delete task
  const handleDeleteTask = (todoId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(deleteTodoItem(todoId))
      }
    })
  }

  // ** Function to restore task
  const handleRestoreTask = (todoId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You can also revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(restoreTodoItem(todoId))
      }
    })
  }

  const renderTasks = () => {
    if (!store.loading) {
      return (
        <div className="list-group todo-task-list-wrapper">
          <ul className="todo-task-list media-list">
            {Array.from(Array(placeholderTasks).keys(), (row, index) => (
              <li
                key={`placeholder-todo-${index}`}
                className="todo-item placeholder-glow"
              >
                <div className="todo-title-wrapper w-100">
                  <div className="todo-title-area w-75">
                    <MoreVertical className="drag-icon" />
                    <div className="form-check placeholder" />

                    <span className="todo-title placeholder w-75" />
                  </div>

                  <div className="todo-item-action mt-lg-0 mt-50 w-25">
                    <div className="badge-wrapper me-1 placeholder w-25" />

                    <small className="text-nowrap text-muted me-1 placeholder w-25" />

                    <Avatar
                      imgClassName="placeholder"
                      img={blankAvatar}
                      imgHeight='32'
                      imgWidth='32'
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <PerfectScrollbar
        className="list-group todo-task-list-wrapper"
        options={{ wheelPropagation: false }}
        containerRef={ref => {
          if (ref) {
            ref._getBoundingClientRect = ref.getBoundingClientRect
            ref.getBoundingClientRect = () => {
              const original = ref._getBoundingClientRect()
              return { ...original, height: Math.floor(original.height) }
            }
          }
        }}
        onScrollDown={(container) => onScrollDown(container, rowsPerPage)}
      >
        {taskItems.length ? (
          <ReactSortable
            tag="ul"
            list={taskItems}
            handle=".drag-icon"
            className="todo-task-list media-list"
            setList={(newState) => dispatch(reOrderTasks(newState))}
          >
            {taskItems.map((item, index) => {
              return (
                <li
                  key={`${item.id}-${index}`}
                  onClick={() => handleTaskClick(item)}
                  className={classnames("todo-item", {
                    completed: item.is_completed
                  })}
                >
                  <div className="todo-title-wrapper">
                    <div className="todo-title-area">
                      <MoreVertical className="drag-icon" />
                      {paramsURL && paramsURL.filter === "deleted" ? (
                        <div className="trash-action">
                          <RefreshCw
                            size={16}
                            className="cursor-pointer mt-25 ms-1 me-1"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleRestoreTask(item.id)
                            }}
                          />

                          <Trash
                            size={16}
                            className="cursor-pointer mt-25"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleDeleteTask(item.id)
                            }}
                          />
                        </div>
                      ) : (
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            id={`${index}_${item.id}`}
                            checked={item.is_completed}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => {
                              event.stopPropagation()
                              dispatch(completeTodoItem(item.id))
                            }}
                          />
                        </div>
                      )}
                      <span className="todo-title">{item.title}</span>
                    </div>
                    <div className="todo-item-action mt-lg-0 mt-50">
                      {item && item.tag ? (
                        <div className="badge-wrapper me-1">{renderTags(item.tag.split(","))}</div>
                      ) : null}

                      {item && item.due_date ? (
                        <small className="text-nowrap text-muted me-1">
                          {new Date(item.due_date).toLocaleString("default", { month: "short" })}{" "}
                          {new Date(item.due_date).getDate().toString().padStart(2, "0")}
                        </small>
                      ) : null}
                      {item && renderAssignee(item)}
                    </div>
                  </div>
                </li>
              )
            })}
          </ReactSortable>
        ) : (
          <div className="no-results show">
            <h5>No Items Found</h5>
          </div>
        )}
      </PerfectScrollbar>
    )
  }

  // ** Function to getTodoList based on search
  const handleSearchFilter = (value) => {
    setSearchInput(value)
    handleTodoLists(paramsURL.filter, value, dateInput, sort, paramsURL.tag)
  }

  // ** Function to getTodoList based on search
  const handleDateFilter = (value) => {
    setDateInput(value)
    handleTodoLists(paramsURL.filter, searchInput, value, sort, paramsURL.tag)
  }

  // ** Function to getTodoList based on sort
  const handleSort = (event, val) => {
    event.preventDefault()
    setSort(val)
    handleTodoLists(paramsURL.filter, searchInput, dateInput, val, paramsURL.tag)
  }

  return (
    <div className="todo-app-list">
      <div className="app-fixed-search d-flex align-items-center">
        <div className="sidebar-toggle cursor-pointer d-block d-lg-none ms-1" onClick={handleMainSidebar}>
          <Menu size={21} />
        </div>

        <div className="d-flex align-content-center justify-content-between w-100">
          <InputGroup className="input-group-merge">
            <InputGroupText>
              <Search className="text-muted" size={14} />
            </InputGroupText>

            <Input id="search-todo" placeholder="Search task" value={searchInput} onChange={(event) => handleSearchFilter(event.target.value)} />

            <Input id="date-todo" type="date" placeholder="YYYY-MM-DD" value={dateInput} onChange={(event) => handleDateFilter(event.target.value)} />
          </InputGroup>
        </div>

        <UncontrolledDropdown>
          <DropdownToggle className="hide-arrow me-1" tag="a" href="/" onClick={(event) => event.preventDefault()}>
            <MoreVertical className="text-body" size={16} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem tag={Link} to="/" onClick={(event) => handleSort(event, "title-asc")}>
              Sort A-Z
            </DropdownItem>

            <DropdownItem tag={Link} to="/" onClick={(event) => handleSort((event), "title-desc")}>
              Sort Z-A
            </DropdownItem>

            <DropdownItem tag={Link} to="/" onClick={(event) => handleSort(event, "Assign-asc")}>
              Sort Assignee
            </DropdownItem>

            <DropdownItem tag={Link} to="/" onClick={(event) => handleSort(event, "due_date-desc")}>
              Sort Due Date
            </DropdownItem>

            <DropdownItem tag={Link} to="/" onClick={(event) => handleSort(event, "")}>
              Reset Sort
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      {renderTasks()}
    </div>
  )
}

export default Tasks
