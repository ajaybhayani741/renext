import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries } from '../../../utils/javascript'
import hostelAuthority from '../container/hostelAuthority.container'
import { hostelAuthorityCharts } from '../dashboard.description'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModuleFilters from '../shared/ModuleFilters'

const HostelAuthorityDashboard = () => {
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
  } = hostelAuthority()

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-authority-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {entries(hostelAuthorityCharts)?.map(([key]) => {
            return (
              <div className="dashboard-full-chart" key={key}>
                <ModernCompareChart
                  {...{
                    name: key,
                    chartData,
                    handleChartClick,
                    seriesData: seriesData?.[key]?.series,
                    title: `${t(key)}`,
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

export default HostelAuthorityDashboard
