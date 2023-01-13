/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  caseItem,
  userItem,
  recordItem,
  fighterItem
} from '@constant/reduxConstant'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'
import { TN_CASES } from '@constant/defaultValues'
import { setTotalNumber, getTimeCounter, setTimeCounter } from '@utils'

async function getCaseListRequest(params) {
  return axios.get(`${API_ENDPOINTS.cases.list}`, { params }).then((cases) => cases.data).catch((error) => error)
}

export const getCaseList = createAsyncThunk('appCase/getCaseList', async (params) => {
  try {
    const response = await getCaseListRequest(params)
    if (response && response.flag) {
      if (response.pagination) {
        setTotalNumber(TN_CASES, response.pagination.totalRecord || 0)
      }
      return {
        params,
        caseItems: response.data,
        pagination: response.pagination,
        caseItem: caseItem,
        fighterItem: fighterItem,
        caseDocs: [],
        caseRecords: [],
        timeCaseRecord: [],
        mailCaseRecords: [],
        caseLetters: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        caseItems: [],
        pagination: null,
        caseItem: caseItem,
        fighterItem: fighterItem,
        caseDocs: [],
        caseRecords: [],
        timeCaseRecord: [],
        mailCaseRecords: [],
        caseLetters: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getCaseList catch ", error)
    return {
      params,
      caseItems: [],
      pagination: null,
      caseItem: caseItem,
      fighterItem: fighterItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getCaseViewRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.view}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const getCaseView = createAsyncThunk('appCase/getCaseView', async (id) => {
  try {
    const response = await getCaseViewRequest(id)
    if (response && response.flag) {
      return {
        id,
        recordItem: recordItem,
        caseItem: response.data.case,
        fighterItem: response.data.fighter && response.data.fighter.id ? response.data.fighter : fighterItem,
        typeItems: response.data.caseType,
        laywerItems: response.data.laywers,
        authUserItem: response.data.authUser,
        attachments: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        recordItem: recordItem,
        caseItem: caseItem,
        fighterItem: fighterItem,
        authUserItem: userItem,
        typeItems: [],
        laywerItems: [],
        attachments: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getCaseView catch ", error)
    return {
      id,
      recordItem: recordItem,
      caseItem: caseItem,
      fighterItem: fighterItem,
      authUserItem: userItem,
      typeItems: [],
      laywerItems: [],
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateCaseRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.update}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const updateCase = createAsyncThunk('appCase/updateCase', async (payload, { dispatch, getState }) => {
  try {
    const response = await updateCaseRequest(payload)
    if (response && response.flag) {
      await dispatch(getCaseView(getState().cases.id))
      return {
        actionFlag: "UPDATED_CASE",
        success: "",
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("updateCase catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function closeCaseRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.close}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const closeCase = createAsyncThunk('appCase/closeCase', async (id) => {
  try {
    const response = await closeCaseRequest(id)
    if (response && response.flag) {
      return {
        caseDocs: [],
        attachments: [],
        caseRecords: [],
        timeCaseRecord: [],
        mailCaseRecords: [],
        caseLetters: [],
        typeItems: [],
        laywerItems: [],
        actionFlag: "DELETED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        caseDocs: [],
        attachments: [],
        caseRecords: [],
        timeCaseRecord: [],
        mailCaseRecords: [],
        caseLetters: [],
        typeItems: [],
        laywerItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("closeCase catch ", error)
    return {
      caseDocs: [],
      attachments: [],
      caseRecords: [],
      timeCaseRecord: [],
      mailCaseRecords: [],
      caseLetters: [],
      typeItems: [],
      laywerItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createFighterRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.createFighter}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createFighter = createAsyncThunk('appCase/createFighter', async (payload) => {
  try {
    const response = await createFighterRequest(payload)
    if (response && response.flag) {
      return {
        attachments: [],
        fighterItem: response.data,
        actionFlag: "FIGHTER_ADDED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        attachments: [],
        fighterItem: fighterItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createFighter catch ", error)
    return {
      attachments: [],
      fighterItem: fighterItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

/* Case Records */
async function getNoteCaseRecordsRequest(params) {
  return axios.get(`${API_ENDPOINTS.cases.noteRecords}`, { params }).then((cases) => cases.data).catch((error) => error)
}

export const getNoteCaseRecords = createAsyncThunk('appCase/getNoteCaseRecords', async (params) => {
  try {
    const response = await getNoteCaseRecordsRequest(params)
    if (response && response.flag) {
      return {
        attachments: [],
        caseRecords: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        attachments: [],
        caseRecords: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getNoteCaseRecords catch ", error)
    return {
      attachments: [],
      caseRecords: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createNoteCaseRecordRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.createNoteRecord}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createNoteCaseRecord = createAsyncThunk('appCase/createNoteCaseRecord', async (payload, { dispatch, getState }) => {
  try {
    const response = await createNoteCaseRecordRequest(payload)
    if (response && response.flag) {
      let actionFlag = "NOTE_RECORD_ADDED"
      if (payload && payload.type === "File") {
        actionFlag = "FILE_RECORD_ADDED"
      }
      await dispatch(getNoteCaseRecords({ CaseID: getState().cases.id }))
      return {
        attachments: [],
        actionFlag: actionFlag,
        success: response.message,
        error: ""
      }
    } else {
      return {
        attachments: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createNoteCaseRecord catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createCaseAttachmentRequest(payload) {
  return axios.post(`${API_ENDPOINTS.attachments.create}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createCaseAttachment = createAsyncThunk('appCase/createCaseAttachment', async (payload) => {
  try {
    const response = await createCaseAttachmentRequest(payload)
    if (response && response.flag) {
      return {
        attachments: response.data,
        actionFlag: "ATTACHMENT_ADDED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        attachments: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createCaseAttachment catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteCaseAttachmentRequest(id) {
  return axios.get(`${API_ENDPOINTS.attachments.delete}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const deleteCaseAttachment = createAsyncThunk('appCase/deleteCaseAttachment', async (params) => {
  try {
    const response = await deleteCaseAttachmentRequest(params.id)
    if (response && response.flag) {
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteCaseAttachment catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function shareCaseRecordRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.shareCase}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const shareCaseRecord = createAsyncThunk('appCase/shareCaseRecord', async (id, { dispatch, getState }) => {
  try {
    const response = await shareCaseRecordRequest(id)
    if (response && response.flag) {
      await dispatch(getNoteCaseRecords({ CaseID: getState().cases.id }))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("shareCaseRecord catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Case Records */

/* Case Documents */
async function getCaseDocumentsRequest(params) {
  return axios.get(`${API_ENDPOINTS.cases.documentList}`, { params }).then((cases) => cases.data).catch((error) => error)
}

export const getCaseDocuments = createAsyncThunk('appCase/getCaseDocuments', async (params) => {
  try {
    const response = await getCaseDocumentsRequest(params)
    if (response && response.flag) {
      return {
        attachments: [],
        caseDocs: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        attachments: [],
        caseDocs: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getCaseDocuments catch ", error)
    return {
      attachments: [],
      caseDocs: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createCaseDocumentRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.createDocument}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createCaseDocument = createAsyncThunk('appCase/createCaseDocument', async (payload, { dispatch, getState }) => {
  try {
    const response = await createCaseDocumentRequest(payload)
    if (response && response.flag) {
      await dispatch(getCaseDocuments({ case_id: getState().cases.id }))
      return {
        actionFlag: "DOCUMENT_CREATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createCaseDocument catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateCaseDocumentRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.updateDocument}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const updateCaseDocument = createAsyncThunk('appCase/updateCaseDocument', async (payload, { dispatch, getState }) => {
  try {
    const response = await updateCaseDocumentRequest(payload)
    if (response && response.flag) {
      await dispatch(getCaseDocuments({ case_id: getState().cases.id }))
      return {
        actionFlag: "DOCUMENT_UPDATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateCaseDocument catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function statusCaseDocumentRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.isErledigtDocument}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const statusCaseDocument = createAsyncThunk('appCase/statusCaseDocument', async (id, { dispatch, getState }) => {
  try {
    const response = await statusCaseDocumentRequest(id)
    if (response && response.flag) {
      await dispatch(getCaseDocuments({ case_id: getState().cases.id }))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("statusCaseDocument catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteCaseDocumentRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.deleteDocument}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const deleteCaseDocument = createAsyncThunk('appCase/deleteCaseDocument', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteCaseDocumentRequest(id)
    if (response && response.flag) {
      await dispatch(getCaseDocuments({ case_id: getState().cases.id }))
      return {
        actionFlag: "DOCUMENT_DELETED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteCaseDocument catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Case Documents */

/* Case Letters */
async function getCaseLettersRequest(params) {
  return axios.get(`${API_ENDPOINTS.cases.letterList}`, { params }).then((cases) => cases.data).catch((error) => error)
}

export const getCaseLetters = createAsyncThunk('appCase/getCaseLetters', async (params) => {
  try {
    const response = await getCaseLettersRequest(params)
    if (response && response.flag) {
      return {
        caseLetters: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        caseLetters: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getCaseLetters catch ", error)
    return {
      caseLetters: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createCaseLetterRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.createLetter}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createCaseLetter = createAsyncThunk('appCase/createCaseLetter', async (payload, { dispatch, getState }) => {
  try {
    const response = await createCaseLetterRequest(payload)
    if (response && response.flag) {
      await dispatch(getCaseLetters({ case_id: getState().cases.id }))
      return {
        actionFlag: "LETTER_CREATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("createCaseLetter catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateCaseLetterRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.updateLetter}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const updateCaseLetter = createAsyncThunk('appCase/updateCaseLetter', async (payload, { dispatch, getState }) => {
  try {
    const response = await updateCaseLetterRequest(payload)
    if (response && response.flag) {
      await dispatch(getCaseLetters({ case_id: getState().cases.id }))
      return {
        actionFlag: "LETTER_UPDATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateCaseLetter catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteCaseLetterRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.deleteLetter}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const deleteCaseLetter = createAsyncThunk('appCase/deleteCaseLetter', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteCaseLetterRequest(id)
    if (response && response.flag) {
      await dispatch(getCaseLetters({ case_id: getState().cases.id }))
      return {
        actionFlag: "LETTER_DELETED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteCaseLetter catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function statusCaseLetterRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.isErledigtLetter}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const statusCaseLetter = createAsyncThunk('appCase/statusCaseLetter', async (id, { dispatch, getState }) => {
  try {
    const response = await statusCaseLetterRequest(id)
    if (response && response.flag) {
      await dispatch(getCaseLetters({ case_id: getState().cases.id }))
      return {
        actionFlag: "",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("statusCaseLetter catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* /Case Letters */

/* Case RecordTime */

async function getTimeCaseRecordsRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.getTimeRecord}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const getTimeCaseRecords = createAsyncThunk('appCase/getTimeCase', async (id) => {
  try {
    const response = await getTimeCaseRecordsRequest(id)
    // console.log(response)
    if (response && response.flag) {
      return {
        timeCaseRecord: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        timeCaseRecord: [],
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("gettimecaserecord catch ", error)
    return {
      timeCaseRecord: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createTimeCaseRecordRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.createTimeRecord}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createTimeCaseRecord = createAsyncThunk('appCase/createTimeCaseRecord', async (payload, { dispatch, getState }) => {
  try {
    const response = await createTimeCaseRecordRequest(payload)
    if (response && response.flag) {
      await dispatch(getTimeCaseRecords(getState().cases.id))
      const timeData = getTimeCounter()
      setTimeCounter({
        ...timeData,
        record_id: response.data.RecordID,
        start_time: response.data.start_time
      })
      return {
        attachments: [],
        actionFlag: "TIME_CREATED",
        success: response.message,
        start_time: response.data.start_time,
        record_id: response.data.RecordID,
        error: ""
      }
    } else {
      return {
        attachments: [],
        actionFlag: "",
        success: "",
        start_time: null,
        record_id: null,
        error: response.message
      }
    }
  } catch (error) {
    console.log("createTimeCaseRecord catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateTimeCaseRecordRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.updateTimeRecord}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const updateTimeCaseRecord = createAsyncThunk('appCase/updateTimeCaseRecord', async (payload, { dispatch, getState }) => {
  try {
    const response = await updateTimeCaseRecordRequest(payload)
    if (response && response.flag) {
      await dispatch(getTimeCaseRecords(getState().cases.id))
      return {
        attachments: [],
        actionFlag: "TIME_UPDATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        attachments: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateTimeCaseRecord catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteTimeCaseRecordRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.deleteTimeRecord}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const deleteTimeCaseRecord = createAsyncThunk('appCase/deleteTimeCaseRecord', async (payload, { dispatch, getState }) => {
  try {
    const response = await deleteTimeCaseRecordRequest(payload)
    if (response && response.flag) {
      await dispatch(getTimeCaseRecords(getState().cases.id))
      return {
        attachments: [],
        actionFlag: "TIME_DELETED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        attachments: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("deleteTimeCaseRecord catch ", error)
    return {
      attachments: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

/* Case RecordTime */

/* Case SendMail */
async function getCaseRecordRequest(id) {
  return axios.get(`${API_ENDPOINTS.cases.getCaseRecord}/${id}`).then((cases) => cases.data).catch((error) => error)
}

export const getCaseRecord = createAsyncThunk('appCase/getCaseRecord', async (id) => {
  try {
    const response = await getCaseRecordRequest(id)
    // console.log(response)
    if (response && response.status === 'success') {
      return {
        mailCaseRecords: response.data,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        mailCaseRecords: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("getCaseRecord catch ", error)
    return {
      mailCaseRecords: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createCaseEmailSendRequest(payload) {
  return axios.post(`${API_ENDPOINTS.cases.createCaseEmailSend}`, payload).then((cases) => cases.data).catch((error) => error)
}

export const createCaseEmailSend = createAsyncThunk('appCase/createCaseEmailSend', async (payload, { dispatch, getState }) => {
  try {
    const response = await createCaseEmailSendRequest(payload)
    if (response && response.flag) {
      await dispatch(getCaseRecord(getState().cases.id))
      return {
        actionFlag: "CASE_EMAIL_UPDATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("updateTimeCaseRecord catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})
/* Case SendMail */


export const appCaseSlice = createSlice({
  name: 'appCase',
  initialState: {
    params: {},
    caseItems: [],
    pagination: null,
    caseItem: caseItem,
    recordItem: recordItem,
    fighterItem: fighterItem,
    authUserItem: userItem,
    caseDocs: [],
    attachments: [],
    caseRecords: [],
    caseLetters: [],
    timeCaseRecord: [],
    mailCaseRecords: [],
    typeItems: [],
    laywerItems: [],
    selectedItem: null,
    actionFlag: "",
    loading: false,
    start_time: null,
    record_id: null,
    success: "",
    error: "",

    // compose modal 
    composeModal: {
      open: false,
      maximize: false,
      mailTo: "",
      subject: "",
      editorHtmlContent: ""
    }
  },
  reducers: {
    updateCaseLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearCaseMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    },

    updateSelectedDetails: (state, action) => {
      state.selectedItem = action.payload || null
    },

    setStartTime: (state, action) => {
      state.start_time = action.payload || null
    },

    /** Compose related reducers */
    toggleCompose: (state) => {
      state.composeModal.open = !state.composeModal.open
    },

    setComposeMaximize: (state, action) => {
      state.composeModal.maximize = action.payload || false
    },

    setComposeMailTo: (state, action) => {
      state.composeModal.mailTo = action.payload || ""
    },

    setComposeSubject: (state, action) => {
      state.composeModal.subject = action.payload || ""
    },

    setComposeEditorHtmlContent: (state, action) => {
      state.composeModal.editorHtmlContent = action.payload || ""
    },

    resetComposeModal: (state) => {
      state.composeModal.open = false
      state.composeModal.maximize = false
      state.composeModal.mailTo = ""
      state.composeModal.subject = ""
      state.composeModal.editorHtmlContent = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCaseList.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.caseItems = action.payload.caseItems
        state.pagination = action.payload.pagination
        state.caseItem = action.payload.caseItem
        state.fighterItem = action.payload.fighterItem
        state.caseDocs = action.payload.caseDocs
        state.caseRecords = action.payload.caseRecords
        state.timeCaseRecord = action.payload.timeCaseRecord
        state.mailCaseRecords = action.payload.mailCaseRecords
        state.caseLetters = action.payload.caseLetters
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getCaseView.fulfilled, (state, action) => {
        state.id = action.payload.id
        state.recordItem = action.payload.recordItem
        state.caseItem = action.payload.caseItem
        state.fighterItem = action.payload.fighterItem
        state.authUserItem = action.payload.authUserItem
        state.typeItems = action.payload.typeItems
        state.laywerItems = action.payload.laywerItems
        state.attachments = action.payload.attachments
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(closeCase.fulfilled, (state, action) => {
        state.caseDocs = action.payload.caseDocs
        state.caseRecords = action.payload.caseRecords
        state.timeCaseRecord = action.payload.timeCaseRecord
        state.mailCaseRecords = action.payload.mailCaseRecords
        state.attachments = action.payload.attachments
        state.caseLetters = action.payload.caseLetters
        state.typeItems = action.payload.typeItems
        state.laywerItems = action.payload.laywerItems
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateCase.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createFighter.fulfilled, (state, action) => {
        state.attachments = action.payload.attachments
        state.fighterItem = action.payload.fighterItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* Case Records */
      .addCase(getNoteCaseRecords.fulfilled, (state, action) => {
        state.attachments = action.payload.attachments
        state.caseRecords = action.payload.caseRecords
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createNoteCaseRecord.fulfilled, (state, action) => {
        state.attachments = action.payload.attachments
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createCaseAttachment.fulfilled, (state, action) => {
        state.attachments = action.payload.attachments
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteCaseAttachment.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(shareCaseRecord.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* Case Records */

      /* Case Documents */
      .addCase(getCaseDocuments.fulfilled, (state, action) => {
        state.caseDocs = action.payload.caseDocs
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createCaseDocument.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateCaseDocument.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(statusCaseDocument.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteCaseDocument.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Case Documents */

      /* Case Letters */
      .addCase(getCaseLetters.fulfilled, (state, action) => {
        state.caseLetters = action.payload.caseLetters
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createCaseLetter.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateCaseLetter.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteCaseLetter.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(statusCaseLetter.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* /Case Letters */
      /* Case RecordTime */
      .addCase(getTimeCaseRecords.fulfilled, (state, action) => {
        state.timeCaseRecord = action.payload.timeCaseRecord
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createTimeCaseRecord.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
        state.start_time = action.payload.start_time
        state.record_id = action.payload.record_id
      })
      .addCase(updateTimeCaseRecord.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteTimeCaseRecord.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      /* Case RecordTime */
      /* Case Mail Record */
      .addCase(getCaseRecord.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.mailCaseRecords = action.payload.mailCaseRecords
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(createCaseEmailSend.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
    /* Case Mail Record */
  }
})

export const {
  setStartTime,
  toggleCompose,
  updateCaseLoader,
  clearCaseMessage,
  setComposeMailTo,
  resetComposeModal,
  setComposeSubject,
  setComposeMaximize,
  updateSelectedDetails,
  setComposeEditorHtmlContent
} = appCaseSlice.actions

export default appCaseSlice.reducer
