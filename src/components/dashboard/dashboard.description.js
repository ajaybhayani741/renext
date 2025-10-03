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

export const hostelsList = [
  {
    hostel: { name: 'Ekalavya Model Residential School' },
    total_students: 100,
  },
  { hostel: { name: 'Govt. BC Hostel' }, total_students: 200 },
  { hostel: { name: 'Govt. BC College' }, total_students: 320 },
  { hostel: { name: 'Govt. ST Ashram School' }, total_students: 250 },
  { hostel: { name: 'Govt. ST Hostel' }, total_students: 290 },
  { hostel: { name: 'Govt. ST PMH' }, total_students: 190 },
  { hostel: { name: 'Govt. ST Hostel' }, total_students: 450 },
  {
    hostel: { name: 'Ekalavya Model Residential School' },
    total_students: 470,
  },
  { hostel: { name: 'Govt. BC Hostel' }, total_students: 520 },
  { hostel: { name: 'Govt. BC College' }, total_students: 380 },
]

export const axisOptionsList = {
  xAxis: {
    type: 'linear',
    title: {
      text: '',
    },
    tickPositions: [],
    labels: {
      formatter: function () {
        return this.value // show plain numbers instead of time
      },
    },
    minRange: 10,
  },
  yAxis: [
    {
      // Primary yAxis
      title: {
        text: '',
      },
      lineWidth: 2,
      opposite: false,
    },
    {
      // Secondary yAxis
      title: {
        text: '',
      },
      lineWidth: 2,
      visible: false,
    },
  ],
}

export const staffDetailsCharts = {
  dash_TotalNumberOfWorkersOnPayroll: {
    xAxisText: 'job_NumberOfWorkersOnPayroll',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
  },
  dash_TotalNumberOfCooksEnrolled: {
    xAxisText: 'job_NumberOfCooksEnrolled',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
  },
  dash_TotalNumberOfKamatiEnrolled: {
    xAxisText: 'job_NumberOfKamatiEnrolled',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
  },
  dash_TotalNumberOfWatchmenEnrolled: {
    xAxisText: 'job_NumberOfWatchmenEnrolled',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
  },
  dash_TotalNumberOfScavengersAvailable: {
    xAxisText: 'job_NumberOfScavengersAvailable',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
  },
  dash_TotalNumberOfScavengersRequired: {
    xAxisText: 'job_NumberOfScavengersRequired',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
  },
}

export const hostelInfraRoomsCharts = {
  dash_TotalNumberOfLivingRooms: {
    xAxisText: 'job_NumberOfLivingRooms',
    yAxisText: 'dash_NumberOfHostels',
    total: 370,
    modalTitle: false,
  },
  dash_LocationBedsMattresses: {
    xAxisText: [
      'dash_LocationGovtPrivate',
      'dash_AreBedsAvailableForAll',
      'dash_AreMattressesAvailableForAll',
      'dash_IsAccommodationSufficient',
    ],
    yAxisText: '',
    total: 1200,
    chartType: 'column',
    modalTitle: true,
  },
  job_WorkingLightsCount: {
    xAxisText: 'dash_TubelightsBulbsInWorking',
    yAxisText: 'dash_NumberOfHostels',
    total: 1280,
    modalTitle: false,
  },
  job_WorkingFansCount: {
    xAxisText: 'dash_FansInWorking',
    yAxisText: 'dash_NumberOfHostels',
    total: 990,
    modalTitle: false,
  },
}

export const hostelInfraSanitationCharts = {
  dash_WasteManagement: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: 'dash_NumberOfHostels',
    md: 24,
    modalTitle: true,
  },
  dash_TotalToiletsAvailable: {
    type: 'rangeFrequency',
    xAxisText: 'dash_NumberOfToiletsAvailable',
    yAxisText: 'dash_NumberOfHostels',
    md: 24,
    modalTitle: false,
  },
  job_PercentageOfTotalToiletsFunctioning: {
    type: 'rangeFrequency',
    xAxisText: 'dash_PercentageOfToiletsFunctioning',
    yAxisText: 'dash_NumberOfHostels',
    md: 24,
    modalTitle: false,
  },
  dash_ToiletsSufficiency: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: true,
  },
  job_DrinkingWater: {
    type: 'pie',
    xAxisText: 'job_NumberOfScavengersAvailable',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: true,
    total: 350,
  },
}

export const medicalCareCharts = {
  job_MedicalCare: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: '',
    modalTitle: true,
  },
  job_DistanceToNearestPHC: {
    type: 'polar',
    xAxisText: '',
    yAxisText: '',
    modalTitle: true,
  },
  dash_IsTheStaffNurseAvailableInTheHostel: {
    type: 'pie',
    xAxisText: 'job_NumberOfScavengersAvailable',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: true,
  },
}

export const educationFacilitiesCharts = {
  dash_EducationRequirements: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: '',
    md: 24,
    modalTitle: true,
  },
}

export const foodPrevisionsCharts = {
  job_NatureOfCookingFuel: {
    type: 'donut',
    xAxisText: '',
    yAxisText: '',
    md: 24,
    modalTitle: true,
  },
  job_FoodProvisions: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: '',
    md: 24,
    modalTitle: true,
  },
}

export const safetySecurityCharts = {
  dash_PrecautionaryMeasures: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: '',
    modalTitle: true,
  },
  dash_AnimalThreat: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: '',
    modalTitle: true,
  },
  dash_NumberOfCCTVsAvailable: {
    type: 'rangeFrequency',
    xAxisText: 'dash_NumberOfCCTVsAvailable',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    total: 120,
  },
  dash_NumberOfCCTVsFunctioning: {
    type: 'rangeFrequency',
    xAxisText: 'dash_NumberOfCCTVsFunctioning',
    yAxisText: 'dash_NumberOfHostels',
    total: 100,
    modalTitle: false,
  },
}

export const conductionMeetingCharts = {
  dash_PrincipalHWOSpecialOfficer: {
    type: 'columnCompare',
    xAxisText: '',
    yAxisText: '',
    modalTitle: true,
  },
}

export const drinkingWaterKeys = {
  boreWell: { label: 'job_BoreWell', value: 'BORE_WELL' },
  openWell: { label: 'dash_OpenWell', value: 'OPEN_WELL' },
  roPlant: { label: 'dash_ROPlant', value: 'RO_PLANT' },
  tapMunicipalityMissionBhageeratha: {
    label: 'dash_TapMunicipalityOrMissionBhageeratha',
    value: 'TAP_MUNICIPALITY_MISSION_BHAGEERATHA',
  },
}

export const availableNursingStaffKeys = {
  available: {
    label: 'job_StaffNurseAvailability_Available',
    value: 'AVAILABLE',
  },
  notAvailableAndNoNurseFromPHCVisits: {
    label: 'job_StaffNurseAvailability_NotAvailable',
    value: 'NOT_AVAILABLE_NO_PHC_NURSE_VISITS',
  },
  notAvailableButANMNurseFromPHCVisitsRegularly: {
    label: 'job_StaffNurseAvailability_ANMVisits',
    value: 'NOT_AVAILABLE_BUT_PHC_NURSE_VISITS',
  },
}

export const lineChartRange = {
  start: 1,
  end: 100,
}
