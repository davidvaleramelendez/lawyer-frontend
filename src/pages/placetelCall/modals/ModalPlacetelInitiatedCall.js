/* eslint-disable object-shorthand */

// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import {
    Row,
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap'

// ** Translation
import { T } from '@localization'

const ModalPlacetelInitiatedCall = ({
    open,
    toggleModal,
    initiatedCallItem
}) => {
    const handleReset = () => {
        toggleModal()
    }

    useEffect(() => {
    }, [])
    // console.log("initiatedCallItem >>> ", initiatedCallItem)

    return (
        <div className='disabled-backdrop-modal'>
            <Modal
                isOpen={open}
                backdrop="static"
                toggle={handleReset}
                className="modal-dialog-centered modal-md"
            >
                <ModalHeader toggle={handleReset}>{T("Initiated call")} {(initiatedCallItem && initiatedCallItem.from_number) || ""}</ModalHeader>

                <ModalBody className="mb-3">
                    {initiatedCallItem && initiatedCallItem.user && initiatedCallItem.user.id ? (
                        <Fragment>
                            {initiatedCallItem.user.name ? (
                                <Row className="mb-1">
                                    <div className="w-25">
                                        <strong>{T("Name")}: </strong>
                                    </div>
                                    <div className="w-75">
                                        {initiatedCallItem.user.name}
                                    </div>
                                </Row>
                            ) : null}

                            {initiatedCallItem.user.name ? (
                                <Row className="mb-1">
                                    <div className="w-25">
                                        <strong>{T("Email")}: </strong>
                                    </div>
                                    <div className="w-75">
                                        {initiatedCallItem.user.email}
                                    </div>
                                </Row>
                            ) : null}
                        </Fragment>
                    ) : null}

                    {initiatedCallItem && initiatedCallItem.from_number ? (
                        <Row className="mb-1">
                            <div className="w-25">
                                <strong>{T("Number")}: </strong>
                            </div>
                            <div className="w-75">
                                {initiatedCallItem.from_number}
                            </div>
                        </Row>
                    ) : null}

                    {initiatedCallItem && initiatedCallItem.status ? (
                        <Row>
                            <div className="w-25">
                                <strong>{T("Status")}: </strong>
                            </div>
                            <div className="w-75">
                                {initiatedCallItem.status}...
                            </div>
                        </Row>
                    ) : null}
                </ModalBody>
            </Modal>
        </div>
    )
}

export default ModalPlacetelInitiatedCall
