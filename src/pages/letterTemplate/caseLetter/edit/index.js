// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ** Store & Actions
import { getCompanyDetail } from '@src/pages/user/store'
import { getLetter } from '@src/pages/letter/store'
import {
    getCaseView,
    updateCaseLetter,
    updateCaseLoader,
    clearCaseMessage
} from '@src/pages/case/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Form,
    Input,
    Label,
    Button,
    CardBody,
    CardHeader,
    FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Utils
import {
    htmlToString,
    isUserLoggedIn,
    getTransformDate
} from '@utils'

// ** Custom Components
import DotPulse from '@components/dotpulse'
import Notification from '@components/toast/notification'

// ** Office Editor Component
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {
    EditorState,
    ContentState,
    convertToRaw
} from 'draft-js'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Constant
import {
    root,
    adminRoot
} from '@constant/defaultValues'
import {
    letterItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Translation
import { T } from '@localization'

const CaseLetterEdit = () => {
    // ** Hooks
    const { caseId, letterId } = useParams()
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)

    // ** Store vars
    const dispatch = useDispatch()
    const userStore = useSelector((state) => state.user)
    const caseStore = useSelector((state) => state.cases)
    const letterStore = useSelector((state) => state.letter)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [editorHtmlContent, setEditorHtmlContent] = useState("")
    const [editorStateContent, setEditorStateContent] = useState(null)

    /* Validation schema */
    const LetterSchema = yup.object({
        subject: yup.string().required(T('Subject is required!')).nullable(),
        best_regards: yup.string().required(T('Best Regards is required!')).nullable()
    }).required()
    /* /Validation schema */

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: letterItem,
        resolver: yupResolver(LetterSchema)
    })

    /* Placeholder texts */
    const PlaceholderSchema = {
        subject: T("Subject"),
        content: T("Content"),
        best_regards: T("Best Regards")
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

    const handleUpdateData = async () => {
        const letterItem = { ...letterStore.letterItem }
        if (letterItem && letterItem.message) {
            await getInitialHTML(letterItem.message)
        }

        if (letterItem && letterItem.status) {
            letterItem.status = { value: letterItem.status, label: letterItem.status }
        }

        letterItem.fristDate = getTransformDate(new Date(), "YYYY-MM-DD")
        letterItem.created_date = getTransformDate(new Date(), "YYYY-MM-DD")
        letterItem.best_regards = letterItem.best_regards ?? ""

        if (letterItem && letterItem.frist_date) {
            letterItem.fristDate = getTransformDate(letterItem.frist_date, "YYYY-MM-DD")
        }

        if (letterItem && letterItem.created_date) {
            letterItem.created_date = getTransformDate(letterItem.created_date, "YYYY-MM-DD")
        }

        reset(letterItem)
    }

    const handleBackCase = () => {
        reset(letterItem)
        setEditorHtmlContent('')
        setEditorStateContent(null)
        navigate(`${adminRoot}/case/view/${caseId}`)
    }

    const handleReset = () => {
        reset(letterItem)
        setEditorHtmlContent('')
        setEditorStateContent(null)
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            handleReset()
            dispatch(getCompanyDetail({}))
            dispatch(getCaseView(caseId))
            dispatch(getLetter(letterId))
            setLoadFirst(false)
        }

        /* Navigate after letter created */
        if (caseStore && caseStore.actionFlag && (caseStore.actionFlag === "LETTER_UPDATED")) {
            handleBackCase()
        }

        /* For reset form data */
        if (letterStore && letterStore.actionFlag && letterStore.actionFlag === "EDIT_ITEM") {
            handleUpdateData()
        }

        /* For blank message api called inside */
        if (caseStore && (caseStore.success || caseStore.error || caseStore.actionFlag)) {
            dispatch(clearCaseMessage())
        }

        /* Succes toast notification */
        if (caseStore && caseStore.success) {
            Notification(T("Success"), caseStore.success, "success")
        }

        if (letterStore && letterStore.success) {
            Notification(T("Success"), letterStore.success, "success")
        }

        /* Error toast notification */
        if (caseStore && caseStore.error) {
            Notification(T("Error"), caseStore.error, "warning")
        }

        if (letterStore && letterStore.error) {
            Notification(T("Error"), letterStore.error, "warning")
        }
    }, [letterStore.success, letterStore.error, letterStore.actionFlag, caseStore.success, caseStore.error, caseStore.actionFlag, loadFirst])
    // console.log("caseStore >>> ", caseStore)

    const onSubmit = async (values) => {
        if (!htmlToString(editorHtmlContent.trim())) {
            onAlertMessage("Content is required!", "Warning", 'warning')
            return
        }

        if (values) {
            const letterData = {
                id: values.id,
                case_id: caseId,
                letter_template_id: values.letter_template_id,
                subject: values.subject,
                best_regards: values.best_regards
            }

            if (editorHtmlContent) {
                letterData.message = editorHtmlContent
            }

            if (values.fristDate && typeof values.fristDate !== 'string' && values.fristDate.length) {
                letterData.frist_date = getTransformDate(values.fristDate[0], "YYYY-MM-DD")
            } else if (values.fristDate) {
                letterData.frist_date = getTransformDate(values.fristDate, "YYYY-MM-DD")
            }

            if (values.created_date && typeof values.created_date !== 'string' && values.created_date.length) {
                letterData.created_date = getTransformDate(values.created_date[0], "YYYY-MM-DD")
            } else if (values.created_date) {
                letterData.created_date = getTransformDate(values.created_date, "YYYY-MM-DD")
            }

            // console.log("onSubmit >>> ", values, letterData)

            dispatch(updateCaseLoader(false))
            dispatch(updateCaseLetter(letterData))
        }
    }

    return (<>
        {!letterStore.loading || !caseStore.loading ? (
            <DotPulse
                className="d-flex justify-content-center position-absolute top-50 w-100 zindex-3"
            />
        ) : null}

        <div className="p-5 mx-md-5">
            {/* Main Row */}
            <Row>
                <Col sm={1} md={1} lg={2} xl={2} />
                {/* Letter */}
                <Col sm={10} md={10} lg={8} xl={8}>
                    <Card>
                        <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                            <CardHeader />

                            <CardBody>
                                {/* Sender */}
                                <Row className="mb-1">
                                    <Col sm={12} md={12} className="sender">
                                        <div className="float-end">
                                            <span className="d-block me-5">
                                                {(userStore && userStore.companyItem && userStore.companyItem.address) || ""}
                                            </span>
                                            <span className="d-block me-5">
                                                {(userStore && userStore.companyItem && userStore.companyItem.city) || ""}
                                            </span>
                                            <span className="d-block me-5">
                                                {(userStore && userStore.companyItem && userStore.companyItem.zip_code) || ""}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Sender */}

                                {/* Return address */}
                                <Row className="return-address mb-1">
                                    <Col sm={12} md={12}>
                                        <div className="mx-md-5">
                                            <span className="d-block">
                                                {userStore && userStore.companyItem ? `${userStore.companyItem.address ? `${userStore.companyItem.address},` : ''} ${userStore.companyItem.city ? `${userStore.companyItem.city},` : ''} ${userStore.companyItem.zip_code ? `${userStore.companyItem.zip_code}` : ''}` : null}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Return address */}

                                {/* Receiver */}
                                <Row className="recipient mb-3">
                                    <Col sm={12} md={12}>
                                        <div className="mx-md-5">
                                            <span className="d-block">
                                                {(caseStore && caseStore.caseItem && caseStore.caseItem.user && caseStore.caseItem.user.Address) || ""}
                                            </span>
                                            <span className="d-block">
                                                {(caseStore && caseStore.caseItem && caseStore.caseItem.user && caseStore.caseItem.user.Address1 ? `${caseStore.caseItem.user.Address1}, ` : '') || ""}
                                                {(caseStore && caseStore.caseItem && caseStore.caseItem.user && caseStore.caseItem.user.City) || ""}
                                            </span>
                                            <span className="d-block">
                                                {(caseStore && caseStore.caseItem && caseStore.caseItem.user && caseStore.caseItem.user.id) ? `${caseStore.caseItem.user.Postcode ? `${caseStore.caseItem.user.Postcode}` : ''} ${caseStore.caseItem.user.State ? `${caseStore.caseItem.user.State}` : ''} ${caseStore.caseItem.user.Country ? `, ${caseStore.caseItem.user.Country}` : ''}` : null}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Receiver */}

                                {/* Date */}
                                <Row className="date justify-content-end mb-2">
                                    <Col sm={6} md={6}>
                                        <div className="mx-md-5">
                                            <Label className='fw-bold form-label' for='created_date'>
                                                {T('Date')}
                                            </Label>
                                            <Controller
                                                defaultValue={new Date()}
                                                id='created_date'
                                                name='created_date'
                                                control={control}
                                                render={({ field }) => <Flatpickr
                                                    {...field}
                                                    id='created_date'
                                                    className='form-control'
                                                    options={{
                                                        enableTime: false,
                                                        dateFormat: "Y-m-d"
                                                    }}
                                                />}
                                            />
                                            <FormFeedback>{errors.created_date?.message}</FormFeedback>
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Date */}

                                {/* Deadline Date */}
                                <Row className="date justify-content-end mb-2">
                                    <Col md={6} sm={6}>
                                        <div className="mx-md-5">
                                            <Label className='fw-bold form-label' for='fristDate'>
                                                {T('Deadline Date')}
                                            </Label>
                                            <Controller
                                                defaultValue={new Date()}
                                                id='fristDate'
                                                name='fristDate'
                                                control={control}
                                                render={({ field }) => <Flatpickr
                                                    {...field}
                                                    id='fristDate'
                                                    className='form-control'
                                                    options={{
                                                        enableTime: false,
                                                        dateFormat: "Y-m-d"
                                                    }}
                                                />}
                                            />
                                            <FormFeedback>{errors.fristDate?.message}</FormFeedback>
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Deadline Date */}

                                {/* Subject */}
                                <Row className="subject mb-2">
                                    <Col sm={12} md={12}>
                                        <div className="mx-md-5">
                                            <Label className='fw-bold form-label' for='subject'>
                                                {T('Subject')}
                                            </Label>
                                            <Controller
                                                defaultValue=""
                                                id='subject'
                                                name='subject'
                                                control={control}
                                                render={({ field }) => <Input
                                                    {...field}
                                                    className="fw-bold"
                                                    placeholder={PlaceholderSchema && PlaceholderSchema.subject}
                                                    invalid={errors.subject && true}
                                                />}
                                            />
                                            <FormFeedback>{errors.subject?.message}</FormFeedback>
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Subject */}

                                {/* Content */}
                                <Row className="main-content mb-3">
                                    <Col sm={12} md={12}>
                                        <div className="mx-md-5">
                                            <Label className="fw-bold form-label w-100" for='content'>
                                                {T('Content')}
                                            </Label>
                                            <Controller
                                                defaultValue={null}
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
                                                        wrapperClassName='toolbar-bottom'
                                                        editorState={editorStateContent}
                                                        onEditorStateChange={handleEditorStateChange}
                                                        placeholder={PlaceholderSchema && PlaceholderSchema.content}
                                                    />
                                                )}
                                            />
                                            {!htmlToString(editorHtmlContent.trim()) ? (
                                                <FormFeedback className="d-block">Content is required!</FormFeedback>
                                            ) : (
                                                <FormFeedback className="d-block">{errors.content?.message}</FormFeedback>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Content */}

                                {/* Best Regards */}
                                <Row className="best-regards mb-2">
                                    <Col sm={12} md={12}>
                                        <div className="mx-md-5">
                                            <Label className='fw-bold form-label' for='best_regards'>
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
                                        </div>
                                    </Col>
                                </Row>
                                {/* /Best Regards */}

                                {/* Action */}
                                <Row className="my-2 text-end">
                                    <div className='px-md-5'>
                                        <Button
                                            type="button"
                                            color="secondary"
                                            className="me-1"
                                            disabled={!caseStore.loading}
                                            onClick={() => handleBackCase()}
                                        >
                                            {T("Back")}
                                        </Button>

                                        <Button
                                            type='submit'
                                            color="primary"
                                            disabled={!caseStore.loading}
                                        >
                                            {T("Update Letter")}
                                        </Button>
                                    </div>
                                </Row>
                                {/* /Action */}
                            </CardBody>
                        </Form>
                    </Card>
                </Col>
                {/* /Letter */}

                <Col sm={1} md={1} lg={2} xl={2} />
            </Row>
            {/* /Main Row */}
        </div>
    </>)
}

export default CaseLetterEdit