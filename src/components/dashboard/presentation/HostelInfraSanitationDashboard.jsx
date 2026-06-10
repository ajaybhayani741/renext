import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import hostelInfraSanitation from '../container/hostelInfraSanitation.container'
import { hostelInfraSanitationCharts } from '../dashboard.description'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModernPieChart from '../shared/ModernPieChart'
import ModuleFilters from '../shared/ModuleFilters'

const chartAesthetics = {
  dash_TotalToiletsAvailable: {
    color: '#8B5CF6',
    colorEnd: '#A78BFA',
    defaultBinSize: 3,
    barSize: 120,
  },
  job_PercentageOfTotalToiletsFunctioning: {
    color: '#06B6D4',
    colorEnd: '#67E8F9',
    defaultBinSize: 5,
    barSize: 92,
  },
}

const HostelInfraSanitationDashboard = () => {
  const { t } = useTranslations()
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    onRangeChange,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = hostelInfraSanitation()

  return (
    <DashboardWrapper
      {...{ handleCloseModal, hostelsData, selectedColumn, handleTableChange }}
    >
      <div className="dashboard-module-surface dashboard-sanitation-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {entries(hostelInfraSanitationCharts)?.map(([key, value]) => {
            const aesthetic = chartAesthetics[key] || chartAesthetics.dash_TotalToiletsAvailable

            return (
              <div className="dashboard-full-chart" key={key}>
                {isEqual(value?.type, 'rangeFrequency') ? (
                  <ModernFrequencyChart
                    {...{
                      name: key,
                      xAxisTitle: value?.xAxisText,
                      yAxisTitle: value?.yAxisText,
                      handleChartClick,
                      seriesData: seriesData?.[key],
                      title: t(key),
                      total: seriesData?.[key]?.total || 0,
                      onRangeChange,
                      ...aesthetic,
                    }}
                  />
                ) : isEqual(value?.type, 'columnCompare') ? (
                  <ModernCompareChart
                    {...{
                      name: key,
                      chartData: seriesData?.[key]?.chartData,
                      handleChartClick,
                      seriesData: seriesData?.[key]?.series,
                      title: t(key),
                      showFooterTitle: false,
                      titlePosition: 'header',
                      barSize: isEqual(key, 'dash_ToiletsSufficiency') ? 110 : 74,
                    }}
                  />
                ) : isEqual(value?.type, 'pie') ? (
                  <ModernPieChart
                    {...{
                      handleChartClick,
                      seriesData: seriesData?.[key]?.series,
                      title: t(key),
                      name: key,
                    }}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default HostelInfraSanitationDashboard
