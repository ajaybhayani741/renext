import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import HCBarChart from '../../charts/HCBarChart'
import students from '../container/students.container'
import { studentCharts } from '../dashboard.description'
import DashboardWrapper from './DashboardWrapper'

const StudentsDashboard = () => {
  const { t } = useTranslations()
  const {
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
    onRangeChange,
  } = students()
  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        hostelsData,
        handleTableChange,
        chartClassName: 'w-100',
      }}
    >
      {entries(studentCharts)?.map(([key, value]) => {
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

export default StudentsDashboard
