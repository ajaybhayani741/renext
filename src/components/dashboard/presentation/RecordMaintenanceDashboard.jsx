import DashboardWrapper from './DashboardWrapper'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ColumnComparison from '../../charts/ColumnComparison'
import recordMaintenance from '../container/recordMaintenance.container'

const RecordMaintenanceDashboard = () => {
  const {
    title,
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
  } = recordMaintenance()

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, chartClassName: 'w-100' }}
    >
      <ANTDColumn xs={24}>
        <ColumnComparison
          {...{
            chartData,
            handleChartClick,
            seriesData,
            title,
          }}
        />
      </ANTDColumn>
    </DashboardWrapper>
  )
}

export default RecordMaintenanceDashboard
