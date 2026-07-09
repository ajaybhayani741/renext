import CommonPieChart from './CommonPieChart'

const InspectionAssessmentPieChart = ({
  data,
  handleChartClick,
  name,
}) => (
  <div className="dashboard-full-chart">
    <CommonPieChart
      data={data}
      handleChartClick={handleChartClick}
      name={name}
    />
  </div>
)

export default InspectionAssessmentPieChart