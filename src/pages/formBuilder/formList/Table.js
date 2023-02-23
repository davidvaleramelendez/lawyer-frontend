// ** React Import
import { useCallback, useEffect, useState } from "react"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { deleteForm, getFormList, publishForm, setLoading } from "../store"

// ** Router Import
import { Link } from "react-router-dom"

// ** Reactstrap Import
import { Badge, Button, Card, CardHeader, CardTitle } from "reactstrap"

// ** Custom Component Import
import DatatablePagination from "@components/datatable/DatatablePagination"
import DotPulse from "@components/dotpulse"
import AddFormModal from "./AddFormModal"
import EditFormModal from "./EditFormModal"

// ** Translation
import { T } from '@localization'

// ** Icon Import
import { Edit, ExternalLink, Eye, Plus, Trash } from "react-feather"

// ** Default Values
import { adminRoot } from "@constant/defaultValues"

const FormBuilderTable = () => {

  // ** Store
  const dispatch = useDispatch()
  const store = useSelector(state => state.formBuilder)

  // ** State
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  // ** Hook
  const handleFormList = useCallback(() => {
    dispatch(setLoading(false))
    dispatch(getFormList())
  }, [])

  useEffect(() => {
    handleFormList()
  }, [])

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleDelete = (formId) => () => {
    dispatch(deleteForm(formId))
  }

  const handleEdit = (item) => () => {
    setEditItem(item)
  }

  const handlePublish = (formId, status) => () => {
    dispatch(publishForm({
      id: formId,
      status
    }))
  }

  const columns = [
    {
        name: `${T("No")}`,
        minWidth: "10%",
        maxWidth: "10%",
        cell: (row, index) => <span>{index + 1}</span>
    },
    {
        name: T("Title"),
        minWidth: "15%",
        maxWidth: "15%",
        cell: (row) => <span>{row.name}</span>
    },
    {
      name: T("Description"),
      minWidth: "20%",
      maxWidth: "20%",
      cell: (row) => <span>{row.description}</span>
    },
    {
      name: T('Link'),
      minWidth: "15%",
      maxWidth: "15%",
      cell: (row) => (row.is_published ? (
        <a
          href={row.type ? `/form/${row.link}` : `${adminRoot}/form-builder/publish/${row.link}`}
          target="_blank"
        >
          {row.link}
        </a>
      ) : (
        <span>{row.link}</span>
      ))
    },
    {
      name: T("Status"),
      minWidth: "10%",
      maxWidth: "10%",
      cell: (row) => (
        <div onClick={handlePublish(row.id, !row.is_published)} className="cursor-pointer">
          {row.is_published ? (
            <Badge color='success'>
              Published
            </Badge>
          ) : (
            <Badge color='secondary'>
              Not Published
            </Badge>
          )}
        </div>
      )
    },
    {
      name: T("Type"),
      minWidth: "10%",
      maxWidth: "10%",
      cell: (row) => (
        <Badge color={row.type ? 'primary' : 'secondary'}>
          {row.type ? 'Public' : 'Private'}
        </Badge>
      )
    },
    {
      name: T('Action'),
      minWidth: "20%",
      maxWidth: "20%",
      center: true,
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <Link
            to={`${adminRoot}/form-builder/steps/${row.id}`}
          >
            <Eye size={17} className="mx-1" />
          </Link>
          {/* <a
            href={`${adminRoot}/form-builder/publish/${row.link}`}
            target="_blank"
          >
            <ExternalLink size={17} className="mx-1" />
          </a> */}
          <span className="cursor-pointer" onClick={handleEdit(row)}>
            <Edit size={17} className="mx-1" />
          </span>
          <span className="cursor-pointer" onClick={handleDelete(row.id)}>
            <Trash size={17} className="mx-1" />
          </span>
        </div>
      )
    }
  ]

  return (
    <Card>
      <CardHeader className="border-bottom py-75">
        <div className="d-flex align-items-center w-100">
          <CardTitle tag="h4">{T("Form List")}</CardTitle>
          <div className="ms-auto">
            <Button.Ripple color="primary" outline className="ms-75" onClick={handleOpenModal}>
              <Plus size={14} />
              <span className="align-middle ms-75">New Form</span>
            </Button.Ripple>
          </div>
        </div>
      </CardHeader>
        {store.loading ? (
          <DatatablePagination
            customClass="react-dataTable"
            columns={columns}
            data={store.formList}
            pagination={{
              startIndex: 1,
              endIndex: store.formList.length,
              totalPages: 1,
              totalRecord: store.formList.length
            }}
          />
        ) : (
          <DotPulse />
        )}
        <AddFormModal 
          modalOpen={modalOpen} 
          setModalOpen={setModalOpen} 
        />
        <EditFormModal
          item={editItem}
          setEditItem={setEditItem}
        />
    </Card>
  )
}

export default FormBuilderTable