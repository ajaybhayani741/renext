import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries } from '../../../utils/javascript'
import administrationGovernance from '../container/administrationGovernance.container'
// Legacy chart API disabled while its charts are hidden.
// import staffDetails from '../container/staffDetails.container'
import { staffDetailsCharts } from '../dashboard.description'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'
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
    handleChartClick,
  } = {} // staffDetails({ hostelFilter })
  const {
    pieData,
    handleChartClick: handleAssessmentChartClick,
    selectedColumn: assessmentSelectedColumn,
    handleCloseModal: handleAssessmentCloseModal,
    handleTableChange: handleAssessmentTableChange,
    hostelsData: assessmentHostelsData,
    questionOptions: assessmentQuestionOptions,
    questionName: assessmentQuestionName,
    setQuestionName: setAssessmentQuestionName,
  } = administrationGovernance({
    hostelFilter,
    moduleName: 'ELECTRICITY_LIGHTING',
  })

  return (
    <DashboardWrapper
      handleCloseModal={handleAssessmentCloseModal}
      selectedColumn={assessmentSelectedColumn}
      handleTableChange={handleAssessmentTableChange}
      hostelsData={assessmentHostelsData}
    >
      <div className="dashboard-module-surface dashboard-staff-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
          questionOptions={assessmentQuestionOptions}
          questionName={assessmentQuestionName}
          onQuestionChange={setAssessmentQuestionName}
        />
        <div className="dashboard-single-chart-grid">
          <InspectionAssessmentPieChart
            data={pieData}
            handleChartClick={handleAssessmentChartClick}
            name="dash_AdministrationGovernance"
          />
          {/* Existing category charts are intentionally hidden for now. */}
          {false && (
            <>
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
            </>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default StaffDetailsDashboard
