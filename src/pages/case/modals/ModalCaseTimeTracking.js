/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Store & Actions
import { clearCaseMessage } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Col,
  Row,
  Form,
  Input,
  Label,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// Constant
import {
  recordItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

// ** Translation
import { T } from '@localization'

const ModalCaseTimeTracking = ({
  open,
  caseId,
  onRecordSubmit,
  toggleModal
}) => {

  // ** Store vars
  const dispatch = useDispatch()

  const store = useSelector((state) => state.cases)

  const ValidationSchema = {
    subject: {
      placeholder: "Subject",
      required: "Subject is required!"
    },
    interval_time: {
      placeholder: "Time Interval",
      required: "Time is required!"
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: recordItem, mode: 'all' })

  const handleReset = () => {
    reset(recordItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearCaseMessage())
    }
  }, [dispatch, store.success, store.error, store.actionFlag])

  /* Submitting data */
  const onSubmit = async (values) => {
    onRecordSubmit(values, caseId)
    toggleModal()
  }

  return (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
        backdrop="static"
      >
        <ModalHeader toggle={handleReset}>{T("Add Time Tracking")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={12} sm={12} className='mb-1'>
                <Label className='form-label' for='Subject'>
                  {T('Subject')}
                </Label>
                <Controller
                  defaultValue=""
                  id='Subject'
                  name='Subject'
                  control={control}
                  rules={ValidationSchema.subject}
                  render={({ field }) => <Input {...field} placeholder={ValidationSchema.subject && ValidationSchema.subject.placeholder} invalid={errors.Subject && true} />}
                />
                <FormFeedback>{errors.Subject?.message}</FormFeedback>
              </Col>

              <Col md={12} sm={12} className='mb-1'>
                <Label className='form-label' for='interval_time'>
                  {T('Enter the time')}
                </Label>
                <Controller
                  defaultValue=""
                  id='interval_time'
                  name='interval_time'
                  control={control}
                  rules={ValidationSchema.interval_time}
                  render={({ field }) => <Input {...field} type="number" placeholder={ValidationSchema.interval_time && ValidationSchema.interval_time.placeholder} invalid={errors.interval_time && true} />}
                />
                <FormFeedback>{errors.interval_time?.message}</FormFeedback>
              </Col>
            </Row>

            <Row className="mt-2 mb-2">
              <div className="d-flex justify-content-end">
                <Button type="submit" color="primary" className="btn btn-primary">
                  {T("Record")} {T("now")}
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalCaseTimeTracking
