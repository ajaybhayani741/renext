import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import hostelInfraRooms from '../container/hostelInfraRooms.container'
import { hostelInfraRoomsCharts } from '../dashboard.description'
import DashboardWrapper from './DashboardWrapper'

const HostelInfraRoomsDashboard = () => {
  const { t } = useTranslations()
  const {
    axisOptions,
    onRangeChange,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = hostelInfraRooms()
  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        handleTableChange,
        hostelsData,
      }}
    >
      {entries(hostelInfraRoomsCharts)?.map(([key, value]) => {
        return (
          <ANTDColumn xs={24} md={24} key={key}>
            {isEqual(value?.chartType, 'column') ? (
              <ModernCompareChart
                {...{
                  chartData: axisOptions?.[key],
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: t(key),
                  name: key,
                }}
              />
            ) : (
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
            )}
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default HostelInfraRoomsDashboard
