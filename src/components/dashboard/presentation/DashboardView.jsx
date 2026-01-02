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
import ANTDBreadcrumb from '../../../shared/antd/ANTDBreadcrumb'
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

  const getCurrentPath = () => {
    const currentData = cardList.find(card => isEqual(card.key, params?.type))
    let pathItems = [
      {
        title: t('job_Dashboard'),
        className: 'cursor-pointer text-underline',
        onClick: () => handleOnClick(DASHBOARD_TXT),
      },
      { title: t(currentData?.label) },
      ...(currentData?.subLabel ? [{ title: t(currentData?.subLabel) }] : []),
    ]
    return <ANTDBreadcrumb separator=">" items={pathItems} />
  }

  return (
    <div className="dashboard-view">
      <div className="d-flex justify-content-between">
        <div className="breadCrumb">{getCurrentPath()}</div>
        <FiscalYearSelect className="ml-auto mb-10" setDefault={false} />
      </div>
      {getDashboardComponent(params?.type)}
    </div>
  )
}

export default DashboardView
