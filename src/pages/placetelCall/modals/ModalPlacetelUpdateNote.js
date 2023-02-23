/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect } from 'react'

// ** Reactstrap Imports
import {
    Row,
    Form,
    Label,
    Modal,
    Input,
    Button,
    ModalBody,
    ModalHeader,
    FormFeedback
} from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Translation
import { T } from '@localization'

const ModalPlacetelUpdateNote = ({
    open,
    loading,
    dispatch,
    actionFlag,
    toggleModal,
    placetelCallItem,
    updatePlacetelCall,
    setPlacetelCallItem,
    updatePlacetelCallLoader
}) => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: placetelCallItem
    })

    const handleReset = () => {
        toggleModal()
    }

    const handleSidebarOpened = () => {
        const placetelData = { ...placetelCallItem }
        placetelData.note = placetelData.note ?? ""
        reset(placetelData)
    }

    const handleSidebarClosed = () => {
        dispatch(setPlacetelCallItem(null))
    }

    useEffect(() => {
        if (actionFlag && actionFlag === "PLACETEL_CALL_UPDATED") {
            handleReset()
        }
    }, [actionFlag])

    /* Submitting data */
    const onSubmit = async (values) => {
        const placetelData = {
            id: values.id,
            from_number: values.from_number,
            note: values.note
        }
        // console.log("onSubmit >>> ", values, placetelData)
        if (placetelData && placetelData.id) {
            dispatch(updatePlacetelCallLoader(false))
            dispatch(updatePlacetelCall(placetelData))
        }
    }

    return (
        <div className='disabled-backdrop-modal'>
            <Modal
                isOpen={open}
                backdrop="static"
                toggle={handleReset}
                onOpened={handleSidebarOpened}
                onClosed={handleSidebarClosed}
                className="modal-dialog-centered modal-md"
            >
                {!loading ? (
                    <DotPulse
                        className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                    />
                ) : null}

                <ModalHeader toggle={handleReset}>{T("Update Note")}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="mb-1">
                            <Label className="form-label" for="note" />
                            <Controller
                                defaultValue=""
                                name='note'
                                id='note'
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="textarea"
                                        {...field}
                                        invalid={errors.note && true}
                                    />
                                )}
                            />
                            <FormFeedback>{errors.note?.message}</FormFeedback>
                        </div>

                        <Row className="mt-2 mb-2">
                            <div className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={!loading}
                                >
                                    {T("Update")}
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default ModalPlacetelUpdateNote
