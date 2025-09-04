import { getMethod, postMethod, patchMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const {
  JOBS,
  SEARCH_JOB_LIST,
  GET_ERROR_CODE,
  JOBS_UPDATE,
  GET_EQUIPMENT,
  SEARCH_EQUIPMENT,
  ADD_ERROR_CODE,
  GET_REPORT,
  SHARE_REPORT,
  UPDATE_REPORT,
} = API_ROUTES

const getJobListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${JOBS}/${pageNo}`, { params })
  return response?.data
}

const postJobApi = async ({ payload }) => {
  const response = await postMethod(JOBS, payload)
  return response?.data
}

const searchJobListApi = async ({ params, pageNo }) => {
  const response = await getMethod(`${SEARCH_JOB_LIST}/${pageNo}`, { params })
  return response?.data
}

const getErrorCodeApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_ERROR_CODE({ pageNo, params }))
  return response?.data
}

const addErrorCodeApi = async ({ payload }) => {
  const response = await postMethod(ADD_ERROR_CODE, payload)
  return response?.data
}

const editErrorCodeApi = async ({ payload }) => {
  const response = await patchMethod(ADD_ERROR_CODE, payload)
  return response?.data
}

const getJobDetailApi = async ({ params }) => {
  const response = await getMethod(JOBS, { params })
  return response?.data
}

const repairJobApi = async ({ payload }) => {
  const response = await postMethod(JOBS_UPDATE, payload)
  return response
}
const repairJobPatchApi = async ({ payload }) => {
  const response = await patchMethod(JOBS_UPDATE, payload)
  return response
}

const getEquipmentApi = async ({ params }) => {
  const response = await getMethod(GET_EQUIPMENT({ params }))
  return response?.data
}

const searchEquipmentApi = async ({ params }) => {
  const response = await getMethod(SEARCH_EQUIPMENT({ params }))
  return response?.data
}

const getReportApi = async ({ jobId, jobType }) => {
  const response = await getMethod(GET_REPORT({ jobId, jobType }))
  return response?.data
}

const shareCertificateApi = async ({ payload }) => {
  const response = await postMethod(SHARE_REPORT, payload)
  return response
}

const updateReportApi = async ({ payload }) => {
  const response = await postMethod(UPDATE_REPORT, payload)
  return response?.data
}

export {
  getJobListApi,
  postJobApi,
  searchJobListApi,
  getJobDetailApi,
  getErrorCodeApi,
  addErrorCodeApi,
  editErrorCodeApi,
  repairJobApi,
  repairJobPatchApi,
  getEquipmentApi,
  searchEquipmentApi,
  getReportApi,
  shareCertificateApi,
  updateReportApi,
}
