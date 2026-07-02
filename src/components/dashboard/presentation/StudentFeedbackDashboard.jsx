import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../shared/antd/ANTDTable'
import studentFeedback from '../container/studentFeedback.container'

const StudentFeedbackDashboard = () => {
  const {
    feedback,
    selectedFeedback,
    handleHostelSelect,
    handlePopupScroll,
  } = studentFeedback()

  const columns = [
    { title: 'Feedback Type', dataIndex: 'hostel?.lastName', key: 'type', width: '50%' },
    { title: 'Remarks', dataIndex: 'studentTopThreeConcerns', key: 'remarks', width: '50%' },
  ]
  const options = (feedback?.list || []).map(item => ({
    label: item?.hostel?.lastName,
    value: item?.jobId,
  }))

  const data = feedback?.list || []
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
        <ANTDTable columns={columns} dataSource={data} rowKey={'type'} pagination={false} />
      </div>
    </div>
  )
}

export default StudentFeedbackDashboard
