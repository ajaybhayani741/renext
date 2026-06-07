import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import safetySecurity from '../container/safetySecurity.container'
import { safetySecurityCharts } from '../dashboard.description'
import DashboardWrapper from './DashboardWrapper'

const SafetySecurityDashboard = () => {
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
    onRangeChange,
  } = safetySecurity()
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      {entries(safetySecurityCharts)?.map(([key, value]) => {
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
                  chartData: axisOptions?.[key],
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}`,
                }}
              />
            ) : null}
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default SafetySecurityDashboard
