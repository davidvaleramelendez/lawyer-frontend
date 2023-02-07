/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Form,
    Card,
    Label,
    Input,
    Badge,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    InputGroup,
    FormFeedback,
    UncontrolledTooltip
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** React Dropdown Import
import Select from 'react-select'

// ** Icons Import
import {
    X,
    User,
    Briefcase,
    Paperclip,
    MessageSquare
} from 'react-feather'

// ** Store & Actions
import {
    getSortCodes,
    clearSortCode,
    getEmailTemplate,
    updateEmailTemplate,
    updateEmailTemplateLoader,
    deleteEmailTemplateAttachment,
    createEmailTemplateAttachment,
    getEmailTemplateAttachmentList,
    clearEmailTemplateMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {
    EditorState,
    ContentState,
    convertToRaw
} from 'draft-js'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Utils
import {
    htmlToString,
    isUserLoggedIn,
    getWebPreviewUrl
} from '@utils'

// ** Custom Components
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'

// Constant
import {
    root,
    adminRoot,
    statusOptions
} from '@constant/defaultValues'

// Modal
import ModalEmailSortCodes from '../modals/ModalEmailSortCodes'

// ** Styles
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const EmailTemplateEdit = () => {
    // ** Hooks
    const { id } = useParams()
    const MySwal = withReactContent(Swal)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editorHtmlContent, setEditorHtmlContent] = useState("")
    const [editorStateContent, setEditorStateContent] = useState(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useSelector((state) => state.emailTemplate)

    const EmailTemplateSchema = yup.object({
        subject: yup.string().required(T('Subject is required!')),
        status: yup.object().required(T(`Status is required!`)).nullable()
    }).required()

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.emailTemplateItem,
        resolver: yupResolver(EmailTemplateSchema)
    })

    /* Placeholder texts */
    const PlaceholderSchema = {
        subject: T("Subject"),
        template: T("Content"),
        status: `${T("Select Status")}...`
    }

    const handleEditorStateChange = (state) => {
        // console.log("handleEditorStateChange >>> ", state)
        setEditorStateContent(state)
        setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
    }

    /* set initial html while edit */
    const getInitialHTML = (value) => {
        const contentBlock = htmlToDraft(value)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            handleEditorStateChange(editorState)
            return editorState
        }

        return value
    }

    const handleReset = async () => {
        const emailTemplateItem = { ...store.emailTemplateItem }
        if (emailTemplateItem && emailTemplateItem.template) {
            emailTemplateItem.template = await getInitialHTML(emailTemplateItem.template)
        }

        if (emailTemplateItem && emailTemplateItem.status) {
            emailTemplateItem.status = { value: emailTemplateItem.status, label: emailTemplateItem.status }
        }
        reset(emailTemplateItem)
    }

    const handleBack = () => {
        setEditorHtmlContent('')
        setEditorStateContent(null)
        navigate(`${adminRoot}/email-template`)
    }

    /* Swal Alert */
    const onAlertMessage = (title, text, icon) => {
        MySwal.fire({
            title: title ?? T('File limit exceeded!'),
            text: text ?? T('File uploading size exceeded!'),
            icon: icon ?? 'warning',
            showCancelButton: false,
            confirmButtonText: T('Okay'),
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
            }
        })
    }

    /* Deleting uploaded files */
    const onFileRemove = (event, id) => {
        if (event) {
            event.preventDefault()
        }

        // console.log("onFileRemove >>> ", id)
        dispatch(deleteEmailTemplateAttachment(id))
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            dispatch(getEmailTemplateAttachmentList({ email_template_id: id }))
            dispatch(getEmailTemplate(id))
            setLoadFirst(false)
        }

        /* For reset form data */
        if (store && store.actionFlag && store.actionFlag === "EDIT_ITEM") {
            handleReset()
        }

        if (store && store.actionFlag && store.actionFlag === "UPDATED_ITEM") {
            handleBack()
        }

        /* For recall attachment api */
        if (store && store.actionFlag && store.actionFlag === "ATTACHMENT_CREATED") {
            dispatch(getEmailTemplateAttachmentList({ email_template_id: id }))
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearEmailTemplateMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)
    console.log("errors >>> ", errors)

    const handleOpenModal = (type) => {
        setModalOpen(true)
        dispatch(getSortCodes({ type: type, sortCodeTypes: store.sortCodeTypes }))
    }

    const handleAttachmentUpload = (data) => {
        dispatch(updateEmailTemplateLoader(false))
        dispatch(createEmailTemplateAttachment(data))
    }

    /* File uploading */
    const onFileChange = (event) => {
        const fileReader = new FileReader()
        const files = event.target.files

        if (files && files.length > 0) {
            if (files[0].size) {
                const fileSizeKiloBytes = files[0].size / 1024
                const uploadLimit = process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE * 1024
                if (fileSizeKiloBytes > uploadLimit) {
                    event.target.value = ""
                    onAlertMessage(T('File limit exceeded!'), `${T('Please upload max')} ${process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE} mb ${T('file')}!`, 'warning')
                    return false
                }
            }

            fileReader.readAsDataURL(files[0])
            fileReader.onloadend = async () => {
                const name = files[0].name || ""
                let fileName = files[0].name || ""
                let extension = ""
                if (fileName) {
                    fileName = fileName.split('.')
                    if (fileName && fileName.length > 0) {
                        extension = fileName[fileName.length - 1]
                    }
                }

                handleAttachmentUpload({
                    email_template_id: id,
                    name: name || "",
                    extension: extension,
                    file: fileReader.result
                })
                event.target.value = ""
            }
        }
    }

    /* Submitting data */
    const onSubmit = (values) => {
        if (values) {
            const emailTemplateData = {
                id: values.id,
                subject: values.subject
            }

            if (editorHtmlContent) {
                emailTemplateData.template = editorHtmlContent
            }

            if (values.status && values.status.value) {
                emailTemplateData.status = values.status.value
            }

            // console.log("onSubmit >>> ", values, emailTemplateData)
            dispatch(updateEmailTemplateLoader(false))
            dispatch(updateEmailTemplate(emailTemplateData))
        }
    }

    /* Rendering file preview web url */
    const renderFileWebUrlPreview = (path) => {
        if (path) {
            return getWebPreviewUrl(path)
        }

        return false
    }
    /* /Rendering file preview web url */

    return store ? (
        <Card className="px-5">
            {!store.loading ? (
                <DotPulse
                    className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                />
            ) : null}

            <CardHeader>
                <CardTitle>
                    {T("Edit Email Template")}
                </CardTitle>
            </CardHeader>

            <CardBody>
                <Form
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Row>
                        <Col md={12} sm={12} className="mb-1">
                            <Label className='form-label' for='subject'>
                                {T('Subject')}
                            </Label>
                            <Controller
                                defaultValue=""
                                id='subject'
                                name='subject'
                                control={control}
                                render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.subject} invalid={errors.subject && true} />}
                            />
                            <FormFeedback>{errors.subject?.message}</FormFeedback>
                        </Col>

                        <Col md={12} sm={12} className="mb-1">
                            <Label className='form-label w-100' for='template'>
                                <div className="d-flex justify-content-between">
                                    <div className="me-1">{T('Content')}</div>
                                    <div>
                                        {T("Sort codes")} :

                                        <Briefcase
                                            size={17}
                                            className="cursor-pointer ms-1"
                                            id={`case-sortcodes-edit-${id}`}
                                            onClick={() => handleOpenModal(store.sortCodeTypes[0].id || 'case')}
                                        />
                                        <UncontrolledTooltip
                                            placement="top"
                                            target={`case-sortcodes-edit-${id}`}
                                        >
                                            {T("Case")} {T("Sort codes")}
                                        </UncontrolledTooltip>

                                        <MessageSquare
                                            size={17}
                                            className="cursor-pointer ms-1"
                                            id={`contact-sortcodes-edit-${id}`}
                                            onClick={() => handleOpenModal(store.sortCodeTypes[1].id || 'contact')}
                                        />
                                        <UncontrolledTooltip
                                            placement="top"
                                            target={`contact-sortcodes-edit-${id}`}
                                        >
                                            {T("Contact")} {T("Sort codes")}
                                        </UncontrolledTooltip>

                                        <User
                                            size={17}
                                            className="cursor-pointer ms-1"
                                            id={`user-sortcodes-edit-${id}`}
                                            onClick={() => handleOpenModal(store.sortCodeTypes[2].id || 'user')}
                                        />
                                        <UncontrolledTooltip
                                            placement="top"
                                            target={`user-sortcodes-edit-${id}`}
                                        >
                                            {T("User")} {T("Sort codes")}
                                        </UncontrolledTooltip>

                                        <ModalEmailSortCodes
                                            store={store}
                                            open={modalOpen}
                                            dispatch={dispatch}
                                            clearSortCode={clearSortCode}
                                            toggleModal={() => setModalOpen(!modalOpen)}
                                        />
                                    </div>
                                </div>
                            </Label>
                            <Controller
                                defaultValue={editorStateContent}
                                control={control}
                                id='template'
                                name='template'
                                render={({ field }) => (
                                    <Editor
                                        {...field}
                                        toolbar={{
                                            options: ['blockType', 'inline', 'list'],
                                            blockType: {
                                                inDropdown: true,
                                                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
                                            },
                                            inline: {
                                                inDropdown: false,
                                                options: ['bold', 'italic', 'underline', 'strikethrough']
                                            }
                                        }}
                                        editorState={editorStateContent}
                                        onEditorStateChange={handleEditorStateChange}
                                        placeholder={PlaceholderSchema && PlaceholderSchema.template}
                                    />
                                )}
                            />
                            {!htmlToString(editorHtmlContent.trim()) ? (
                                <FormFeedback className="d-block">{T("Content is required!")}</FormFeedback>
                            ) : (
                                <FormFeedback className="d-block">{errors.template?.message}</FormFeedback>
                            )}
                        </Col>

                        <Col md={6} sm={12} className="mb-1">
                            <Label className='form-label' for="status">
                                {T("Status")}
                            </Label>
                            <Controller
                                defaultValue={null}
                                name='status'
                                id='status'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id='status'
                                        placeholder={PlaceholderSchema && PlaceholderSchema.status}
                                        options={statusOptions}
                                        className='react-select'
                                        classNamePrefix='select'
                                        isClearable={false}
                                    />
                                )}
                            />
                            <FormFeedback className="d-block">{errors.status?.message}</FormFeedback>
                        </Col>

                        <Col md={6} sm={12} className="mb-1">
                            <Label className="form-label" for="attachment">
                                {T("Attachment")}
                            </Label>
                            <InputGroup>
                                <Input
                                    name="attachment"
                                    type="file"
                                    onChange={(event) => onFileChange(event)}
                                />
                            </InputGroup>

                            {store.emailTemplateAttachmentItems && store.emailTemplateAttachmentItems.length ? (
                                <div className='demo-inline-spacing'>
                                    {store.emailTemplateAttachmentItems.map((attached, index) => (
                                        <Fragment key={`attached_${index}`}>
                                            {attached && attached.path ? <>
                                                <Badge
                                                    tag="a"
                                                    color="primary"
                                                    target="_blank"
                                                    href={renderFileWebUrlPreview(attached.path) || `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}`}
                                                >
                                                    <Paperclip
                                                        size={17}
                                                        className='cursor-pointer me-1'
                                                    />

                                                    {attached.file_name}

                                                    <X
                                                        size={17}
                                                        color="#FF0000"
                                                        className="cursor-pointer ms-1"
                                                        onClick={(event) => onFileRemove(event, attached.id)}
                                                    />
                                                </Badge>
                                            </> : null}
                                        </Fragment>
                                    ))}
                                </div>
                            ) : null}
                        </Col>
                    </Row>


                    <Row className="mt-2 mb-2">
                        <div className="d-flex">
                            <Button
                                type="submit"
                                color="primary"
                                disabled={!store.loading}
                            >
                                {T("Submit")}
                            </Button>

                            <Button
                                type="button"
                                className="ms-1"
                                color="secondary"
                                disabled={!store.loading}
                                onClick={handleBack}
                            >
                                {T("Back")}
                            </Button>
                        </div>
                    </Row>
                </Form>
            </CardBody>
        </Card>
    ) : null
}

export default EmailTemplateEdit