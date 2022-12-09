/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import {
  Row,
  Modal,
  Button,
  ModalBody,
  ModalHeader
} from 'reactstrap'
import { CircularProgressbar } from 'react-circular-progressbar'

// Notification
import Notification from '@components/toast/notification'


// API
import { createTimeCaseRecord } from '../store'


// ** Styles
import 'react-circular-progressbar/dist/styles.css'
import '@styles/base/pages/app-invoice.scss'
import { setTimeCounter, getTimeCounter } from '../../../utility/Utils'

// ** Translation
import { T } from '@localization'

let myInterval = null

const ModalCaseTimeTrackingCounter = ({
  open,
  toggleModal
}) => {

  // ** Store vars
  const [currentTime, setCurrentTime] = useState(getTimeCounter().current_time ?? 0)
  const [status, setStatus] = useState(getTimeCounter().state ?? false)
  const [alarm, setAlarm] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (alarm) {
      setAlarm(false)
      Notification(T("Warning"), T("Time counter will be expired soon"), "warning")
    }
  }, [alarm])

  useEffect(() => {
    if (open) {
      myInterval = setInterval(() => {
        setAlarm(false)
        setCurrentTime(prevTime => {
          const timeCounter = getTimeCounter()

          if ((getTimeCounter().interval_time - prevTime) === 5) {
            setAlarm(true)
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
      }, 1000)
    }
  }, [open])
  
  const closeTimer = () => {
    const localTime = getTimeCounter()
    setStatus(false)
    clearInterval(myInterval)
    setTimeCounter({
      ...localTime,
      status: false,
      current_time: 0,
      interval_time: currentTime
    })    
  }

  const handleSave = async () => {
    // Call API
    const localTime = getTimeCounter()
    dispatch(createTimeCaseRecord({
      ...localTime,
      status: false,
      interval_time: currentTime,
      current_time: 0,
      IsShare: 0
    }))
    closeTimer()
    setCurrentTime(0)
    toggleModal()
  }

  const handleReset = () => {
    closeTimer()
    setCurrentTime(0)
    toggleModal()
  }

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered modal-md'
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{T("Terminal")}</ModalHeader>
        <ModalBody>
          <Row className='text-center'>
            <div className="d-flex justify-content-center time-tracking">
              <CircularProgressbar value={currentTime * 100 / getTimeCounter().interval_time} text={`${currentTime}s`} />
            </div>
          </Row>

          <Row className="mt-2 mb-2">
            <div className="d-flex justify-content-center">
              {!status && currentTime === getTimeCounter().interval_time ? (
                <>
                  <Button type="submit" color="primary" className='me-3' onClick={handleSave}>
                    {T("Save")}
                  </Button>
                  <Button type="submit" color="danger" onClick={handleReset}>
                    {T("Delete")}
                  </Button>
                </>
                ) : (
                <Button type="submit" color="danger" onClick={closeTimer}>
                  {T("Stop")}
                </Button>
              )}
            </div>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseTimeTrackingCounter
