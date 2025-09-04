import { getMethod, patchMethod, postMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const {
  SHIFT_REPORT,
  TRIGGER_REPORT,
  USER_REPORTS,
  GET_COLUMN_LIST,
  SAVE_FLEXIBLE_REPORT,
  GET_SAVE_FLEXIBLE_REPORT,
  GET_SINGLE_REPORT,
  GET_FLEXIBLE_REPORT_CALCULATION,
} = API_ROUTES

const getReportDetailsApi = async ({ params }) => {
  const response = await getMethod(SHIFT_REPORT, {
    params,
  })
  return response?.data
}

const updateReportApi = async ({ payload }) => {
  const response = await patchMethod(SHIFT_REPORT, payload)
  return response?.data
}

const triggerReportApi = async ({ payload }) => {
  const response = await postMethod(TRIGGER_REPORT, payload)
  return response?.data
}

const getExcelReportListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${USER_REPORTS}/${pageNo}`, { params })
  return response?.data
}

const getColumnListApi = async ({ params }) => {
  const response = await getMethod(GET_COLUMN_LIST({ params }))
  return response?.data
}

const exportToExcelApi = async ({ payload }) => {
  const response = await postMethod(TRIGGER_REPORT, payload)
  return response?.data
}

const saveFlexibleReportApi = async ({ payload }) => {
  const response = await postMethod(SAVE_FLEXIBLE_REPORT, payload)
  return response?.data
}

const updateFlexibleReportApi = async ({ payload }) => {
  const response = await patchMethod(SAVE_FLEXIBLE_REPORT, payload)
  return response?.data
}

const getSaveReportListApi = async ({ pageNo = 1, params }) => {
  const response = await getMethod(`${GET_SAVE_FLEXIBLE_REPORT}/${pageNo}`, {
    params,
  })
  return response?.data
}

const getSingleReportApi = async ({ params }) => {
  const response = await getMethod(GET_SINGLE_REPORT, { params })
  return response?.data
}

const getFlexibleReportCalculationApi = async ({ payload }) => {
  const response = await postMethod(GET_FLEXIBLE_REPORT_CALCULATION, payload)
  return response?.data
}

export {
  getReportDetailsApi,
  updateReportApi,
  triggerReportApi,
  getExcelReportListApi,
  getColumnListApi,
  exportToExcelApi,
  saveFlexibleReportApi,
  getSaveReportListApi,
  getSingleReportApi,
  getFlexibleReportCalculationApi,
  updateFlexibleReportApi,
}
