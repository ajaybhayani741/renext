import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModernPieChart from '../shared/ModernPieChart'
import medicalCare from '../container/medicalCare.container'
import { medicalCareCharts } from '../dashboard.description'

const MedicalCareDashboard = () => {
  const {
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
    onRangeChange,
  } = medicalCare()
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      {entries(medicalCareCharts)?.map(([key, value]) => {
        return (
          <ANTDColumn xs={24} md={value?.md || 12} key={key}>
            {isEqual(value?.type, 'columnCompare') ? (
              <ModernCompareChart
                {...{
                  name: key,
                  chartData: seriesData?.[key]?.chartData,
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}`,
                }}
              />
            ) : isEqual(value?.type, 'rangeFrequency') ? (
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

export default MedicalCareDashboard
