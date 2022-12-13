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
    params,
    dispatch,
    mainSidebar,
    getTodoList,
    setMainSidebar,
    setOpenTaskSidebar
  } = props

  // ** Functions To Handle List Item Filter
  const handleFilter = (filter) => {
    dispatch(getTodoList({ ...params, filter }))
  }

  const handleTag = tag => {
    dispatch(getTodoList({ ...params, tag }))
  }

  // ** Functions To Active List Item
  const handleActiveItem = (value) => {
    if ((params.filter && params.filter === value) || (params.tag && params.tag === value)) {
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
              <Button color='primary' onClick={handleAddClick} block>
                {T('Add Task')}
              </Button>
            </div>

            <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
              <ListGroup tag='div' className='list-group-filters'>
                <ListGroupItem
                  action
                  tag={Link}
                  to={'/apps/todo/'}
                  active={params.filter === '' && params.tag === ''}
                  onClick={() => handleFilter('')}
                >
                  <Mail className='me-75' size={18} />
                  <span className='align-middle'>{T('My Tasks')}</span>
                </ListGroupItem>

                <ListGroupItem
                  tag={Link}
                  to={'/apps/todo/important'}
                  active={handleActiveItem('important')}
                  onClick={() => handleFilter('important')}
                  action
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
                  tag={Link}
                  to={'/apps/todo/completed'}
                  active={handleActiveItem('completed')}
                  onClick={() => handleFilter('completed')}
                  action
                >
                  <Check className='me-75' size={18} />
                  <span className='align-middle'>{T('Completed')}</span>
                </ListGroupItem>

                <ListGroupItem
                  tag={Link}
                  to={'/apps/todo/deleted'}
                  active={handleActiveItem('deleted')}
                  onClick={() => handleFilter('deleted')}
                  action
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
                  active={handleActiveItem('team')}
                  className='d-flex align-items-center'
                  tag={Link}
                  to='/apps/todo/tag/team'
                  onClick={() => handleTag('team')}
                  action
                >
                  <span className='bullet bullet-sm bullet-primary me-1'></span>
                  <span className='align-middle'>{T('Team')}</span>
                </ListGroupItem>

                <ListGroupItem
                  active={handleActiveItem('low')}
                  className='d-flex align-items-center'
                  tag={Link}
                  to='/apps/todo/tag/low'
                  onClick={() => handleTag('low')}
                  action
                >
                  <span className='bullet bullet-sm bullet-success me-1'></span>
                  <span className='align-middle'>{T('Low')}</span>
                </ListGroupItem>

                <ListGroupItem
                  active={handleActiveItem('medium')}
                  className='d-flex align-items-center'
                  tag={Link}
                  to='/apps/todo/tag/medium'
                  onClick={() => handleTag('medium')}
                  action
                >
                  <span className='bullet bullet-sm bullet-warning me-1'></span>
                  <span className='align-middle'>{T('Medium')}</span>
                </ListGroupItem>

                <ListGroupItem
                  active={handleActiveItem('high')}
                  className='d-flex align-items-center'
                  tag={Link}
                  to='/apps/todo/tag/high'
                  onClick={() => handleTag('high')}
                  action
                >
                  <span className='bullet bullet-sm bullet-danger me-1'></span>
                  <span className='align-middle'>{T('High')}</span>
                </ListGroupItem>

                <ListGroupItem
                  active={handleActiveItem('update')}
                  className='d-flex align-items-center'
                  tag={Link}
                  to='/apps/todo/tag/update'
                  onClick={() => handleTag('update')}
                  action
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
