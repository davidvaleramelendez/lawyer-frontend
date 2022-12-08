/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { updateTimeCaseRecord, deleteTimeCaseRecord } from '../store'

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

// Component
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

// Utils
import { setTimeCounter, getTimeCounter, toTimeString } from '@utils'

// ** Styles
import 'react-circular-progressbar/dist/styles.css'
import '@styles/base/pages/app-invoice.scss'
import { Clock } from 'react-feather'

let myInterval = null

const TerminalCaseTimeTrackingCounter = ({
  open,
  closeTerminal
}) => {
  // ** Hooks for tanslation
  const { t } = useTranslation()

  // ** Store vars
  const [currentTime, setCurrentTime] = useState(getTimeCounter().current_time ?? 0)
  const [status, setStatus] = useState(getTimeCounter().state ?? false)
  const [alarmModal, setAlarmModal] = useState(false)
  const [stopModal, setStopModal] = useState(false)

  const dispatch = useDispatch()
  const start_time = useSelector(state => state.cases.start_time)

  useEffect(() => {
    if (open) {
      setAlarmModal(false)
      setStopModal(false)
      myInterval = setInterval(() => {
        if (stopModal) {
          return prevTime
        }
        setStopModal(prevStop => {
          if (!prevStop) {
            setCurrentTime(prevTime => {
              const timeCounter = getTimeCounter()
              if ((getTimeCounter().interval_time - prevTime) === 5) {
                setAlarmModal(true)
              }
      
              if (prevTime === getTimeCounter().interval_time) {
                clearInterval(myInterval)
                setTimeCounter({
                  ...getTimeCounter(),
                  status: false
                })
              }
    
              if (timeCounter.status && prevTime < timeCounter.interval_time) {
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
      current_time: 0,
      interval_time: currentTime
    })
  }

  const handleSave = async () => {
    const localTime = getTimeCounter()
    dispatch(updateTimeCaseRecord({
      RecordID: localTime.CaseID
    }))
    closeTimer()
    setCurrentTime(0)
    closeTerminal()
  }

  const handleDelete = () => {
    const localTime = getTimeCounter()
    dispatch(deleteTimeCaseRecord({
      RecordID: localTime.CaseID
    }))
    closeTimer()
    setCurrentTime(0)
    closeTerminal()
  }

  return (
    <div className={`${open ? '' : 'd-none'}`}>
      <Card>
        <CardBody>
          <h3>{t("Terminal")}</h3>
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
                <Clock size={16} className="me-1"/> <h5 className='mb-0'>Recorded Time</h5>
              </div>
              <h2 className='mt-2'>{toTimeString(currentTime, 'min')}</h2>
              <div className='mt-5 d-flex'>
                <Clock size={16} className="me-1"/> <h5 className='mb-0'>Started Time</h5>
              </div>
              <h2 className='mt-2'>{`${start_time ?? ''}`}</h2>
            </div>
          </div>

          <Row className="mt-5 mb-1">
            <div className="d-flex justify-content-center">
              {!status && currentTime === getTimeCounter().interval_time ? (
                <>
                  <Button type="submit" size='lg' color="primary" className='me-3' onClick={handleSave}>
                    {t("Save")}
                  </Button>
                  <Button type="submit" size='lg' color="danger" onClick={handleDelete}>
                    {t("Delete")}
                  </Button>
                </>
                ) : (
                <Button type="submit" size='lg' color="danger" onClick={() => setStopModal(true)}>
                  {t("Stop")}
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
          <Button color="danger" onClick={closeTimer}>
            Stop
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default TerminalCaseTimeTrackingCounter
