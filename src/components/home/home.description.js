import { setJobActiveTab } from '../../redux/jobs/reducer'
import pathName from '../../routing/pathName.constant'
import { userWiseRole } from '../../utils/constant'
import { DashboardIcon, QuoteIcon } from '../../utils/icons'
import { tabKeys as jobTabKeys } from '../jobs/jobs.description'

const {
  admin,
  districtHostelDepartment,
  inspectionOfficer,
  districtCollector,
} = userWiseRole

// const job_Recovery = [
//   {
//     btnLabel: 'job_Recovery',
//     BtnIcon: RepairIcon,
//     path: pathName.ADD_JOB.replace(':jobType', jobTabKeys.recovery),
//   },
// ]

const job_InspectionJob = [
  {
    btnLabel: 'job_InspectionJob',
    BtnIcon: QuoteIcon,
    path: pathName.ADD_JOB.replace(':jobType', jobTabKeys.inspection),
  },
]

const job_Dashboard = [
  {
    btnLabel: 'job_Dashboard',
    BtnIcon: DashboardIcon,
    path: pathName.DASHBOARD.replace(':type', ''),
  },
]

const home_ActiveJobs = [
  {
    btnLabel: 'job_InspectionJob',
    BtnIcon: QuoteIcon,
    path: pathName.JOBS,
    dispatchAction: setJobActiveTab({
      status: jobTabKeys.active,
      type: jobTabKeys.inspection,
    }),
    jobKey: jobTabKeys.inspection,
  },
]

// const menu_ShiftActivities = [
//   {
//     btnLabel: 'menu_ScratchTicketTracking',
//     BtnIcon: JobsIcon,
//     path: pathName.BOOK_KEEPING?.replace(':type', SCRATCH_TICKET_TRACKING),
//   },
//   {
//     btnLabel: 'menu_JohnTubes',
//     BtnIcon: CategoryManagementIcon,
//     path: pathName.BOOK_KEEPING?.replace(':type', JOHN_TUBES),
//   },
//   {
//     btnLabel: 'menu_Machines',
//     BtnIcon: MaterialManagement,
//     path: pathName.BOOK_KEEPING?.replace(':type', MACHINES),
//   },
//   {
//     btnLabel: 'menu_Cashback',
//     BtnIcon: GeneralLedger,
//     path: pathName.BOOK_KEEPING?.replace(':type', CASHBACK),
//   },
//   {
//     btnLabel: 'menu_VendorPayout',
//     BtnIcon: GeneralLedger,
//     path: pathName.BOOK_KEEPING?.replace(':type', VENDOR_PAYOUT),
//   },
// ]

// const menu_Reporting = [
//   {
//     btnLabel: 'menu_ShiftReport',
//     BtnIcon: GeneralLedger,
//     path: pathName.BOOK_KEEPING?.replace(':type', SHIFT),
//   },
// ]

//role-wise listing
const roleWiseData = {
  [admin]: [],
  [districtHostelDepartment]: [{ job_InspectionJob }, { home_ActiveJobs }],
  [inspectionOfficer]: [{ job_InspectionJob }, { home_ActiveJobs }],
  [districtCollector]: [{ job_Dashboard }, { home_ActiveJobs }],
}

export default roleWiseData
