import DashboardWrapper from './DashboardWrapper'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ColumnComparison from '../../charts/ColumnComparison'
import hostelAuthority from '../container/hostelAuthority.container'

const HostelAuthorityDashboard = () => {
  const {
    title,
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
  } = hostelAuthority()

  return (
    <DashboardWrapper {...{ handleCloseModal, selectedColumn }}>
      <ANTDColumn xs={24} md={12}>
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

export default HostelAuthorityDashboard
