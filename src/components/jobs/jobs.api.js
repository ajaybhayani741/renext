import {
  getMethod,
  postMethod,
  patchMethod,
  deleteMethod,
} from '../../api/methods'
import API_ROUTES from '../../api/routes'
import { apiParams } from '../../utils'

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
  QUICK_EDIT,
  GET_GEO_TAG,
  JOB_EDIT_LOG,
  TRIGGER_JOB_REPORT,
  DELETE_USER,
  GENERATE_MASTER_SHEET,
} = API_ROUTES

const getJobListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${JOBS}/${pageNo}`, { params })
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

const addJobPostApi = async ({ payload }) => {
  const response = await postMethod(JOBS, payload)
  return response
}

const updateJobPatchApi = async ({ payload }) => {
  const response = await patchMethod(JOBS, payload)
  return response
}

const removeEquipmentApi = async ({ payload }) => {
  const response = await deleteMethod(JOBS_UPDATE, { data: payload })
  return response?.data
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

const quickEditAPI = async ({ payload }) => {
  const response = await patchMethod(QUICK_EDIT, payload)
  return response
}

const getGeoTagDataApi = async ({ params }) => {
  const response = await getMethod(
    GET_GEO_TAG({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getJobEditLogApi = async ({ params }) => {
  const response = await getMethod(
    JOB_EDIT_LOG({ params: apiParams({ params }) }),
  )
  return response?.data
}

const patchJobEditLogApi = async ({ payload }) => {
  const response = await patchMethod(JOB_EDIT_LOG(), payload)
  return response?.data
}

const triggerJobReportApi = async ({ payload }) => {
  const response = await postMethod(TRIGGER_JOB_REPORT, payload)
  return response?.data
}

const deleteUserApi = async ({ id }) => {
  const response = await deleteMethod(`${DELETE_USER}/${id}`)
  return response?.data
}

const getMasterSheetApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${GENERATE_MASTER_SHEET}/${pageNo}`, {
    params,
  })
  return response?.data
}

const generateMasterSheetApi = async ({ payload }) => {
  const response = await postMethod(GENERATE_MASTER_SHEET, payload)
  return response?.data
}

export {
  getJobListApi,
  searchJobListApi,
  getJobDetailApi,
  getErrorCodeApi,
  addErrorCodeApi,
  editErrorCodeApi,
  addJobPostApi,
  updateJobPatchApi,
  removeEquipmentApi,
  getEquipmentApi,
  searchEquipmentApi,
  getReportApi,
  shareCertificateApi,
  updateReportApi,
  quickEditAPI,
  getGeoTagDataApi,
  getJobEditLogApi,
  patchJobEditLogApi,
  triggerJobReportApi,
  deleteUserApi,
  getMasterSheetApi,
  generateMasterSheetApi,
}
