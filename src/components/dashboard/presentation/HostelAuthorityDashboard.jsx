import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import hostelAuthority from '../container/hostelAuthority.container'
import { hostelAuthorityCharts } from '../dashboard.description'

const HostelAuthorityDashboard = () => {
  const { t } = useTranslations()
  const {
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = hostelAuthority()

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      {entries(hostelAuthorityCharts)?.map(([key]) => {
        return (
          <ANTDColumn xs={24} md={12} key={key}>
            <ColumnComparison
              {...{
                name: key,
                chartData,
                handleChartClick,
                seriesData: seriesData?.[key]?.series,
                title: `${t(key)}`,
              }}
            />
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default HostelAuthorityDashboard
