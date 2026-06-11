import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import medicalCare from '../container/medicalCare.container'
import { medicalCareCharts } from '../dashboard.description'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModernPieChart from '../shared/ModernPieChart'
import ModuleFilters from '../shared/ModuleFilters'

const chartAesthetics = {
  job_DistanceToNearestPHC: {
    color: '#8B5CF6',
    colorEnd: '#A78BFA',
    defaultBinSize: 3,
    barSize: 120,
  },
}

const MedicalCareDashboard = () => {
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
    onRangeChange,
  } = medicalCare({ hostelFilter })
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-medical-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {entries(medicalCareCharts)?.map(([key, value]) => {
            return (
              <div className="dashboard-full-chart" key={key}>
                {isEqual(value?.type, 'columnCompare') ? (
                  <ModernCompareChart
                    {...{
                      name: key,
                      chartData: seriesData?.[key]?.chartData,
                      handleChartClick,
                      seriesData: seriesData?.[key]?.series,
                      title: t(key),
                      showFooterTitle: false,
                      titlePosition: 'header',
                      barSize: 96,
                    }}
                  />
                ) : isEqual(value?.type, 'rangeFrequency') ? (
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
                      ...chartAesthetics[key],
                    }}
                  />
                ) : isEqual(value?.type, 'pie') ? (
                  <ModernPieChart
                    {...{
                      handleChartClick,
                      seriesData: seriesData?.[key]?.series,
                      title: t(key),
                      name: key,
                      colors: ['#22C55E', '#F59E0B', '#EF4444'],
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

export default MedicalCareDashboard
