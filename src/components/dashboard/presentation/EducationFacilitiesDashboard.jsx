import { useMemo, useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import administrationGovernance from '../container/administrationGovernance.container'
// Legacy chart API disabled while its charts are hidden.
// import educationFacilities from '../container/educationFacilities.container'
import { educationFacilitiesCharts } from '../dashboard.description'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModuleFilters from '../shared/ModuleFilters'

const EducationFacilitiesDashboard = () => {
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const { axisOptions, handleChartClick, seriesData } = {} // educationFacilities({ hostelFilter })
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
    moduleName: 'EDUCATION_ACADEMIC_ENVIRONMENT',
  })
  const { t } = useTranslations()

  const educationChartData =
    seriesData?.dash_EducationRequirements?.chartData || {}

  const categoryLabels = useMemo(
    () => educationChartData?.category?.map((_, index) => `${index + 1}`) || [],
    [educationChartData],
  )

  const legendMapping = useMemo(
    () =>
      educationChartData?.category?.reduce(
        (acc, category, index) => ({
          ...acc,
          [`${index + 1}`]: t(category) || category,
        }),
        {},
      ) || {},
    [educationChartData, t],
  )

  return (
    <DashboardWrapper
      handleCloseModal={handleAssessmentCloseModal}
      selectedColumn={assessmentSelectedColumn}
      handleTableChange={handleAssessmentTableChange}
      hostelsData={assessmentHostelsData}
    >
      <div className="dashboard-module-surface dashboard-education-surface">
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
              {axisOptions &&
                entries(educationFacilitiesCharts)?.map(([key, value]) => {
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
                            categoryLabels,
                            legendMapping,
                            showFooterTitle: false,
                            titlePosition: 'header',
                            barSize: 34,
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

export default EducationFacilitiesDashboard
