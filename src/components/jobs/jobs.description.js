import { userWiseRole } from '../../utils/constant'
import { isEqual } from '../../utils/javascript'

const { admin, districtHostelDepartment, inspectionOfficer } = userWiseRole

const tabKeys = {
  active: 'active',
  complete: 'complete',
  inspection: 'inspection',
}

const { active, complete, inspection } = tabKeys

const jobTabList = {
  status: [
    {
      label: 'txt_Active',
      key: active,
    },
    {
      label: 'job_Complete',
      key: complete,
    },
  ],
  type: [
    {
      label: 'job_InspectionJob',
      key: inspection,
      permission: [admin, districtHostelDepartment, inspectionOfficer],
    },
  ],
}

const columnKeys = {
  action: 'action',
  read: 'read',
  all: 'txt_All',
  jobId: 'job_Id',
  employeeName: 'job_EmployeeName',
  shiftDate: 'job_ShiftDate',
  shiftType: 'job_ShiftType',
  loginTime: 'job_LoginTime',
  logoutTime: 'job_LogoutTime',
  shiftTime: 'job_ShiftTime',
}

const searchByKeys = {
  employeeName: 'EMPLOYEE_NAME',
}

const { employeeName } = searchByKeys

const searchByLabels = {
  [employeeName]: 'job_EmployeeName',
}

const payloadType = {
  // [shift]: 'SHIFT_JOB',
  // [purchasing]: 'PURCHASE',
}

const inspectionSteps = [
  'job_NameAndDate',
  'txt_Details',
  'job_Findings',
  'job_Confirm',
  'job_Complete',
]

