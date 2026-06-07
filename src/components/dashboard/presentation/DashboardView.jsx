import '../dashboard.scss'

import ConductionMeetingsDashboard from './ConductionMeetingsDashboard'
import EducationFacilitiesDashboard from './EducationFacilitiesDashboard'
import FeedbackDashboard from './FeedbackDashboard'
import FoodProvisionsDashboard from './FoodProvisionsDashboard'
import HostelAuthorityDashboard from './HostelAuthorityDashboard'
import HostelInfraRoomsDashboard from './HostelInfraRoomsDashboard'
import HostelInfraSanitationDashboard from './HostelInfraSanitationDashboard'
import MedicalCareDashboard from './MedicalCareDashboard'
import PhotosDashboard from './PhotosDashboard'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import PageNotFound from '../../PageNotFound'
import { cardKeys, cardList } from '../dashboard.description'
import RecordMaintenanceDashboard from './RecordMaintenanceDashboard'
import SafetySecurityDashboard from './SafetySecurityDashboard'
import StaffDetailsDashboard from './StaffDetailsDashboard'
import StudentsDashboard from './StudentsDashboard'
import { DASHBOARD_TXT } from '../../../routing/pathName.constant'
import { isEqual } from '../../../utils/javascript'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'

const DashboardView = () => {
  const { t } = useTranslations()
  const { params, navigate } = useRouter()

  const getDashboardComponent = type => {
    switch (type) {
      case cardKeys.hostelAuthority:
        return <HostelAuthorityDashboard />
      case cardKeys.students:
        return <StudentsDashboard />
      case cardKeys.recordMaintenance:
        return <RecordMaintenanceDashboard />
      case cardKeys.staffDetails:
        return <StaffDetailsDashboard />
      case cardKeys.hostelInfraRooms:
        return <HostelInfraRoomsDashboard />
      case cardKeys.hostelInfraSanitation:
        return <HostelInfraSanitationDashboard />
      case cardKeys.medicalCare:
        return <MedicalCareDashboard />
      case cardKeys.educationFacilities:
        return <EducationFacilitiesDashboard />
      case cardKeys.foodProvisions:
        return <FoodProvisionsDashboard />
      case cardKeys.safetyAndSecurity:
        return <SafetySecurityDashboard />
      case cardKeys.conductionMeetings:
        return <ConductionMeetingsDashboard />
      case cardKeys.feedback:
        return <FeedbackDashboard />
      case cardKeys.photos:
        return <PhotosDashboard />

      default:
        return <PageNotFound />
    }
  }

  const handleOnClick = path => (path ? navigate(path) : null)

  const currentData = cardList.find(card => isEqual(card.key, params?.type))

  return (
    <div className="dashboard-view bg-background min-h-screen">
      <div className="flex flex-wrap items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white gap-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 m-0">
            {currentData ? t(currentData.subLabel || currentData.label) : t('job_Dashboard')}
          </h1>
        </div>
        <FiscalYearSelect setDefault={false} className="ml-auto" />
      </div>
      <div className="flex-1">
        {getDashboardComponent(params?.type)}
      </div>
    </div>
  )
}

export default DashboardView
