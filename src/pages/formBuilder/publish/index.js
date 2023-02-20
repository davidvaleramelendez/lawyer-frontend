// ** React Import
import { useEffect, useRef, useState } from "react"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { getStepList } from "../store"

// ** Custom Component Import
import Wizard from "@components/wizard"
import StepForm from "./StepForm"
import DotPulse from "@components/dotpulse"

// ** Style Import
import "@styles/base/pages/app-form-builder.scss"

const FormPublish = () => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  // ** Store
  const dispatch = useDispatch()
  const store = useSelector(state => state.formBuilder)

  useEffect(() => {
    dispatch(getStepList())
  }, [])

  const steps = store.stepList.map(item => ({
    id: `step-${item.id}`,
    title: item.name,
    subtitle: item.description,
    content: <StepForm stepDetails={item} stepper={stepper} />
  }))

  return (
    <div className='horizontal-wizard publish-form-wizard'>
      {store.stepList.length > 0 ? (
        <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
      ) : (
        <DotPulse />
      )}
    </div>
  )
}

export default FormPublish