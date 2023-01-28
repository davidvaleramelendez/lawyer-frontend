// ** React Imports
import { useEffect } from 'react'

// ** Reactstrap Imports
import {
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
import * as yup from "yup"
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store & Actions
import {
    createVoiceRecordItem
} from '@src/pages/voiceRecording/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Constant
import {
    voiceRecordingItem
} from '@constant/reduxConstant'

// ** Translation
import { T } from '@localization'

const ModalCaseVoiceRecording = ({
    open,
    caseId,
    toggleModal,
    setVoiceRecorderTerminalOpen
}) => {
    // ** Hooks
    const dispatch = useDispatch()

    // ** Store vars
    const store = useSelector((state) => state.voiceRecording)

    const PlaceholderSchema = {
        subject: "Subject"
    }

    /* Validation schema */
    const VoiceRecordSchema = yup.object({
        subject: yup.string().required('Subject is required!')
    }).required()
    /* /Validation schema */

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: voiceRecordingItem,
        resolver: yupResolver(VoiceRecordSchema)
    })

    const handleReset = () => {
        reset(voiceRecordingItem)
        toggleModal()
    }

    // ** Get mount
    useEffect(() => {
        if (store && store.actionFlag && (store.actionFlag === "RECORD_STATE_CREATED")) {
            setVoiceRecorderTerminalOpen(true)
            handleReset()
        }
    }, [store.actionFlag])
    // console.log("voiceRecordingStore >>> ", voiceRecordingStore)

    /* Submitting data */
    const onSubmit = async (values) => {
        if (values) {
            dispatch(createVoiceRecordItem({ data: { ...values, case_id: caseId }, message: "RECORD_STATE_CREATED" }))
        }
    }

    return (
        <div className='disabled-backdrop-modal'>
            <Modal
                isOpen={open}
                backdrop="static"
                toggle={handleReset}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader toggle={handleReset}>{T("Voice Recording")}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Row>
                            <div className='mb-1'>
                                <Label className='form-label' for='subject'>
                                    {T("Subject")}
                                </Label>
                                <Controller
                                    defaultValue=""
                                    id='subject'
                                    name='subject'
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.subject} invalid={errors.subject && true} />}
                                />
                                <FormFeedback>{errors.subject?.message}</FormFeedback>
                            </div>
                        </Row>

                        <Row className="mt-2 mb-2">
                            <div className="d-flex justify-content-end">
                                <Button type="submit" color="primary" className="btn btn-primary">
                                    {T("Save")}
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default ModalCaseVoiceRecording