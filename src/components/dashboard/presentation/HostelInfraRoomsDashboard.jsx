import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import hostelInfraRooms from '../container/hostelInfraRooms.container'
import { hostelInfraRoomsCharts } from '../dashboard.description'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModuleFilters from '../shared/ModuleFilters'

const chartAesthetics = {
  dash_TotalNumberOfLivingRooms: {
    color: '#8B5CF6',
    colorEnd: '#A78BFA',
    defaultBinSize: 3,
    barSize: 120,
  },
  job_WorkingLightsCount: {
    color: '#06B6D4',
    colorEnd: '#67E8F9',
    defaultBinSize: 4,
    barSize: 92,
  },
  job_WorkingFansCount: {
    color: '#F59E0B',
    colorEnd: '#FCD34D',
    defaultBinSize: 3,
    barSize: 92,
  },
}

const HostelInfraRoomsDashboard = () => {
  const { t } = useTranslations()
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
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
      <div className="dashboard-module-surface dashboard-rooms-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {entries(hostelInfraRoomsCharts)?.map(([key, value]) => {
            const aesthetic = chartAesthetics[key] || chartAesthetics.dash_TotalNumberOfLivingRooms

            return (
              <div className="dashboard-full-chart" key={key}>
                {isEqual(value?.chartType, 'column') ? (
                  <ModernCompareChart
                    {...{
                      chartData: axisOptions?.[key],
                      handleChartClick,
                      seriesData: seriesData?.[key]?.series,
                      title: t(key),
                      name: key,
                      forceYesNoKeys: true,
                      showFooterTitle: false,
                      titlePosition: 'header',
                      barSize: 92,
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
                      title: `${t(key)}`,
                      total: seriesData?.[key]?.total || 0,
                      onRangeChange,
                      ...aesthetic,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default HostelInfraRoomsDashboard
