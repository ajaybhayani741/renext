import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import HCPieChart from '../../charts/HCPieChart'
import LineCharts from '../../charts/LineCharts'
import hostelInfraSanitation from '../container/hostelInfraSanitation.container'
import { hostelInfraSanitationCharts } from '../dashboard.description'

const HostelInfraSanitationDashboard = () => {
  const { t } = useTranslations()
  const {
    // axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = hostelInfraSanitation()

  return (
    <DashboardWrapper
      {...{ handleCloseModal, hostelsData, selectedColumn, handleTableChange }}
    >
      {entries(hostelInfraSanitationCharts)?.map(([key, value]) => {
        return (
          <ANTDColumn xs={24} md={value?.md || 12} key={key}>
            {isEqual(value?.type, 'rangeFrequency') ? (
              <LineCharts
                {...{
                  name: key,
                  // axisOptions: axisOptions?.[key],
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}: ${seriesData?.[key]?.total || 0}`,
                  xAxisTitle: value?.xAxisText,
                  yAxisTitle: value?.yAxisText,
                }}
              />
            ) : isEqual(value?.type, 'columnCompare') ? (
              <ColumnComparison
                {...{
                  name: key,
                  chartData: seriesData?.[key]?.chartData,
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}`,
                }}
              />
            ) : isEqual(value?.type, 'pie') ? (
              <HCPieChart
                {...{
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}`,
                  name: key,
                }}
              />
            ) : null}
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default HostelInfraSanitationDashboard
