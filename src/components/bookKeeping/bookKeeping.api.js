import {
  deleteMethod,
  getMethod,
  patchMethod,
  postMethod,
} from '../../api/methods'
import API_ROUTES from '../../api/routes'
const {
  SCRATCH_TICKET,
  SCRATCH_TICKET_BOOK,
  SEARCH_SCRATCH_TICKET,
  TOTAL_VALUES,
  BOOK_KEEPING_TUBE,
  MACHINES,
  MACHINE_TICKETS,
  CASHBACK,
  VENDOR_PAYOUT,
  SEARCH_TUBE,
} = API_ROUTES

const updateScratchTicketApi = async ({ payload }) => {
  const response = await postMethod(SCRATCH_TICKET, payload)
  return response?.data
}

const getScratchTicketListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${SCRATCH_TICKET}/${pageNo}`, {
    params,
  })
  return response?.data
}

const searchScratchTicketListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${SEARCH_SCRATCH_TICKET}/${pageNo}`, {
    params,
  })
  return response?.data
}

const getTotalValuesApi = async ({ params }) => {
  const response = await getMethod(TOTAL_VALUES, {
    params,
    hideErrorPopup: true,
  })
  return response?.data
}

const addBookApi = async ({ payload = {}, id }) => {
  const response = await postMethod(`${SCRATCH_TICKET_BOOK}?id=${id}`, payload)
  return response?.data
}

const deleteBookApi = async ({ params }) => {
  const response = await deleteMethod(SCRATCH_TICKET_BOOK, { params })
  return response?.data
}

const updateTubeApi = async ({ payload }) => {
  const response = await postMethod(BOOK_KEEPING_TUBE, payload)
  return response?.data
}

const getTubeListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${BOOK_KEEPING_TUBE}/${pageNo}`, {
    params,
  })
  return response?.data
}

const searchTubeListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${SEARCH_TUBE}/${pageNo}`, {
    params,
  })
  return response?.data
}

const getMachineListApi = async ({ params }) => {
  const response = await getMethod(MACHINES, {
    params,
  })
  return response?.data
}

const getMachineTicketListApi = async ({ params }) => {
  const response = await getMethod(MACHINE_TICKETS, {
    params,
  })
  return response?.data
}

const addMachineTicketApi = async ({ payload = {} }) => {
  const response = await postMethod(MACHINE_TICKETS, payload)
  return response?.data
}

const updateMachineTicketApi = async ({ payload = {} }) => {
  const response = await patchMethod(MACHINE_TICKETS, payload)
  return response?.data
}

const deleteMachineTicketApi = async ({ params }) => {
  const response = await deleteMethod(MACHINE_TICKETS, { params })
  return response?.data
}

const getCashBackListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${CASHBACK}/${pageNo}`, {
    params,
  })
  return response?.data
}

const addCashBackApi = async ({ payload = {} }) => {
  const response = await postMethod(CASHBACK, payload)
  return response?.data
}

const updateCashBackApi = async ({ payload = {} }) => {
  const response = await patchMethod(CASHBACK, payload)
  return response?.data
}

const deleteCashBackApi = async ({ params }) => {
  const response = await deleteMethod(CASHBACK, { params })
  return response?.data
}

const getVendorPayoutListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${VENDOR_PAYOUT}/${pageNo}`, {
    params,
  })
  return response?.data
}

const addVendorPayoutApi = async ({ payload = {} }) => {
  const response = await postMethod(VENDOR_PAYOUT, payload)
  return response?.data
}

const updateVendorPayoutApi = async ({ payload = {} }) => {
  const response = await patchMethod(VENDOR_PAYOUT, payload)
  return response?.data
}

const deleteVendorPayoutApi = async ({ params }) => {
  const response = await deleteMethod(VENDOR_PAYOUT, { params })
  return response?.data
}

export {
  updateScratchTicketApi,
  getScratchTicketListApi,
  addBookApi,
  deleteBookApi,
  searchScratchTicketListApi,
  getTotalValuesApi,
  updateTubeApi,
  getTubeListApi,
  searchTubeListApi,
  getMachineListApi,
  getMachineTicketListApi,
  addMachineTicketApi,
  updateMachineTicketApi,
  deleteMachineTicketApi,
  getCashBackListApi,
  addCashBackApi,
  updateCashBackApi,
  deleteCashBackApi,
  getVendorPayoutListApi,
  addVendorPayoutApi,
  updateVendorPayoutApi,
  deleteVendorPayoutApi,
}
