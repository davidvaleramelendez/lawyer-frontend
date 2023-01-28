// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import {
    Card,
    CardBody
} from 'reactstrap'

// ** Store & Actions
import {
    createVoiceRecording,
    clearVoiceRecordingMessage
} from '@src/pages/voiceRecording/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Icons Import
import {
    Minus,
    Square
} from 'react-feather'

// ** Draggable Import
import Draggable from 'react-draggable'

// ** Third Party Components
import { Recorder } from 'react-voice-recorder'

// ** Translation
import { T } from '@localization'

// ** Styles
import 'react-voice-recorder/dist/index.css'

const TerminalVoiceRecording = ({
    open,
    caseId,
    closeTerminal
}) => {
    // ** Hooks
    const dispatch = useDispatch()

    const recoderData = { url: null, blob: null, chunks: null, duration: { h: 0, m: 0, s: 0 } }

    // ** Store vars
    const store = useSelector((state) => state.voiceRecording)

    // ** State
    const [draggable, setDraggable] = useState(false)
    const [audioDetails, setAudioDetails] = useState(recoderData)
    const [isRecording, setIsRecording] = useState(true)

    const handleReset = () => {
        setIsRecording(true)
        setAudioDetails(recoderData)
    }

    useEffect(() => {
        if (open) {
            setDraggable(false)
            handleReset()
        }
    }, [open])

    useEffect(() => {
        /* For blank message api called inside */
        if (store.success || store.error || store.actionFlag) {
            dispatch(clearVoiceRecordingMessage())
        }

        if (store && store.actionFlag && (store.actionFlag === "RECORDING_CREATED")) {
            handleReset()
            closeTerminal()
        }
    }, [store.success, store.error, store.actionFlag])

    const toggleDraggable = (status) => () => {
        setDraggable(status)
    }

    const handleAudioStop = (data) => {
        setIsRecording(false)
        setAudioDetails(data)
    }

    const handleAudioStart = () => {
        setIsRecording(true)
    }

    const handleAudioUpload = (file) => {
        if (!isRecording) {
            const recordingData = {
                attachment: ""
            }

            if (store.voiceRecordingItem) {
                if (store.voiceRecordingItem.subject) {
                    recordingData.subject = store.voiceRecordingItem.subject
                }

                recordingData.case_id = store.voiceRecordingItem.case_id || caseId
            }

            if (file) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = async () => {
                    recordingData.attachment = await reader.result
                    dispatch(createVoiceRecording(recordingData))
                }
            }
        }
    }

    // const handleCountDown = (data) => {
    //     console.log("handleCountDown >>> ", data)
    // }

    const renderTerminal = () => {
        return (
            <div className={`voice-recording-terminal ${open ? '' : 'd-none'}`}>
                <Card>
                    <CardBody className="card-body">
                        <div className='d-flex justify-content-between'>
                            <h3>{T("Voice Recording")}</h3>
                            {draggable ? (
                                <button className='btn btn-default' onClick={toggleDraggable(false)}>
                                    <Minus size={14} />
                                </button>
                            ) : (
                                <button className='btn btn-default' onClick={toggleDraggable(true)}>
                                    <Square size={14} />
                                </button>
                            )}
                        </div>

                        <hr />
                        <div className="case-voice-recording">
                            <Recorder
                                showUIAudio
                                record={false}
                                uploadButtonDisabled={isRecording}
                                title={(store && store.voiceRecordingItem && store.voiceRecordingItem.subject) || "New Recording"}
                                audioURL={(audioDetails && audioDetails.url) || null}
                                handleReset={() => handleReset()}
                                handleAudioStop={(data) => handleAudioStop(data)}
                                handleAudioStart={(data) => handleAudioStart(data)}
                                handleAudioUpload={(data) => handleAudioUpload(data)}
                                // handleCountDown={(data) => handleCountDown(data)}
                                mimeTypeToUseWhenRecording={`audio/webm`}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }

    return (
        <Fragment>
            {draggable ? (
                <div className='time-tracking-draggable mx-auto col-sm-8 col-md-6 col-xl-5'>
                    <Draggable handle='.card-body'>
                        {renderTerminal()}
                    </Draggable>
                </div>
            ) : (
                renderTerminal()
            )}
        </Fragment>
    )
}

export default TerminalVoiceRecording