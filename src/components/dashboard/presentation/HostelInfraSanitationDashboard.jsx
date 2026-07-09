import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import administrationGovernance from '../container/administrationGovernance.container'
// Legacy chart API disabled while its charts are hidden.
// import hostelInfraSanitation from '../container/hostelInfraSanitation.container'
import { hostelInfraSanitationCharts } from '../dashboard.description'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'
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
  } = {} // hostelInfraSanitation({ hostelFilter })
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
    moduleName: 'SANITATION_DRAINAGE',
  })

  return (
    <DashboardWrapper
      handleCloseModal={handleAssessmentCloseModal}
      selectedColumn={assessmentSelectedColumn}
      handleTableChange={handleAssessmentTableChange}
      hostelsData={assessmentHostelsData}
    >
      <div className="dashboard-module-surface dashboard-sanitation-surface">
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
                      rangeResetKey: `${districtFilter}:${hostelFilter}`,
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
            </>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default HostelInfraSanitationDashboard
