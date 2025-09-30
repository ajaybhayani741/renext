import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import FrequencyBarRange from '../../charts/FrequencyBarRange'
import HCPieChart from '../../charts/HCPieChart'
import hostelInfraSanitation from '../container/hostelInfraSanitation.container'
import { hostelInfraSanitationCharts } from '../dashboard.description'

const HostelInfraSanitationDashboard = () => {
  const { t } = useTranslations()
  const {
    axisOptions,
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
      {axisOptions &&
        entries(hostelInfraSanitationCharts)?.map(([key, value]) => {
          return (
            <ANTDColumn xs={24} md={value?.md || 12} key={key}>
              {isEqual(value?.type, 'rangeFrequency') ? (
                <FrequencyBarRange
                  {...{
                    name: key,
                    axisOptions: axisOptions?.[key],
                    handleChartClick,
                    seriesData: seriesData?.[key],
                    title: `${t(key)}: ${value?.total}`,
                  }}
                />
              ) : isEqual(value?.type, 'columnCompare') ? (
                <ColumnComparison
                  {...{
                    name: key,
                    chartData: seriesData?.[key]?.chartData,
                    handleChartClick,
                    seriesData: seriesData?.[key]?.seriesData,
                    title: `${t(key)}`,
                  }}
                />
              ) : isEqual(value?.type, 'pie') ? (
                <HCPieChart
                  {...{
                    handleChartClick,
                    seriesData: seriesData?.[key],
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
