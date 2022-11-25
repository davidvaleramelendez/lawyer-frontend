// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

// Translation
import { useTranslation } from 'react-i18next'

// ** Utils
import {
    isUserLoggedIn,
    getTransformDate
} from '@utils'

// Constant
import {
    root,
    adminRoot
} from '@constant/defaultValues'

// ** Store & Actions
import {
    getTreeFolderList,
    changeExpandedValue,
    getCloudStorageList,
    getCloudStorageItem,
    markRestoreCloudItem,
    trashCloudStorageFile,
    updateCloudStorageFile,
    createCloudStorageFile,
    deleteCloudStorageFile,
    markImportantCloudItem,
    trashCloudStorageFolder,
    defaultCloudStorageItem,
    deleteCloudStorageFolder,
    createCloudStorageFolder,
    updateCloudStorageFolder,
    updateCloudStorageLoader,
    clearCloudStorageMessage
} from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Sidebar from './Sidebar'
import Storages from './Storages'
import Spinner from '@components/spinner/Simple-grow-spinner'
import Notification from '@components/toast/notification'

// Constant
import {
    cloudStorageItem
} from '@constant/reduxConstant'

// Modal
import ModalCloudFolder from './modals/ModalCloudFolder'
import ModalCloudUploadFile from './modals/ModalCloudUploadFile'

// ** Styles
// import 'antd/dist/antd.css'
import '@src/assets/scss/antd.css'
import '@styles/base/pages/app-file-manager.scss'

