import pathName, {
  CASHBACK,
  JOHN_TUBES,
  MACHINES,
  SCRATCH_TICKET_TRACKING,
  SHIFT,
  VENDOR_PAYOUT,
} from '../../routing/pathName.constant'
import { userWiseRole } from '../../utils/constant'
import {
  CategoryManagementIcon,
  GeneralLedger,
  JobsIcon,
  MaterialManagement,
} from '../../utils/icons'

const { admin, storeEmployee } = userWiseRole

// const job_Recovery = [
//   {
//     btnLabel: 'job_Recovery',
//     BtnIcon: RepairIcon,
//     path: pathName.ADD_JOB.replace(':jobType', jobTabKeys.recovery),
//   },
// ]

// const home_ActiveJobs = [
//   {
//     btnLabel: 'job_Recovery',
//     BtnIcon: RepairIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.recovery,
//     }),
//     jobKey: jobTabKeys.recovery,
//   },
//   {
//     btnLabel: 'job_Process',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.process,
//     }),
//     jobKey: jobTabKeys.process,
//   },
//   {
//     btnLabel: 'job_BucketCreation',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.bucketCreation,
//     }),
//     jobKey: jobTabKeys.bucketCreation,
//   },
//   {
//     btnLabel: 'home_ScrapProcessingRequest',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.recycleRequest,
//     }),
//     jobKey: jobTabKeys.recycleRequest,
//   },
//   {
//     btnLabel: 'job_Recycle',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.recycle,
//     }),
//     jobKey: jobTabKeys.recycle,
//   },
//   // {
//   //   btnLabel: 'home_RefurbishmentRequestNew',
//   //   BtnIcon: ClipboardIcon,
//   //   path: pathName.JOBS,
//   //   dispatchAction: setJobActiveTab({
//   //     status: jobTabKeys.active,
//   //     type: jobTabKeys.smeltingRequest,
//   //   }),
//   //   jobKey: jobTabKeys.smeltingRequest,
//   // },
//   {
//     btnLabel: 'job_ReuseRequest',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.reuseRequest,
//     }),
//     jobKey: jobTabKeys.reuseRequest,
//   },
//   {
//     btnLabel: 'home_RecycleRequest',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.smeltingRequest,
//     }),
//     jobKey: jobTabKeys.smeltingRequest,
//   },
//   {
//     btnLabel: 'job_Shredding',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.shredding,
//     }),
//     jobKey: jobTabKeys.shredding,
//   },
//   {
//     btnLabel: 'job_Hydrometallurgy',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.hydrometallurgy,
//     }),
//     jobKey: jobTabKeys.hydrometallurgy,
//   },
//   {
//     btnLabel: 'job_DestructionRequest',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.destructionRequest,
//     }),
//     jobKey: jobTabKeys.destructionRequest,
//   },

//   {
//     btnLabel: 'home_Refurbishment',
//     BtnIcon: ClipboardIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.smelting,
//     }),
//     jobKey: jobTabKeys.smelting,
//   },
//   {
//     btnLabel: 'job_MaterialSalesSupplier',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.materialSalesSupplier,
//     }),
//     jobKey: jobTabKeys.materialSalesSupplier,
//   },
//   {
//     btnLabel: 'job_MaterialSalesMaterialProducer',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.materialSalesMaterialProducer,
//     }),
//     jobKey: jobTabKeys.materialSalesMaterialProducer,
//   },
//   {
//     btnLabel: 'job_SupplierProduction',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.supplierProduction,
//     }),
//     jobKey: jobTabKeys.supplierProduction,
//   },
//   {
//     btnLabel: 'job_PartSalesProducer',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.materialSalesProducer,
//     }),
//     jobKey: jobTabKeys.materialSalesProducer,
//   },
//   {
//     btnLabel: 'job_PartSalesPartProducer',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.partSalesPartProducer,
//     }),
//     jobKey: jobTabKeys.partSalesPartProducer,
//   },
//   {
//     btnLabel: 'job_VehicleProduction',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.vehicleProduction,
//     }),
//     jobKey: jobTabKeys.vehicleProduction,
//   },
//   {
//     btnLabel: 'job_VehicleSales',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.vehicleSales,
//     }),
//     jobKey: jobTabKeys.vehicleSales,
//   },
//   {
//     btnLabel: 'job_Sales',
//     BtnIcon: QuoteIcon,
//     path: pathName.JOBS,
//     dispatchAction: setJobActiveTab({
//       status: jobTabKeys.active,
//       type: jobTabKeys.sales,
//     }),
//     jobKey: jobTabKeys.sales,
//   },
// ]

const menu_ShiftActivities = [
  {
    btnLabel: 'menu_ScratchTicketTracking',
    BtnIcon: JobsIcon,
    path: pathName.BOOK_KEEPING?.replace(':type', SCRATCH_TICKET_TRACKING),
  },
  {
    btnLabel: 'menu_JohnTubes',
    BtnIcon: CategoryManagementIcon,
    path: pathName.BOOK_KEEPING?.replace(':type', JOHN_TUBES),
  },
  {
    btnLabel: 'menu_Machines',
    BtnIcon: MaterialManagement,
    path: pathName.BOOK_KEEPING?.replace(':type', MACHINES),
  },
  {
    btnLabel: 'menu_Cashback',
    BtnIcon: GeneralLedger,
    path: pathName.BOOK_KEEPING?.replace(':type', CASHBACK),
  },
  {
    btnLabel: 'menu_VendorPayout',
    BtnIcon: GeneralLedger,
    path: pathName.BOOK_KEEPING?.replace(':type', VENDOR_PAYOUT),
  },
]

const menu_Reporting = [
  {
    btnLabel: 'menu_ShiftReport',
    BtnIcon: GeneralLedger,
    path: pathName.BOOK_KEEPING?.replace(':type', SHIFT),
  },
]

//role-wise listing

const adminList = []

const employeeList = [{ menu_ShiftActivities }, { menu_Reporting }]

const roleWiseData = {
  [admin]: adminList,
  [storeEmployee]: employeeList,
}

export default roleWiseData
