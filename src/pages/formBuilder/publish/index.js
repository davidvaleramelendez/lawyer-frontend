// ** React Import
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { getStepListByLink, setLoading } from "../store"

// ** Custom Component Import
import Wizard from "@components/wizard"
import StepForm from "./StepForm"
import DotPulse from "@components/dotpulse"

// ** Style Import
import "@styles/base/pages/app-form-builder.scss"
import { Card, CardBody, CardHeader } from "reactstrap"

const FormPublish = ({status}) => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  // ** Store
  const dispatch = useDispatch()
  const store = useSelector(state => state.formBuilder)
  const userId = useSelector(state => state.auth.userItem.id)

  // ** Route
  const {formLink} = useParams()

  useEffect(() => {
    dispatch(setLoading(false))
    dispatch(getStepListByLink(formLink))
  }, [])

  const steps = store.stepList.map(item => ({
    id: `step-${item.id}`,
    title: item.name,
    subtitle: item.description,
    content: <StepForm stepDetails={item} stepper={stepper} />
  }))

  return (
    <div className={status ? 'm-5' : 'm-0'}>
      <div className={'horizontal-wizard publish-form-wizard'}>
        {!store.loading ? (
          <DotPulse />
        ) : !store.formDetails.is_published ? (
          <Card>
            <CardHeader className="border-bottom">Forbidden</CardHeader>
            <CardBody>
              <div className="p-3">
                This form is not published yet.
                Please contact with support team.
              </div>
            </CardBody>
          </Card>
        ) : (status && !store.formDetails.type && !userId) ? (
          <Card>
            <CardHeader className="border-bottom">Forbidden</CardHeader>
            <CardBody>
              <div className="p-3">
                You have no access to this form.
                Please log in and try again
              </div>
            </CardBody>
          </Card>
        ) : (
          <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />  
        )}
      </div>
    </div>
  )
}

export default FormPublish