import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import administrationGovernance from '../container/administrationGovernance.container'
// Legacy chart API disabled while its charts are hidden.
// import medicalCare from '../container/medicalCare.container'
import { medicalCareCharts } from '../dashboard.description'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'
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
    onRangeChange,
  } = {} // medicalCare({ hostelFilter })
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
    moduleName: 'HEALTH_MEDICAL_CARE',
  })
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      handleCloseModal={handleAssessmentCloseModal}
      selectedColumn={assessmentSelectedColumn}
      handleTableChange={handleAssessmentTableChange}
      hostelsData={assessmentHostelsData}
    >
      <div className="dashboard-module-surface dashboard-medical-surface">
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
                      rangeResetKey: `${districtFilter}:${hostelFilter}`,
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
            </>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default MedicalCareDashboard
