// ** React Import
import { useCallback, useEffect, useState } from "react"

// ** Redux Import
import { useDispatch, useSelector } from "react-redux"
import { deleteStepItem, getStepList, reorderStepItem, setLoading } from "../store"

// ** Router Import
import { Link, useParams } from "react-router-dom"

// ** Reactstrap Import
import { Button, Card, CardHeader, CardTitle } from "reactstrap"

// ** Custom Component Import
import DatatablePagination from "@components/datatable/DatatablePagination"
import DotPulse from "@components/dotpulse"
import AddStepModal from "./AddStepModal"
import EditStepModal from "./EditStepModal"

// ** Utils Import
import { getTransformDate } from "@utils"

// ** Translation
import { T } from '@localization'

// ** Icon Import
import { ChevronsLeft, CornerLeftUp, CornerRightDown, Edit, ExternalLink, Eye, Plus, Trash } from "react-feather"

// ** Default Values
import { adminRoot } from "@constant/defaultValues"

const placeholderStyle = {
  height: '15px', 
  width: 'auto', 
  borderRadius: '10px', 
  display: 'inline-block', 
  marginTop: 9,
  margiBottom: 1
}

const StepList = () => {

  // ** Store
  const dispatch = useDispatch()
  const store = useSelector(state => state.formBuilder)

  // ** State
  const [modalOpen, setModalOpen] = useState(false)
  const [editStep, setEditStep] = useState(null)

  // ** Hook
  const { formId } = useParams()

  const handleStepList = useCallback((id) => {
    dispatch(setLoading(false))
    dispatch(getStepList(id))
  }, [])

  useEffect(() => {
    handleStepList(formId)
  }, [])

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleDelete = (stepId) => () => {
    dispatch(deleteStepItem(stepId))
  }

  const handleEdit = (step) => () => {
    setEditStep(step)
  }

  const handleReorder = (stepId1, isUp) => () => {
    const rowIndex = store.stepList.findIndex(item => item.id === stepId1)
    let stepId2 = 0
    if (isUp) {
      stepId2 = store.stepList[rowIndex - 1].id
    } else {
      stepId2 = store.stepList[rowIndex + 1].id
    }
    dispatch(reorderStepItem({ id1: stepId1, id2: stepId2 }))
  }

  const columns = [
    {
        name: `${T("No")}`,
        cell: (row, index) => <span>{index + 1}</span>,
        minWidth: "7%",
        maxWidth: "7%",
        /* Custom placeholder vars */
        contentExtraStyles: { ...placeholderStyle, minWidth: '40px' },
        customLoaderCellClass: "",
        customLoaderContentClass: ""
        /* /Custom placeholder vars */
    },
    {
        name: T("Step Title"),
        minWidth: "17%",
        maxWidth: "17%",
        cell: (row) => <span>{row.name}</span>,
        /* Custom placeholder vars */
        contentExtraStyles: { ...placeholderStyle, minWidth: '100px' },
        customLoaderCellClass: "",
        customLoaderContentClass: ""
        /* /Custom placeholder vars */
    },
    {
      name: T("Step Description"),
      minWidth: "23%",
      maxWidth: "23%",
      cell: (row) => <span>{row.description}</span>,
      /* Custom placeholder vars */
      contentExtraStyles: { ...placeholderStyle, minWidth: '150px' },
      customLoaderCellClass: "",
      customLoaderContentClass: ""
      /* /Custom placeholder vars */
    },
    {
        name: T("Created At"),
        minWidth: "18%",
        maxWidth: "18%",
        cell: (row) => row.created_at && getTransformDate(row.created_at, "DD MMM YYYY HH:mm:ss"),
        /* Custom placeholder vars */
        contentExtraStyles: { ...placeholderStyle, minWidth: '150px' },
        customLoaderCellClass: "",
        customLoaderContentClass: ""
        /* /Custom placeholder vars */
    },
    {
      name: T('Priority'),
      minWidth: "15%",
      maxWidth: "15%",
      center: true,
      cell: (row, index) => (
        <div className="column-action d-flex align-items-center">
          {index > 0 && (
            <span className="cursor-pointer" onClick={handleReorder(row.id, true)}>
              <CornerLeftUp size={17} className="mx-1" />
            </span>
          )}
          {index < store.stepList.length - 1 && (
            <span className="cursor-pointer" onClick={handleReorder(row.id, false)}>
              <CornerRightDown size={17} className="mx-1" />
            </span>
          )}
        </div>
      ),
      /* Custom placeholder vars */
      contentExtraStyles: { ...placeholderStyle, minWidth: '90px' },
      customLoaderCellClass: "text-center",
      customLoaderContentClass: ""
      /* /Custom placeholder vars */
    },
    {
      name: T('Action'),
      minWidth: "20%",
      maxWidth: "20%",
      center: true,
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <Link
              to={`${adminRoot}/form-builder/view/${row.id}`}
          >
            <Eye size={17} className="mx-1" />
          </Link>
          <span className="cursor-pointer" onClick={handleEdit(row)}>
            <Edit size={17} className="mx-1" />
          </span>
          <span className="cursor-pointer" onClick={handleDelete(row.id)}>
            <Trash size={17} className="mx-1" />
          </span>
        </div>
      ),
      /* Custom placeholder vars */
      contentExtraStyles: { ...placeholderStyle, minWidth: '90px' },
      customLoaderCellClass: "text-center",
      customLoaderContentClass: ""
      /* /Custom placeholder vars */
    }
  ]

  return (
    <Card>
      <CardHeader className="border-bottom py-75">
        <div className="d-flex align-items-center w-100">
          <CardTitle tag="h4">
            {store.formDetails?.name ? store.formDetails.name : T("Form Details")}
          </CardTitle>
          <div className="ms-auto">
            {/* {store.formDetails?.link && (
              <a
                className='btn btn-outline-primary'
                color='primary'
                href={`/apps/form-builder/publish/${store.formDetails?.link ?? ''}`}
                target='_blank'
              >
                <ExternalLink size={14} /> 
                <span className="align-middle ms-75">Publish</span>
              </a>
            )} */}
            <Button.Ripple color="primary" outline className="ms-2" onClick={handleOpenModal}>
              <Plus size={14} />
              <span className="align-middle ms-75">New Step</span>
            </Button.Ripple>
            <Link
              className='btn btn-outline-primary ms-2'
              color='primary'
              to='/apps/form-builder'
            >
              <ChevronsLeft size={14} /> Back
            </Link>
          </div>
        </div>
      </CardHeader>
        {store.loading ? (
          <DatatablePagination
            customClass="react-dataTable"
            columns={columns}
            data={store.stepList}
            pagination={{
              startIndex: 1,
              endIndex: store.stepList.length,
              totalPages: 1,
              totalRecord: store.stepList.length
            }}
          />
        ) : (
          <DotPulse />
        )}
        <AddStepModal 
          modalOpen={modalOpen} 
          setModalOpen={setModalOpen} 
        />
        <EditStepModal
          item={editStep}
          setEditStep={setEditStep}
        />
    </Card>
  )
}

export default StepList