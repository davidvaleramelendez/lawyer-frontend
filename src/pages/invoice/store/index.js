/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
  paymentMethod,
  TN_INVOICE
} from '@constant/defaultValues'
import {
  userItem,
  invoiceItem,
  invoiceItemItem,
  invoicePaymentItem
} from '@constant/reduxConstant'

// ** Utils
import {
  getTransformDate,
  increaseDaysDateFormat,
  setTotalNumber
} from '@utils'

// ** Api endpoints
import {
  API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getInvoiceListRequest(params) {
  return axios.get(`${API_ENDPOINTS.invoices.list}`, { params }).then((invoice) => invoice.data).catch((error) => error)
}

export const getInvoiceList = createAsyncThunk('appInvoice/getInvoiceList', async (params) => {
  try {
    const response = await getInvoiceListRequest(params)
    if (response && response.flag) {
      if (response.pagination) {
        setTotalNumber(TN_INVOICE, response.pagination.totalRecord || 0)
      }
      return {
        params,
        invoiceItems: response.data,
        pagination: response.pagination,
        invoiceItem: invoiceItem,
        invoicePaymentItem: invoicePaymentItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        invoiceItems: [],
        pagination: null,
        invoiceItem: invoiceItem,
        invoicePaymentItem: invoicePaymentItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getInvoiceList catch ", error)
    return {
      params,
      invoiceItems: [],
      pagination: null,
      invoiceItem: invoiceItem,
      invoicePaymentItem: invoicePaymentItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteInvoiceRequest(id) {
  return axios.get(`${API_ENDPOINTS.invoices.delete}/${id}`).then((invoice) => invoice.data).catch((error) => error)
}

export const deleteInvoice = createAsyncThunk('appInvoice/deleteInvoice', async (id, { dispatch, getState }) => {
  try {
    const response = await deleteInvoiceRequest(id)
    if (response && response.flag) {
      await dispatch(getInvoiceList(getState().invoice.params))
      return {
        actionFlag: "DELETED",
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
    console.log("deleteInvoice catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function invoiceInfoRequest() {
  return axios.get(`${API_ENDPOINTS.invoices.info}`).then((invoice) => invoice.data).catch((error) => error)
}

export const invoiceInfo = createAsyncThunk('appInvoice/invoiceInfo', async (payload) => {
  try {
    const response = await invoiceInfoRequest()
    if (response && response.flag) {
      return {
        invoiceNo: response.data.invoiceNo,
        casesItems: response.data.cases,
        caseTypeItems: response.data.caseTypes,
        customerItems: response.data.customers,
        userItem: response.data.userData,
        invoicePaymentItem: invoicePaymentItem,
        from: payload && payload.from ? payload.from : "",
        actionFlag: "INVOICE_INFO",
        success: "",
        error: ""
      }
    } else {
      return {
        casesItems: [],
        caseTypeItems: [],
        customerItems: [],
        userItem: userItem,
        invoicePaymentItem: invoicePaymentItem,
        from: "",
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("invoiceInfo catch ", error)
    return {
      casesItems: [],
      caseTypeItems: [],
      customerItems: [],
      userItem: userItem,
      invoicePaymentItem: invoicePaymentItem,
      from: "",
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getInvoiceItemRequest(id) {
  return axios.get(`${API_ENDPOINTS.invoices.view}/${id}`).then((invoice) => invoice.data).catch((error) => error)
}

export const getInvoiceItem = createAsyncThunk('appInvoice/getInvoiceItem', async (id) => {
  try {
    const response = await getInvoiceItemRequest(id)
    if (response && response.flag) {
      return {
        id,
        invoiceItem: response.data,
        actionFlag: "EDIT_ITEM",
        success: "",
        error: ""
      }
    } else {
      return {
        id,
        invoiceItem: invoiceItem,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    console.log("getInvoiceItem catch ", error)
    return {
      id,
      invoiceItem: invoiceItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function saveInvoiceItemRequest(payload) {
  return axios.post(`${API_ENDPOINTS.invoices.save}`, payload).then((invoice) => invoice.data).catch((error) => error)
}

export const saveInvoiceItem = createAsyncThunk('appInvoice/saveInvoiceItem', async (payload) => {
  try {
    const response = await saveInvoiceItemRequest(payload)
    if (response && response.flag) {
      return {
        invoiceItem: response.data,
        actionFlag: "CREATED",
        success: response.message,
        error: ""
      }
    } else {
      return {
        invoiceItem: invoiceItem,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    console.log("saveInvoiceItem catch ", error)
    return {
      invoiceItem: invoiceItem,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateInvoiceItemRequest(payload) {
  return axios.post(`${API_ENDPOINTS.invoices.update}`, payload).then((invoice) => invoice.data).catch((error) => error)
}

export const updateInvoiceItem = createAsyncThunk('appInvoice/updateInvoiceItem', async (payload) => {
  try {
    const response = await updateInvoiceItemRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "UPDATED",
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
    console.log("updateInvoiceItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function sendInvoiceItemRequest(payload) {
  return axios.post(`${API_ENDPOINTS.invoices.send}`, payload).then((invoice) => invoice.data).catch((error) => error)
}

export const sendInvoiceItem = createAsyncThunk('appInvoice/sendInvoiceItem', async (payload) => {
  try {
    const response = await sendInvoiceItemRequest(payload)
    if (response && response.flag) {
      return {
        actionFlag: "INVOICE_SENT",
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
    console.log("sendInvoiceItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function payInvoiceItemRequest(payload) {
  return axios.post(`${API_ENDPOINTS.invoices.pay}`, payload).then((invoice) => invoice.data).catch((error) => error)
}

export const payInvoiceItem = createAsyncThunk('appInvoice/payInvoiceItem', async (payload, { dispatch, getState }) => {
  try {
    const response = await payInvoiceItemRequest(payload)
    if (response && response.flag) {
      await dispatch(getInvoiceItem(getState().invoice.id))
      return {
        actionFlag: "PAYMENT_CREATED",
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
    console.log("payInvoiceItem catch ", error)
    return {
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

export const appInvoiceSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    params: {},
    invoiceItems: [],
    invoiceItem: invoiceItem,
    invoiceItemItem: invoiceItemItem,
    invoicePaymentItem: invoicePaymentItem,
    casesItems: [],
    caseTypeItems: [],
    customerItems: [],
    userItem: userItem,
    totalPrice: 0,
    totalVat: 0,
    finalPrice: 0,
    actionFlag: "",
    loading: false,
    success: "",
    error: ""
  },
  reducers: {
    calculateTotalVatPrice: (state, action) => {
      let totalVat = 0
      let totalPrice = 0
      let finalPrice = 0
      if (action && action.payload && action.payload.length) {
        totalVat = action.payload.reduce(function (prev, value) { return prev + parseFloat(value.vat) }, 0)
        totalVat = totalVat ? parseFloat(totalVat).toFixed(2) : 0

        totalPrice = action.payload.reduce(function (prev, value) { return prev + parseFloat(value.price) }, 0)
        totalPrice = totalPrice ? parseFloat(totalPrice).toFixed(2) : 0

        finalPrice = parseFloat(parseFloat(totalPrice) + parseFloat(totalVat)).toFixed(2)
      }
      state.totalVat = totalVat
      state.totalPrice = totalPrice
      state.finalPrice = finalPrice
    },

    resetCalculationVatPrice: (state) => {
      state.totalVat = 0
      state.totalPrice = 0
      state.finalPrice = 0
    },

    updateInvoiceLoader: (state, action) => {
      state.loading = action.payload || false
    },

    clearInvoiceMessage: (state) => {
      state.actionFlag = ""
      state.success = ""
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvoiceList.fulfilled, (state, action) => {
        state.params = action.payload.params
        state.invoiceItems = action.payload.invoiceItems
        state.pagination = action.payload.pagination
        state.invoiceItem = action.payload.invoiceItem
        state.invoicePaymentItem = action.payload.invoicePaymentItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(invoiceInfo.fulfilled, (state, action) => {
        state.casesItems = action.payload.casesItems
        state.caseTypeItems = action.payload.caseTypeItems
        state.customerItems = action.payload.customerItems
        state.userItem = action.payload.userItem
        if (action.payload && action.payload.from === "COPY") {
          if (action.payload && action.payload.invoiceNo) {
            state.invoiceItem.invoice_no = action.payload.invoiceNo
          }
        }

        if (action.payload && action.payload.from === "ADD") {
          if (action.payload && action.payload.invoiceNo) {
            state.invoiceItem.invoice_no = action.payload.invoiceNo
          }
          state.invoiceItem.invoice_date = getTransformDate(new Date(), "YYYY-MM-DD")
          state.invoiceItem.invoice_due_date = increaseDaysDateFormat(5, "YYYY-MM-DD")
          state.invoiceItem.method = paymentMethod[0]
          state.invoiceItem.status = { value: 'open', label: 'Open' }
        }
        state.invoicePaymentItem = action.payload.invoicePaymentItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(getInvoiceItem.fulfilled, (state, action) => {
        state.id = action.payload.id
        state.invoiceItem = action.payload.invoiceItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(saveInvoiceItem.fulfilled, (state, action) => {
        state.invoiceItem = action.payload.invoiceItem
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(updateInvoiceItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(sendInvoiceItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
      .addCase(payInvoiceItem.fulfilled, (state, action) => {
        state.actionFlag = action.payload.actionFlag
        state.loading = true
        state.success = action.payload.success
        state.error = action.payload.error
      })
  }
})

export const {
  calculateTotalVatPrice,
  resetCalculationVatPrice,
  updateInvoiceLoader,
  clearInvoiceMessage
} = appInvoiceSlice.actions

export default appInvoiceSlice.reducer
