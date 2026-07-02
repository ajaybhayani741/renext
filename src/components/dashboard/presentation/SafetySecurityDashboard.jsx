import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import administrationGovernance from '../container/administrationGovernance.container'
// Legacy chart API disabled while its charts are hidden.
// import safetySecurity from '../container/safetySecurity.container'
import { safetySecurityCharts } from '../dashboard.description'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModernFrequencyChart from '../shared/ModernFrequencyChart'
import ModuleFilters from '../shared/ModuleFilters'

const chartAesthetics = {
  dash_NumberOfCCTVsAvailable: {
    color: '#8B5CF6',
    colorEnd: '#A78BFA',
    defaultBinSize: 3,
    barSize: 120,
  },
  dash_NumberOfCCTVsFunctioning: {
    color: '#06B6D4',
    colorEnd: '#67E8F9',
    defaultBinSize: 3,
    barSize: 120,
  },
}

const SafetySecurityDashboard = () => {
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    onRangeChange,
  } = {} // safetySecurity({ hostelFilter })
  const {
    pieData,
    handleChartClick: handleAssessmentChartClick,
    selectedColumn: assessmentSelectedColumn,
    handleCloseModal: handleAssessmentCloseModal,
    handleTableChange: handleAssessmentTableChange,
    hostelsData: assessmentHostelsData,
  } = administrationGovernance({
    hostelFilter,
    moduleName: 'SAFETY_SECURITY',
  })
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      handleCloseModal={handleAssessmentCloseModal}
      selectedColumn={assessmentSelectedColumn}
      handleTableChange={handleAssessmentTableChange}
      hostelsData={assessmentHostelsData}
    >
      <div className="dashboard-module-surface dashboard-safety-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
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
          {entries(safetySecurityCharts)?.map(([key, value]) => {
            const isAnimalThreat = isEqual(key, 'dash_AnimalThreat')

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
                      ...chartAesthetics[key],
                    }}
                  />
                ) : isEqual(value?.type, 'columnCompare') ? (
                  <ModernCompareChart
                    {...{
                      name: key,
                      chartData: axisOptions?.[key],
                      handleChartClick,
                      seriesData: seriesData?.[key]?.series,
                      title: t(key),
                      showFooterTitle: false,
                      titlePosition: 'header',
                      barSize: isAnimalThreat ? 72 : 96,
                      barColors: isAnimalThreat ? ['#F59E0B'] : undefined,
                      showLegend: !isAnimalThreat,
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

export default SafetySecurityDashboard
