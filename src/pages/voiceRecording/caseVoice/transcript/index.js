/* eslint-disable multiline-ternary */

// ** React Imports
import { Fragment, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Button,
    CardBody,
    CardHeader
} from 'reactstrap'

// ** Constant
import {
    adminRoot
} from '@constant/defaultValues'

// ** Third Party Components
import useSpeechToText from 'react-hook-speech-to-text'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'

const CaseVoiceTranscript = () => {
    // ** Hooks
    const { caseId } = useParams()
    const navigate = useNavigate()

    // ** State
    const [blobURL, setBlobUrl] = useState(null)

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

    const addAudioElement = (blob) => {
        const newBlobUrl = URL.createObjectURL(blob)
        setBlobUrl(newBlobUrl)
        stopSpeechToText()
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = function () {
            const base64data = reader.result
            console.log("base64data >>> ", base64data)
        }
    }

    const handleReset = () => {
        setBlobUrl(null)
        stopSpeechToText()
        navigate(`${adminRoot}/case/voice/transcript/${caseId}`)
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
        if (isRecording) {
            stopRecording()
            stopSpeechToText()
        } else {
            setBlobUrl()
            startRecording()
            startSpeechToText()
        }
    }

    return (
        <Fragment>
            <div className="p-5 mx-md-5">
                <Row>
                    <Col sm={1} md={1} lg={2} xl={2} />
                    <Col sm={10} md={10} lg={8} xl={8}>
                        <Card>
                            <CardHeader />

                            <CardBody>
                                <Row>
                                    <div className="text-end">
                                        <Button
                                            type="button"
                                            onClick={() => navigate(`${adminRoot}/case/view/${caseId}`)}
                                        >
                                            Back
                                        </Button>
                                    </div>

                                    {error ? (
                                        <p>Web Speech API is not available in this browser 🤷‍</p>
                                    ) : (
                                        <Fragment>
                                            <div className="react-audio-voice-recorder">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob)}
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
                                                    Start Recording
                                                </Button>

                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="ms-50"
                                                    disabled={!recordingTime}
                                                    onClick={handlePauseResumeRecording}
                                                >
                                                    {`${isPaused ? 'Resume' : 'Pause'} Recording`}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    className="ms-50"
                                                    onClick={handleReset}
                                                >
                                                    Reset
                                                </Button>

                                                <ul>
                                                    {results.map((result) => (
                                                        <li key={result.timestamp}>{result.transcript}</li>
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