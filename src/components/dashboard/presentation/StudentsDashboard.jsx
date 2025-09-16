import DashboardWrapper from './DashboardWrapper'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import FrequencyBarRange from '../../charts/FrequencyBarRange'
import students from '../container/students.container'

const StudentsDashboard = () => {
  const {
    title,
    axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
  } = students()
  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        chartClassName: 'w-100',
      }}
    >
      <ANTDColumn xs={24} md={12}>
        <FrequencyBarRange
          {...{
            axisOptions,
            handleChartClick,
            seriesData,
            title: `${title}: ${1200}`,
          }}
        />
      </ANTDColumn>
    </DashboardWrapper>
  )
}

export default StudentsDashboard
