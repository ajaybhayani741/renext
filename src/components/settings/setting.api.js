import {
  deleteMethod,
  getMethod,
  patchMethod,
  postMethod,
} from '../../api/methods'
import API_ROUTES from '../../api/routes'
const { SCRATCH_TICKET_BOX } = API_ROUTES

const addBoxApi = async ({ payload }) => {
  const response = await postMethod(SCRATCH_TICKET_BOX, payload)
  return response?.data
}

const updateBoxApi = async ({ payload }) => {
  const response = await patchMethod(SCRATCH_TICKET_BOX, payload)
  return response?.data
}

const getBoxListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${SCRATCH_TICKET_BOX}/${pageNo}`, {
    params,
  })
  return response?.data
}

const deleteBoxApi = async ({ params }) => {
  const response = await deleteMethod(SCRATCH_TICKET_BOX, { params })
  return response?.data
}

const getTubesApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${API_ROUTES.TUBE}/${pageNo}`, { params })
  return response?.data
}

const addTubesApi = async ({ payload }) => {
  const response = await postMethod(API_ROUTES.TUBE, payload)
  return response?.data
}

const updateTubesApi = async ({ payload }) => {
  const response = await patchMethod(API_ROUTES.TUBE, payload)
  return response?.data
}

const deleteTubesApi = async ({ params }) => {
  const response = await deleteMethod(API_ROUTES.TUBE, { params })
  return response?.data
}

export {
  addBoxApi,
  deleteBoxApi,
  getBoxListApi,
  updateBoxApi,
  getTubesApi,
  addTubesApi,
  updateTubesApi,
  deleteTubesApi,
}
