import DashboardWrapper from './DashboardWrapper'
import administrationGovernance from '../container/administrationGovernance.container'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'

const AdministrationGovernanceDashboard = () => {
  const {
    pieData,
    handleChartClick,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = administrationGovernance({ moduleName: 'ADMINISTRATION_GOVERNANCE' })

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-authority-surface">
        <div className="dashboard-single-chart-grid">
          <InspectionAssessmentPieChart
            data={pieData}
            handleChartClick={handleChartClick}
            name="dash_AdministrationGovernance"
          />
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default AdministrationGovernanceDashboard
