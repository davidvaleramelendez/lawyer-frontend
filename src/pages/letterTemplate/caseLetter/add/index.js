// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ** Store & Actions
import {
    getLetterTemplate,
    clearLetterTemplateMessage
} from '@src/pages/letterTemplate/store'
import { getCompanyDetail } from '@src/pages/user/store'
import {
    getCaseView,
    createCaseLetter,
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

const CaseLetterAdd = () => {
    // ** Hooks
    const { caseId, letterTemplateId } = useParams()
    const navigate = useNavigate()

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.letterTemplate)
    const userStore = useSelector((state) => state.user)
    const caseStore = useSelector((state) => state.cases)

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)
    const [editorHtmlContent, setEditorHtmlContent] = useState("")
    const [editorStateContent, setEditorStateContent] = useState(null)

    /* Validation schema */
    const LetterSchema = yup.object({
        subject: yup.string().required(T('Subject is required!')),
        content: yup.object().shape({
            blocks: yup.array().of(yup.object().shape({
                text: yup.string().required(T('Content is required!'))
            }).required(T('Content is required!')).nullable())
        }).required(T('Content is required!')).nullable(),
        best_regards: yup.string().required(T('Best Regards is required!'))
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
        const letterTemplateItem = { ...store.letterTemplateItem }
        let subject = ""
        if (caseStore && caseStore.caseItem) {
            if (caseStore.caseItem.CaseID) {
                subject += subject ? `, Case ID: ${caseStore.caseItem.CaseID}` : `Case ID: ${caseStore.caseItem.CaseID}`
            }

            if (caseStore.caseItem.type) {
                if (caseStore.caseItem.type.CaseTypeName) {
                    subject += subject ? `, Case Type: ${caseStore.caseItem.type.CaseTypeName}` : `Case Type: ${caseStore.caseItem.type.CaseTypeName}`
                }
            }
        }

        if (caseStore && caseStore.fighterItem && caseStore.fighterItem.id) {
            if (caseStore.fighterItem.name) {
                subject += subject ? `, fighting Against: ${caseStore.fighterItem.name} ${caseStore.fighterItem.last_name}` : `fighting Against: ${caseStore.fighterItem.name} ${caseStore.fighterItem.last_name}`
            }
        }

        if (letterTemplateItem && letterTemplateItem.content) {
            letterTemplateItem.content = await getInitialHTML(letterTemplateItem.content)
        }

        if (letterTemplateItem && letterTemplateItem.status) {
            letterTemplateItem.status = { value: letterTemplateItem.status, label: letterTemplateItem.status }
        }

        letterTemplateItem.letter_template_id = letterTemplateItem.id
        letterTemplateItem.id = ""
        letterTemplateItem.subject = subject || letterTemplateItem.subject
        letterTemplateItem.fristDate = new Date()
        reset(letterTemplateItem)
    }

    const handleBackCase = () => {
        reset(letterItem)
        navigate(`${adminRoot}/case/view/${caseId}`)
    }

    const handleReset = () => {
        reset(letterItem)
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
            dispatch(getLetterTemplate(letterTemplateId))
            setLoadFirst(false)
        }

        /* Navigate after letter created */
        if (caseStore && caseStore.actionFlag && (caseStore.actionFlag === "LETTER_CREATED")) {
            handleBackCase()
        }

        /* For reset form data */
        if (store && store.actionFlag && store.actionFlag === "EDIT_ITEM") {
            handleUpdateData()
        }

        /* For blank message api called inside */
        if (caseStore && (caseStore.success || caseStore.error || caseStore.actionFlag)) {
            dispatch(clearCaseMessage())
        }

        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearLetterTemplateMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification(T("Success"), store.success, "success")
        }

        if (caseStore && caseStore.success) {
            Notification(T("Success"), caseStore.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification(T("Error"), store.error, "warning")
        }

        if (caseStore && caseStore.error) {
            Notification(T("Error"), caseStore.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag, caseStore.success, caseStore.error, caseStore.actionFlag, loadFirst])
    // console.log("caseStore >>> ", caseStore)

    const onSubmit = async (values) => {
        if (values) {
            const letterData = {
                case_id: caseId,
                letter_template_id: values.letter_template_id,
                subject: values.subject,
                best_regards: values.best_regards
            }

            if (editorHtmlContent) {
                letterData.message = editorHtmlContent
            }

            if (values.fristDate && typeof values.fristDate !== 'string' && values.fristDate.length) {
                letterData.frist_date = getTransformDate(new Date(values.fristDate[0], "YYYY-MM-DD"))
            } else if (values.fristDate) {
                letterData.frist_date = getTransformDate(values.fristDate, "YYYY-MM-DD")
            }

            // console.log("onSubmit >>> ", values, letterData)
            dispatch(updateCaseLoader(false))
            dispatch(createCaseLetter(letterData))
        }
    }

    return (<>
        {!store.loading || !caseStore.loading ? (
            <DotPulse
                className="d-flex justify-content-center position-absolute top-50 w-100 zindex-3"
            />
        ) : null}

        <div className="p-5 mx-md-5">
            <Row>
                <Col sm={1} md={1} lg={2} xl={2} />
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
                                            <Label className='fw-bold form-label' for='fristDate'>
                                                {T('Date')}
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
                                {/* /Date */}

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
                                                defaultValue={editorStateContent}
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
                                            <FormFeedback className="d-block">{errors.content?.message || (errors.content?.blocks && errors.content.blocks[0]?.text?.message)}</FormFeedback>
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
                                            {T("Create Letter")}
                                        </Button>
                                    </div>
                                </Row>
                                {/* /Action */}
                            </CardBody>
                        </Form>
                    </Card>
                </Col>
                <Col sm={1} md={1} lg={2} xl={2} />
            </Row>
        </div>
    </>)
}

export default CaseLetterAdd