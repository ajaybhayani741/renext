import { getMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'
import { apiParams } from '../../utils'

const {
  DASHBOARD_SHIFT_REPORT,
  DASHBOARD_DISCREPANCIES,
  GET_DRINKING_WATER_BAR_CHART,
  GET_DRINKING_WATER_HOSTELS,
  GET_STAFF_AVAILABILITY_CHART,
  GET_STAFF_AVAILABILITY_HOSTELS,
  GET_AVAILABLE_TOILETS_CHART,
  GET_AVAILABLE_TOILETS_HOSTELS,
  DASHBOARD_PRINCIPAL_AUTHORITY_BAR_CHART,
  DASHBOARD_PRINCIPAL_AUTHORITY_HOSTELS,
  DASHBOARD_RECORD_MAINTENANCE_BAR_CHART,
  DASHBOARD_RECORD_MAINTENANCE_HOSTELS,
  DASHBOARD_WASTE_MANAGEMENT_BAR_CHART,
  DASHBOARD_WASTE_MANAGEMENT_HOSTELS,
  DASHBOARD_TOILETS_SUFFICIENCY_BAR_CHART,
  DASHBOARD_TOILETS_SUFFICIENCY_HOSTELS,
} = API_ROUTES

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

const getStaffAvailabilityChartApi = async ({ params }) => {
  const response = await getMethod(GET_STAFF_AVAILABILITY_CHART, { params })
  return response?.data
}

const getStaffAvailabilityHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_STAFF_AVAILABILITY_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}

const getPrincipalAuthorityBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_PRINCIPAL_AUTHORITY_BAR_CHART, {
    params,
  })
  return response?.data
}

const getAvailableToiletsChartApi = async ({ params }) => {
  const response = await getMethod(GET_AVAILABLE_TOILETS_CHART, { params })
  return response?.data
}

const getAvailableToiletsHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_AVAILABLE_TOILETS_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}

const getPrincipalAuthorityHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_PRINCIPAL_AUTHORITY_HOSTELS({
      params: apiParams({ params, pageNo }),
    }),
  )
  return response?.data
}

const getRecordMaintenanceBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_RECORD_MAINTENANCE_BAR_CHART, {
    params,
  })
  return response?.data
}

const getRecordMaintenanceHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_RECORD_MAINTENANCE_HOSTELS({
      params: apiParams({ params, pageNo }),
    }),
  )
  return response?.data
}

const getWasteManagementBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_WASTE_MANAGEMENT_BAR_CHART, {
    params,
  })
  return response?.data
}

const getWasteManagementHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_WASTE_MANAGEMENT_HOSTELS({
      params: apiParams({ params, pageNo }),
    }),
  )
  return response?.data
}

const getToiletsSufficiencyBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_TOILETS_SUFFICIENCY_BAR_CHART, {
    params,
  })
  return response?.data
}

const getToiletsSufficiencyHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_TOILETS_SUFFICIENCY_HOSTELS({
      params: apiParams({ params, pageNo }),
    }),
  )
  return response?.data
}

export {
  getDiscrepanciesApi,
  getShiftReportApi,
  getPrincipalAuthorityBarChartApi,
  getPrincipalAuthorityHostelsApi,
  getDrinkingWaterChartApi,
  getDrinkingWaterHostelsApi,
  getAvailableToiletsChartApi,
  getAvailableToiletsHostelsApi,
  getStaffAvailabilityChartApi,
  getStaffAvailabilityHostelsApi,
  getRecordMaintenanceBarChartApi,
  getRecordMaintenanceHostelsApi,
  getWasteManagementBarChartApi,
  getWasteManagementHostelsApi,
  getToiletsSufficiencyBarChartApi,
  getToiletsSufficiencyHostelsApi,
}
