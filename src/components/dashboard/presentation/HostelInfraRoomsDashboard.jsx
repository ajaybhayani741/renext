import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import FrequencyBarRange from '../../charts/FrequencyBarRange'
import hostelInfraRooms from '../container/hostelInfraRooms.container'
import { hostelInfraRoomsCharts } from '../dashboard.description'
import DashboardWrapper from './DashboardWrapper'

const HostelInfraRoomsDashboard = () => {
  const { t } = useTranslations()
  const {
    axisOptions,
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
        // chartClassName: 'w-100',
      }}
    >
      {axisOptions &&
        entries(hostelInfraRoomsCharts)?.map(([key, value]) => {
          return (
            <ANTDColumn xs={24} md={12} key={key}>
              {isEqual(value?.chartType, 'column') ? (
                <ColumnComparison
                  {...{
                    chartData: axisOptions?.[key],
                    handleChartClick,
                    seriesData: seriesData?.[key],
                    title: t(key),
                    name: key,
                  }}
                />
              ) : (
                <FrequencyBarRange
                  {...{
                    name: key,
                    axisOptions: axisOptions?.[key],
                    handleChartClick,
                    seriesData: seriesData?.[key],
                    title: `${t(key)}: ${value?.total}`,
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
