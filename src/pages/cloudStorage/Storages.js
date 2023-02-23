// ** React Imports

// ** Reactstrap Imports
import {
  Card,
  Input,
  Button,
  CardBody,
  CardText,
  InputGroup,
  ButtonGroup,
  DropdownMenu,
  DropdownItem,
  InputGroupText,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,
  Badge
} from 'reactstrap'

// ** Icons Import
import {
  Grid,
  List,
  Move,
  Menu,
  Star,
  Edit,
  Search,
  Folder,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ChevronRight,
  MoreVertical,
  Share2
} from 'react-feather'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Image icons
import attachmentSvg from '@src/assets/images/icons/svg/attachment.svg'
import imagePng from '@src/assets/images/icons/jpg.png'
import pdfPng from '@src/assets/images/icons/pdf.png'
import docPng from '@src/assets/images/icons/doc.png'
import txtPng from '@src/assets/images/icons/txt.png'
import videoSvg from '@src/assets/images/icons/svg/video.svg'

// ** Translation
import { T } from '@localization'

const Storages = (props) => {
  // ** Props
  const {
    sort,
    store,
    shared,
    navigate,
    hashParam,
    handleSort,
    searchInput,
    onTrashFile,
    handleSearch,
    onTrashFolder,
    handleFileItem,
    handleViewFile,
    handleMarkShare,
    handleDeleteFile,
    getTransformDate,
    handleFolderItem,
    handleMarkRestore,
    handleMainSidebar,
    handleDeleteFolder,
    handleNavigateItem,
    handleFileItemMove,
    handleMarkImportant,
    handleFolderItemMove,
    handleBreadcrumbNavigate
  } = props

  const fileExtensions = {
    attachment: attachmentSvg,
    avi: videoSvg,
    doc: docPng,
    docm: docPng,
    docx: docPng,
    jpeg: imagePng,
    jpg: imagePng,
    mkv: videoSvg,
    mov: videoSvg,
    mp4: videoSvg,
    odp: docPng,
    ods: docPng,
    odt: docPng,
    pdf: pdfPng,
    png: imagePng,
    potm: docPng,
    potx: docPng,
    ppam: docPng,
    ppsm: docPng,
    ppsx: docPng,
    pptm: docPng,
    pptx: docPng,
    svg: imagePng,
    text: txtPng,
    txt: txtPng,
    webm: videoSvg,
    wmv: videoSvg,
    xlam: docPng,
    xlsm: docPng,
    xlsx: docPng,
    xltm: docPng,
    xltx: docPng
  }

  /* Rendering breadcrumb */
  const renderBreadcrumbs = () => {
    return store.cloudStorageItems ? (<>
      {store.cloudStorageItems.breadcrumbs && store.cloudStorageItems.breadcrumbs.length ? (
        <div className="file-manager-content-header d-flex justify-content-between align-items-center breadcrumb p-1">
          <div className="d-inline-flex">
            <div className="d-flex">
              
              {store.cloudStorageItems.shared ? (
                <h5
                  className="cursor-pointer"
                  onClick={(e) => handleNavigateItem(e, "shared")}
                >
                  {T('Shared Folder')}
                </h5>
              ) : (
                <h5
                  className="cursor-pointer"
                  onClick={() => handleBreadcrumbNavigate("", true)}
                >
                  {T('My Drive')}
                </h5>
              )}
              <ChevronRight
                className="ms-1 me-1"
                size={17}
              />
            </div>

            {store.cloudStorageItems.breadcrumbs.map((breadcrumb, index) => {
              const ind = store.cloudStorageItems.breadcrumbs.length - 1 - index
              return (<div
                key={`breadcrumb_${index}`}
                className="d-flex"
              >
                <h5
                  className={store.cloudStorageItems.breadcrumbs.length - 1 === index ? '' : 'cursor-pointer'}
                  onClick={() => handleBreadcrumbNavigate(store.cloudStorageItems.breadcrumbs[ind].slug || "", !(store.cloudStorageItems.breadcrumbs.length - 1 === index))}
                >
                  {store.cloudStorageItems.breadcrumbs[ind].name}
                </h5>

                {store.cloudStorageItems.breadcrumbs.length - 1 === index ? '' : <ChevronRight
                  className="ms-1 me-1"
                  size={17}
                />}
              </div>)
            })}
          </div>
        </div>
      ) : null}
    </>) : null
  }
  /* /Rendering breadcrumb */

  /* Rendering folder and its files */
  const renderFolderFiles = () => {
    return store ? (
      <PerfectScrollbar
        className={`file-manager-content-body ${store.cloudStorageItems && store.cloudStorageItems.breadcrumbs && store.cloudStorageItems.breadcrumbs.length ? 'has-breadcrumb' : ''}`}
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
        {/* Container Starts */}
        <div
          className={`view-container ${hashParam === "#list" ? 'list-view' : ''}`}
        >
          <div className="files-header">
            <h6 className="fw-bold mb-0">{T('Filename')}</h6>
            <div>
              <h6 className="fw-bold file-status d-inline-block mb-0">
                {shared ? T('Shared By') : T('Status')}
              </h6>
              <h6 className="fw-bold file-last-modified d-inline-block mb-0">{T('Created')}
              </h6>
              <h6 className="fw-bold d-inline-block me-1 mb-0">{T('Actions')}</h6>
            </div>
          </div>

          <Card className="file-manager-item folder level-up">
            <div className="card-img-top file-logo-wrapper">
              <div className="d-flex align-items-center justify-content-center w-100">
                {sort.includes('name-asc') ? (
                  <ArrowUp
                    size={17}
                    onClick={() => handleSort("name-desc")}
                  />
                ) : null}

                {sort.includes('name-desc') ? (
                  <ArrowDown
                    size={17}
                    onClick={() => handleSort("name-asc")}
                  />
                ) : null}
              </div>
            </div>
          </Card>

          {/* Folder */}
          {store.cloudStorageItems.folders && store.cloudStorageItems.folders.length ? (<>
            {hashParam === "#grid" ? (
              <h6 className="files-section-title mt-25 mb-75">{T("Folders")}</h6>
            ) : null}

            {store.cloudStorageItems.folders.map((folder, index) => (
              <Card
                key={`folder_${index}`}
                className="file-manager-item folder"
              >
                <div className="card-img-top file-logo-wrapper">
                  <div className="dropdown float-end">
                    {/* View action */}
                    <UncontrolledButtonDropdown>
                      <DropdownToggle color="#FFFFFF" tag="span">
                        <MoreVertical size={17} className="cursor-pointer" />
                      </DropdownToggle>
                      <DropdownMenu end>
                        {folder && !folder.deleted_at ? (<>
                          {!shared &&
                            <DropdownItem
                              className="w-100"
                              onClick={() => handleMarkShare(folder)}
                            >
                              <Share2 size={17} className="me-50" />
                              <span className="align-middle">{T("Share")}</span>
                            </DropdownItem>
                          }
                          <DropdownItem
                            className="w-100"
                            onClick={() => handleFolderItem(folder)}
                          >
                            <Edit size={17} className="me-50" />
                            <span className="align-middle">{T("Edit")}</span>
                          </DropdownItem>

                          <DropdownItem
                            className="w-100"
                            onClick={() => handleFolderItemMove(folder)}
                          >
                            <Move size={17} className="me-50" />
                            <span className="align-middle">{T("Move")}</span>
                          </DropdownItem>

                          <DropdownItem
                            className="w-100"
                            onClick={() => handleMarkImportant(folder)}
                          >
                            <Star
                              size={17}
                              className={classnames("me-50", {
                                'text-warning': (folder && folder.important_at !== null) || ""
                              })}
                            />
                            <span className="align-middle">{T("Important")}</span>
                          </DropdownItem>

                          <DropdownItem
                            className="w-100"
                            onClick={() => onTrashFolder(folder.id)}
                          >
                            <Trash2 size={17} className="me-50" />
                            <span className="align-middle">{T("Delete")}</span>
                          </DropdownItem>
                        </>) : (<>
                          <DropdownItem
                            className="w-100"
                            onClick={() => handleMarkRestore(folder)}
                          >
                            <RefreshCw size={17} className="me-50" />
                            <span className="align-middle">{T("Restore")}</span>
                          </DropdownItem>

                          <DropdownItem
                            className="w-100"
                            onClick={() => handleDeleteFolder(folder)}
                          >
                            <Trash2 size={17} className="me-50" />
                            <span className="align-middle">{T("Delete forever")}</span>
                          </DropdownItem>
                        </>)}
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                    {/* View action */}
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center w-100"
                    onClick={(event) => folder && !folder.deleted_at && handleNavigateItem(event, folder.slug || "")}
                  >
                    <Folder
                      size={17}
                      className="feather feather-folder"
                    />
                  </div>
                </div>

                <CardBody>
                  <div className="content-wrapper">
                    <CardText
                      id={`cs-tooltip-folder-name-${folder.id}`}
                      className="file-name mb-0"
                      onClick={(event) => folder && !folder.deleted_at && handleNavigateItem(event, folder.slug || "")}
                    >
                      {folder.name}
                      <UncontrolledTooltip
                        delay={300}
                        placement="top"
                        target={`cs-tooltip-folder-name-${folder.id}`}
                      >
                        {folder.name}
                      </UncontrolledTooltip>
                    </CardText>

                    {!shared && folder.shared_user_id !== null && (
                      <CardText
                        className="file-status"
                        id={`cs-tooltip-folder-status-${folder.id}`}
                      >
                        <Badge color='info'>
                          <Share2 size={12} className='align-middle me-25' />
                          <span className='align-middle'>{T("Shared")}</span>
                        </Badge>
                      </CardText>
                    )}
                    {!shared && folder.shared_user_id === null && (
                        <CardText
                          className="file-status"
                          id={`cs-tooltip-folder-status-${folder.id}`}
                        >&nbsp;</CardText>
                      )}
                    {shared && (
                      <CardText
                        className="file-shareuser"
                        id={`cs-tooltip-folder-shareuser-${folder.id}`}
                      >
                        {folder.user.name}
                      </CardText>
                    )}
                    <CardText
                      className="file-date"
                      id={`cs-tooltip-folder-date-${folder.id}`}
                    >
                      {folder && folder.created_at && getTransformDate(folder.created_at, "DD-MM-YYYY HH:mm:ss")}
                    </CardText>
                  </div>

                  <small
                    id={`cs-tooltip-folder-date-${folder.id}`}
                    className="file-accessed text-muted"
                  >
                    {folder && folder.created_at && getTransformDate(folder.created_at, "DD-MM-YYYY HH:mm:ss")}
                    <UncontrolledTooltip
                      delay={300}
                      placement="top"
                      target={`cs-tooltip-folder-date-${folder.id}`}
                    >
                      {T("Folder Created")}
                    </UncontrolledTooltip>
                  </small>
                </CardBody>
              </Card>
            ))}
          </>) : null}
          {/* /Folder */}

          {/* File */}
          {store.cloudStorageItems.files && store.cloudStorageItems.files.length ? (<>
            {hashParam === "#grid" ? (
              <h6 className="files-section-title mt-25 mb-75">{T("Files")}</h6>
            ) : null}

            {store.cloudStorageItems.files.map((file, index) => {
              const SvgIcon = fileExtensions[file.extension] || fileExtensions["attachment"]

              return (
                <Card
                  key={`file_${index}`}
                  className="file-manager-item file"
                >
                  <div className="card-img-top file-logo-wrapper">
                    <div className="dropdown float-end">
                      {/* View action */}
                      <UncontrolledButtonDropdown>
                        <DropdownToggle color="#FFFFFF" tag="span">
                          <MoreVertical size={17} className="cursor-pointer" />
                        </DropdownToggle>
                        <DropdownMenu end>
                          {file && !file.deleted_at ? (<>
                            {!shared && (
                              <DropdownItem
                                className="w-100"
                                onClick={() => handleMarkShare(file)}
                              >
                                <Share2 size={17} className="me-50" />
                                <span className="align-middle">{T("Share")}</span>
                              </DropdownItem>
                            )}
                            <DropdownItem
                              className="w-100"
                              onClick={() => handleFileItem(file)}
                            >
                              <Edit size={17} className="me-50" />
                              <span className="align-middle">{T("Edit")}</span>
                            </DropdownItem>

                            <DropdownItem
                              className="w-100"
                              onClick={() => handleFileItemMove(file)}
                            >
                              <Move size={17} className="me-50" />
                              <span className="align-middle">{T("Move")}</span>
                            </DropdownItem>

                            <DropdownItem
                              className="w-100"
                              onClick={() => handleMarkImportant(file)}
                            >
                              <Star
                                size={17}
                                className={classnames("me-50", {
                                  'text-warning': (file && file.important_at !== null) || ""
                                })}
                              />
                              <span className="align-middle">{T("Important")}</span>
                            </DropdownItem>

                            <DropdownItem
                              className="w-100"
                              onClick={() => onTrashFile(file.id)}
                            >
                              <Trash2 size={17} className="me-50" />
                              <span className="align-middle">{T("Delete")}</span>
                            </DropdownItem>
                          </>) : (<>
                            <DropdownItem
                              className="w-100"
                              onClick={() => handleMarkRestore(file)}
                            >
                              <RefreshCw size={17} className="me-50" />
                              <span className="align-middle">{T("Restore")}</span>
                            </DropdownItem>

                            <DropdownItem
                              className="w-100"
                              onClick={() => handleDeleteFile(file)}
                            >
                              <Trash2 size={17} className="me-50" />
                              <span className="align-middle">{T("Delete forever")}</span>
                            </DropdownItem>
                          </>)}
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                      {/* /View action */}
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-center w-100"
                      onClick={() => file && !file.deleted_at && handleViewFile(file)}
                    >
                      <Avatar
                        img={SvgIcon}
                        imgHeight="20"
                        imgWidth="auto"
                        imgClassName="rounded-0"
                        className="bg-transparent"
                      />
                    </div>
                  </div>

                  <CardBody>
                    <div
                      className="content-wrapper"
                    >
                      <CardText
                        id={`cs-tooltip-file-name-${file.id}`}
                        className="file-name mb-0"
                      >
                        {file.name}
                        <UncontrolledTooltip
                          delay={300}
                          placement="top"
                          target={`cs-tooltip-file-name-${file.id}`}
                        >
                          {file.name}
                        </UncontrolledTooltip>
                      </CardText>
                      {!shared && file.shared_user_id !== null && (
                        <CardText
                          className="file-status"
                          id={`cs-tooltip-file-status-${file.id}`}
                        >
                          
                          <Badge color='info'>
                            <Share2 size={12} className='align-middle me-25' />
                            <span className='align-middle'>{T("Shared")}</span>
                          </Badge>
                        </CardText>
                      )}
                      {!shared && file.shared_user_id === null && (
                        <CardText
                          className="file-status"
                          id={`cs-tooltip-file-status-${file.id}`}
                        >&nbsp;</CardText>
                      )}
                      {shared && (
                        <CardText
                          className="file-shareuser"
                          id={`cs-tooltip-file-shareuser-${file.id}`}
                        >
                          {file.user.name}
                        </CardText>
                      )}
                      <CardText
                        className="file-date"
                        id={`cs-tooltip-file-date-${file.id}`}
                      >
                        {file && file.created_at && getTransformDate(file.created_at, "DD-MM-YYYY HH:mm:ss")}
                      </CardText>
                    </div>

                    <small
                      id={`cs-tooltip-file-date-${file.id}`}
                      className="file-accessed text-muted"
                    >
                      {file && file.created_at && getTransformDate(file.created_at, "DD-MM-YYYY HH:mm:ss")}
                      <UncontrolledTooltip
                        delay={300}
                        placement="top"
                        target={`cs-tooltip-file-date-${file.id}`}
                      >
                        {T("File Created")}
                      </UncontrolledTooltip>
                    </small>
                  </CardBody>
                </Card>
              )
            })}
          </>) : null}
          {/* /File */}
        </div>
      </PerfectScrollbar>
    ) : null
  }
  /* /Rendering folder and its files */

  return store ? (
    <div className="file-manager-main-content">
      <div className="file-manager-content-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="sidebar-toggle d-block d-xl-none float-start align-middle ms-1" onClick={handleMainSidebar}>
            <Menu size={21} className="font-medium-5" />
          </div>

          <InputGroup className="input-group-merge shadow-none m-0 flex-grow-1">
            <InputGroupText className="border-0">
              <Search size={14} className="text-muted" />
            </InputGroupText>

            <Input id="search-cloud-storage" className="form-control files-filter border-0 bg-transparent" placeholder="Search..." value={searchInput} onChange={(event) => handleSearch(event.target.value)} />
          </InputGroup>
        </div>

        <div className="d-flex align-items-center">
          <div className="file-actions d-block" />

          <ButtonGroup className="view-toggle ms-50">
            <Button
              outline
              color='primary'
              className="p-50"
              id={`cs-tooltip-grid`}
              active={hashParam === "#grid"}
              onClick={() => navigate(`#grid`)}
            >
              <Grid
                size={14}
              />
              <UncontrolledTooltip
                delay={300}
                placement="top"
                target={`cs-tooltip-grid`}
              >
                {T('Grid view')}
              </UncontrolledTooltip>
            </Button>

            <Button
              outline
              color='primary'
              className="p-50"
              id={`cs-tooltip-list`}
              active={hashParam === "#list"}
              onClick={() => navigate(`#list`)}
            >
              <List
                size={14}
              />
              <UncontrolledTooltip
                delay={300}
                placement="top"
                target={`cs-tooltip-list`}
              >
                {T('List view')}
              </UncontrolledTooltip>
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {store.cloudStorageItems ? (<>
        {/* Breadcrumb */}
        {renderBreadcrumbs()}
        {/* /Breadcrumb */}
      </>) : null}

      {store.cloudStorageItems ? (<>
        {/* Folder Files */}
        {renderFolderFiles()}
        {/* /Folder Files */}
      </>) : null}
      {/* </div> */}
    </div>
  ) : null
}

export default Storages
