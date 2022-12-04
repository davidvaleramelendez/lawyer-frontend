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
import {  toggleCompose, getMails, resetSelectedMail, getDraftList } from './store'

// Translation
import { useTranslation } from 'react-i18next'

const Sidebar = (props) => {
  // ** Props
  const {
    store,
    setOpenMail,
    sidebarOpen,
    setSidebarOpen, 
    folder,
    goToOtherFolder
  } = props

  // ** Store Variables
  const dispatch = useDispatch()

  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Functions To Handle Folder, Label & Compose
  const handleFolder = newFolder => {
    setOpenMail(false)
    goToOtherFolder(newFolder)
    if (newFolder === 'draft') {
      dispatch(getDraftList())
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
              <Button className='compose-email' color='primary' block onClick={handleComposeClick} disabled={store.composeModal.open}>
                {t("Compose")}
              </Button>
            </div>

            <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
              <ListGroup className='list-group-messages'>
                <ListGroupItem
                  tag="a"
                  active={folder === 'inbox'}
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
                  tag="a"
                  active={folder === 'draft'}
                  onClick={() => handleFolder('draft')}
                >
                  <File size={18} className='me-75' />
                  <span className='align-middle'>{t("Drafts")}</span>
                  {store.emailsMeta.draft ? (
                    <Badge className='float-end' color='light-primary' pill>
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
                  <span className='align-middle'>{t("Important")}</span>
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'spam'}
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
                  tag="a"
                  active={folder === 'sent'}
                  onClick={() => handleFolder('sent')}
                >
                  <Send size={18} className='me-75' />
                  <span className='align-middle'>{t("Sent")}</span>
                </ListGroupItem>

                <ListGroupItem
                  tag="a"
                  active={folder === 'trash'}
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
