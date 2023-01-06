// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import Select, { components } from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {
  EditorState,
  ContentState,
  convertToRaw
} from 'draft-js'

// ** Icons Import
import {
  X,
  Star
} from 'react-feather'

// ** Reactstrap Imports
import {
  Form,
  Modal,
  Label,
  Input,
  Button,
  ModalBody,
  FormFeedback
} from 'reactstrap'

// ** Utils
import {
  onImageSrcError,
  getTransformDate,
  selectThemeColors,
  capitalizeFirstLetter
} from '@utils'

// Constant
import {
  todoItem
} from '@constant/reduxConstant'

// ** Custom Components
import DotPulse from '@components/dotpulse'

// ** Styles Imports
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

// ** Translation
import { T } from '@localization'

// ** Modal Header
const ModalHeader = (props) => {
  // ** Props
  const {
    dispatch,
    todoItem,
    children,
    important,
    setImportant,
    handleTaskSidebar,
    importantTodoItem,
    onCheckUserPermission
  } = props

  const handleImportant = () => {
    setImportant(!important)
    if (todoItem && todoItem.id) {
      dispatch(importantTodoItem(todoItem.id))
    }
  }

  return (
    <div className='modal-header d-flex align-items-center justify-content-between mb-1'>
      <h5 className='modal-title'>{children}</h5>
      <div className='todo-item-action d-flex align-items-center'>
        {onCheckUserPermission(13) ? (
          <span className='todo-item-favorite cursor-pointer mx-75'>
            <Star
              size={16}
              onClick={() => handleImportant()}
              className={classnames({
                'text-warning': important === true
              })}
            />
          </span>
        ) : null}
        <X className='fw-normal mt-25 cursor-pointer' size={16} onClick={handleTaskSidebar} />
      </div>
    </div>
  )
}

