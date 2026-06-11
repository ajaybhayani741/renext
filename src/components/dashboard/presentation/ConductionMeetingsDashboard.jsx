import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import conductionMeeting from '../container/conductionMeeting.container'
import { conductionMeetingCharts } from '../dashboard.description'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModuleFilters from '../shared/ModuleFilters'

const ConductionMeetingsDashboard = () => {
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = conductionMeeting({ hostelFilter })
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-conduction-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          {axisOptions &&
            entries(conductionMeetingCharts)?.map(([key, value]) => {
              return (
                <div className="dashboard-full-chart" key={key}>
                  {isEqual(value?.type, 'columnCompare') ? (
                    <ModernCompareChart
                      {...{
                        name: key,
                        chartData: seriesData?.[key]?.chartData,
                        handleChartClick,
                        seriesData: seriesData?.[key]?.seriesData,
                        title: t(key),
                        showFooterTitle: false,
                        titlePosition: 'header',
                        barSize: 96,
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

export default ConductionMeetingsDashboard
