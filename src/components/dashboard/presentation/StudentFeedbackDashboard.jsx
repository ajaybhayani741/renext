import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../shared/antd/ANTDTable'
import studentFeedback from '../container/studentFeedback.container'

const StudentFeedbackDashboard = () => {
  const {
    feedback,
    selectedFeedback,
    handleHostelSelect,
    handlePopupScroll,
    feedbackColumns,
    feedbackData,
  } = studentFeedback()
  const options = (feedback?.list || []).map(item => ({
    label: item?.hostel?.lastName,
    value: item?.jobId,
  }))
  const renderSelect = () => (
    <div className={'dashboard-feedback-select'}>
      <ANTDSelect
        options={options}
        value={selectedFeedback?.jobId}
        onChange={handleHostelSelect}
        onPopupScroll={handlePopupScroll}
        className={'w-100'}
        placeholder={'Select Hostel'}
      />
    </div>
  )

  return (
    <div className={'dashboard-module-surface dashboard-feedback-surface'}>
      <div className={'host-chart-container dashboard-feedback-card'}>
        <h3>Feedback - Select Hostel with Completed Jobs</h3>
        {renderSelect()}
        {selectedFeedback?.hostel?.lastName ? (
          <h4 className="dashboard-feedback-hostel">
            {selectedFeedback?.hostel?.lastName}
          </h4>
        ) : null}
        <ANTDTable
          className="dashboard-feedback-table"
          columns={feedbackColumns}
          dataSource={feedbackData}
          rowKey="label"
          pagination={false}
        />
      </div>
    </div>
  )
}

export default StudentFeedbackDashboard
