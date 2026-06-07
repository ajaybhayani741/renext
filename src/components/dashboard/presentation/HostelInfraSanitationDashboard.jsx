import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModernPieChart from '../shared/ModernPieChart'
import hostelInfraSanitation from '../container/hostelInfraSanitation.container'
import { hostelInfraSanitationCharts } from '../dashboard.description'

const HostelInfraSanitationDashboard = () => {
  const { t } = useTranslations()
  const {
    onRangeChange,
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
              <ModernFrequencyChart
                {...{
                  name: key,
                  xAxisTitle: value?.xAxisText,
                  yAxisTitle: value?.yAxisText,
                  handleChartClick,
                  seriesData: seriesData?.[key],
                  title: `${t(key)}: ${seriesData?.[key]?.total || 0}`,
                  onRangeChange,
                }}
              />
            ) : isEqual(value?.type, 'columnCompare') ? (
              <ModernCompareChart
                {...{
                  name: key,
                  chartData: seriesData?.[key]?.chartData,
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}`,
                }}
              />
            ) : isEqual(value?.type, 'pie') ? (
              <ModernPieChart
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
