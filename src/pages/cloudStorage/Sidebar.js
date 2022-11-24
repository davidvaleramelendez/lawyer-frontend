/* eslint-disable no-unused-expressions */

// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Progress,
  Collapse,
  ListGroup,
  DropdownMenu,
  DropdownItem,
  ListGroupItem,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'

// ** Icons Import
import * as Icon from 'react-feather'

const Sidebar = (props) => {
  // ** Props
  const {
    store,
    params,
    dispatch,
    mainSidebar,
    setFileModalOpen,
    handleNavigateItem,
    setFolderModalOpen,
    changeExpandedValue
  } = props

  // ** Hooks
  const { t } = useTranslation()

  const onExpandingToggle = async (folder) => {
    const expndTreeFoldr = [...store.expandTreeFolder]
    if (folder && folder.slug) {
      const index = expndTreeFoldr.indexOf(folder.slug)
      if (index !== -1) {
        expndTreeFoldr.splice(index, 1)
      } else {
        expndTreeFoldr.push(folder.slug)
      }
      dispatch(changeExpandedValue(expndTreeFoldr))
    }
  }

  const onCheckCollapsed = (folder) => {
    if (folder && folder.slug) {
      const index = store.expandTreeFolder.indexOf(folder.slug)
      if (index !== -1) {
        return true
      }
      return false
    }
    return false
  }

  const renderTreeFolderStructure = (treeFolderItems, level) => {
    if (treeFolderItems && treeFolderItems.length) {
      return treeFolderItems.map((folder, index) => {
        let IconTag = ""
        if (folder && folder.children && folder.children.length && onCheckCollapsed(folder)) {
          IconTag = Icon['ChevronDown']
        }

        if (folder && folder.children && folder.children.length && !onCheckCollapsed(folder)) {
          IconTag = Icon['ChevronRight']
        }

        const FolderIcon = Icon['Folder']

        return <Fragment key={`tree_folder_${level}_${index}`}>
          <ListGroupItem
            className={`pb-0 ${IconTag ? 'position-relative' : ''}`}
            active={params.slug === folder.slug}
          >
            <div
              className={`d-inline-flex ${folder && folder.id !== 0 ? IconTag ? '' : 'ms-2' : ''}`}
            >
              {IconTag ? (
                <IconTag
                  size={17}
                  style={{ left: '5px' }}
                  className="position-absolute cursor-pointer me-50"
                  onClick={() => onExpandingToggle(folder, onCheckCollapsed(folder))}
                />
              ) : null}

              <FolderIcon
                size={17}
                className={`align-middle cursor-pointer me-50 ${folder && folder.id !== 0 ? IconTag ? '' : 'ms-25' : ''}`}
                onClick={(event) => {
                  handleNavigateItem(event, folder.slug || "")
                  IconTag && onExpandingToggle(folder, onCheckCollapsed(folder))
                }}
              />
              <span
                className="align-middle cursor-pointer"
                onClick={(event) => {
                  handleNavigateItem(event, folder.slug || "")
                  IconTag && onExpandingToggle(folder, onCheckCollapsed(folder))
                }}
              >
                {folder.name || ""}
              </span>
            </div>

            <Collapse isOpen={onCheckCollapsed(folder)}>
              {folder && folder.children && folder.children.length ? (
                <ListGroup
                  tag="ul"
                  className={`list-group-filters level-${level + 1}`}
                >
                  {renderTreeFolderStructure(folder.children, level + 1)}
                </ListGroup>
              ) : null}
            </Collapse>
          </ListGroupItem>
        </Fragment>
      })
    }

    return null
  }

  const Star = Icon['Star']
  const Clock = Icon['Clock']
  const Server = Icon['Server']
  const Trash2 = Icon['Trash2']
  const Folder = Icon['Folder']
  const UploadCloud = Icon['UploadCloud']

  return store ? (
    <div
      className={classnames("sidebar-left", {
        show: mainSidebar === true
      })}
    >
      <div className="sidebar">
        <div className="sidebar-file-manager">
          <div className="sidebar-inner">
            <div className="dropdown dropdown-actions">
              <UncontrolledButtonDropdown className="w-100">
                <DropdownToggle
                  color="primary"
                  className="rounded-2"
                >
                  {t("Add")} {t("New")}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    className="w-100"
                    onClick={() => setFolderModalOpen(true)}
                  >
                    <Folder size={17} className="me-50" />
                    <span className="align-middle">{t("Folder")}</span>
                  </DropdownItem>

                  <DropdownItem
                    className="w-100"
                    onClick={() => setFileModalOpen(true)}
                  >
                    <UploadCloud size={17} className="me-50" />
                    <span className="align-middle">{t("File Upload")}</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>

            <PerfectScrollbar
              className="sidebar-list"
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
            >
              <ListGroup
                tag="ul"
                className={`list-group-filters level-0`}
              >
                {store.treeFolderItems && store.treeFolderItems.length ? (
                  renderTreeFolderStructure(store.treeFolderItems, 0)
                ) : null}

                <ListGroupItem
                  active={params.slug === 'important'}
                  onClick={(event) => handleNavigateItem(event, 'important')}
                >
                  <Star
                    size={17}
                    className="me-50 cursor-pointer"
                  />
                  <span className="align-middle cursor-pointer">{t("Important")}</span>
                </ListGroupItem>

                <ListGroupItem
                  active={params.slug === 'recent'}
                  onClick={(event) => handleNavigateItem(event, 'recent')}
                >
                  <Clock
                    size={17}
                    className="me-50 cursor-pointer"
                  />
                  <span className="align-middle cursor-pointer">{t("Recents")}</span>
                </ListGroupItem>

                <ListGroupItem
                  active={params.slug === 'trash'}
                  onClick={(event) => handleNavigateItem(event, 'trash')}
                >
                  <Trash2
                    size={17}
                    className="me-50 cursor-pointer"
                  />
                  <span className="align-middle cursor-pointer">{t("Trash")}</span>
                </ListGroupItem>
              </ListGroup>

              <div className="storage-status mb-1 px-2">
                <h6 className="section-label mb-1">Storage Status</h6>
                <div className="d-flex align-items-center cursor-pointer">
                  <Server size={17} />
                  <div className="file-manager-progress ms-1">
                    <span>68GB used of 100GB</span>
                    <Progress
                      value={68}
                      style={{ height: '6px' }}
                    />
                  </div>
                </div>
              </div>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  ) : null

}

export default Sidebar
