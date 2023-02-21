// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  Mail,
  File,
  Send,
  Star,
  Info,
  Trash
} from 'react-feather'

// ** Reactstrap Imports
import {
  Badge,
  Button,
  ListGroup,
  ListGroupItem
} from 'reactstrap'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import {
  getMails,
  getDraftList,
  toggleCompose,
  resetSelectedMail
} from '@src/pages/email/store'

// ** Translation
import { T } from '@localization'

const Sidebar = (props) => {
  // ** Props
  const {
    store,
    folder,
    userId,
    setOpenMail,
    sidebarOpen,
    setSidebarOpen,
    goToOtherFolder,
    onCheckUserPermission
  } = props

  // ** Store Variables
  const dispatch = useDispatch()

  // ** Functions To Handle Folder, Label & Compose
  const handleFolder = newFolder => {
    setOpenMail(false)
    goToOtherFolder(newFolder)
    if (newFolder === 'draft') {
      dispatch(getDraftList({ user_id: userId || "" }))
    } else {
      dispatch(getMails({ ...store.params, folder: newFolder }))
    }
    dispatch(resetSelectedMail())
  }

  const handleComposeClick = () => {
    dispatch(toggleCompose())
    setSidebarOpen(false)
  }

  return (
    <div
      className={classnames('sidebar-left', {
        show: sidebarOpen
      })}
    >
      <div className='sidebar'>
        <div className='sidebar-content email-app-sidebar'>
          <div className='email-app-menu'>
            <div className='form-group-compose text-center compose-btn'>
              {onCheckUserPermission(9) ? (
                <Button className='compose-email' color='primary' block onClick={handleComposeClick} disabled={store.composeModal.open}>
                  {T("Compose")}
                </Button>
              ) : null}
            </div>

            <PerfectScrollbar
              className='sidebar-menu-list'
            // options={{ wheelPropagation: false }}
            >
              <ListGroup className='list-group-messages'>
                <ListGroupItem
                  tag="a"
                  active={folder === 'inbox'}
                  onClick={() => handleFolder('inbox')}
                >
                  <Mail size={18} className='me-75' />
                  <span className='align-middle'>{T("Inbox")}</span>
                  {store.emailsMeta && store.emailsMeta.inbox ? (
                    <Badge className='float-end' color='light-primary' pill>
                      {store.emailsMeta.inbox}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'draft'}
                  onClick={() => handleFolder('draft')}
                >
                  <File size={18} className='me-75' />
                  <span className='align-middle'>{T("Drafts")}</span>
                  {store.emailsMeta && store.emailsMeta.draft ? (
                    <Badge className='float-end' color='light-warning' pill>
                      {store.emailsMeta.draft}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'important'}
                  onClick={() => handleFolder('important')}
                >
                  <Star size={18} className='me-75' />
                  <span className='align-middle'>{T("Important")}</span>
                  {store.emailsMeta && store.emailsMeta.important ? (
                    <Badge className='float-end' color='light-primary' pill>
                      {store.emailsMeta.important}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'spam'}
                  onClick={() => handleFolder('spam')}
                >
                  <Info size={18} className='me-75' />
                  <span className='align-middle'>{T("Spam")}</span>
                  {store.emailsMeta.spam ? (
                    <Badge className='float-end' color='light-danger' pill>
                      {store.emailsMeta.spam}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'sent'}
                  onClick={() => handleFolder('sent')}
                >
                  <Send size={18} className='me-75' />
                  <span className='align-middle'>{T("Sent")}</span>
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'trash'}
                  onClick={() => handleFolder('trash')}
                >
                  <Trash size={18} className='me-75' />
                  <span className='align-middle'>{T("Trash")}</span>
                </ListGroupItem>
              </ListGroup>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
