// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Store & Actions
import {
    updateUserLoader,
    createUpdatePlacetelIncomingSip
} from '@src/pages/user/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Form,
    Label,
    Button,
    CardBody,
    FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** React Dropdown Import
import Select from 'react-select'

// ** Translation
import { T } from '@localization'

const PlacetelIncomingVoIP = () => {
    // ** Store vars
    const dispatch = useDispatch()
    const store = useSelector((state) => state.user)

    // ** State
    const [placetelSipUidOption, setPlacetelSipUidOption] = useState([])

    const ApiTokenSchema = yup.object({
        sipuid: yup.object().required(T(`Sip User Id is required!`)).nullable()
    }).required()

    /* Placeholder texts */
    const PlaceholderSchema = {
        sipuid: `${T("Select")}...`
    }

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'all',
        defaultValues: store.placetelIncomingSipItem,
        resolver: yupResolver(ApiTokenSchema)
    })

    const handleReset = () => {
        const placetelIncomingSipItem = { ...store.placetelIncomingSipItem }
        if (placetelIncomingSipItem && placetelIncomingSipItem.response) {
            placetelIncomingSipItem.sipuid = {
                value: placetelIncomingSipItem.response.sipuid || "",
                label: `${(placetelIncomingSipItem.response.name) || ""} (${(placetelIncomingSipItem.response.sipuid) || ""})`,
                response: placetelIncomingSipItem.response
            }
        }
        reset(placetelIncomingSipItem)
    }

    useEffect(() => {
        let list1 = []
        if (store.placetelSipUserIdItems && store.placetelSipUserIdItems.length) {
            list1 = store.placetelSipUserIdItems
            .filter(item => !store.notAllowedIncomingItems.includes(item.sipuid))
            .map(placetelUid => {
                return {
                    value: placetelUid.sipuid,
                    label: `${placetelUid.name} (${placetelUid.sipuid})`,
                    response: placetelUid
                }
            })
        }
        setPlacetelSipUidOption(list1)

        /* Reset form data */
        if (store && store.actionFlag && (store.actionFlag === "PLACETEL_INCOMING_SIP_USERID_DETAIL")) {
            handleReset()
        }
    }, [store.actionFlag, store.placetelSipUserIdItems, store.notAllowedIncomingItems])

    /* Submitting placetel api sipuid data */
    const onSubmit = (values) => {
        if (values) {
            const placetelData = {
                id: values.id
            }

            if (values.sipuid && values.sipuid.value) {
                placetelData.sipuid = values.sipuid.value
                placetelData.response = values.sipuid.response
            }

            dispatch(updateUserLoader(false))
            dispatch(createUpdatePlacetelIncomingSip(placetelData))
        }
    }
    /* /Submitting placetel api sipuid data */

    return (
        <Fragment>
            <Card>
                <CardBody className="pt-1">
                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Row>
                            <Col sm={6} className="mb-1">
                                <Label className="form-label" for="sipuid">
                                    {T("Sip User Id")}
                                </Label>
                                <Controller
                                    defaultValue={null}
                                    name="sipuid"
                                    id="sipuid"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="sipuid"
                                            placeholder={PlaceholderSchema && PlaceholderSchema.sipuid}
                                            options={placetelSipUidOption}
                                            className="react-select"
                                            classNamePrefix="select"
                                            isClearable={false}
                                        />
                                    )}
                                />
                                <FormFeedback className="d-block">{errors.sipuid?.message}</FormFeedback>
                            </Col>
                        </Row>

                        <div className="d-flex flex-wrap mb-2 mt-2">
                            <Button
                                type="submit"
                                className="me-1"
                                color="primary"
                                disabled={!store.loading}
                            >
                                {T("Save Change")}
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default PlacetelIncomingVoIP
