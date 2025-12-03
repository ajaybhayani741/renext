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

export const hostelAuthorityCharts = {
  job_HostelAuthority: {
    xAxisText: ['dash_RegularInCharge', 'dash_StayInHeadquarters'],
    yAxisText: '',
    chartType: 'column',
    modalTitle: true,
  },
}

export const studentCharts = {
  dash_TotalNumberOfStudents: {
    xAxisText: 'dash_NumberOfStudents',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
}

export const recordMaintenanceCharts = {
  job_RecordMaintenance: {
    yAxisText: '',
    chartType: 'column',
    modalTitle: true,
  },
}

export const staffDetailsCharts = {
  dash_TotalNumberOfWorkersOnPayroll: {
    xAxisText: 'job_NumberOfWorkersOnPayroll',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  dash_TotalNumberOfCooksEnrolled: {
    xAxisText: 'job_NumberOfCooksEnrolled',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  dash_TotalNumberOfKamatiEnrolled: {
    xAxisText: 'job_NumberOfKamatiEnrolled',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  dash_TotalNumberOfWatchmenEnrolled: {
    xAxisText: 'job_NumberOfWatchmenEnrolled',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  dash_TotalNumberOfScavengersAvailable: {
    xAxisText: 'job_NumberOfScavengersAvailable',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  dash_TotalNumberOfScavengersRequired: {
    xAxisText: 'job_NumberOfScavengersRequired',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
}

export const hostelInfraRoomsCharts = {
  dash_TotalNumberOfLivingRooms: {
    xAxisText: 'job_NumberOfLivingRooms',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  dash_LocationBedsMattresses: {
    xAxisText: [
      'dash_LocationGovtPrivate',
      'dash_AreBedsAvailableForAll',
      'dash_AreMattressesAvailableForAll',
      'dash_IsAccommodationSufficient',
    ],
    yAxisText: '',
    chartType: 'column',
    modalTitle: true,
  },
  job_WorkingLightsCount: {
    xAxisText: 'dash_TubelightsBulbsInWorking',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
  job_WorkingFansCount: {
    xAxisText: 'dash_FansInWorking',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    chartType: 'rangeFrequency',
  },
}

export const studentsCharts = {
  dash_Students: {
    xAxisText: 'dash_NumberOfStudents',
    yAxisText: 'dash_NumberOfHostels',
    chartType: 'rangeFrequency',
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
  },
}

export const medicalCareCharts = {
  job_MedicalCare: {
    type: 'columnCompare',
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
  job_DistanceToNearestPHC: {
    type: 'rangeFrequency',
    xAxisText: 'job_DistanceToNearestPHC',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    md: 24,
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
    md: 24,
  },
  dash_NumberOfCCTVsFunctioning: {
    type: 'rangeFrequency',
    xAxisText: 'dash_NumberOfCCTVsFunctioning',
    yAxisText: 'dash_NumberOfHostels',
    modalTitle: false,
    md: 24,
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
  waterCansPurchased: {
    label: 'job_WaterCansPurchased',
    value: 'WATER_CANS_PURCHASED',
  },
}
export const hotBathingWaterKeys = {
  firewood: { label: 'job_Firewood', value: 'FIREWOOD' },
  solarWaterHeater: {
    label: 'job_SolarWaterHeater',
    value: 'SOLAR_WATER_HEATER',
  },
  geyser: { label: 'job_Geyser', value: 'GEYSER' },
  none: { label: 'txt_None', value: 'NONE' },
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

export const vegetableQualityKeys = {
  good: { label: 'job_Good', value: 'GOOD' },
  medium: { label: 'job_Medium', value: 'MEDIUM' },
  poor: { label: 'job_Poor', value: 'POOR' },
}

export const lineChartRange = {
  start: 1,
  end: 100,
}

export const chartTypeKeys = {
  job_HostelAuthority: 'PRINCIPAL_AUTHORITY',
  job_RecordMaintenance: 'RECORD_MAINTENANCE',
  job_EducationFacilities: 'EDUCATION_FACILITIES',
  dash_WasteManagement: 'WASTE_MANAGEMENT',
  dash_ToiletsSufficiency: 'TOILETS_SUFFICIENCY',
  job_DrinkingWater: 'DRINKING_WATER',
  job_FoodProvisions: 'FOOD_PROVISIONS',
  job_NatureOfCookingFuel: 'COOKING_FUEL',
  dash_PrincipalHWOSpecialOfficer: 'CONDUCTION_MEETINGS',
  dash_PrecautionaryMeasures: 'PRECAUTIONARY_MEASURES',
  dash_AnimalThreat: 'ANIMAL_THREAT',
  job_MedicalCare: 'MEDICAL_CARE',
  dash_IsTheStaffNurseAvailableInTheHostel: 'STAFF_NURSE_AVAILABILITY',
  dash_LocationBedsMattresses: 'LOCATION_BEDS_MATTRESSES',
  job_DistanceToNearestPHC: 'DISTANCE_TO_NEAREST_PHC',
  dash_TotalNumberOfStudents: 'HOSTEL_STUDENT',
  dash_TotalNumberOfLivingRooms: 'HOSTEL_LIVING_ROOMS',
  job_WorkingLightsCount: 'HOSTEL_TUBELIGHTS_BULBS',
  job_WorkingFansCount: 'HOSTEL_FANS_WORKING',
  dash_TotalToiletsAvailable: 'HOSTEL_TOILETS_AVAILABLE',
  job_PercentageOfTotalToiletsFunctioning:
    'HOSTEL_TOILETS_FUNCTIONING_PERCENTAGE',
  dash_NumberOfCCTVsAvailable: 'HOSTEL_CCTVS_AVAILABLE',
  dash_NumberOfCCTVsFunctioning: 'HOSTEL_CCTVS_FUNCTIONING',
  dash_TotalNumberOfWorkersOnPayroll: 'HOSTEL_WORKERS_PAYROLL',
  dash_TotalNumberOfCooksEnrolled: 'HOSTEL_COOKS_ENROLLED',
  dash_TotalNumberOfKamatiEnrolled: 'HOSTEL_KAMATI_ENROLLED',
  dash_TotalNumberOfWatchmenEnrolled: 'HOSTEL_WATCHMEN_ATTENDERS_ENROLLED',
  dash_TotalNumberOfScavengersAvailable: 'HOSTEL_SCAVENGERS_AVAILABLE',
  dash_TotalNumberOfScavengersRequired: 'HOSTEL_SCAVENGERS_REQUIRED',
  dash_EducationRequirements: 'EDUCATION_FACILITIES',
}

export const reportCategoryKeys = t => ({
  [t('btn_Yes')]: 'YES',
  [t('btn_No')]: 'NO',
  [t('dash_RegularInCharge')]: 'IS_REGULAR_INCHARGE',
  [t('dash_StayInHeadquarters')]: 'STAYS_IN_HEADQUARTERS',
  [t('dash_Staff')]: 'STAFF_ATTENDANCE',
  [t('dash_Boarder')]: 'BOARDER_ATTENDANCE',
  [t('dash_Sick')]: 'SICK_BOARDERS',
  [t('dash_BoarderMovement')]: 'BOARDER_MOVEMENT',
  [t('dash_VisitorRegister')]: 'VISITOR_REGISTER',
  [t('dash_OtherRecords')]: 'ALL_OTHER_RECORDS',
  [t('dash_LocationGovtPrivate')]: 'HOSTEL_LOCATION_TYPE',
  [t('dash_AreBedsAvailableForAll')]: 'BEDS_AVAILABLE_FOR_ALL',
  [t('dash_AreMattressesAvailableForAll')]: 'MATTRESSES_AVAILABLE_FOR_ALL',
  [t('dash_IsAccommodationSufficient')]: 'ACCOMMODATION_SUFFICIENT',
  [t('dash_GPMunicipalityIsRegularlyCleaningTheSolidWaste')]:
    'GP_MUNICIPALITY_CLEARING_SOLID_WASTE',
  [t('dash_GreyWaterAndBlackWaterSeparatelyDrainedOut')]:
    'GREY_BLACK_WATER_SEPARATELY_DRAINED',
  [t('dash_SepticTankCleanedRegularly')]: 'SEPTIC_TANK_CLEANED_REGULARLY',
  [t('dash_SoakPitsInTheHostel')]: 'SOAK_PITS_IN_HOSTEL',
  [t('dash_MoreThan30mDistanceBetweenSepticTankAndBoreWell')]:
    'SUFFICIENT_DISTANCE_SEPTIC_TANK_BOREWELL',
  [t('dash_HostelPremisesAreKeptCleanInsideAndOutside')]:
    'HOSTEL_PREMISES_KEPT_CLEAN',
  [t('job_AreToiletsSufficient')]: '',
  [t('dash_TapMunicipalityOrMissionBhageeratha')]:
    'TAP_MUNICIPALITY_MISSION_BHAGEERATHA',
  [t('dash_ROPlant')]: 'RO_PLANT',
  [t('dash_OpenWell')]: 'OPEN_WELL',
  [t('job_BoreWell')]: 'BORE_WELL',
  [t('job_MedicalOfficerVisits')]: 'MEDICAL_OFFICER_REGULAR_VISITS',
  [t('job_FirstAidKitAvailability')]: 'FIRST_AID_KIT_AVAILABLE_IN_HOSTEL',
  [t('job_StaffNurseAvailability_Available')]: 'AVAILABLE',
  [t('job_StaffNurseAvailability_NotAvailable')]:
    'NOT_AVAILABLE_NO_PHC_NURSE_VISITS',
  [t('job_StaffNurseAvailability_ANMVisits')]:
    'NOT_AVAILABLE_BUT_PHC_NURSE_VISITS',
  [t('job_TextbooksSupplied')]: 'TEXTBOOKS',
  [t('job_NotebooksSupplied')]: 'NOTEBOOKS',
  [t('job_UniformsSupplied')]: 'UNIFORMS',
  [t('job_TrunkBoxesSupplied')]: 'TRUNK_BOXES',
  [t('job_PlatesGlassesSupplied')]: 'PLATES_GLASSES',
  [t('job_SchoolBagsSupplied')]: 'SCHOOL_BAGS',
  [t('job_BeddingMaterialSupplied')]: 'BEDDING_MATERIAL',
  [t('job_TreasuryBillRegisterMaintained')]: 'TREASURY_BILL_REGISTER',
  [t('job_TeachingAsPerLessonPlan')]: 'TEACHING_ANNUAL_LESSON_PLAN',
  [t('job_Firewood')]: 'NATURE_OF_COOKING_FUEL',
  [t('job_LPG')]: 'NATURE_OF_COOKING_FUEL',
  [t('job_SufficientLPGCylinders')]: 'LPG_CYLINDERS_AVAILABLE',
  [t('job_NoLPGCylinders')]: 'LPG_CYLINDERS_AVAILABLE',
  [t('job_NonSufficientLPGCylinders')]: 'LPG_CYLINDERS_AVAILABLE',
  [t('dash_MenuChartDisplay')]: 'MENU_CHART_DISPLAYED',
  [t('dash_MenuImplementationAsPrescribed')]: 'MENU_IMPLEMENTED_AS_PRESCRIBED',
  [t('job_StockRegisterMaintained')]: 'STOCK_REGISTER_MAINTAINED',
  [t('job_VegetablesStoredAboveGround')]: 'VEGETABLES_STORED_ABOVE_GROUND',
  [t('job_ExhaustFanInKitchen')]: 'EXHAUST_FAN_IN_KITCHEN',
  [t('job_OpenSpaceLightingAtNight')]: 'SUFFICIENT_LIGHTING_OPEN_SPACES',
  [t('job_PolicePatrolRequired')]: 'DAILY_NIGHT_POLICE_PATROLLING_REQUIRED',
  [t('job_Rats')]: 'RATS',
  [t('job_Monkeys')]: 'MONKEYS',
  [t('job_Snakes')]: 'SNAKES',
  [t('job_Dogs')]: 'DOGS',
  [t('txt_None')]: 'NONE',
  [t('job_HWOMeetingsRegular')]: null,
})
