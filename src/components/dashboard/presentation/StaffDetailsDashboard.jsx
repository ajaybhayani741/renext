import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import HCBarChart from '../../charts/HCBarChart'
import staffDetails from '../container/staffDetails.container'
import { staffDetailsCharts } from '../dashboard.description'

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
            <HCBarChart
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
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default StaffDetailsDashboard
