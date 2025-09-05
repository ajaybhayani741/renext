import '../dashboard.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDTab from '../../../shared/antd/ANTDTab'
import dashboard from '../container/dashboard.conainer'
import { tabKeys } from '../dashboard.description'
import DashboardContext from '../DashboardContext'
import EducationalSupportMetrics from './EducationalSupportMetrics'
import FoodAndSuppliesMetrics from './FoodAndSuppliesMetrics'
import HealthAndSafetyMetrics from './HealthAndSafetyMetrics'
import InfrastructureMetrics from './InfrastructureMetrics'
import StaffMetrics from './StaffMetrics'
import StudentMetrics from './StudentMetrics'

const Dashboard = () => {
  const { t } = useTranslations()
  const { handleTabChange, activeTab, getFilterValue } = dashboard()

  const tabList = [
    {
      label: 'dash_StudentMetrics',
      key: tabKeys.studentMetrics,
      children: <StudentMetrics />,
    },
    {
      label: 'dash_StaffMetrics',
      key: tabKeys.staffMetrics,
      children: <StaffMetrics />,
    },
    {
      label: 'dash_InfrastructureMetrics',
      key: tabKeys.infrastructureMetrics,
      children: <InfrastructureMetrics />,
    },
    {
      label: 'dash_FoodSuppliesMetrics',
      key: tabKeys.foodSuppliesMetrics,
      children: <FoodAndSuppliesMetrics />,
    },
    {
      label: 'dash_HealthSafetyMetrics',
      key: tabKeys.healthSafetyMetrics,
      children: <HealthAndSafetyMetrics />,
    },
    {
      label: 'dash_EducationalSupportMetrics',
      key: tabKeys.educationalSupportMetrics,
      children: <EducationalSupportMetrics />,
    },
  ]

  return (
    <>
      <h2 className="page-title">{t('job_Dashboard')}</h2>
      <DashboardContext.Provider value={{ handleTabChange, getFilterValue }}>
        <ANTDTab
          activeKey={activeTab}
          items={tabList.map(({ key, addHeader, ...item }) => ({
            ...item,
            key,
            label: t(item.label),
          }))}
          centered
          onChange={handleTabChange}
        />
      </DashboardContext.Provider>
    </>
  )
}

export default Dashboard
