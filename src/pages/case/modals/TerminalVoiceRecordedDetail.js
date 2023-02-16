// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import {
    Row,
    Card,
    CardBody
} from 'reactstrap'

// ** Icons Import
import {
    X,
    Minus,
    Square
} from 'react-feather'

// ** Draggable Import
import Draggable from 'react-draggable'

// ** Translation
import { T } from '@localization'

const TerminalVoiceRecordedDetail = ({
    open,
    closeTerminal,
    getTransformDate,
    recordedVoiceItem,
    renderFileWebUrlPreview
}) => {
    // ** State
    const [draggable, setDraggable] = useState(false)

    useEffect(() => {
        if (open) {
            setDraggable(false)
        }
    }, [open])

    const toggleDraggable = (status) => () => {
        setDraggable(status)
    }

    const renderTerminal = () => {
        return (
            <div className={`voice-recording-terminal ${open ? '' : 'd-none'}`}>
                <Card>
                    <CardBody className="card-body">
                        <div className='d-flex justify-content-between'>
                            <h3>{T("Recorded Voice")}</h3>
                            <div>
                                {draggable ? (
                                    <button className='btn btn-default p-0' onClick={toggleDraggable(false)}>
                                        <Minus size={14} />
                                    </button>
                                ) : (
                                    <button className='btn btn-default p-0' onClick={toggleDraggable(true)}>
                                        <Square size={14} />
                                    </button>
                                )}
                                <button type="button" className='btn btn-default p-0 ms-50' onClick={() => closeTerminal()}>
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        <hr />

                        <Row>
                            <div className="w-25">
                                <strong>{T("Subject")}: </strong>
                            </div>
                            <div className="w-75">
                                {(recordedVoiceItem && recordedVoiceItem.subject) || ""}
                            </div>
                        </Row>

                        {recordedVoiceItem && recordedVoiceItem.created_at ? (
                            <Row className="mt-1">
                                <div className="w-25">
                                    <strong>{T("Date")}: </strong>
                                </div>
                                <div className="w-75">
                                    {getTransformDate(recordedVoiceItem.created_at, "DD.MM.YYYY")}
                                </div>
                            </Row>
                        ) : null}

                        {recordedVoiceItem && recordedVoiceItem.path ? (
                            <Row className='mt-2'>
                                <audio src={renderFileWebUrlPreview(recordedVoiceItem.path)} controls />
                            </Row>
                        ) : null}
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

export default TerminalVoiceRecordedDetail