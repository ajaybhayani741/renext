import CommonPieChart from './CommonPieChart'

export const inspectionAssessmentPieData = [
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

const InspectionAssessmentPieChart = ({ handleChartClick, name }) => (
  <div className="dashboard-full-chart">
    <CommonPieChart
      data={inspectionAssessmentPieData}
      handleChartClick={handleChartClick}
      name={name}
    />
  </div>
)

export default InspectionAssessmentPieChart
