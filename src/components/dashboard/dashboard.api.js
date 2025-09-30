import { getMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'
import { apiParams } from '../../utils'

const {
  GET_COUNTRY_STATE,
  GET_TILES,
  GET_PIE_CHART,
  GET_ERROR_CODE_TABLE,
  GET_BAR_CHART,
  GET_TOTAL_JOBS,
  GET_BUBBLE_CHART,
  DASHBOARD_SHIFT_REPORT,
  DASHBOARD_DISCREPANCIES,
  GET_DRINKING_WATER_BAR_CHART,
  GET_DRINKING_WATER_HOSTELS,
} = API_ROUTES

const getCountryStateApi = async ({ params }) => {
  const response = await getMethod(
    GET_COUNTRY_STATE({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getNumberTilesApi = async ({ params }) => {
  const response = await getMethod(GET_TILES({ params: apiParams({ params }) }))
  return response?.data
}

const getPieChartApi = async ({ params }) => {
  const response = await getMethod(
    GET_PIE_CHART({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getErrorCodeTableApi = async ({ params, pageNo }) => {
  const response = await getMethod(
    GET_ERROR_CODE_TABLE({ params: apiParams({ params, pageNo }) }),
  )
  return response?.data
}

const getBarChartApi = async ({ params, pageNo }) => {
  const response = await getMethod(
    GET_BAR_CHART({ params: apiParams({ params, pageNo }) }),
  )
  return response?.data
}

const getTotalJobsApi = async ({ params }) => {
  const response = await getMethod(
    GET_TOTAL_JOBS({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getBubbleChartApi = async ({ params }) => {
  const response = await getMethod(
    GET_BUBBLE_CHART({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getShiftReportApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_SHIFT_REPORT, { params })
  return response?.data
}

const getDiscrepanciesApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_DISCREPANCIES, { params })
  return response?.data
}

const getDrinkingWaterChartApi = async ({ params }) => {
  const response = await getMethod(GET_DRINKING_WATER_BAR_CHART, { params })
  return response?.data
}

const getDrinkingWaterHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_DRINKING_WATER_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}

export {
  getPieChartApi,
  getBarChartApi,
  getTotalJobsApi,
  getBubbleChartApi,
  getCountryStateApi,
  getNumberTilesApi,
  getErrorCodeTableApi,
  getShiftReportApi,
  getDiscrepanciesApi,
  getDrinkingWaterChartApi,
  getDrinkingWaterHostelsApi,
}
