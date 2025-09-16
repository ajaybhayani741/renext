import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries } from '../../../utils/javascript'
import FrequencyBarRange from '../../charts/FrequencyBarRange'
import staffDetails from '../container/staffDetails.container'
import { staffDetailsCharts } from '../dashboard.description'

const StaffDetailsDashboard = () => {
  const { t } = useTranslations()
  const {
    axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
  } = staffDetails()

  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        // chartClassName: 'w-100',
      }}
    >
      {axisOptions &&
        entries(staffDetailsCharts)?.map(([key, value]) => {
          return (
            <ANTDColumn xs={24} md={12} key={key}>
              <FrequencyBarRange
                {...{
                  name: key,
                  axisOptions: axisOptions?.[key],
                  handleChartClick,
                  seriesData: seriesData?.[key],
                  title: `${t(key)}: ${value?.total}`,
                }}
              />
            </ANTDColumn>
          )
        })}
    </DashboardWrapper>
  )
}

export default StaffDetailsDashboard
