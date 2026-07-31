import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { length } from '../../../utils/javascript'
import { tabKeys } from '../../jobs/jobs.description'
import ViewJob from '../../jobs/presentation/viewJobs'
import dashboardWrapper from '../container/dashboardWrapper.container'

const assessmentHighlightColors = {
  SATISFACTORY: '#58b766',
  NEEDS_ATTENTION: '#f8c21c',
  CRITICAL: '#ef4444',
}

const DashboardWrapper = ({
  children,
  selectedColumn,
  handleCloseModal,
  chartClassName,
  handleTableChange = null,
  hostelsData,
  hideExportButton = false,
}) => {
  const { t } = useTranslations()
  const { hostels, loader, pageNo, lastPage } = hostelsData || {}
  const pageSize = 10
  const jobType = tabKeys?.inspection

  const {
    columns,
    jobModel,
    handleCloseJobModel,
    onGenerateReport,
    reportLoader,
  } = dashboardWrapper({
    title: selectedColumn?.title,
    pageNo,
    jobType,
    selectedColumn,
  })

  return (
    <>
      <div className="dashboard-wrapper">
        <ANTDRow
          gutter={[16, 12]}
          className={`${chartClassName ?? ''} text-center chart-view`}
        >
          {children}
        </ANTDRow>
        {selectedColumn?.selected && (
          <ANTDModal
            title={
              selectedColumn?.modalTitle
                ? `${selectedColumn?.chartData?.question || t(selectedColumn?.chartData?.category)} (${selectedColumn?.chartData?.type})`
                : t('txt_Details')
            }
            centered
            open={selectedColumn?.selected}
            onCancel={handleCloseModal}
            footer={false}
            width={850}
          >
            {!hideExportButton && (
              <div className="text-end mb-5">
                <ANTDButton
                  type="primary"
                  className="btn"
                  onClick={onGenerateReport}
                  loading={reportLoader}
                >
                  {t('dash_ExportToExcel')}
                </ANTDButton>
              </div>
            )}
            <ANTDTable
              loading={loader || jobModel?.loader}
              columns={columns}
              dataSource={
                length(hostels)
                  ? hostels
                  : length(selectedColumn?.list)
                    ? selectedColumn?.list?.map((item, ind) => ({
                        ...item,
                        key: (pageNo - 1) * pageSize + ind,
                      }))
                    : []
              }
              pagination={{
                lastFetched: pageNo,
                current: pageNo,
                pageSize: pageSize,
                total: lastPage * pageSize,
                responsive: true,
                hideOnSinglePage: true,
              }}
              onChange={handleTableChange}
              size="small"
            ></ANTDTable>
          </ANTDModal>
        )}
      </div>
      {jobModel?.open && (
        <ANTDModal
          title={t('txt_Details')}
          centered
          open={jobModel?.open}
          onCancel={handleCloseJobModel}
          footer={false}
          width={1100}
        >
          <ViewJob
            data={jobModel?.data}
            jobType={jobType}
            loader={jobModel?.loader}
            highlightCategoryColor={
              assessmentHighlightColors?.[selectedColumn?.categoryValue] || null
            }
            highlightSection={
              {
                ADMINISTRATION_GOVERNANCE: 'hostelAdministrationRequestDto',
                FOOD_NUTRITION: 'foodNutritionRequestDto',
                ACCOMMODATION: 'accommodationRequestDto',
                SANITATION_DRAINAGE: 'sanitationDrainageRequestDto',
                ELECTRICITY_LIGHTING: 'electricityLightingRequestDto',
                HEALTH_MEDICAL_CARE: 'healthMedicalCareRequestDto',
                EDUCATION_ACADEMIC_ENVIRONMENT:
                  'educationAcademicEnvironmentRequestDto',
                SAFETY_SECURITY: 'safetySecurityRequestDto',
                STUDENT_FEEDBACK: 'studentFeedbackRequestDto',
              }[selectedColumn?.moduleName] ||
              (selectedColumn?.reportChartType === 'OVERALL_HOSTEL_CONDITION'
                ? 'overallAssessmentRequestDto'
                : null)
            }
          />
        </ANTDModal>
      )}
    </>
  )
}

export default DashboardWrapper
