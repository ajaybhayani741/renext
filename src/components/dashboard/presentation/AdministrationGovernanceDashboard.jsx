import DashboardWrapper from './DashboardWrapper'
import administrationGovernance from '../container/administrationGovernance.container'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'

const AdministrationGovernanceDashboard = () => {
  const {
    handleChartClick,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = administrationGovernance()

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-authority-surface">
        <div className="dashboard-single-chart-grid">
          <InspectionAssessmentPieChart
            handleChartClick={handleChartClick}
            name="dash_AdministrationGovernance"
          />
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default AdministrationGovernanceDashboard
