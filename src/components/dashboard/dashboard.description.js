import { userWiseRole } from '../../utils/constant'
import {
  dash_company,
  dash_customer,
  dash_recoveryAgent,
  dash_recycle,
  dash_smelter,
} from '../../utils/icons'

const cardKeys = {
  hostelAuthority: 'hostel-authority',
  students: 'students',
  recordMaintenance: 'record-maintenance',
  staffDetails: 'staff-details',
  hostelInfraRooms: 'hostel-infra-rooms',
  hostelInfraSanitation: 'hostel-infra-sanitation',
  medicalCare: 'medical-care',
  educationFacilities: 'education-facilities',
  foodProvisions: 'food-provisions',
  safetyAndSecurity: 'safety-and-security',
  conductionMeetings: 'conduction-meetings',
  feedback: 'feedback',
}

const {
  producer,
  recycler,
  consumer,
  dealer,
  refurbisher,
  trader,
  supplier,
  disposer,
} = userWiseRole

const numberTileList = [
  {
    title: 'tag_ScrapRecovered',
    key: 'repairJobsCreated',
    count: 250,
    color: '#95ceff',
  },
  {
    title: 'dash_ScrapRecycled',
    key: 'repairJobsCompleted',
    count: 180,
    color: '#9f9d9d',
  },
  {
    title: 'dash_ScrapSmelted',
    key: 'repairJobsActive',
    count: 150,
    color: '#13dcfb',
  },
  {
    title: 'dash_OutputProduced',
    key: 'maintenanceJobsCreated',
    count: 149,
    color: '#90ee90',
  },
  {
    title: 'dash_DomesticScrap',
    key: 'maintenanceJobsCompleted',
    count: 148,
    color: '#FF5733',
  },
  {
    title: 'dash_ImportedScrap',
    key: 'installationJobsCreated',
    count: 145,
    color: '#f7a35c',
  },
  {
    title: 'dash_CO2AvoidedOrCO2EmissionReduction',
    key: 'installationJobsCompleted',
    count: 130,
    color: '#07a107',
  },
  {
    title: 'dash_ElectricityConsumed',
    key: 'electricityConsumed',
    count: 130,
    color: '#544ec5',
  },
]

const peopleTileList = [
  {
    title: 'dash_NumberOfRecoveryAgents',
    key: 'dash_NumberOfRecoveryAgents',
    count: 250,
    color: '#95ceff',
    icon: dash_recoveryAgent,
  },
  {
    title: 'dash_NumberOfRecyclers',
    key: 'dash_NumberOfRecyclers',
    count: 240,
    color: '#07a107',
    icon: dash_recycle,
  },
  {
    title: 'dash_NumberOfSmelters',
    key: 'dash_NumberOfSmelters',
    count: 100,
    color: '#f7a35c',
    icon: dash_smelter,
  },
  {
    title: 'dash_numberOfTradingCompanies',
    key: 'dash_numberOfTradingCompanies',
    count: 150,
    color: '#cc5cf7',
    icon: dash_company,
  },
  {
    title: 'dash_numberOfCustomers',
    key: 'dash_numberOfCustomers',
    count: 250,
    color: '#5cf7b9',
    icon: dash_customer,
  },
]

const cpcbTilesList = [
  {
    title: 'dash_Producers',
    key: 'dash_Producers',
    count: 250,
    color: '#95ceff',
    roleId: producer,
  },
  {
    title: 'dash_Recyclers',
    key: 'dash_Recyclers',
    count: 240,
    color: '#95ceff',
    roleId: recycler,
  },
  {
    title: 'dash_Consumers',
    key: 'dash_Consumers',
    count: 100,
    color: '#95ceff',
    roleId: consumer,
  },
  {
    title: 'dash_Dealers',
    key: 'dash_Dealers',
    count: 150,
    color: '#95ceff',
    roleId: dealer,
  },
  {
    title: 'dash_Refurbishers',
    key: 'dash_Refurbishers',
    count: 326,
    color: '#95ceff',
    roleId: refurbisher,
  },
]

const otherCpcbTiles = [
  {
    title: 'dash_Traders',
    key: 'dash_Traders',
    count: 126,
    color: '#95ceff',
    roleId: trader,
  },
  {
    title: 'dash_Suppliers',
    key: 'dash_Suppliers',
    count: 342,
    color: '#95ceff',
    roleId: supplier,
  },
  {
    title: 'dash_Disposers',
    key: 'dash_Disposers',
    count: 121,
    color: '#95ceff',
    roleId: disposer,
  },
]

