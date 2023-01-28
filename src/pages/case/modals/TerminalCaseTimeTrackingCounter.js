/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// ** Redux
import { useDispatch } from 'react-redux'
import { updateTimeCaseRecord, deleteTimeCaseRecord } from '../store'

// ** draggable Import
import Draggable from 'react-draggable'

// ** Reactstrap Imports
import {
  Row,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

// ** Constant
import { CONTINUE_MODAL } from '@constant/defaultValues'

// ** Component
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

// ** Icons Import
import { Clock, Minus, Square } from 'react-feather'

// ** Utils
import { setTimeCounter, getTimeCounter, toTimeString } from '@utils'

// ** Translation
import { T } from '@localization'

// ** Styles
import 'react-circular-progressbar/dist/styles.css'

let myInterval = null

const TerminalCaseTimeTrackingCounter = ({
  open,
  closeTerminal
}) => {
  // ** Store vars
  const [currentTime, setCurrentTime] = useState(getTimeCounter()?.current_time ?? 0)
  const [status, setStatus] = useState(getTimeCounter()?.status ?? false)
  const [alarmModal, setAlarmModal] = useState(false)
  const [stopModal, setStopModal] = useState(false)
  const [draggable, setDraggable] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [continueModal, setContinueModal] = useState(getTimeCounter()?.manual ?? CONTINUE_MODAL.INITIAL_STATE)

  const dispatch = useDispatch()

  useEffect(() => {
    if (open) {
      setAlarmModal(false)
      setStopModal(false)
      setDraggable(false)

      myInterval = setInterval(() => {
        if (stopModal) {
          return
        }
        if (completed) {
          return
        }
        setStopModal(prevStop => {
          if (!prevStop) {
            setCurrentTime(prevTime => {
              const timeCounter = getTimeCounter()
              if ((getTimeCounter()?.interval_time - prevTime) === 5) {
                setAlarmModal(true)
              }

              if (prevTime === getTimeCounter()?.interval_time) {
                // clearInterval(myInterval)
                setTimeCounter({
                  ...getTimeCounter(),
                  completed: true
                })
                setCompleted(true)
                setContinueModal(prevContinue => {
                  if (prevContinue === CONTINUE_MODAL.INITIAL_STATE) {
                    setContinueModal(CONTINUE_MODAL.OPENED_STATE)
                  }
                  return prevContinue
                })
              }

              if (timeCounter.status && prevTime < timeCounter?.interval_time) {
                setStatus(true)
                setTimeCounter({
                  ...timeCounter,
                  current_time: prevTime + 1
                })
                return prevTime + 1
              }
              setStatus(false)
              return prevTime
            })
          }
          return prevStop
        })
      }, 1000)
    }
  }, [open])

  const closeTimer = () => {
    const localTime = getTimeCounter()
    setStatus(false)
    setStopModal(false)
    clearInterval(myInterval)
    setTimeCounter({
      ...localTime,
      status: false,
      completed: true,
      interval_time: currentTime
    })

    setCompleted(false)

  }

  const handleConfirm = () => {
    setContinueModal(CONTINUE_MODAL.CONFIRMED_STATE)
    const localTime = getTimeCounter()
    setTimeCounter({
      ...localTime,
      manual: CONTINUE_MODAL.CONFIRMED_STATE
    })
  }

  const handleTimeIncrease = (increasetime) => () => {
    const localTime = getTimeCounter()
    setContinueModal(CONTINUE_MODAL.INITIAL_STATE)
    setTimeCounter({
      ...localTime,
      interval_time: localTime.interval_time + (increasetime * 60),
      manual: CONTINUE_MODAL.INITIAL_STATE,
      status: true
    })
    setStatus(true)
  }

  const handleSave = async () => {
    const localTime = getTimeCounter()
    dispatch(updateTimeCaseRecord({
      RecordID: localTime.record_id,
      interval_time: localTime.interval_time
    }))
    closeTimer()
    setContinueModal(CONTINUE_MODAL.INITIAL_STATE)
    setCurrentTime(0)
    setTimeCounter({
      ...localTime,
      completed: false,
      status: false,
      current_time: 0,
      manual: CONTINUE_MODAL.INITIAL_STATE
    })
    closeTerminal()
  }

  const handleDelete = () => {
    const localTime = getTimeCounter()
    dispatch(deleteTimeCaseRecord({
      RecordID: localTime.record_id
    }))
    closeTimer()
    setCurrentTime(0)
    setContinueModal(CONTINUE_MODAL.INITIAL_STATE)
    setTimeCounter({
      ...localTime,
      completed: false,
      status: false,
      current_time: 0,
      manual: CONTINUE_MODAL.INITIAL_STATE
    })
    closeTerminal()
  }

  const toggleDraggable = (status) => () => {
    setDraggable(status)
  }

  const handleForceStop = () => {
    closeTimer()
    setContinueModal(CONTINUE_MODAL.CONFIRMED_STATE)
    setTimeCounter({
      ...getTimeCounter(),
      manual: CONTINUE_MODAL.CONFIRMED_STATE
    })
  }

  const renderTerminal = () => {
    return (
      <div className={`${open ? '' : 'd-none'}`}>
        <Card>
          <CardBody className='card-body'>
            <div className='d-flex justify-content-between'>
              <h3>{T("Terminal")}</h3>
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
            <div className='row align-items-center'>
              <div className="col-7">
                <div className="mx-auto time-tracking">
                  <CircularProgressbar
                    value={currentTime * 100 / getTimeCounter().interval_time}
                    text={`${toTimeString(currentTime)}`}
                    styles={buildStyles({
                      textSize: '12px'
                    })}
                  />
                </div>
              </div>

              <div className='col-5'>
                <div className='d-flex'>
                  <Clock size={16} className="me-1" /> <h5 className='mb-0'>Recorded Time</h5>
                </div>
                <h2 className='mt-2'>{toTimeString(currentTime, 'min')}</h2>
                <div className='mt-5 d-flex'>
                  <Clock size={16} className="me-1" /> <h5 className='mb-0'>Started Time</h5>
                </div>
                <h2 className='mt-2'>{`${getTimeCounter().start_time ?? ''}`}</h2>
              </div>
            </div>

            <Row className="mt-5 mb-1">
              <div className="d-flex justify-content-center">
                {!status && currentTime === getTimeCounter().interval_time ? (
                  <div>
                    <div className='mt-2 d-flex justify-content-center'>
                      <Button type="submit" size='lg' color="success" className='me-3' onClick={handleSave}>
                        {T("Save")}
                      </Button>
                      <Button type="submit" size='lg' color="danger" onClick={handleDelete}>
                        {T("Delete")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className='d-flex justify-content-center' type="submit" size='lg' color="danger" onClick={() => setStopModal(true)}>
                    {T("Stop")}
                  </Button>
                )}
              </div>
            </Row>
          </CardBody>
        </Card>

        <Modal
          isOpen={alarmModal}
          toggle={() => setAlarmModal(!alarmModal)}
          modalClassName="modal-warning"
          className='modal-dialog-centered'
        >
          <ModalHeader toggle={() => setAlarmModal(!alarmModal)}>Warning</ModalHeader>
          <ModalBody>
            Time is about to expired.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setAlarmModal(!alarmModal)}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={stopModal}
          toggle={() => setStopModal(!stopModal)}
          modalClassName="modal-warning"
          className='modal-dialog-centered'
        >
          <ModalHeader toggle={() => setStopModal(!stopModal)}>Warning</ModalHeader>
          <ModalBody>
            Do you want to continue?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setStopModal(false)}>
              Continue
            </Button>
            <Button color="danger" onClick={handleForceStop}>
              Stop
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={continueModal === CONTINUE_MODAL.OPENED_STATE}
          toggle={() => { }}
          modalClassName="modal-warning"
          className='modal-dialog-centered'
        >
          <ModalHeader>Warning</ModalHeader>
          <ModalBody className='mt-2'>
            <div>
              Your time is expired.
              Do you want to continue?
            </div>
            <div className='mt-2 d-flex'>
              <Button type="submit" size='lg' color="primary" className='me-2 ms-auto' onClick={handleTimeIncrease(5)}>
                {T("5")}
              </Button>
              <Button type="submit" size='lg' color="primary" className='me-2' onClick={handleTimeIncrease(10)}>
                {T("10")}
              </Button>
              <Button type="submit" size='lg' color="primary" className='me-2' onClick={handleTimeIncrease(15)}>
                {T("15")}
              </Button>
              <Button type="submit" size='lg' color="primary" className='me-2' onClick={handleTimeIncrease(20)}>
                {T("20")}
              </Button>
              <Button type="submit" size='lg' color="primary" className='me-auto' onClick={handleTimeIncrease(25)}>
                {T("25")}
              </Button>
            </div>
          </ModalBody>

          <ModalFooter>
            <div>
              <Button color="danger" onClick={() => handleConfirm()}>
                Stop
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    )
  }

  return (
    <>
      {draggable ? (
        <div className='time-tracking-draggable mx-auto col-sm-8 col-md-6 col-xl-5'>
          <Draggable handle='.card-body' className='time-tracking-draggable'>
            {renderTerminal()}
          </Draggable>
        </div>
      ) : (
        <>
          {renderTerminal()}
        </>
      )}
    </>
  )
}

export default TerminalCaseTimeTrackingCounter
