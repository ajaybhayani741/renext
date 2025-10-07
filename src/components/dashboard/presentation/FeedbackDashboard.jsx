import useTranslations from '../../../hooks/useTranslations'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../shared/antd/ANTDTable'
import Label from '../../../shared/Label'
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
  } = feedback()

  return (
    <div>
      <Label text={t('job_SelectHostel')} />
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
        className="w-100 mb-15"
      />
      <ANTDTable
        columns={feedbackColumns}
        dataSource={selectedHostel ? [selectedHostel] : []}
        pagination={false}
      />
    </div>
  )
}

export default FeedbackDashboard
