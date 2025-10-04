import DashboardWrapper from './DashboardWrapper'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import LineCharts from '../../charts/LineCharts'
import students from '../container/students.container'
import { studentCharts } from '../dashboard.description'

const StudentsDashboard = () => {
  const {
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
    onRangeChange,
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
      {' '}
      {entries(studentCharts)?.map(([key, value]) => {
        return (
          <ANTDColumn xs={24} md={24} key={key}>
            <LineCharts
              {...{
                name: key,
                xAxisTitle: value?.xAxisText,
                yAxisTitle: value?.yAxisText,
                handleChartClick,
                seriesData: seriesData?.[key]?.series,
                title: `${key}: ${seriesData?.[key]?.total || 0}`,
                onRangeChange,
              }}
            />
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default StudentsDashboard
