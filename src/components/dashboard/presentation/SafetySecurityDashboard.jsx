import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import LineCharts from '../../charts/LineCharts'
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
      {axisOptions &&
        entries(safetySecurityCharts)?.map(([key, value]) => {
          return (
            <ANTDColumn xs={24} md={value?.md || 12} key={key}>
              {isEqual(value?.type, 'rangeFrequency') ? (
                <LineCharts
                  {...{
                    name: key,
                    handleChartClick,
                    seriesData: seriesData?.[key]?.series,
                    title: `${t(key)}: ${seriesData?.[key]?.total || 0}`,
                    xAxisTitle: value?.xAxisText,
                    yAxisTitle: value?.yAxisText,
                    onRangeChange,
                  }}
                />
              ) : isEqual(value?.type, 'columnCompare') ? (
                <ColumnComparison
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
