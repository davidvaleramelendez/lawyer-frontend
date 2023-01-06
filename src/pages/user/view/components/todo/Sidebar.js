// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  Mail,
  Star,
  Check,
  Trash
} from 'react-feather'

// ** Reactstrap Imports
import {
  Badge,
  Button,
  ListGroup,
  ListGroupItem
} from 'reactstrap'

// ** Translation
import { T } from '@localization'

const TodoSidebar = (props) => {
  // ** Props
  const {
    store,
    folder,
    params,
    dispatch,
    setFolder,
    tagFolder,
    mainSidebar,
    getTodoList,
    setTagFolder,
    setMainSidebar,
    resetTaskItems,
    // updateTaskLoader,
    setOpenTaskSidebar,
    onCheckUserPermission
  } = props

  // ** Functions To Handle List Item Filter
  const handleFilter = (filter) => {
    // dispatch(updateTaskLoader(false))
    dispatch(resetTaskItems([]))
    setTagFolder('')
    setFolder(filter)
    dispatch(getTodoList({ ...params, filter, tag: "" }))
  }

  const handleTag = (tag) => {
    // dispatch(updateTaskLoader(false))
    dispatch(resetTaskItems([]))
    setFolder('')
    setTagFolder(tag)
    dispatch(getTodoList({ ...params, filter: "", tag }))
  }

  // ** Functions To Active List Item
  const handleActiveItem = (value) => {
    if ((folder === value) || (tagFolder === value)) {
      return true
    } else {
      return false
    }
  }

  // ** Functions To Handle Add Task Click
  const handleAddClick = () => {
    setOpenTaskSidebar(true)
    setMainSidebar()
  }

  return (
    <div
      className={classnames('sidebar-left', {
        show: mainSidebar === true
      })}
    >
      <div className='sidebar'>
        <div className='sidebar-content todo-sidebar'>
          <div className='todo-app-menu'>
            <div className='add-task'>
              {onCheckUserPermission(13) ? (
                <Button color='primary' onClick={handleAddClick} block>
                  {T('Add Task')}
                </Button>
              ) : null}
            </div>

            <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
              <ListGroup tag='div' className='list-group-filters'>
                <ListGroupItem
                  action
                  className="cursor-pointer"
                  active={folder === '' && tagFolder === ''}
                  onClick={() => handleFilter('')}
                >
                  <Mail className='me-75' size={18} />
                  <span className='align-middle'>{T('My Tasks')}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  className="cursor-pointer"
                  active={handleActiveItem('important')}
                  onClick={() => handleFilter('important')}
                >
                  <Star className='me-75' size={18} />
                  <span className='align-middle'>{T('Important')}</span>
                  {store && store.todosMeta && store.todosMeta.important ? (
                    <Badge className='float-end' color='light-warning' pill>
                      {store.todosMeta.important}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  action
                  className="cursor-pointer"
                  active={handleActiveItem('completed')}
                  onClick={() => handleFilter('completed')}
                >
                  <Check className='me-75' size={18} />
                  <span className='align-middle'>{T('Completed')}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  className="cursor-pointer"
                  active={handleActiveItem('deleted')}
                  onClick={() => handleFilter('deleted')}
                >
                  <Trash className='me-75' size={18} />
                  <span className='align-middle'>{T('Deleted')}</span>
                </ListGroupItem>
              </ListGroup>

              <div className='mt-3 px-2 d-flex justify-content-between'>
                <h6 className='section-label mb-1'>{T('Tags')}</h6>
              </div>

              <ListGroup className='list-group-labels'>
                <ListGroupItem
                  action
                  className='d-flex align-items-center cursor-pointer'
                  active={handleActiveItem('team')}
                  onClick={() => handleTag('team')}
                >
                  <span className='bullet bullet-sm bullet-primary me-1'></span>
                  <span className='align-middle'>{T('Team')}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  className='d-flex align-items-center cursor-pointer'
                  active={handleActiveItem('low')}
                  onClick={() => handleTag('low')}
                >
                  <span className='bullet bullet-sm bullet-success me-1'></span>
                  <span className='align-middle'>{T('Low')}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  className='d-flex align-items-center cursor-pointer'
                  active={handleActiveItem('medium')}
                  onClick={() => handleTag('medium')}
                >
                  <span className='bullet bullet-sm bullet-warning me-1'></span>
                  <span className='align-middle'>{T('Medium')}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  className='d-flex align-items-center cursor-pointer'
                  active={handleActiveItem('high')}
                  onClick={() => handleTag('high')}
                >
                  <span className='bullet bullet-sm bullet-danger me-1'></span>
                  <span className='align-middle'>{T('High')}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  className='d-flex align-items-center cursor-pointer'
                  active={handleActiveItem('update')}
                  onClick={() => handleTag('update')}
                >
                  <span className='bullet bullet-sm bullet-info me-1'></span>
                  <span className='align-middle'>{T('Update')}</span>
                </ListGroupItem>
              </ListGroup>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoSidebar
