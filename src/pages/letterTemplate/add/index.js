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
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** React Dropdown Import
import Select from 'react-select'

// ** Store & Actions
import {
    getSortCodes,
    clearSortCode,
    createLetterTemplate,
    updateLetterTemplateLoader,
    clearLetterTemplateMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    User,
    Briefcase,
    MessageSquare
} from 'react-feather'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Utils
import {
    htmlToString,
    isUserLoggedIn
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

// ** Modal
import ModalEmailSortCodes from '../modals/ModalEmailSortCodes'

// ** Styles
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const LetterTemplateAdd = () => {
    // ** Hooks
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.letterTemplate)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editorHtmlContent, setEditorHtmlContent] = useState("")

    const LetterTemplateSchema = yup.object({
        subject: yup.string().required(T('Subject is required!')),
        Status: yup.object().required(T(`Status is required!`)).nullable()
    }).required()

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.letterTemplateItem,
        resolver: yupResolver(LetterTemplateSchema)
    })

    /* Placeholder texts */
    const PlaceholderSchema = {
        subject: T("Subject"),
        content: T("Content"),
        best_regards: T("Best Regards"),
        status: `${T("Select Status")}...`
    }

    const onAlertMessage = (message, title, icon) => {
        MySwal.fire({
            title: title || 'Warning',
            text: message || 'Something went wrong!',
            icon: icon || 'warning',
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

    const handleEditorStateChange = (state) => {
        // console.log("handleEditorStateChange >>>> ", state)
        setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
    }

    const handleReset = () => {
        const letterTemplateItem = { ...store.letterTemplateItem }
        reset(letterTemplateItem)
        setEditorHtmlContent('')
        navigate(`${adminRoot}/letter-template`)
    }

    const handleOpenModal = (type) => {
        setModalOpen(true)
        dispatch(getSortCodes({ type: type, sortCodeTypes: store.sortCodeTypes }))
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            dispatch(updateLetterTemplateLoader(true))
            setLoadFirst(false)
        }

        /* For reset form data */
        if (store && store.actionFlag && store.actionFlag === "CREATED_ITEM") {
            handleReset()
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearLetterTemplateMessage())
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

    /* Submitting data */
    const onSubmit = (values) => {
        if (!htmlToString(editorHtmlContent.trim())) {
            onAlertMessage("Content is required!", "Warning", 'warning')
            return
        }

        if (values) {
            const letterTemplateData = {
                subject: values.subject,
                main_heading: values.main_heading,
                best_regards: values.best_regards
            }

            if (editorHtmlContent) {
                letterTemplateData.content = editorHtmlContent
            }

            if (values.Status && values.Status.value) {
                letterTemplateData.status = values.Status.value
            }

            // console.log("onSubmit >>> ", values, letterTemplateData)
            dispatch(updateLetterTemplateLoader(false))
            dispatch(createLetterTemplate(letterTemplateData))
        }
    }

    return store ? (
        <Card className="px-5">
            {!store.loading ? (
                <DotPulse
                    className="d-flex justify-content-center position-absolute top-50 w-100 zindex-3"
                />
            ) : null}

            <CardHeader>
                <CardTitle>
                    {T("Add Letter Template")}
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
                            <Label className="form-label w-100" for='content'>
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
                                id='content'
                                name='content'
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
                                        placeholder={PlaceholderSchema && PlaceholderSchema.content}
                                    />
                                )}
                            />
                            {!htmlToString(editorHtmlContent.trim()) ? (
                                <FormFeedback className="d-block">{T("Content is required!")}</FormFeedback>
                            ) : (
                                <FormFeedback className="d-block">{errors.content?.message}</FormFeedback>
                            )}
                        </Col>

                        <Col md={6} sm={6} className="mb-1">
                            <Label className='form-label' for='best_regards'>
                                {T('Best Regards')}
                            </Label>
                            <Controller
                                defaultValue=""
                                id='best_regards'
                                name='best_regards'
                                control={control}
                                render={({ field }) => <Input {...field} type="textarea" rows={2} placeholder={PlaceholderSchema && PlaceholderSchema.best_regards} invalid={errors.best_regards && true} />}
                            />
                            <FormFeedback>{errors.best_regards?.message}</FormFeedback>
                        </Col>

                        <Col md={6} sm={6} className="mb-1">
                            <Label className='form-label' for="Status">
                                {T("Status")}
                            </Label>
                            <Controller
                                defaultValue={store.letterTemplateItem && store.letterTemplateItem.status ? { value: store.letterTemplateItem.status, label: store.letterTemplateItem.status } : null}
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

export default LetterTemplateAdd