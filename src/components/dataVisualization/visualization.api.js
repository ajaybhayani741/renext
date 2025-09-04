import { getMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'
import { apiParams } from '../../utils'

const {
  GET_ADDRESS_DATA,
  GET_EQUIPMENT_DATA,
  GET_EQUIPMENT_PIE_CHART_DATA,
  GET_TOTAL_USER_DATA,
  GET_FE_USER_DATA,
  GET_FILTER_USER_DATA,
  GET_SEARCH_FILTER_DATA,
  GET_BUILDING_DETAILS,
  GET_EQUIPMENT_DETAILS,
  GET_BRAND_TOTAL,
} = API_ROUTES

const getAddressApi = async ({ params }) => {
  const response = await getMethod(
    GET_ADDRESS_DATA({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getEquipmentDataApi = async ({ params, pageNo }) => {
  const response = await getMethod(
    GET_EQUIPMENT_DATA({ params: apiParams({ params, pageNo }) }),
  )
  return response?.data
}
const getFEDataApi = async ({ params, pageNo }) => {
  const response = await getMethod(
    GET_FE_USER_DATA({ params: apiParams({ params, pageNo }) }),
  )
  return response?.data
}

const getEquipmentPieChartDataApi = async ({ params }) => {
  const response = await getMethod(
    GET_EQUIPMENT_PIE_CHART_DATA({ params: apiParams({ params }) }),
  )
  return response?.data
}
const getTotalUserDataApi = async ({ params }) => {
  const response = await getMethod(
    GET_TOTAL_USER_DATA({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getTotalBrandDataApi = async ({ params }) => {
  const response = await getMethod(
    GET_BRAND_TOTAL({ params: apiParams({ params }) }),
  )
  return response?.data
}

const getFilterUserDataApi = async ({ userType, pageNo }) => {
  const response = await getMethod(GET_FILTER_USER_DATA({ userType, pageNo }))
  return response?.data
}

const getSearchFilterUserApi = async ({ userType, pageNo, search }) => {
  const response = await getMethod(
    GET_SEARCH_FILTER_DATA({ userType, pageNo, search }),
  )
  return response?.data
}
const getBuildingDetailsApi = async ({ buildingId }) => {
  const response = await getMethod(GET_BUILDING_DETAILS({ buildingId }))
  return response?.data
}

const getEquipmentDetailsApi = async ({ buildingId, equipmentId }) => {
  const response = await getMethod(
    GET_EQUIPMENT_DETAILS({ buildingId, equipmentId }),
  )
  return response?.data
}

export {
  getAddressApi,
  getEquipmentDataApi,
  getEquipmentPieChartDataApi,
  getTotalUserDataApi,
  getFEDataApi,
  getFilterUserDataApi,
  getSearchFilterUserApi,
  getBuildingDetailsApi,
  getEquipmentDetailsApi,
  getTotalBrandDataApi,
}
