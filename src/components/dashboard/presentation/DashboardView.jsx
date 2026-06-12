import '../dashboard.scss'

import { motion } from 'framer-motion'

import ConductionMeetingsDashboard from './ConductionMeetingsDashboard'
import EducationFacilitiesDashboard from './EducationFacilitiesDashboard'
import FeedbackDashboard from './FeedbackDashboard'
import FoodProvisionsDashboard from './FoodProvisionsDashboard'
import HostelAuthorityDashboard from './HostelAuthorityDashboard'
import HostelInfraRoomsDashboard from './HostelInfraRoomsDashboard'
import HostelInfraSanitationDashboard from './HostelInfraSanitationDashboard'
import MedicalCareDashboard from './MedicalCareDashboard'
import PhotosDashboard from './PhotosDashboard'
import RecordMaintenanceDashboard from './RecordMaintenanceDashboard'
import SafetySecurityDashboard from './SafetySecurityDashboard'
import StaffDetailsDashboard from './StaffDetailsDashboard'
import StudentsDashboard from './StudentsDashboard'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { DASHBOARD_TXT } from '../../../routing/pathName.constant'
import { isEqual } from '../../../utils/javascript'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import PageNotFound from '../../PageNotFound'
import { cardKeys, cardList } from '../dashboard.description'
import BackButton from '../shared/BackButton'
import DashboardHeader from '../shared/DashboardHeader'

const DashboardView = () => {
  const { t } = useTranslations()
  const { navigate, params } = useRouter()

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

  const currentData = cardList.find(card => isEqual(card.key, params?.type))

  return (
    <div className="dashboard-view dashboard-container">
      <DashboardHeader
        title={currentData ? t(currentData.subLabel || currentData.label) : t('job_Dashboard')}
        subtitle={currentData?.label ? t(currentData.label) : ''}
        action={<FiscalYearSelect setDefault={false} className="ml-auto" />}
      />
      <motion.div
        className="dashboard-view-content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <BackButton
          label="Back to Dashboard Grid"
          onClick={() => navigate(DASHBOARD_TXT)}
          className="dashboard-back-button"
        />
        {getDashboardComponent(params?.type)}
      </motion.div>
    </div>
  )
}

export default DashboardView
