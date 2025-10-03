import DashboardWrapper from './DashboardWrapper'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import LineCharts from '../../charts/LineCharts'
import students from '../container/students.container'

const StudentsDashboard = () => {
  const {
    title,
    // axisOptions,
    xAxisTitle,
    yAxisTitle,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
  } = students()
  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        hostelsData,
        handleTableChange,
        chartClassName: 'w-100',
      }}
    >
      <ANTDColumn xs={24} md={24}>
        <LineCharts
          {...{
            // axisOptions,
            xAxisTitle,
            yAxisTitle,
            handleChartClick,
            seriesData: seriesData?.['dash_Students']?.series,
            title: `${title}: ${seriesData?.['dash_Students']?.total || 0}`,
          }}
        />
      </ANTDColumn>
    </DashboardWrapper>
  )
}

export default StudentsDashboard