const filterKeys = {
  producerKey: '',
  modelKey: 'model',
  dealerKey: 'dealer',
}

const { producerKey, model, dealerKey } = filterKeys

const payloadFieldKeys = {
  [producerKey]: 'producer',
  [model]: 'model',
  [dealerKey]: 'dealer',
}

const seriesTitle = {
  [producerKey]: 'user_Producer',
  [model]: 'txt_Model',
  [dealerKey]: 'user_Dealer',
}

const colorByRegion = {
  NORTH_REGION: '#51c8f5',
  SOUTH_REGION: '#114169',
  WEST_REGION: '#ee5234',
  CENTRAL_REGION: '#62bb46',
}

const chartHeading = {
  bubbleChart: {
    [producerKey]: 'dash_TotalRepairAndMaintenanceJobsCompletedRegionWise',
    [model]: 'dash_TotalRepairAndMaintenanceJobsCompletedCountryWise',
    [dealerKey]: 'dash_TotalRepairAndMaintenanceJobsCompletedStateWise',
  },
  columnComparison: {
    [producerKey]: 'dash_ComparisonOfJobsCreatedVsJobsCompletedForEachRegion',
    [model]: 'dash_ComparisonOfJobsCreatedVsJobsCompletedForEachCountry',
    [dealerKey]: 'dash_ComparisonOfJobsCreatedVsJobsCompletedForEachState',
  },
}

const dealerPaymentData = [
  {
    key: 1,
    dealerNames: 'NEXA(T.R.SAWHNEY AUTOMOBILES PVT. LTD)',
    scrapTypeId: 1,
    totalELVReceived: 56,
    totalPurchasedPricePaid: 189000,
    totalDealerCommissionPaid: 18900,
    totalFreightPaid: 1908,
    totalPurchaseValuePaid: '-',
    totalSpecialIncentivetoDealerPaid: 8900,
  },
  {
    key: 2,
    dealerNames: 'NEXA(RANA MOTORS PVT LTD)',
    scrapTypeId: 2,
    totalELVReceived: 25,
    totalPurchasedPricePaid: 75000,
    totalDealerCommissionPaid: 7500,
    totalFreightPaid: 1450,
    totalPurchaseValuePaid: '-',
    totalSpecialIncentivetoDealerPaid: 4500,
  },
]

const cardList = [
  {
    label: 'job_HostelAdministration',
    subLabel: 'job_HostelAuthority',
    key: cardKeys.hostelAuthority,
  },
  {
    label: 'job_HostelAdministration',
    subLabel: 'dash_Students',
    key: cardKeys.students,
  },
  {
    label: 'job_HostelAdministration',
    subLabel: 'job_RecordMaintenance',
    key: cardKeys.recordMaintenance,
  },
  {
    label: 'job_HostelAdministration',
    subLabel: 'job_StaffDetails',
    key: cardKeys.staffDetails,
  },
  {
    label: 'job_HostelInfraRooms',
    key: cardKeys.hostelInfraRooms,
  },
  {
    label: 'job_HostelInfraSanitation',
    key: cardKeys.hostelInfraSanitation,
  },
  {
    label: 'job_MedicalCare',
    key: cardKeys.medicalCare,
  },
  {
    label: 'job_EducationFacilities',
    key: cardKeys.educationFacilities,
  },
  {
    label: 'job_FoodProvisions',
    key: cardKeys.foodProvisions,
  },
  {
    label: 'job_SafetyAndSecurity',
    key: cardKeys.safetyAndSecurity,
  },
  {
    label: 'job_ConductionMeetings',
    key: cardKeys.conductionMeetings,
  },
  {
    label: 'job_Feedback',
    key: cardKeys.feedback,
  },
]

export {
  cardKeys,
  cardList,
  chartHeading,
  colorByRegion,
  cpcbTilesList,
  dealerPaymentData,
  filterKeys,
  numberTileList,
  otherCpcbTiles,
  payloadFieldKeys,
  peopleTileList,
  seriesTitle,
}

export const schoolsList = [
  { name: 'Ekalavya Model Residential School' },
  { name: 'Govt. BC Hostel' },
  { name: 'Govt. BC College' },
  { name: 'Govt. ST Ashram School' },
  { name: 'Govt. ST Hostel' },
  { name: 'Govt. ST PMH' },
  { name: 'Govt. ST Hostel' },
  { name: 'Ekalavya Model Residential School' },
  { name: 'Govt. BC Hostel' },
  { name: 'Govt. BC College' },
]
