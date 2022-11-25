/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
    Row,
    Button
} from 'reactstrap'

// ** Store & Actions
import {
    viewEmailTemplate,
    clearEmailTemplateMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import {
    setInnerHtml,
    isUserLoggedIn
} from '@utils'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'
import Notification from '@components/toast/notification'

// Constant
import {
    root,
    adminRoot
} from '@constant/defaultValues'

// ** Styles
import '@styles/react/libs/editor/editor.scss'

const EmailTemplateView = () => {
    // ** Hooks
    const { t } = useTranslation()
    const { id } = useParams()

    // ** States
    const [loadFirst, setLoadFirst] = useState(true)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useSelector((state) => state.emailTemplate)

    const handleReset = async () => {
    }

    useEffect(() => {
        /* if user not logged then navigate */
        if (isUserLoggedIn() === null) {
            navigate(root)
        }

        if (loadFirst) {
            dispatch(viewEmailTemplate(id))
            setLoadFirst(false)
        }

        /* For reset form data */
        if (store && store.actionFlag && store.actionFlag === "EDIT_ITEM") {
            handleReset()
        }

        /* For blank message api called inside */
        if (store && (store.success || store.error || store.actionFlag)) {
            dispatch(clearEmailTemplateMessage())
        }

        /* Succes toast notification */
        if (store && store.success) {
            Notification("Success", store.success, "success")
        }

        /* Error toast notification */
        if (store && store.error) {
            Notification("Error", store.error, "warning")
        }
    }, [dispatch, store.success, store.error, store.actionFlag, loadFirst])
    // console.log("store >>> ", store)

    return store ? (
        <div className="position-relative">

            <div className="position-absolute w-100">
                {!store.loading ? (
                    <Spinner
                        className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
                    />
                ) : null}

                <div className="d-flex justify-content-between p-4">
                    <Button
                        type="button"
                        color="secondary"
                        onClick={() => navigate(`${adminRoot}/email-template`)}
                    >
                        {t("Back")}
                    </Button>

                    <Button
                        type="button"
                        color="primary"
                        onClick={() => navigate(`${adminRoot}/email-template/edit/${id}`)}
                    >
                        {t("Edit")}
                    </Button>
                </div>
            </div>

            {setInnerHtml((store.emailTemplateItem && store.emailTemplateItem.htmlBody) || "")}
        </div>
    ) : null
}

export default EmailTemplateView