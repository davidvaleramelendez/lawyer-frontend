/* eslint-disable multiline-ternary */

// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Label,
    Input,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    FormFeedback
} from 'reactstrap'

// ** Store & Actions
import {
    createVoiceRecording,
    setVoiceRecordingItem,
    updateVoiceRecordingLoader,
    clearVoiceRecordingMessage
} from '@src/pages/voiceRecording/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components
import Notification from '@components/toast/notification'

// ** Constant
import {
    adminRoot
} from '@constant/defaultValues'

// ** Third Party Components
import useSpeechToText from 'react-hook-speech-to-text'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'

// ** Translation
import { T } from '@localization'

const CaseVoiceTranscript = () => {
    // ** Hooks
    const { caseId } = useParams()
    const navigate = useNavigate()

    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.voiceRecording)

    const PlaceholderSchema = {
        subject: "Subject"
    }

    const ErrorMessageSchema = {
        subject: T("Subject is required!")
    }

    // ** State
    const [loadFirst, setLoadFirst] = useState(true)
    const [blobURL, setBlobUrl] = useState(null)
    const [errors, setErrors] = useState(false)

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText
    } = useSpeechToText({
        lang: 'de-DE',
        continuous: true,
        useLegacyResults: false,
        interimResults: true // Allows for displaying real-time speech results
    })

    const recorderControls = useAudioRecorder()

    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        isPaused,
        recordingTime
    } = recorderControls

    const blobToBase64 = (blob = null) => new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => resolve(reader.result)
        // reader.onerror = error => reject(error)
        reader.onerror = () => ""
    })

    const handleRecordingComplete = async (blob) => {
        const voiceRecordingItem = { ...store.voiceRecordingItem }

        const voiceData = {
            id: voiceRecordingItem.id,
            case_id: caseId,
            attachment: "",
            subject: voiceRecordingItem.subject
        }

        if (results && results.length) {
            voiceData.transcript_json = results
        }

        const newBlobUrl = URL.createObjectURL(blob)
        setBlobUrl(newBlobUrl)
        stopSpeechToText()

        const base64 = await blobToBase64(blob)
        voiceData.attachment = base64
        // console.log("voiceData >>> ", voiceData)
        dispatch(updateVoiceRecordingLoader(false))
        dispatch(createVoiceRecording(voiceData))
    }

    const handleReset = () => {
        setBlobUrl(null)
        stopRecording()
        stopSpeechToText()
        navigate(`${adminRoot}/case/voice/transcript/${caseId}`)
    }

    const handleBackCase = () => {
        handleReset()
        navigate(`${adminRoot}/case/view/${caseId}`)
    }

    const getVoiceItemValue = (key = "") => {
        const voiceRecordingItem = { ...store.voiceRecordingItem }
        if (voiceRecordingItem && voiceRecordingItem[key]) {
            return voiceRecordingItem[key]
        }
        return ""
    }

    const handlePauseResumeRecording = () => {
        togglePauseResume()
        if (isPaused) {
            startSpeechToText()
        } else {
            stopSpeechToText()
        }
    }

    const handleRecordingTranscript = () => {
        const subject = getVoiceItemValue("subject")
        if (!subject) {
            setErrors(true)
            return
        }

        if (isRecording) {
            stopRecording()
            stopSpeechToText()
        } else {
            setBlobUrl()
            startRecording()
            startSpeechToText()
        }
    }

    const handleUpdateVoiceItem = (value = "", key = "") => {
        const voiceRecordingItem = { ...store.voiceRecordingItem }
        if (key) {
            voiceRecordingItem[key] = value
        }

        dispatch(setVoiceRecordingItem({ ...voiceRecordingItem }))
    }

    // ** Get data on mount
    useEffect(() => {
        if (loadFirst) {
            handleUpdateVoiceItem(caseId, "case_id")
            setLoadFirst(false)
        }

        if (store && store.actionFlag && (store.actionFlag === "RECORDING_CREATED")) {
            handleBackCase()
        }

        /* For blank message api called inside */
        if (store.success || store.error || store.actionFlag) {
            dispatch(clearVoiceRecordingMessage())
        }

        /* Succes toast notification */
        if (store.success) {
            Notification(T("Success"), store.success, "success")
        }

        /* Error toast notification */
        if (store.error) {
            Notification(T("Error"), store.error, "warning")
        }
    }, [store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)

    return (
        <Fragment>
            <div className="p-5 mx-md-5">
                <Row>
                    <Col sm={1} md={1} lg={2} xl={2} />
                    <Col sm={10} md={10} lg={8} xl={8}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">{T('Voice Recording')} & {T("Transcript")}</CardTitle>

                                <div className="text-end">
                                    <Button
                                        type="button"
                                        onClick={() => handleBackCase()}
                                    >
                                        {T("Back")}
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardBody>
                                <Row>
                                    {error ? (
                                        <p>Web Speech API is not available in this browser 🤷‍</p>
                                    ) : (
                                        <Fragment>
                                            <div className="mb-1">
                                                <Label className="form-label" for="subject">
                                                    {T("Subject")}
                                                </Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    placeholder={PlaceholderSchema && PlaceholderSchema.subject}
                                                    value={getVoiceItemValue("subject")}
                                                    onInput={(event) => handleUpdateVoiceItem(event.target.value, "subject")}
                                                    invalid={!getVoiceItemValue("subject") && errors}
                                                />
                                                {!getVoiceItemValue("subject") && errors ? (
                                                    <FormFeedback>{ErrorMessageSchema && ErrorMessageSchema.subject}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="react-audio-voice-recorder">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => handleRecordingComplete(blob)}
                                                    recorderControls={recorderControls}
                                                />

                                                {blobURL ? (
                                                    <audio
                                                        controls
                                                        className="mt-2"
                                                        src={blobURL}
                                                    />
                                                ) : null}
                                            </div>

                                            <div className="mt-2 react-audio-voice-recorder">
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    disabled={recordingTime !== 0}
                                                    onClick={handleRecordingTranscript}
                                                >
                                                    {T("Start Recording")}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="ms-50"
                                                    disabled={!recordingTime}
                                                    onClick={handlePauseResumeRecording}
                                                >
                                                    {`${isPaused ? T('Resume Recording') : T('Pause Recording')}`}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    className="ms-50"
                                                    onClick={handleReset}
                                                >
                                                    {T("Reset")}
                                                </Button>

                                                <ul>
                                                    {results.map((result) => (
                                                        <li key={result.timestamp}>{(result.transcript) || ""}</li>
                                                    ))}

                                                    {interimResult && <li>{interimResult}</li>}
                                                </ul>
                                            </div>
                                        </Fragment>
                                    )}
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={1} md={1} lg={2} xl={2} />
                </Row>
            </div>
        </Fragment>
    )
}

export default CaseVoiceTranscript