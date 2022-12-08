/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Form,
    Card,
    Label,
    Input,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    FormFeedback,
    UncontrolledTooltip
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** React Dropdown Import
import Select from 'react-select'

// ** Store & Actions
import {
    getSortCodes,
    clearSortCode,
    createEmailTemplate,
    updateEmailTemplateLoader,
    clearEmailTemplateMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

// ** Icons Import
import {
    User,
    Briefcase,
    MessageSquare
} from 'react-feather'

// ** Utils
import {
    isUserLoggedIn
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'
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

const EmailTemplateAdd = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useSelector((state) => state.emailTemplate)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editorHtmlContent, setEditorHtmlContent] = useState("")

    const EmailTemplateSchema = yup.object({
        subject: yup.string().required(T('Subject is required!')),
        template: yup.object().shape({
            blocks: yup.array().of(yup.object().shape({
                text: yup.string().required(T('Content is required!'))
            }).required(T('Content is required!')).nullable())
        }).required(T('Content is required!')).nullable(),
        Status: yup.object().required(T(`Status is required!`)).nullable()
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
        // console.log("handleEditorStateChange >>>> ", state)
        setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
    }

    const handleReset = () => {
        const emailTemplateItem = { ...store.emailTemplateItem }
        reset(emailTemplateItem)
        setEditorHtmlContent('')
        navigate(`${adminRoot}/email-template`)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            dispatch(updateEmailTemplateLoader(true))
            setLoadFirst(false)
        }

        /* For reset form data */
        if (store && store.actionFlag && store.actionFlag === "CREATED_ITEM") {
            handleReset()
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearEmailTemplateMessage())
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

    const handleOpenModal = (type) => {
        setModalOpen(true)
        dispatch(getSortCodes({ type: type, sortCodeTypes: store.sortCodeTypes }))
    }

    /* Submitting data */
    const onSubmit = (values) => {
        if (values) {
            const emailTemplateData = {
                subject: values.subject
            }

            if (editorHtmlContent) {
                emailTemplateData.template = editorHtmlContent
            }

            if (values.Status && values.Status.value) {
                emailTemplateData.status = values.Status.value
            }

            // console.log("onSubmit >>> ", values, emailTemplateData)
            dispatch(updateEmailTemplateLoader(false))
            dispatch(createEmailTemplate(emailTemplateData))
        }
    }

    return store ? (
        <Card className="px-5">
            {!store.loading ? (
                <Spinner
                    className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                />
            ) : null}

            <CardHeader>
                <CardTitle>
                    {T("Add Email Template")}
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
                            <Label className="form-label w-100" for='template'>
                                <div className="d-flex justify-content-between">
                                    <div className="me-1">{T('Content')}</div>
                                    <div>
                                        {T("Sort codes")} :

                                        <Briefcase
                                            size={17}
                                            className="cursor-pointer ms-1"
                                            id="case-sortcodes-add"
                                            onClick={() => handleOpenModal(store.sortCodeTypes[0].id || 'case')}
                                        />
                                        <UncontrolledTooltip
                                            placement="top"
                                            target="case-sortcodes-add"
                                        >
                                            {T("Case")} {T("Sort codes")}
                                        </UncontrolledTooltip>

                                        <MessageSquare
                                            size={17}
                                            className="cursor-pointer ms-1"
                                            id="contact-sortcodes-add"
                                            onClick={() => handleOpenModal(store.sortCodeTypes[1].id || 'contact')}
                                        />
                                        <UncontrolledTooltip
                                            placement="top"
                                            target="contact-sortcodes-add"
                                        >
                                            {T("Contact")} {T("Sort codes")}
                                        </UncontrolledTooltip>

                                        <User
                                            size={17}
                                            className="cursor-pointer ms-1"
                                            id="user-sortcodes-add"
                                            onClick={() => handleOpenModal(store.sortCodeTypes[2].id || 'user')}
                                        />
                                        <UncontrolledTooltip
                                            placement="top"
                                            target="user-sortcodes-add"
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
                                defaultValue=""
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
                                        onEditorStateChange={handleEditorStateChange}
                                        placeholder={PlaceholderSchema && PlaceholderSchema.template}
                                    />
                                )}
                            />
                            <FormFeedback className="d-block">{errors.template?.message || (errors.template?.blocks && errors.template.blocks[0]?.text?.message)}</FormFeedback>
                        </Col>

                        <Col md={6} sm={12} className="mb-1">
                            <Label className='form-label' for="Status">
                                {T("Status")}
                            </Label>
                            <Controller
                                defaultValue={store.emailTemplateItem && store.emailTemplateItem.status ? { value: store.emailTemplateItem.status, label: store.emailTemplateItem.status } : null}
                                name='Status'
                                id='Status'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id='Status'
                                        placeholder={PlaceholderSchema && PlaceholderSchema.status}
                                        options={statusOptions}
                                        className='react-select'
                                        classNamePrefix='select'
                                        isClearable={false}
                                    />
                                )}
                            />
                            <FormFeedback className="d-block">{errors.Status?.message}</FormFeedback>
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
                                onClick={handleReset}
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

export default EmailTemplateAdd