const TaskSidebar = (props) => {
  // ** Props
  const {
    open,
    store,
    MySwal,
    folder,
    userId,
    dispatch,
    userOptions,
    getTaskItem,
    trashTodoItem,
    createUpdateTodo,
    updateTaskLoader,
    completeTodoItem,
    importantTodoItem,
    handleTaskSidebar,
    onCheckUserPermission
  } = props

  // ** State Constant
  const [important, setImportant] = useState(false)
  const [editorHtmlContent, setEditorHtmlContent] = useState("")
  const [editorStateContent, setEditorStateContent] = useState(null)

  const ValidationSchema = {
    title: {
      placeholder: T("Title"),
      required: T("Title is required!")
    },
    assigneeId: {
      placeholder: `${T('Select Assignee')}...`,
      required: T(`Assignee is required!`)
    },
    due_date: {
      placeholder: "YYYY-MM-DD",
      required: T("Due date is required!")
    },
    tagId: {
      placeholder: `${T('Select Tag')}...`,
      required: T(`Tag is required!`)
    },
    description: {
      placeholder: T("Description"),
      required: false
    }
  }

  // ** States
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'all',
    defaultValues: store.todoItem
  })

  // ** Tag Select Options
  const tagOptions = [
    { value: 'team', label: T('Team') },
    { value: 'low', label: T('Low') },
    { value: 'medium', label: T('Medium') },
    { value: 'high', label: T('High') },
    { value: 'update', label: T('Update') }
  ]

  /* set initial html while edit */
  const getInitialHTML = (value) => {
    const contentBlock = htmlToDraft(value)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorStateContent(editorState)
    }
  }

  // ** Custom Assignee Component
  const AssigneeComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex align-items-center'>
          <img
            className='d-block rounded-circle me-50'
            src={`${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}/${data.img}`}
            height='26'
            width='26'
            alt={data.label}
            onError={(currentTarget) => onImageSrcError(currentTarget)}
          />
          <p className='mb-0'>{data.label}</p>
        </div>
      </components.Option>
    )
  }

  // ** Returns sidebar title
  const handleSidebarTitle = () => {
    if (store && store.todoItem && store.todoItem.id) {
      return (
        <Button
          outline
          size='sm'
          onClick={() => dispatch(completeTodoItem(store.todoItem.id))}
          color={store.todoItem.is_completed === 1 ? 'success' : 'secondary'}
        >
          {store.todoItem.is_completed === 1 ? T('Completed') : T('Mark Complete')}
        </Button>
      )
    } else {
      return T('Add Task')
    }
  }

  // ** Function to run when sidebar opens
  const handleSidebarOpened = () => {
    const { todoItem } = store
    if (todoItem && todoItem.description) {
      getInitialHTML(todoItem.description)
    }

    if (todoItem && todoItem.is_important) {
      setImportant(true)
    }
    reset(todoItem)
  }

  // ** Function to run when sidebar closes
  const handleSidebarClosed = () => {
    reset(todoItem)
    setImportant(false)
    setEditorHtmlContent("")
    setEditorStateContent(null)
    dispatch(getTaskItem(todoItem))
  }

  // ** Function to move task to trash
  const handleTrashTask = () => {
    MySwal.fire({
      title: T('Are you sure?'),
      text: T("You can also revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: T('Yes, delete it!'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.isConfirmed) {
        dispatch(trashTodoItem(store.todoItem.id))
      }
    })
  }

  // ** Renders Footer Buttons
  const renderFooterButtons = () => {
    if (store && store.todoItem && store.todoItem.id) {
      return (
        <Fragment>
          <Button
            color="primary"
            disabled={!store.loading}
            className="update-btn update-todo-item"
          >
            {T('Update')}
          </Button>

          {folder !== 'deleted' ? (
            <Button
              color="danger"
              className="ms-1"
              disabled={!store.loading}
              outline onClick={handleTrashTask}
            >
              {T('Delete')}
            </Button>
          ) : null}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button
            color="primary"
            disabled={!store.loading}
            className="add-todo-item me-1"
          >
            {T('Add Task')}
          </Button>

          <Button
            outline
            color="secondary"
            disabled={!store.loading}
            onClick={handleTaskSidebar}
          >
            {T('Cancel')}
          </Button>
        </Fragment>
      )
    }
  }

  const handleEditorStateChange = (state) => {
    setEditorStateContent(state)
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())))
  }

  const onSubmit = (values) => {
    if (values) {
      const taskData = {
        id: values.id,
        title: values.title,
        user_id: userId || ""
      }

      if (important) {
        taskData.is_important = 1
      }

      if (editorHtmlContent) {
        taskData.description = editorHtmlContent
      }

      if (values.due_date && values.due_date.length) {
        taskData.due_date = getTransformDate(values.due_date[0], "YYYY-MM-DD")
      } else if (values.due_date) {
        taskData.due_date = getTransformDate(values.due_date, "YYYY-MM-DD")
      }

      if (values.assigneeId && values.assigneeId.value) {
        taskData.Assign = values.assigneeId.value
      }

      if (values.tagId && values.tagId.value) {
        taskData.tag = values.tagId.value
      }

      // console.log("onSubmit >>> ", taskData)
      dispatch(updateTaskLoader(false))
      dispatch(createUpdateTodo(taskData))
    }
  }

  return (
    <Modal
      isOpen={open}
      backdrop="static"
      toggle={handleTaskSidebar}
      className='sidebar-lg'
      contentClassName='p-0'
      onOpened={handleSidebarOpened}
      onClosed={handleSidebarClosed}
      modalClassName='modal-slide-in sidebar-todo-modal'
    >
      {!store.loading ? (
        <DotPulse
          className="d-flex justify-content-center position-absolute top-50 w-100 zindex-3"
        />
      ) : null}

      <Form id='form-modal-todo' className='todo-modal' onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ModalHeader
          store={store}
          dispatch={dispatch}
          todoItem={store.todoItem}
          important={important}
          setImportant={setImportant}
          importantTodoItem={importantTodoItem}
          handleTaskSidebar={handleTaskSidebar}
          onCheckUserPermission={onCheckUserPermission}
        >
          {onCheckUserPermission(13) ? (
            handleSidebarTitle()
          ) : null}
        </ModalHeader>

        <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
          <div className='mb-1'>
            <Label className='form-label' for='task-title'>
              {T('Title')} <span className='text-danger'>*</span>
            </Label>
            <Controller
              defaultValue=""
              id='title'
              name='title'
              control={control}
              rules={ValidationSchema.title}
              render={({ field }) => (
                <Input
                  {...field}
                  className='new-todo-item-title'
                  placeholder={ValidationSchema.title && ValidationSchema.title.placeholder}
                  invalid={errors.title && true}
                />
              )}
            />
            {errors.title && <FormFeedback>{errors.title?.message}</FormFeedback>}
          </div>

          <div className='mb-1'>
            <Label className='form-label' for='tagId'>
              {T('Tags')} <span className='text-danger'>*</span>
            </Label>
            <Controller
              defaultValue={store.todoItem && store.todoItem.tag ? { label: capitalizeFirstLetter(store.todoItem.tag), value: store.todoItem.tag } : null}
              name='tagId'
              id='tagId'
              control={control}
              rules={ValidationSchema.tagId}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable={false}
                  name='tagId'
                  placeholder={ValidationSchema.tagId && ValidationSchema.tagId.placeholder}
                  options={tagOptions}
                  theme={selectThemeColors}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    menu: provided => ({ ...provided, zIndex: "9999 !important" })
                  }}
                  menuPosition={'fixed'}
                  menuPortalTarget={document.body}
                  className='react-select'
                  classNamePrefix='select'
                />
              )}
            />
            {errors.tagId && <FormFeedback className="d-block">{errors.tagId?.message}</FormFeedback>}
          </div>

          <div className='mb-1'>
            <Label className='form-label' for='due_date'>
              {T('Due Date')} <span className='text-danger'>*</span>
            </Label>
            <Controller
              defaultValue=""
              id='due_date'
              name='due_date'
              control={control}
              rules={ValidationSchema.due_date}
              render={({ field }) => <Flatpickr
                {...field}
                id='due_date'
                className='form-control'
                placeholder={ValidationSchema.due_date && ValidationSchema.due_date.placeholder}
                options={{
                  enableTime: false,
                  dateFormat: "Y-m-d"
                }}
              />}
            />
            {errors.due_date && <FormFeedback className="d-block">{errors.due_date?.message}</FormFeedback>}
          </div>

          <div className='mb-1'>
            <Label className='form-label' for='assigneeId'>
              {T('Assignee')} <span className='text-danger'>*</span>
            </Label>
            <Controller
              defaultValue={store.todoItem && store.todoItem.assign ? { label: store.todoItem.assign.name, value: store.todoItem.assign.id } : null}
              name='assigneeId'
              id='assigneeId'
              control={control}
              rules={ValidationSchema.assigneeId}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable={false}
                  name='assigneeId'
                  placeholder={ValidationSchema.assigneeId && ValidationSchema.assigneeId.placeholder}
                  options={userOptions}
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  components={{ Option: AssigneeComponent }}
                />
              )}
            />
            {errors.assigneeId && <FormFeedback className="d-block">{errors.assigneeId?.message}</FormFeedback>}
          </div>

          <div className="mb-1">
            <Label for="description" className='form-label'>
              {T('Description')}
            </Label>
            <Controller
              defaultValue=""
              name='description'
              id='description'
              control={control}
              rules={ValidationSchema.description}
              render={({ field }) => <Editor
                {...field}
                toolbar={{
                  options: ['inline', 'textAlign'],
                  inline: {
                    inDropdown: false,
                    options: ['bold', 'italic', 'underline']
                  }
                }}
                editorState={editorStateContent}
                wrapperClassName='toolbar-bottom'
                placeholder={ValidationSchema.description && ValidationSchema.description.placeholder}
                onEditorStateChange={handleEditorStateChange}
              />
              }
            />
            {errors.description && <FormFeedback>{errors.description?.message}</FormFeedback>}
          </div>

          {onCheckUserPermission(13) ? (
            <div>{renderFooterButtons()}</div>
          ) : null}
        </ModalBody>
      </Form>
    </Modal>
  )
}

export default TaskSidebar
