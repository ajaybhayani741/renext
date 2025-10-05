import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import LineCharts from '../../charts/LineCharts'
import staffDetails from '../container/staffDetails.container'
import { staffDetailsCharts } from '../dashboard.description'
import DashboardWrapper from './DashboardWrapper'

const StaffDetailsDashboard = () => {
  const { t } = useTranslations()
  const {
    onRangeChange,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
  } = staffDetails()

  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        hostelsData,
        handleTableChange,
      }}
    >
      {entries(staffDetailsCharts)?.map(([key, value]) => {
        return (
          <ANTDColumn xs={24} md={24} key={key}>
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
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default StaffDetailsDashboard
