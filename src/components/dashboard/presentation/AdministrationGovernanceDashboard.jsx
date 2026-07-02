import DashboardWrapper from './DashboardWrapper'
import administrationGovernance from '../container/administrationGovernance.container'
import CommonPieChart from '../shared/CommonPieChart'

const administrationGovernancePieData = [
  {
    name: 'Satisfactory',
    value: 60,
    color: '#58b766',
    category: 'Satisfactory',
    categoryValue: 'SATISFACTORY',
  },
  {
    name: 'Needs Attention',
    value: 25,
    color: '#f8c21c',
    category: 'Needs Attention',
    categoryValue: 'NEEDS_ATTENTION',
  },
  {
    name: 'Critical',
    value: 15,
    color: '#ef4444',
    category: 'Critical',
    categoryValue: 'CRITICAL',
  },
]

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
          <div className="dashboard-full-chart">
            <CommonPieChart
              data={administrationGovernancePieData}
              handleChartClick={handleChartClick}
              name="dash_AdministrationGovernance"
            />
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default AdministrationGovernanceDashboard