const hydrometallurgyProcessSteps = {
  process: [
    'job_Date',
    'job_JobDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
}

const salesSteps = [
  'job_Date',
  'job_BuyerAndLocation',
  'job_SalesList',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]

const smelterFormSteps = {
  request: [
    'user_MaterialProducer',
    'job_Bale',
    'job_Part',
    'job_Material',
    'job_Transport',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  accumulation: ['job_RequestedDetails', 'job_Transport', 'job_Complete'],
  reception: ['job_RequestedDetails', 'job_ReceiveBales', 'job_Complete'],
  process: [
    'job_Date',
    'job_JobDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
}

const recycleFormSteps = {
  request: [
    'user_ScrappingFacility',
    'job_Scrap',
    'job_Transport',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  accumulation: ['job_RequestedDetails', 'job_Transport', 'job_Complete'],
  reception: ['job_RequestedDetails', 'job_ReceiveScraps', 'job_Complete'],
  process: [
    'job_Date',
    'job_ScrapELVDetails',
    // 'job_JobDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  recycleLoginStep: [
    'job_Date',
    'job_JobDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
}

const processFormSteps = {
  process: [
    'job_Date',
    'job_Vehicle',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
}
const bucketCreationFormSteps = {
  creation: [
    'job_Date',
    'job_ProcessJob',
    'job_BucketDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
}

const supplierProductionSteps = [
  'job_Date',
  'job_JobDetails',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]

const destructionRequestSteps = [
  'user_Disposer',
  'inv_Bucket',
  'job_Transport',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]
const thirdPartyRecycleSteps = [
  'user_MaterialProducer',
  'inv_Bucket',
  'job_Transport',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]
const reuseRequestSteps = [
  'user_SecondHandBuyer',
  'inv_Bucket',
  'job_Transport',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]

const materialSalesSupplierFormSteps = {
  request: [
    'home_Refurbishment',
    'job_JobDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  accumulation: ['job_RequestedDetails', 'tag_FinalProduct', 'job_Complete'],
}
const vehicleProductionSteps = [
  'job_Date',
  'job_JobDetails',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]
const materialSalesProducerFormSteps = {
  request: [
    'user_Supplier',
    'job_JobDetails',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  accumulation: ['job_RequestedDetails', 'tag_FinalProduct', 'job_Complete'],
}

const vehicleSalesSteps = [
  'job_Date',
  'job_BuyerAndLocation',
  'job_VehicleSold',
  'job_Remarks',
  'job_Confirm',
  'job_Complete',
]

const materialSalesMaterialProducerSteps = {
  request: [
    'job_Date',
    'job_Product',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  accumulation: ['job_RequestedDetails', 'job_Product', 'job_Complete'],
}

const partSalesPartProducerSteps = {
  request: [
    'job_Date',
    'job_Product',
    'job_Remarks',
    'job_Confirm',
    'job_Complete',
  ],
  accumulation: ['job_RequestedDetails', 'job_Product', 'job_Complete'],
}

const recycleListAttr = {
  tyerCNGData: {
    title: 'job_RegisterTyreCNGGasData',
    fieldAttr: {
      tyre: {
        label: 'job_Tyre',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      cng: {
        label: 'job_CNGGas',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'Kg',
        md: 12,
        sm: 24,
      },
    },
  },
  batteryFreonGas: {
    title: 'job_RegisterBatteryFreonGasSpareTypeData',
    fieldAttr: {
      battery: {
        label: 'job_Battery',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      freonGas: {
        label: 'job_FreonGas',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'Kg',
        md: 12,
        sm: 24,
      },
      spareTyre: {
        label: 'job_SpareTyre',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      kit: {
        label: 'job_Kit',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      others: {
        label: 'dash_Others',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
    },
  },
  depollution: {
    title: 'job_RegisterDepollutionData',
    fieldAttr: {
      muffler: {
        label: 'job_Muffler',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      fuelTankFuel: {
        label: 'job_FuelTankAndFuel',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      engineOil: {
        label: 'job_EngineOil',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'ml',
        md: 8,
        sm: 24,
      },
      transmissionOil: {
        label: 'job_TransmissionOil',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'ml',
        md: 8,
        sm: 24,
      },
      coolant: {
        label: 'job_Coolant',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'ml',
        md: 8,
        sm: 24,
      },
      brakeOil: {
        label: 'job_BrakeOil',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'ml',
        md: 8,
        sm: 24,
      },
      steeringOil: {
        label: 'job_SteeringOil',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'ml',
        md: 8,
        sm: 24,
      },
      windshieldLiquid: {
        label: 'job_WindshieldLiquid',
        inputType: 'inputNumber',
        className: 'w-100',
        addonAfter: 'ml',
        md: 8,
        sm: 24,
      },
    },
  },
  bodyPanel: {
    title: 'job_RegisterBodyPanel',
    fieldAttr: {
      doors: {
        label: 'job_Doors',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      bonnet: {
        label: 'job_Bonnet',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      fenders: {
        label: 'job_Fenders',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      bumpers: {
        label: 'job_Bumpers',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      headLights: {
        label: 'job_HeadLights',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      tailLights: {
        label: 'job_TailLights',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
    },
  },
  interiorParts: {
    title: 'job_RegisterInteriorParts',
    fieldAttr: {
      seats: {
        label: 'job_Seats',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      steering: {
        label: 'job_Steering',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      dashboard: {
        label: 'job_Dashboard',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      floorMat: {
        label: 'job_FloorMat',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      rooflining: {
        label: 'job_Rooflining',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      interiorParts: {
        label: 'job_InteriorParts',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
    },
  },
  wireHarness: {
    title: 'job_RegisterWireHarnessData',
    fieldAttr: {
      wiring: {
        label: 'job_WiringHarness',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      smallInteriorParts: {
        label: 'job_SmallInteriorParts',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
    },
  },
  engineSuspension: {
    title: 'job_EngineSuspensionRadiatorData',
    fieldAttr: {
      engine: {
        label: 'job_Engine',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      frontRearSuspension: {
        label: 'job_FrontRearSuspension',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      radiatorAssembly: {
        label: 'job_RadiatorAssembly',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      brakeLining: {
        label: 'job_BrakeLining',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
      engineRoomWiring: {
        label: 'job_EngineRoomWiringHarness',
        inputType: 'input',
        className: 'w-100',
        md: 8,
        sm: 24,
      },
    },
  },
  miscellaneousParts: {
    title: 'job_MiscellaneousParts',
    fieldAttr: {
      engineRoom: {
        label: 'job_EngineRoomMiscellaneousItems',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      glasses: {
        label: 'job_Glasses',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      trims: {
        label: 'job_Trims',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      plasticFastners: {
        label: 'job_PlasticFastners',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      VINNumber: {
        label: 'job_VINNumber',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      chassisNumber: {
        label: 'job_ChassisNumberCutOut',
        inputType: 'input',
        className: 'w-100',
        md: 12,
        sm: 24,
      },
    },
  },
  steelData: {
    title: 'job_SteelDataBaleShredded',
    fieldAttr: {
      materialType: {
        label: 'job_MaterialType',
        inputType: 'input',
        // options: optionFilter(materialTypeOptions),
        required: true,
        md: 24,
        sm: 24,
        disabled: true,
      },
      grade: {
        label: 'job_MaterialCompositionGrade',
        inputType: 'input',
        required: true,
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      weight: {
        label: 'job_Weight',
        inputType: 'input',
        required: true,
        className: 'w-100',
        md: 12,
        sm: 24,
      },
      dimension: {
        title: 'job_Dimension',
        hidden: true,
      },
      dLength: {
        label: 'job_Length',
        inputType: 'inputNumber',
        required: true,
        className: 'w-100',
        md: 8,
        sm: 24,
        addonAfter: 'feet',
      },
      dWidth: {
        label: 'job_Width',
        inputType: 'inputNumber',
        required: true,
        className: 'w-100',
        md: 8,
        sm: 24,
        addonAfter: 'feet',
      },
      dHeight: {
        label: 'job_Height',
        inputType: 'inputNumber',
        required: true,
        className: 'w-100',
        md: 8,
        sm: 24,
        addonAfter: 'feet',
      },
    },
  },
}

const bucketListOptions = [
  { value: 'Converter', label: 'job_Converter' },
  { value: 'Mix Steel', label: 'job_MixSteel' },
  { value: 'Doors, Dicky', label: 'job_DoorsDicky' },
  { value: 'Rubber and Tyres', label: 'job_RubberAndTyres' },
  { value: 'Shell and Painted Steel', label: 'job_ShellAndPaintedSteel' },
  { value: 'Hazardous Material', label: 'job_HazardousMaterial' },
  { value: 'Al Castings', label: 'job_AlCastings' },
  { value: 'Al Alloy', label: 'job_AlAlloy' },
  { value: 'Al Radiators', label: 'job_AlRadiators' },
  { value: 'Plastic', label: 'job_Plastic' },
  { value: 'Lead Acid Battery', label: 'job_LeadAcidBattery' },
  { value: 'Glasses', label: 'job_Glasses' },
  { value: 'Mix Motors', label: 'job_MixMotors' },
  { value: 'E Waste', label: 'job_EWaste' },
  { value: 'Used Parts', label: 'job_UsedParts' },
  { value: 'Steel Casting', label: 'job_SteelCasting' },
  { value: 'Wire Harness', label: 'job_WireHarness' },
  { value: 'Head & Tail Lights', label: 'job_HeadTailLights' },
  { value: 'Used Doors', label: 'job_UsedDoors' },
  { value: 'Used Hood & Dicky', label: 'job_UsedHoodDicky' },
  { value: 'Used Seats', label: 'job_UsedSeats' },
  { value: 'Engine Parts', label: 'job_EngineParts' },
  { value: 'EV Battery', label: 'job_EVBattery' },
  { value: 'Oils', label: 'job_Oils' },
  { value: 'Foam', label: 'job_Foam' },
]

const judgementOptions = [
  { label: 'inv_SelfRecycle', value: 'self-recycle' },
  { label: 'inv_3rdPartyRecycle', value: '3rd-party' },
  { label: 'inv_Reuse', value: 'reuse' },
  { label: 'inv_Refurbish', value: 'refurbish' },
  { label: 'inv_Destroy', value: 'destroy' },
]

const categoryELVOptions = [
  {
    label: 'job_CategoryELV1',
    value: 'Category I',
  },
  {
    label: 'job_CategoryELV2',
    value: 'Category II',
  },
  {
    label: 'job_CategoryELV3',
    value: 'Category III',
  },
  {
    label: 'job_CategoryELV4',
    value: 'Category IV',
  },
  {
    label: 'job_CategoryELV5',
    value: 'Category V',
  },
  {
    label: 'job_CategoryELV6',
    value: 'Category VI',
  },
  {
    label: 'job_CategoryELV7',
    value: 'Category VII',
  },
]

const bucketCreationFormAttr = {
  bucketName: {
    label: 'job_BucketName',
    inputType: 'select',
    options: bucketListOptions,
    required: true,
    md: 8,
    sm: 24,
  },
  quantity: {
    label: 'job_Quantity',
    inputType: 'inputNumber',
    className: 'w-100',
    required: true,
    addonAfter: true,
    md: 8,
    sm: 24,
  },
  judgement: {
    label: 'job_Judgement',
    inputType: 'select',
    options: judgementOptions,
    required: true,
    md: 8,
    sm: 24,
  },
  bucketImages: {
    label: 'job_BucketImages',
    inputType: 'formUpload',
    acceptFileTypes: '.png,.jpg,.jpeg,.webp',
    max: 5,
    md: 24,
    xs: 24,
  },
}

const manualBaleInputFields = {
  totalWeight: {
    label: 'job_TotalWeightKgs',
    inputType: 'inputNumber',
    className: 'w-100',
    md: 12,
    sm: 24,
  },
  count: {
    label: 'job_BaleCount',
    inputType: 'inputNumber',
    className: 'w-100',
    md: 12,
    sm: 24,
  },
}

const imageFieldKeys = {
  nameplateImages: 'nameplateDmsId',
  equipmentImages: 'equipmentDmsId',
  otherImages: 'otherDmsId',
}

const initialEquipment = {
  userEinId: null,
  equipmentIdentificationNumberFreeText: null,
}

const initialErrorCode = {
  options: {},
  value: null,
  selectedOption: null,
}

const jobWiseReport = {
  REPAIR: [
    {
      title: 'job_RepairCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  RECOVERY: [
    {
      title: 'job_RecoveryCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  RECYCLE: [
    {
      title: 'job_RecycleCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  RECYCLE_REQUEST: [
    {
      title: 'job_RecycleRequestCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  DIRECT_RECOVERY: [
    {
      title: 'job_RecoveryCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
    {
      title: 'job_RecycleCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
      // hidden: [recycler],
    },
  ],
  RECYCLE_REQUESTED: [
    {
      title: 'job_RecycleRequestCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  OUTPUT_CERTIFICATE: [
    {
      title: 'job_OutPutCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  GREEN_CERTIFICATE: [
    {
      title: 'job_GreenCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  REFURBISHMENT: [
    {
      title: 'job_RefurbishmentCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  SALES: [
    {
      title: 'job_SalesCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  MATERIAL_SALES_SUPPLIER: [
    {
      title: 'job_MaterialSalesSupplierCertificate',
      subTitle: '',
      type: 'REPAIR_JOB_CERTIFICATE',
    },
  ],
  SUPPLIER_PRODUCTION: [],
  MATERIAL_SALES_PRODUCER: [],
  VEHICLE_PRODUCTION: [],
  VEHICLE_SALES: [],
}

const certTagProp = {
  output: {
    color: '#6badb6',
    text: 'tag_Output',
  },
  recycle: {
    color: '#90d050',
    text: 'tag_Recycle',
  },
  green: {
    color: '#52b052',
    text: 'tag_Green',
  },
}

const shareCertificateFields = t => [
  {
    name: 'phoneNumber',
    label: 'job_SendSMS',
    validation: {
      rules: [
        {
          required: false,
          max: 12,
          pattern: new RegExp(/^[0-9-]{12,12}$/),
          message: t('error_LengthValidation'),
        },
      ],
    },
  },
  {
    name: 'emailId',
    label: 'job_SendEmail',
    validation: {
      rules: [
        {
          required: false,
          type: 'email',
          pattern: new RegExp(/[a-z0-9]+@[a-z-0-9-]+\.[a-z-0-9-]{2,3}/),
          message: t('error_InvalidEmail'),
        },
      ],
    },
  },
]

const recycleScrapSourceOpt = [
  { label: 'job_ELV', value: 'ELV' },
  { label: 'job_Part', value: 'Parts' },
  { label: 'job_Material', value: 'Material' },
]

const scrapTypeOpt = [
  {
    label: 'job_ShreddedScrap',
    value: 'Shredded Scrap',
  },
  {
    label: 'job_HighMeltingScrap',
    value: 'High Melting Scrap',
  },
  {
    label: 'job_MachineScrap',
    value: 'Machine Scrap',
  },
  {
    label: 'job_ConstructionScrap',
    value: 'Construction Scrap',
  },
]

const partName = [
  { label: 'Body', value: 'Body' },
  { label: 'Bumper', value: 'Bumper' },
  { label: 'Chassis', value: 'Chassis' },
  { label: 'Engine', value: 'Engine' },
  { label: 'Transmission', value: 'Transmission' },
]

const materialOptions = [
  { label: 'job_Aluminium', value: 'Aluminium' },
  { label: 'job_Copper', value: 'Copper' },
  { label: 'job_Fe', value: 'Fe' },
  { label: 'job_Plastic', value: 'Plastic' },
  { label: 'job_BlackMass', value: 'Black Mass' },
]

const dummyJobList = ({ jobType, status }) => {
  switch (jobType) {
    case inspection:
      if (isEqual(status, active)) {
        return {
          list: [],
        }
      } else {
        return {
          list: [],
        }
      }

    default:
      return { list: [] }
  }
}

const getDummyJob = ({ jobType, jobId, status }) => {
  const jobList = dummyJobList({ jobType, status })?.list
  return jobList?.find(job => isEqual(job?.jobId, +jobId)) || {}
}

const exportExcelOptions = [
  { label: 'job_SNo', value: 'S. No.' },
  { label: 'job_DateOfReceiptOfVehicle', value: 'Date of Receipt of Vehicle' },
  { label: 'job_RVSFVehicleNo', value: 'MSTI Vehicle No.' },
  { label: 'user_Type', value: 'Type' },
  { label: 'job_Source', value: 'Source' },
  { label: 'user_ProducerName', value: 'Producer Name' },
  { label: 'job_CustomerName', value: 'Customer Name' },
  { label: 'job_VehicleNo', value: 'Vehicle No.' },
  { label: 'job_ManufacturingDate', value: 'Manufacturing Date' },
  { label: 'job_RegistrationDate', value: 'Registration Date' },
  { label: 'job_ELVModel', value: 'ELV Model' },
  { label: 'job_Category', value: 'Category' },
  { label: 'job_FuelType', value: 'Fuel Type' },
  { label: 'job_RTO', value: 'RTO' },
  {
    label: 'job_WeightAsPerRegistrationCertificateInKG',
    value: 'Weight As per Registration Certificate (In KG)',
  },
  {
    label: 'job_WeightAsPerMSTIWeighmentInKG',
    value: 'Weight as per MSTI Weighment (In KG)',
  },
  { label: 'chassisNo', value: 'Chassis No.' },
  {
    label: 'job_DateOfReceiptOfChassisCutOut',
    value: 'Date of Receipt of Chassis Cut out',
  },
  { label: 'engineNo', value: 'Engine No.' },
  {
    label: 'job_DateOfReceiptOfEngineNoCutOut',
    value: 'Date of Receipt of Engine No. Cut out',
  },
  {
    label: 'job_DateOfReceiptOfCompliancePlate',
    value: 'Date of Receipt of Compliance Plate',
  },
  { label: 'job_ApplicationInwardNo', value: 'Application/ Inward No.' },
  { label: 'job_ApplicationInwardDate', value: 'Application/ Inward Date' },
  { label: 'job_CertificateOfDepositNo', value: 'Certificate of Deposit No.' },
  {
    label: 'job_CertificateOfDepositDate',
    value: 'Certificate of Deposit Date',
  },
  {
    label: 'job_DestructionCertificateCertificateOfVehicleScrappingCVSNo',
    value:
      'Destruction Certificate / Certificate of Vehicle Scrapping (CVS) No.',
  },
  {
    label: 'job_DateOfDestructionCertificateCVS',
    value: 'Date of Destruction Certificate/ CVS',
  },
  { label: 'job_BaseBuyingPrice', value: 'Base Buying Price' },
  { label: 'job_PurchasePrice', value: 'Purchase Price' },
  { label: 'job_DealerCommission', value: 'Dealer Commission' },
  { label: 'job_Freight', value: 'Freight' },
  {
    label: 'job_TotalPurchaseValue',
    value: 'Total Purchase Value',
  },
  {
    label: 'job_SpecialIncentiveToDealer',
    value: 'Special Incentive to Dealer',
  },
  { label: 'job_QuotedPrice', value: 'Quoted Price' },
  {
    label:
      'job_ChallanAmountDeductedFromCustomerQuotedPriceAgainstTotalChallanAmount',
    value:
      'Challan Amount deducted from Customer Quoted Price against total challan amount',
  },
  {
    label:
      'job_ChallanAmountDeductedFromDealerCommissionPriceAgainstTotalChallanAmount',
    value:
      'Challan Amount deducted from Dealer Commission Price against total challan amount',
  },
  {
    label: 'job_TotalChallanValueChallanDeduction',
    value: 'Total Challan Value/ Challan Deduction',
  },
  {
    label: 'job_OtherDeductionFromCustomerQuotedPrice',
    value: 'Other Deduction From Customer Quoted Price',
  },
  {
    label: 'job_OtherDeductionFromDealerCommission',
    value: 'Other Deduction From Dealer commission',
  },
  {
    label: 'job_NetAmountNeedToBePaidToTheCustomer',
    value: 'Net amount need to be paid to the Customer',
  },
  {
    label: 'job_NetAmountNeedToBePaidToDealerIncludingSpecialIncentive',
    value: 'Net Amount need to be paid to Dealer Including Special Incentive',
  },
  { label: 'job_PurchasedFrom', value: 'Purchased From' },
  { label: 'job_PaymentVoucherNo', value: 'Payment Voucher No.' },
  { label: 'job_PaymentDate', value: 'Payment Date' },
  { label: 'job_PaymentBank', value: 'Payment Bank' },
  { label: 'job_PaymentAmount', value: 'Payment Amount' },
  { label: 'job_PickedBy', value: 'Picked by' },
  { label: 'job_PaymentDate1', value: 'Payment Date1' },
  { label: 'job_PaymentBank1', value: 'Payment Bank1' },
  { label: 'job_PaymentAmount1', value: 'Payment Amount1' },
  { label: 'job_Remarks', value: 'Remarks' },
  { label: 'job_SpeedPostNo', value: 'Speed Post No.' },
  { label: 'job_PostDate', value: 'Post Date' },
]

export {
  bucketCreationFormAttr,
  bucketCreationFormSteps,
  bucketListOptions,
  categoryELVOptions,
  certTagProp,
  columnKeys,
  destructionRequestSteps,
  dummyJobList,
  exportExcelOptions,
  getDummyJob,
  hydrometallurgyProcessSteps,
  imageFieldKeys,
  initialEquipment,
  initialErrorCode,
  jobTabList,
  jobWiseReport,
  judgementOptions,
  manualBaleInputFields,
  materialOptions,
  materialSalesMaterialProducerSteps,
  materialSalesProducerFormSteps,
  materialSalesSupplierFormSteps,
  partName,
  partSalesPartProducerSteps,
  payloadType,
  processFormSteps,
  inspectionSteps,
  recycleFormSteps,
  recycleListAttr,
  recycleScrapSourceOpt,
  reuseRequestSteps,
  salesSteps,
  scrapTypeOpt,
  searchByKeys,
  searchByLabels,
  shareCertificateFields,
  smelterFormSteps,
  supplierProductionSteps,
  tabKeys,
  thirdPartyRecycleSteps,
  vehicleProductionSteps,
  vehicleSalesSteps,
}
