/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
    Row,
    Modal,
    Label,
    Input,
    Button,
    ModalBody,
    InputGroup,
    ModalHeader
} from 'reactstrap'
import { TreeSelect } from 'antd'

const ModalCloudUploadFile = ({
    open,
    store,
    MySwal,
    params,
    dispatch,
    toggleModal,
    movItemFlag,
    setMoveItemFlag,
    cloudStorageItem,
    createCloudStorageFile,
    updateCloudStorageFile,
    defaultCloudStorageItem,
    updateCloudStorageLoader,
    clearCloudStorageMessage
}) => {
    // ** Hooks
    const { t } = useTranslation()

    // ** States
    const [fileName, setFileName] = useState('')
    const [fileUrl, setFileUrl] = useState('')
    const [parentId, setParentId] = useState(null)
    const [treeStructureData, setTreeStructureData] = useState(store.treeFolderItems)

    const handleSidebarOpened = () => {
        const treeFolderItems = [...store.treeFolderItems]
        if (store) {
            if (store.cloudStorageItem && store.cloudStorageItem.name) {
                setFileName(store.cloudStorageItem.name)
            }

            if (store.cloudStorageItem && store.cloudStorageItem.parent_id) {
                setParentId(store.cloudStorageItem.parent_id)
            }
        }
        setTreeStructureData([...treeFolderItems])
    }

    const handleSidebarClosed = () => {
        setFileUrl('')
        setFileName('')
        setMoveItemFlag(false)
        setTreeStructureData([])
        setParentId(null)
    }

    const handleReset = () => {
        setFileUrl('')
        setFileName('')
        dispatch(defaultCloudStorageItem(cloudStorageItem))
        toggleModal()
    }

    /* Swal Alert */
    const onAlertMessage = (title, text, icon) => {
        MySwal.fire({
            title: title ?? 'File limit exceeded!',
            text: text ?? 'File uploading size exceeded!',
            icon: icon ?? 'warning',
            showCancelButton: false,
            confirmButtonText: 'Okay',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
            }
        })
    }

    // ** Get contact on mount based on id
    useEffect(() => {
        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearCloudStorageMessage())
        }

        /* For reset form data and closing modal */
        if (store && store.actionFlag && (store.actionFlag === "FILE_CREATED" || store.actionFlag === "FILE_UPDATED")) {
            handleReset()
        }
    }, [store.success, store.error, store.actionFlag])
    // console.log("ModalCloudUploadFile >>> ", store)

    /* File uploading */
    const onFileChange = (event) => {
        event.preventDefault()
        const result = [...event.target.files]
        let fileFlag = false
        const fileArray = []

        if (result && result.length) {
            const fileSize = result.reduce(function (prev, file) { return prev + file.size }, 0)
            const fileSizeKiloBytes = fileSize / 1024
            const uploadLimit = process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE * 1024
            if (fileSizeKiloBytes > uploadLimit) {
                onAlertMessage('File limit exceeded!', `Please upload max ${process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE} mb files!`, 'warning')
                return
            }

            result.map(((file, index) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onloadend = async () => {
                    const res = await fileReader.result
                    const name = file.name || ""
                    let fileName = file.name || ""
                    let extension = ""
                    if (fileName) {
                        fileName = fileName.split('.')
                        if (fileName && fileName.length > 0) {
                            extension = fileName[fileName.length - 1]
                        }
                    }

                    fileArray.push({ name: name, extension: extension, file: res })
                    fileFlag = false

                    if (result.length - 1 === index) {
                        fileFlag = true
                    }

                    if (fileFlag) {
                        const fileData = {
                            type: 'file',
                            attachments: fileArray
                        }

                        if (params && params.slug) {
                            fileData.parent_slug = params.slug
                        }

                        // console.log("fileArray >>> ", fileArray)
                        dispatch(updateCloudStorageLoader(false))
                        dispatch(createCloudStorageFile(fileData))
                    }
                }
            }))
        }
    }
    /* /File uploading */

    /* Tree dropdown value change */
    const onParentChange = (value) => {
        setParentId(value)
    }
    /* /Tree dropdown value change */

    const onSubmit = () => {
        if (store.cloudStorageItem && store.cloudStorageItem.id) {
            const fileData = {
                id: store.cloudStorageItem.id,
                name: store.cloudStorageItem.name,
                type: 'file'
            }

            if (fileData && fileData.id) {
                if (fileName) {
                    fileData.name = fileName
                }

                if (parentId) {
                    if (store.cloudStorageItem !== parentId) {
                        fileData.parent_id = parentId
                    }
                }

                if (parentId === 0) {
                    fileData.root = true
                }
            }

            // console.log("fileData >>> ", fileData)
            if (fileData && fileData.id) {
                dispatch(updateCloudStorageLoader(false))
                dispatch(updateCloudStorageFile(fileData))
            }
        }
    }

    return store ? (
        <div className="disabled-backdrop-modal">
            <Modal
                isOpen={open}
                backdrop="static"
                toggle={handleReset}
                onOpened={handleSidebarOpened}
                onClosed={handleSidebarClosed}
                className="modal-dialog-centered modal-md"
            >
                <ModalHeader toggle={handleReset}>
                    {!movItemFlag ? (<> {store.cloudStorageItem && store.cloudStorageItem.id ? (<> {t("Edit")} {t("File")} </>) : (<> {t("Upload")} {t("New File")} </>)} </>) : null}
                    {movItemFlag ? (<> {t("Move")} {t("File")} </>) : null}
                </ModalHeader>

                <ModalBody>
                    {!movItemFlag && store.cloudStorageItem && store.cloudStorageItem.id ? (
                        <div className="mb-1">
                            <Label className="form-label" for="name">
                                File Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder=""
                                value={fileName || ""}
                                onInput={(event) => setFileName(event.target.value)}
                                invalid={!fileName && true}
                            />
                        </div>
                    ) : null}

                    {!movItemFlag && store.cloudStorageItem && !store.cloudStorageItem.id ? (
                        <div className="mb-1">
                            <InputGroup>
                                <Input
                                    name="attachment"
                                    type="file"
                                    multiple
                                    onChange={(event) => onFileChange(event)}
                                    invalid={!fileUrl && true}
                                />
                            </InputGroup>
                        </div>
                    ) : null}

                    {movItemFlag ? (
                        <div className="mb-1">
                            <Label className="form-label" for="name">
                                {store.cloudStorageItem && store.cloudStorageItem.name}
                            </Label>
                            <TreeSelect
                                treeLine
                                // allowClear
                                showSearch
                                treeDefaultExpandAll
                                id="parentId"
                                name="parentId"
                                value={parentId || 0}
                                className="form-control"
                                style={{ width: '100%' }}
                                placeholder="Select Parent..."
                                treeData={treeStructureData}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                onChange={(value) => onParentChange(value)}
                                fieldNames={{ label: "label", value: "value", children: "children" }}
                            />
                        </div>
                    ) : null}

                    {movItemFlag || (store.cloudStorageItem && store.cloudStorageItem.id) ? (
                        <Row className="mt-2 mb-2">
                            <div className="d-flex justify-content-end">
                                <Button
                                    type="button"
                                    color="secondary"
                                    className="me-1"
                                    disabled={!store.loading}
                                    onClick={handleReset}
                                >
                                    {t("Cancel")}
                                </Button>

                                <Button
                                    type="button"
                                    color="primary"
                                    disabled={!store.loading}
                                    onClick={onSubmit}
                                >
                                    {t("Submit")}
                                </Button>
                            </div>
                        </Row>
                    ) : null}
                </ModalBody>
            </Modal>
        </div>
    ) : null
}

export default ModalCloudUploadFile
