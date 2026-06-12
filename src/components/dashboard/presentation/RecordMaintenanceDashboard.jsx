import { useMemo, useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries } from '../../../utils/javascript'
import recordMaintenance from '../container/recordMaintenance.container'
import { recordMaintenanceCharts } from '../dashboard.description'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModuleFilters from '../shared/ModuleFilters'

const RecordMaintenanceDashboard = () => {
  const { t } = useTranslations()
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = recordMaintenance({ hostelFilter })

  const categoryLabels = useMemo(
    () => chartData?.category?.map((_, index) => `${index + 1}`) || [],
    [chartData],
  )

  const legendMapping = useMemo(
    () =>
      chartData?.category?.reduce(
        (acc, category, index) => ({
          ...acc,
          [`${index + 1}`]: t(category) || category,
        }),
        {},
      ) || {},
    [chartData, t],
  )

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
      <div className="dashboard-module-surface dashboard-record-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {entries(recordMaintenanceCharts)?.map(([key]) => {
            return (
              <div className="dashboard-full-chart" key={key}>
                <ModernCompareChart
                  {...{
                    name: key,
                    chartData,
                    handleChartClick,
                    seriesData: seriesData?.[key]?.series,
                    title: `${t(key)}`,
                    categoryLabels,
                    legendMapping,
                    showFooterTitle: false,
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

export default RecordMaintenanceDashboard
