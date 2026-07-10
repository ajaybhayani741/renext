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
  mandalSpecialOfficer,
} = userWiseRole

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

const roleWiseData = {
  [admin]: [],
  [districtHostelDepartment]: [{ job_InspectionJob }, { home_ActiveJobs }],
  [inspectionOfficer]: [{ job_InspectionJob }, { home_ActiveJobs }],
  [districtCollector]: [{ job_Dashboard }, { home_ActiveJobs }],
  [mandalSpecialOfficer]: [{ job_Dashboard }, { home_ActiveJobs }],
}

export default roleWiseData
