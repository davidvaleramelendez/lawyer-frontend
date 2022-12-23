// ** React Imports
import { useEffect, useState } from 'react'

// ** Reactstrap Imports
import {
    Row,
    Form,
    Label,
    Modal,
    Input,
    Button,
    ModalBody,
    ModalHeader,
    FormFeedback
} from 'reactstrap'
import { TreeSelect } from 'antd'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Translation
import { T } from '@localization'

const ModalCloudFolder = ({
    open,
    store,
    params,
    dispatch,
    toggleModal,
    movItemFlag,
    setMoveItemFlag,
    cloudStorageItem,
    defaultCloudStorageItem,
    createCloudStorageFolder,
    updateCloudStorageFolder,
    updateCloudStorageLoader,
    clearCloudStorageMessage
}) => {

    /* Yup validation schema */
    const CloudSchema = yup.object({
        name: yup.string().required(T('Name is required!'))
    }).required()

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: cloudStorageItem,
        resolver: yupResolver(CloudSchema)
    })

    // ** States
    const [treeStructureData, setTreeStructureData] = useState(store.treeFolderItems)

    const handleSidebarOpened = () => {
        const treeFolderItems = [...store.treeFolderItems]
        if (store && store.treeFolderItems && store.treeFolderItems.length) {
            // treeFolderItems.splice(0, 0, { id: 0, name: "Home", value: 0, label: "Home" })
        }
        setTreeStructureData([...treeFolderItems])
    }

    const handleSidebarClosed = () => {
        setMoveItemFlag(false)
        setTreeStructureData([])
    }

    const handleReset = () => {
        reset(cloudStorageItem)
        dispatch(defaultCloudStorageItem(cloudStorageItem))
        toggleModal()
    }

    // ** Get contact on mount based on id
    useEffect(() => {
        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearCloudStorageMessage())
        }

        /* For reset form data */
        if (store && store.actionFlag && (store.actionFlag === "EDIT_FOLDER")) {
            reset(store.cloudStorageItem)
        }

        /* For reset form data and closing modal */
        if (store && store.actionFlag && (store.actionFlag === "FOLDER_CREATED" || store.actionFlag === "FOLDER_UPDATED")) {
            handleReset()
        }
    }, [store.success, store.error, store.actionFlag])
    // console.log("ModalCloudFolder >>> ", store)

    /* Submitting data */
    const onSubmit = async (values) => {
        if (values) {
            const folderData = {
                id: values.id,
                name: values.name,
                type: "folder"
            }

            if (params && params.slug) {
                folderData.parent_slug = params.slug
                if (values.parent && (values.parent.slug === params.slug)) {
                    folderData.parent_slug = ""
                }
            }

            if (folderData && folderData.id) {
                if (values.parentId) {
                    if (values.parent_id !== values.parentId) {
                        folderData.parent_id = values.parentId
                    }
                }

                if (values.parentId === 0) {
                    folderData.root = true
                }
            }


            // console.log("onSubmit >>> ", values, folderData)
            /* Calling api */
            dispatch(updateCloudStorageLoader(false))
            if (folderData && folderData.id) {
                dispatch(updateCloudStorageFolder(folderData))
            } else {
                dispatch(createCloudStorageFolder(folderData))
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
                {!store.loading ? (
                    <DotPulse
                        className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                    />
                ) : null}

                <ModalHeader toggle={handleReset}>
                    {!movItemFlag ? (<> {store.cloudStorageItem && store.cloudStorageItem.id ? (<>{T("Edit Folder")}</>) : (<> {T("Create New Folder")} </>)} </>) : null}
                    {movItemFlag ? (<> {T("Move Folder")} </>) : null}
                </ModalHeader>

                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        {!movItemFlag ? (
                            <div className="mb-1">
                                <Label className="form-label" for="name">
                                    {T('Folder Name')}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id="name"
                                    name="name"
                                    control={control}
                                    render={({ field }) => <Input
                                        {...field}
                                        placeholder=""
                                        invalid={errors.name && true}
                                    />}
                                />
                                <FormFeedback className="invalid-feedback">{errors.name?.message}</FormFeedback>
                            </div>
                        ) : null}

                        {movItemFlag && store.cloudStorageItem && store.cloudStorageItem.id ? (
                            <div className="mb-1">
                                <Label className="form-label" for="name">
                                    {store.cloudStorageItem && store.cloudStorageItem.name}
                                </Label>
                                <Controller
                                    defaultValue={(store.cloudStorageItem && store.cloudStorageItem.parent_id) || 0}
                                    id="parentId"
                                    name="parentId"
                                    control={control}
                                    render={({ field }) => <TreeSelect
                                        {...field}
                                        treeLine
                                        // allowClear
                                        showSearch
                                        treeDefaultExpandAll
                                        className="form-control"
                                        style={{ width: '100%' }}
                                        placeholder="Select Parent..."
                                        treeData={treeStructureData}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        // onChange={(value) => console.log("TreeSelect >>> ", value)}
                                        fieldNames={{ label: "label", value: "value", children: "children" }}
                                    />}
                                />
                                <FormFeedback className="invalid-feedback">{errors.parentId?.message}</FormFeedback>
                            </div>
                        ) : null}

                        <Row className="mt-2 mb-2">
                            <div className="d-flex justify-content-end">
                                <Button
                                    type="button"
                                    color="secondary"
                                    className="me-1"
                                    onClick={handleReset}
                                >
                                    {T("Cancel")}
                                </Button>

                                <Button type="submit" color="primary">
                                    {T("Submit")}
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    ) : null
}

export default ModalCloudFolder
