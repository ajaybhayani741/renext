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
  DASHBOARD_LOCATION_BEDS_MATTRESSES_BAR_CHART,
  DASHBOARD_LOCATION_BEDS_MATTRESSES_HOSTELS,
  DASHBOARD_MEDICAL_CARE_BAR_CHART,
  DASHBOARD_MEDICAL_CARE_HOSTELS,
  DASHBOARD_EDUCATION_FACILITIES_BAR_CHART,
  DASHBOARD_EDUCATION_FACILITIES_HOSTELS,
  DASHBOARD_FOOD_PROVISIONS_BAR_CHART,
  DASHBOARD_FOOD_PROVISIONS_HOSTELS,
  DASHBOARD_PRECAUTIONARY_MEASURES_BAR_CHART,
  DASHBOARD_PRECAUTIONARY_MEASURES_HOSTELS,
  DASHBOARD_ANIMAL_THREAT_BAR_CHART,
  DASHBOARD_ANIMAL_THREAT_HOSTELS,
  DASHBOARD_CONDUCTION_MEETINGS_BAR_CHART,
  DASHBOARD_CONDUCTION_MEETINGS_HOSTELS,
  DASHBOARD_COOKING_FUEL_BAR_CHART,
  DASHBOARD_COOKING_FUEL_HOSTELS,
  GET_FUNCTIONING_TOILETS_CHART,
  GET_FUNCTIONING_TOILETS_HOSTELS,
  GET_HOSTEL_STUDENT_CHART,
  GET_HOSTEL_STUDENT_HOSTELS,
  GET_WORKERS_CHART,
  GET_WORKERS_HOSTELS,
  GET_COOKS_CHART,
  GET_COOKS_HOSTELS,
  GET_KAMATI_CHART,
  GET_KAMATI_HOSTELS,
  GET_WATCHMAN_CHART,
  GET_WATCHMAN_HOSTELS,
  GET_AVAILABLE_SCAVENGERS_CHART,
  GET_AVAILABLE_SCAVENGERS_HOSTELS,
  GET_REQUIRED_SCAVENGERS_CHART,
  GET_REQUIRED_SCAVENGERS_HOSTELS,
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

const getLocationBedsMattressesBarChartApi = async ({ params }) => {
  const response = await getMethod(
    DASHBOARD_LOCATION_BEDS_MATTRESSES_BAR_CHART,
    {
      params,
    },
  )
  return response?.data
}

const getFunctioningToiletsChartApi = async ({ params }) => {
  const response = await getMethod(GET_FUNCTIONING_TOILETS_CHART, { params })
  return response?.data
}

const getFunctioningToiletsHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(
    GET_FUNCTIONING_TOILETS_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getLocationBedsMattressesHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_LOCATION_BEDS_MATTRESSES_HOSTELS({
      params: apiParams({ params, pageNo }),
    }),
  )
  return response?.data
}

const getMedicalCareBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_MEDICAL_CARE_BAR_CHART, {
    params,
  })
  return response?.data
}

const getMedicalCareHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(DASHBOARD_MEDICAL_CARE_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}

const getEducationFacilitiesBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_EDUCATION_FACILITIES_BAR_CHART, {
    params,
  })
  return response?.data
}

const getEducationFacilitiesHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_EDUCATION_FACILITIES_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getHostelStudentsChartApi = async ({ params }) => {
  const response = await getMethod(GET_HOSTEL_STUDENT_CHART, { params })
  return response?.data
}

const getStudentsHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_HOSTEL_STUDENT_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}
const getWorkersChartApi = async ({ params }) => {
  const response = await getMethod(GET_WORKERS_CHART, { params })
  return response?.data
}
const getWorkersHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_WORKERS_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}
const getCooksChartApi = async ({ params }) => {
  const response = await getMethod(GET_COOKS_CHART, { params })
  return response?.data
}
const getCooksHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_COOKS_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}
const getKamatiChartApi = async ({ params }) => {
  const response = await getMethod(GET_KAMATI_CHART, { params })
  return response?.data
}
const getKamatiHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_KAMATI_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}
const getWatchmanChartApi = async ({ params }) => {
  const response = await getMethod(GET_WATCHMAN_CHART, { params })
  return response?.data
}
const getWatchmanHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(GET_WATCHMAN_HOSTELS({ pageNo }), {
    params,
  })
  return response?.data
}
const getAvailableScavengersChartApi = async ({ params }) => {
  const response = await getMethod(GET_AVAILABLE_SCAVENGERS_CHART, { params })
  return response?.data
}
const getAvailableScavengersHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(
    GET_AVAILABLE_SCAVENGERS_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}
const getRequiredScavengersChartApi = async ({ params }) => {
  const response = await getMethod(GET_REQUIRED_SCAVENGERS_CHART, { params })
  return response?.data
}
const getRequiredScavengersHostelsApi = async ({ pageNo, params }) => {
  const response = await getMethod(
    GET_REQUIRED_SCAVENGERS_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getFoodProvisionsBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_FOOD_PROVISIONS_BAR_CHART, {
    params,
  })
  return response?.data
}

const getFoodProvisionsHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_FOOD_PROVISIONS_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getPrecautionaryMeasuresBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_PRECAUTIONARY_MEASURES_BAR_CHART, {
    params,
  })
  return response?.data
}

const getPrecautionaryMeasuresHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_PRECAUTIONARY_MEASURES_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getAnimalThreatBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_ANIMAL_THREAT_BAR_CHART, {
    params,
  })
  return response?.data
}

const getAnimalThreatHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_ANIMAL_THREAT_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getConductionMeetingsBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_CONDUCTION_MEETINGS_BAR_CHART, {
    params,
  })
  return response?.data
}

const getConductionMeetingsHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(
    DASHBOARD_CONDUCTION_MEETINGS_HOSTELS({ pageNo }),
    {
      params,
    },
  )
  return response?.data
}

const getCookingFuelBarChartApi = async ({ params }) => {
  const response = await getMethod(DASHBOARD_COOKING_FUEL_BAR_CHART, {
    params,
  })
  return response?.data
}

const getCookingFuelHostelsApi = async ({ params, pageNo = 1 }) => {
  const response = await getMethod(DASHBOARD_COOKING_FUEL_HOSTELS({ pageNo }), {
    params,
  })
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
  getLocationBedsMattressesBarChartApi,
  getLocationBedsMattressesHostelsApi,
  getMedicalCareBarChartApi,
  getMedicalCareHostelsApi,
  getEducationFacilitiesBarChartApi,
  getEducationFacilitiesHostelsApi,
  getFoodProvisionsBarChartApi,
  getFoodProvisionsHostelsApi,
  getPrecautionaryMeasuresBarChartApi,
  getPrecautionaryMeasuresHostelsApi,
  getAnimalThreatBarChartApi,
  getAnimalThreatHostelsApi,
  getConductionMeetingsBarChartApi,
  getConductionMeetingsHostelsApi,
  getCookingFuelBarChartApi,
  getCookingFuelHostelsApi,
  getFunctioningToiletsChartApi,
  getFunctioningToiletsHostelsApi,
  getHostelStudentsChartApi,
  getStudentsHostelsApi,
  getWorkersChartApi,
  getWorkersHostelsApi,
  getCooksChartApi,
  getCooksHostelsApi,
  getKamatiChartApi,
  getKamatiHostelsApi,
  getWatchmanChartApi,
  getWatchmanHostelsApi,
  getAvailableScavengersChartApi,
  getAvailableScavengersHostelsApi,
  getRequiredScavengersChartApi,
  getRequiredScavengersHostelsApi,
}
