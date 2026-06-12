import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries } from '../../../utils/javascript'
import staffDetails from '../container/staffDetails.container'
import { staffDetailsCharts } from '../dashboard.description'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModuleFilters from '../shared/ModuleFilters'

const chartAesthetics = {
  dash_TotalNumberOfWorkersOnPayroll: {
    color: '#8B5CF6',
    colorEnd: '#A78BFA',
    defaultBinSize: 3,
    barSize: 92,
  },
  dash_TotalNumberOfCooksEnrolled: {
    color: '#06B6D4',
    colorEnd: '#67E8F9',
    defaultBinSize: 2,
    barSize: 92,
  },
  dash_TotalNumberOfKamatiEnrolled: {
    color: '#F59E0B',
    colorEnd: '#FCD34D',
    defaultBinSize: 1,
    barSize: 92,
  },
  dash_TotalNumberOfWatchmenEnrolled: {
    color: '#EC4899',
    colorEnd: '#F9A8D4',
    defaultBinSize: 1,
    barSize: 92,
  },
  dash_TotalNumberOfScavengersAvailable: {
    color: '#10B981',
    colorEnd: '#6EE7B7',
    defaultBinSize: 1,
    barSize: 92,
  },
  dash_TotalNumberOfScavengersRequired: {
    color: '#3B82F6',
    colorEnd: '#93C5FD',
    defaultBinSize: 1,
    barSize: 92,
  },
}

const StaffDetailsDashboard = () => {
  const { t } = useTranslations()
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    onRangeChange,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
  } = staffDetails({ hostelFilter })

  return (
    <DashboardWrapper
      {...{
        selectedColumn,
        handleCloseModal,
        hostelsData,
        handleTableChange,
      }}
    >
      <div className="dashboard-module-surface dashboard-staff-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {entries(staffDetailsCharts)?.map(([key, value]) => {
            const aesthetic = chartAesthetics[key] || chartAesthetics.dash_TotalNumberOfWorkersOnPayroll

            return (
              <div className="dashboard-full-chart" key={key}>
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
                    rangeResetKey: `${districtFilter}:${hostelFilter}`,
                    ...aesthetic,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default StaffDetailsDashboard