const CloudStorageApp = () => {
    // ** Hooks
    const { t } = useTranslation()
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Vars
    const params = useParams()
    const hashParam = useLocation().hash || "#list"

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [mainSidebar, setMainSidebar] = useState(false)
    const [sort, setSort] = useState('name-asc')
    const [searchInput, setSearchInput] = useState('')
    const [folderModalOpen, setFolderModalOpen] = useState(false)
    const [fileModalOpen, setFileModalOpen] = useState(false)
    const [movItemFlag, setMoveItemFlag] = useState(false)

    // ** Function to handle Left sidebar & cloud sidebar
    const handleMainSidebar = () => setMainSidebar(!mainSidebar)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.cloudStorage)

    const handleCloudStorageLists = (search = searchInput, sortBy = sort) => {
        dispatch(getCloudStorageList({
            slug: params.slug || "",
            search: search || "",
            sortBy: sortBy || ""
        }))
    }

    const handleSearch = (val) => {
        setSearchInput(val)
        handleCloudStorageLists(val, sort)
    }

    const handleSort = (val) => {
        setSort(val)
        handleCloudStorageLists(searchInput, val)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            dispatch(getTreeFolderList())
            handleCloudStorageLists()
            setLoadFirst(false)
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearCloudStorageMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification("Success", store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification("Error", store.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)

    /* Move to trash folder */
    const onTrashFolder = (folderId) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You revert this from trash!",
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
                // console.log("folderId >>> ", folderId)
                dispatch(trashCloudStorageFolder(folderId))
            }
        })
    }
    /* /Move to trash folder */

    /* Move to trash file */
    const onTrashFile = (fileId) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You revert this from trash!",
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
                // console.log("fileId >>> ", fileId)
                dispatch(trashCloudStorageFile(fileId))
            }
        })
    }
    /* /Move to trash file */

    /* Restore trashed cloud item */
    const handleMarkRestore = (values) => {
        dispatch(markRestoreCloudItem({ id: values.id || "" }))
    }
    /* /Restore trashed cloud item */

    /* Permanent delete folder */
    const handleDeleteFolder = (folder) => {
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
                dispatch(deleteCloudStorageFolder(folder.id || ""))
            }
        })
    }
    /* /Permanent delete folder */

    /* Permanent delete file */
    const handleDeleteFile = (file) => {
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
                dispatch(deleteCloudStorageFile(file.id || ""))
            }
        })
    }
    /* /Permanent delete file */

    /* Marking important cloud item */
    const handleMarkImportant = (values) => {
        dispatch(markImportantCloudItem({ id: values.id || "" }))
    }
    /* /Marking important cloud item */

    /* Getting folder object for update */
    const handleFolderItem = (folder) => {
        dispatch(getCloudStorageItem({ flag: "EDIT_FOLDER", payload: folder }))
        setFolderModalOpen(true)
    }
    /* /Getting folder object for update */

    /* Getting folder object for move */
    const handleFolderItemMove = (folder) => {
        dispatch(getCloudStorageItem({ flag: "EDIT_FOLDER", payload: folder }))
        setMoveItemFlag(true)
        setFolderModalOpen(true)
    }
    /* /Getting folder object for move */

    /* Getting file object for update */
    const handleFileItem = (file) => {
        dispatch(getCloudStorageItem({ flag: "EDIT_FILE", payload: file }))
        setFileModalOpen(true)
    }
    /* /Getting folder object for update */

    /* Getting file object for move */
    const handleFileItemMove = (file) => {
        dispatch(getCloudStorageItem({ flag: "EDIT_FILE", payload: file }))
        setMoveItemFlag(true)
        setFileModalOpen(true)
    }
    /* /Getting file object for move */

    /* Entering on folder click */
    const handleNavigateItem = (event, slug) => {
        // console.log("handleNavigateItem ", event, folder)
        if (event) {
            if (slug === "default") {
                slug = ""
            }

            navigate(`${adminRoot}/cloud-storage/${slug || ''}${hashParam}`)
        }
    }
    /* /Entering on folder click */

    /* Navigate from breadcrumb click */
    const handleBreadcrumbNavigate = (slug, flag) => {
        if (flag) {
            if (slug) {
                navigate(`${adminRoot}/cloud-storage/${slug}${hashParam}`)
            } else {
                navigate(`${adminRoot}/cloud-storage${hashParam}`)
            }
        }
    }
    /* /Navigate from breadcrumb click */

    return store ? (<Fragment>
        <Sidebar
            store={store}
            params={params}
            hashParam={hashParam}
            dispatch={dispatch}
            handleSort={handleSort}
            mainSidebar={mainSidebar}
            setMainSidebar={setMainSidebar}
            setFileModalOpen={setFileModalOpen}
            handleMainSidebar={handleMainSidebar}
            handleNavigateItem={handleNavigateItem}
            setFolderModalOpen={setFolderModalOpen}
            changeExpandedValue={changeExpandedValue}
        />

        {!store.loading ? (
            <Spinner
                className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
            />
        ) : null}

        <div className="content-right w-80">
            <div className="content-wrapper">
                <div className="content-body">
                    <div
                        className={classnames("body-content-overlay", {
                            show: mainSidebar === true
                        })}
                        onClick={handleMainSidebar}
                    ></div>

                    <Storages
                        t={t}
                        sort={sort}
                        store={store}
                        params={params}
                        navigate={navigate}
                        hashParam={hashParam}
                        handleSort={handleSort}
                        onTrashFile={onTrashFile}
                        handleSearch={handleSearch}
                        onTrashFolder={onTrashFolder}
                        handleFileItem={handleFileItem}
                        getTransformDate={getTransformDate}
                        setFileModalOpen={setFileModalOpen}
                        handleFolderItem={handleFolderItem}
                        handleDeleteFile={handleDeleteFile}
                        handleMainSidebar={handleMainSidebar}
                        handleMarkRestore={handleMarkRestore}
                        handleDeleteFolder={handleDeleteFolder}
                        setFolderModalOpen={setFolderModalOpen}
                        handleNavigateItem={handleNavigateItem}
                        handleFileItemMove={handleFileItemMove}
                        handleMarkImportant={handleMarkImportant}
                        handleFolderItemMove={handleFolderItemMove}
                        handleBreadcrumbNavigate={handleBreadcrumbNavigate}
                    />

                    <ModalCloudFolder
                        toggleModal={() => setFolderModalOpen(!folderModalOpen)}
                        store={store}
                        open={folderModalOpen}
                        params={params}
                        dispatch={dispatch}
                        movItemFlag={movItemFlag}
                        setMoveItemFlag={setMoveItemFlag}
                        cloudStorageItem={cloudStorageItem}
                        defaultCloudStorageItem={defaultCloudStorageItem}
                        handleCloudStorageLists={handleCloudStorageLists}
                        createCloudStorageFolder={createCloudStorageFolder}
                        updateCloudStorageFolder={updateCloudStorageFolder}
                        updateCloudStorageLoader={updateCloudStorageLoader}
                        clearCloudStorageMessage={clearCloudStorageMessage}
                    />

                    <ModalCloudUploadFile
                        toggleModal={() => setFileModalOpen(!fileModalOpen)}
                        store={store}
                        open={fileModalOpen}
                        MySwal={MySwal}
                        params={params}
                        dispatch={dispatch}
                        movItemFlag={movItemFlag}
                        setMoveItemFlag={setMoveItemFlag}
                        cloudStorageItem={cloudStorageItem}
                        createCloudStorageFile={createCloudStorageFile}
                        updateCloudStorageFile={updateCloudStorageFile}
                        defaultCloudStorageItem={defaultCloudStorageItem}
                        handleCloudStorageLists={handleCloudStorageLists}
                        updateCloudStorageLoader={updateCloudStorageLoader}
                        clearCloudStorageMessage={clearCloudStorageMessage}
                    />
                </div>
            </div>
        </div>
    </Fragment>) : null
}

export default CloudStorageApp
