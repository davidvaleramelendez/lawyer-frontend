/* eslint-disable object-shorthand */

// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Store & Actions
import { useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Row,
  Form,
  Label,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** React Dropdown Import
import Select from 'react-select'

// ** Constants
import {
  adminRoot
} from '@constant/defaultValues'
import {
  letterItem
} from '@constant/reduxConstant'

// ** Custom Components
import Spinner from '@components/spinner/Simple-grow-spinner'

// ** Translation
import { T } from '@localization'

const ModalCaseLetter = ({
  open,
  caseData,
  toggleModal,
  letterRowData,
  setLetterRowData
}) => {
  // ** Hooks
  const navigate = useNavigate()

  // ** Store vars
  const store = useSelector((state) => state.cases)
  const letterTemStore = useSelector((state) => state.letterTemplate)

  // ** States
  const [letterTemOption, setLetterTemOption] = useState([])

  /* Validation schema */
  const LetterSchema = yup.object({
    letterTemplateId: yup.object().required(T(`Letter Template is required!`)).nullable()
  }).required()
  /* /Validation schema */

  /* Placeholder schema */
  const PlaceholderSchema = {
    letterTemplateId: `Select ${T("Letter Template")}...`
  }
  /* /Placeholder schema */

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: letterRowData,
    resolver: yupResolver(LetterSchema)
  })

  const handleReset = async () => {
    reset(letterItem)
    setLetterRowData(letterItem)
    toggleModal()
  }

  // ** Get contact on mount based on id
  useEffect(() => {
    let list1 = []
    if (letterTemStore && letterTemStore.letterTemplateItems && letterTemStore.letterTemplateItems.length) {
      list1 = letterTemStore.letterTemplateItems.map((item) => {
        return {
          label: item.subject,
          value: item.id
        }
      })
    }
    setLetterTemOption(list1)
  }, [letterTemStore.letterTemplateItems])
  // console.log("store >>> ", store)

  /* Submitting data */
  const onSubmit = async (values) => {
    if (values) {
      if (values.letterTemplateId && values.letterTemplateId.value) {
        navigate(`${adminRoot}/case/letter-template/add/${caseData.CaseID}/${values.letterTemplateId.value}`)
      }
    }
  }

  return store ? (
    <div className='disabled-backdrop-modal'>
      <Modal
        isOpen={open}
        toggle={handleReset}
        className='modal-dialog-centered modal-lg'
        backdrop="static"
      >
        {!store.loading ? (
          <Spinner
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader toggle={handleReset}>{T("Write letter")}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <div className='mb-1'>
                <Label className='form-label' for='letterTemplateId'>
                  {T("Letter Template")}
                </Label>
                <Controller
                  defaultValue={null}
                  id='letterTemplateId'
                  name='letterTemplateId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="letterTemplateId"
                      placeholder={PlaceholderSchema && PlaceholderSchema.letterTemplateId}
                      options={letterTemOption}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable={false}
                    />
                  )}
                />
                <FormFeedback className="d-block">{errors.letterTemplateId?.message}</FormFeedback>
              </div>
            </Row>

            <Row className='mb-2 mt-2'>
              <div className="d-flex justify-content-end">
                <Button
                  type='submit'
                  color="primary"
                  disabled={!store.loading}
                >
                  {T("Write a letter")}
                </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalCaseLetter
