import useTranslations from '../../../hooks/useTranslations'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { length } from '../../../utils/javascript'
import feedback from '../container/feedback.container'

const FeedbackDashboard = () => {
  const { t } = useTranslations()
  const {
    handlePopupScroll,
    handleHostelSelect,
    hostelsList,
    selectedHostel,
    feedbackColumns,
    feedbackData,
  } = feedback()

  const feedbackTableColumns = feedbackColumns?.map((column, index) => ({
    ...column,
    title: index === 0 ? 'Feedback Type' : 'Remarks',
  }))

  return (
    <div className="dashboard-module-surface dashboard-feedback-surface">
      <div className="host-chart-container dashboard-feedback-card">
        <h3>Feedback - Select Hostel with Completed Jobs</h3>
        <div className="dashboard-feedback-select">
          <ANTDSelect
            options={
              length(hostelsList?.list)
                ? hostelsList?.list?.map(item => ({
                    label: item?.hostel?.lastName,
                    value: item?.jobId,
                  }))
                : []
            }
            name="hostelId"
            value={selectedHostel?.jobId}
            onChange={handleHostelSelect}
            onPopupScroll={handlePopupScroll}
            className="w-100"
            placeholder={t('job_SelectHostel')}
          />
        </div>
        {selectedHostel?.hostel?.lastName ? (
          <h4 className="dashboard-feedback-hostel">
            {selectedHostel?.hostel?.lastName}
          </h4>
        ) : null}
        <ANTDTable
          className="dashboard-feedback-table"
          columns={feedbackTableColumns}
          dataSource={feedbackData || []}
          rowKey="label"
          pagination={false}
        />
      </div>
    </div>
  )
}

export default FeedbackDashboard
