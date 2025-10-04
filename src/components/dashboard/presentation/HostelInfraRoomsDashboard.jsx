import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import LineCharts from '../../charts/LineCharts'
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
              <ColumnComparison
                {...{
                  chartData: axisOptions?.[key],
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: t(key),
                  name: key,
                }}
              />
            ) : (
              <LineCharts
                {...{
                  name: key,
                  onRangeChange,
                  handleChartClick,
                  seriesData: seriesData?.[key]?.series,
                  title: `${t(key)}: ${seriesData?.[key]?.total || 0}`,
                  xAxisTitle: value?.xAxisText,
                  yAxisTitle: value?.yAxisText,
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
