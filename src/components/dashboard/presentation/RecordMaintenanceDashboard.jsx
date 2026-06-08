import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import ModernCompareChart from '../shared/ModernCompareChart'
import recordMaintenance from '../container/recordMaintenance.container'
import { recordMaintenanceCharts } from '../dashboard.description'

const RecordMaintenanceDashboard = () => {
  const { t } = useTranslations()
  const {
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = recordMaintenance()

  return (
    <DashboardWrapper
      {...{
        handleCloseModal,
        selectedColumn,
        chartClassName: 'w-100',
        handleTableChange,
        hostelsData,
      }}
    >
      {entries(recordMaintenanceCharts)?.map(([key]) => {
        return (
          <ANTDColumn xs={24} md={24} key={key}>
            <ModernCompareChart
              {...{
                name: key,
                chartData,
                handleChartClick,
                seriesData: seriesData?.[key]?.series,
                title: `${t(key)}`,
              }}
            />
          </ANTDColumn>
        )
      })}
    </DashboardWrapper>
  )
}

export default RecordMaintenanceDashboard
