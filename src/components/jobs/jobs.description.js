import { userWiseRole } from '../../utils/constant'
import { isEqual, notEqual } from '../../utils/javascript'

const { admin, inspectionOfficer, districtCollector } = userWiseRole

const tabKeys = {
  active: 'active',
  complete: 'complete',
  inspection: 'inspection',
  unassignHostel: 'unassignHostel',
}

const { active, complete, inspection, unassignHostel } = tabKeys

const getJobTabList = roleId => {
  const baseStatusTabs = [
    {
      label: 'txt_Active',
      key: active,
    },
    {
      label: 'job_Complete',
      key: complete,
    },
  ]

  // Add unassign hostel tab only for district collector
  if (isEqual(roleId, districtCollector)) {
    baseStatusTabs.unshift({
      label: 'job_Unassign',
      key: unassignHostel,
    })
  }

  return {
    status: baseStatusTabs,
    type: [
      {
        label: 'job_InspectionJob',
        key: inspection,
        permission: [admin, inspectionOfficer],
      },
    ],
  }
}

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
    {
      label: 'job_Unassign',
      key: unassignHostel,
    },
  ],
  type: [
    {
      label: 'job_InspectionJob',
      key: inspection,
      permission: [admin, inspectionOfficer, districtCollector],
    },
  ],
}

const columnKeys = {
  action: 'action',
  read: 'read',
  all: 'txt_All',
  jobId: 'job_Id',
  jobTitle: 'job_Title',
  createdDate: 'user_CreationDate',
  updatedDate: 'job_UpdatedDate',
  status: 'job_Status',
  hostel: 'user_Hostel',
  hostelAddress: 'user_HostelAddress',
  inspectionOfficer: 'user_InspectionOfficer',
  hostelContact: 'user_Contact',
  hostelName: 'job_hostelName',
  inspectionOfficerName: 'job_InspectionOfficerName',
}

const searchByKeys = {
  jobId: 'JOB_ID',
  inspectionOfficerName: 'INSPECTION_OFFICER_NAME',
  hostelName: 'HOSTEL_NAME',
}

const { jobId, inspectionOfficerName, hostelName } = searchByKeys

const searchByLabels = {
  [jobId]: 'job_Id',
  [inspectionOfficerName]: 'job_InspectionOfficerName',
  [hostelName]: 'job_hostelName',
}

const payloadType = {
  [inspection]: 'INSPECTION_JOB',
  inspectionReport: 'INSPECTION_REPORT',
  inspectionSheetMultiple: 'INSPECTION_SHEET_MULTIPLE',
}

const inspectionSteps = [
  'job_NameAndDate',
  'txt_Details',
  'job_Findings',
  'job_Confirm',
  'job_Complete',
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

const booleanOptions = [
  { label: 'btn_Yes', value: 'YES' },
  { label: 'btn_No', value: 'NO' },
]

export const APPROVED = 'APPROVED'
export const REJECTED = 'REJECTED'
export const PENDING = 'PENDING'

export const jobStatusList = {
  JOB_REQUEST_INPROGRESS: 'INSPECTION IN PROGRESS',
  JOB_COMPLETED: 'INSPECTION COMPLETED',
}

export const jobTypeRoleSearchBy = (jobType, roleId) => {
  switch (jobType) {
    case tabKeys.inspection:
      return [
        jobId,
        ...(notEqual(roleId, inspectionOfficer) ? [inspectionOfficerName] : []),
        hostelName,
      ]

    default:
      return [jobId]
  }
}

export {
  categoryELVOptions,
  certTagProp,
  columnKeys,
  dummyJobList,
  exportExcelOptions,
  getDummyJob,
  getJobTabList,
  jobTabList,
  jobWiseReport,
  payloadType,
  inspectionSteps,
  searchByKeys,
  searchByLabels,
  shareCertificateFields,
  tabKeys,
  booleanOptions,
}
