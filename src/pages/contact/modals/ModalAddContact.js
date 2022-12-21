// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import {
  addContact,
  updateContactLoader,
  clearContactMessage
} from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
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
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

// Constant
import {
  contactItem
} from '@constant/reduxConstant'

// ** Styles
import '@styles/react/libs/editor/editor.scss'

// ** Translation
import { T } from '@localization'

const ModalAddContact = ({ open, toggleModal }) => {

  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.contact)

  const ContactSchema = yup.object({
    // Name: yup.string().required('Name is required!').matches(/^([a-zA-Z]+ [a-zA-Z]+)$/i, 'Invalid full name!'),
    Name: yup.string().required(T('Name is required!')),
    Email: yup.string().required(T('Email is required!')).email(T('Invalid email address!')),
    PhoneNo: yup.string().required(T('Mobile is required!')).min(6, T("Mobile Must be 6 digit!")).max(16, T("Mobile Must be 16 digit!"))
  }).required()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: { ...contactItem },
    resolver: yupResolver(ContactSchema)
  })

  /* Placeholder texts */
  const PlaceholderSchema = {
    fullname: "John Doe",
    phoneno: "+4915901766553",
    emailAddress: "john.doe@example.com",
    subject: T("Message")
  }

  const [editorHtmlContent, setEditorHtmlContent] = useState("")

  const handleReset = () => {
    reset(contactItem)
    setEditorHtmlContent("")
    toggleModal()
  }

  const handleEditorStateChange = (state) => {
    // console.log("handleEditorStateChange >>>> ", state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }

  useEffect(() => {
    /* For blank message api called inside */
    if (store && (store.success || store.error || store.actionFlag)) {
      dispatch(clearContactMessage())
    }

    /* For reset form data and closing modal */
    if (store && store.actionFlag && store.actionFlag === "ADDED_ITEM") {
      handleReset()
    }
  }, [store.success, store.error, store.actionFlag])

  /* Submitting data */
  const onSubmit = (values) => {
    if (values) {
      const contactData = {
        name: values.Name,
        email: values.Email,
        phone: values.PhoneNo,
        message: editorHtmlContent
      }

      /* Calling api */
      dispatch(updateContactLoader(false))
      dispatch(addContact(contactData))
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
          <DotPulse
            className="d-flex justify-content-center position-absolute top-50 w-100 zindex-1"
          />
        ) : null}

        <ModalHeader
          toggle={handleReset}
          className="bg-transparent"
        />
        <ModalBody className="px-5 pb-5">
          <div className='text-center mb-4'>
            <h1>{T('Add New Contact')}</h1>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className='mb-1'>
              <Label className='form-label' for='Name'>
                {T('Full Name')}
              </Label>
              <Controller
                defaultValue=""
                id='Name'
                name='Name'
                control={control}
                render={({ field }) => <Input {...field} placeholder={PlaceholderSchema && PlaceholderSchema.fullname} invalid={errors.Name && true} />}
              />
              <FormFeedback>{errors.Name?.message}</FormFeedback>
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='PhoneNo'>
                {T("Telephone")}
              </Label>
              <Controller
                defaultValue=""
                id='PhoneNo'
                name='PhoneNo'
                control={control}
                render={({ field }) => <Input {...field} type="number" placeholder={PlaceholderSchema && PlaceholderSchema.phoneno} invalid={errors.PhoneNo && true} />}
              />
              <FormFeedback>{errors.PhoneNo?.message}</FormFeedback>
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='Email'>
                {T("Email")}
              </Label>
              <Controller
                defaultValue=""
                name='Email'
                id='Email'
                control={control}
                render={({ field }) => (
                  <Input {...field} type='email' placeholder={PlaceholderSchema && PlaceholderSchema.emailAddress} invalid={errors.Email && true} />
                )}
              />
              <FormFeedback>{errors.Email?.message}</FormFeedback>
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='Subject'>
                {T("Message")}
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id='Subject'
                name='Subject'
                render={({ field }) => (
                  <Editor
                    {...field}
                    toolbar={{
                      options: ['blockType', 'fontSize', 'inline', 'list', 'textAlign', 'history'],
                      blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
                      },
                      fontSize: {
                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96]
                      },
                      inline: {
                        inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                      }
                    }}
                    onEditorStateChange={handleEditorStateChange}
                    placeholder={PlaceholderSchema && PlaceholderSchema.subject}
                  />
                )}
              />
              <FormFeedback>{errors.Subject?.message}</FormFeedback>
            </div>

            <div className="d-flex justify-content-center mb-2 mt-2">
              <Button
                type="submit"
                className="me-1"
                color="primary"
              >
                {T("Submit")}
              </Button>

              <Button
                outline
                color="secondary"
                onClick={handleReset}
              >
                {T("Cancel")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null
}

export default ModalAddContact
