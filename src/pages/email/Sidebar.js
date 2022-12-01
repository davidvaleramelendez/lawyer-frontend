// ** React Imports
import { Link, useParams } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icons Import
import {
  Mail,
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
import {  toggleCompose, getMails, resetSelectedMail } from './store'

// Translation
import { useTranslation } from 'react-i18next'

const Sidebar = (props) => {
  // ** Props
  const {
    store,
    setOpenMail,
    sidebarOpen,
    setSidebarOpen
  } = props

  // ** Store Variables
  const dispatch = useDispatch()

  // ** Vars
  const params = useParams()

  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Functions To Handle Folder, Label & Compose
  const handleFolder = folder => {
    setOpenMail(false)
    dispatch(getMails({ ...store.params, folder }))
    dispatch(resetSelectedMail())
  }

  const handleComposeClick = () => {
    console.log(' compose click ')
    dispatch(toggleCompose())
    setSidebarOpen(false)
  }

  // ** Functions To Active List Item
  const handleActiveItem = (value) => {
    if ((params.folder && params.folder === value)) {
      return true
    } else {
      return false
    }
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
              <Button className='compose-email' color='primary' block onClick={handleComposeClick}>
                {t("Compose")}
              </Button>
            </div>

            <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
              <ListGroup tag='div' className='list-group-messages'>
                <ListGroupItem
                  action
                  to='/apps/email/inbox'
                  tag={Link}
                  active={!Object.keys(params).length || handleActiveItem('inbox')}
                  onClick={() => handleFolder('inbox')}
                >
                  <Mail size={18} className='me-75' />
                  <span className='align-middle'>{t("Inbox")}</span>
                  {store.emailsMeta.inbox ? (
                    <Badge className='float-end' color='light-primary' pill>
                      {store.emailsMeta.inbox}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  action
                  to='/apps/email/important'
                  tag={Link}
                  active={handleActiveItem('important')}
                  onClick={() => handleFolder('important')}
                >
                  <Star size={18} className='me-75' />
                  <span className='align-middle'>{t("Important")}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  to='/apps/email/spam'
                  tag={Link}
                  active={handleActiveItem('spam')}
                  onClick={() => handleFolder('spam')}
                >
                  <Info size={18} className='me-75' />
                  <span className='align-middle'>{t("Spam")}</span>
                  {store.emailsMeta.spam ? (
                    <Badge className='float-end' color='light-danger' pill>
                      {store.emailsMeta.spam}
                    </Badge>
                  ) : null}
                </ListGroupItem>

                <ListGroupItem
                  action
                  to='/apps/email/sent'
                  tag={Link}
                  active={handleActiveItem('sent')}
                  onClick={() => handleFolder('sent')}
                >
                  <Send size={18} className='me-75' />
                  <span className='align-middle'>{t("Sent")}</span>
                </ListGroupItem>

                <ListGroupItem
                  action
                  to='/apps/email/trash'
                  tag={Link}
                  active={handleActiveItem('trash')}
                  onClick={() => handleFolder('trash')}
                >
                  <Trash size={18} className='me-75' />
                  <span className='align-middle'>{t("Trash")}</span>
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
