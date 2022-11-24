// ** React Imports
import { useEffect } from 'react'

// ** Reactstrap Imports
import {
    Modal,
    ModalBody,
    ListGroup,
    ModalHeader,
    ListGroupItem
} from 'reactstrap'

// Translation
import { useTranslation } from 'react-i18next'

const ModalEmailSortCodes = ({
    open,
    store,
    dispatch,
    toggleModal,
    clearSortCode
}) => {
    // ** Hooks for tanslation
    const { t } = useTranslation()

    const handleReset = () => {
        dispatch(clearSortCode([]))
        toggleModal()
    }

    useEffect(() => {
    }, [])

    return store ? (
        <div className="disabled-backdrop-modal">
            <Modal
                isOpen={open}
                toggle={handleReset}
                className="modal-dialog-centered modal-md"
                backdrop="static"
            >
                <ModalHeader toggle={handleReset}>{t(store.sortCodeType)} {t("Sort codes")}</ModalHeader>
                <ModalBody>
                    <ListGroup flush>
                        {store.sortCodes && store.sortCodes.length ? <>
                            {store.sortCodes.map((sortCode, index) => (
                                <ListGroupItem key={`${sortCode.key}_${index}`} className="d-flex align-items-start px-0">
                                    <div className="d-flex d-inline-block">
                                        <div className="me-1">
                                            <h6 className="mb-25">{sortCode.key}</h6>
                                        </div>
                                        {sortCode.value ? (<>
                                            :<span className="text-wrap ms-1">{sortCode.value}</span>
                                        </>) : null}
                                    </div>
                                </ListGroupItem>
                            ))}
                        </> : null}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
    ) : null
}

export default ModalEmailSortCodes