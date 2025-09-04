import '../report.scss'

import ShiftReportTable from './ShiftReportTable'
import ViewPreviousHistoryModal from './ViewPreviousHistoryModal'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { ANTDDatePicker } from '../../../shared/antd/ANTDDatePicker'
import { DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import shiftReport from '../container/shiftReport.container'

const ShiftReport = ({ isDailyReport, readOnly, shiftId }) => {
  const {
    t,
    date,
    storeId,
    loader,
    disabled,
    dataSource,
    viewPreviousHistory,
    handleSave,
    handleSubmitShift,
    toggleViewHistoryModal,
    onDateChange,
    onGenerateReport,
  } = shiftReport({ isDailyReport, shiftId })

  return (
    <>
      <div className="mb-10 mt-10 d-flex flex-end">
        <div className="d-flex align-center justify-end flex-wrap gap-10">
          {isDailyReport && (
            <ANTDDatePicker
              {...{
                className: 'ml-auto',
                format: DISPLAY_DATE_FORMAT,
                allowClear: false,
                value: date,
                onChange: onDateChange,
              }}
            />
          )}
          <div className="ml-auto">
            <ANTDButton type="primary" onClick={onGenerateReport}>
              {t('btn_GenerateReport')}
            </ANTDButton>
            <ANTDButton
              type="primary"
              className="ml-10"
              onClick={toggleViewHistoryModal}
            >
              {t('btn_ViewPreviousHistory')}
            </ANTDButton>
          </div>
        </div>
      </div>
      <ShiftReportTable
        readOnly={readOnly}
        disabled={disabled}
        handleSave={handleSave}
        dataSource={dataSource}
        loader={loader}
      />

      {!isDailyReport && !readOnly && (
        <div className="mt-10 d-flex justify-center">
          <ANTDButton
            size="large"
            type="primary"
            className="btn"
            onClick={handleSubmitShift}
          >
            {t('btn_SubmitShiftReport')}
          </ANTDButton>
        </div>
      )}

      <ViewPreviousHistoryModal
        open={viewPreviousHistory.open}
        onClose={toggleViewHistoryModal}
        payload={{
          reportType: isDailyReport ? 'DAILY_CLOSING_REPORT' : 'SHIFT_REPORT',
          storeId,
          shiftId: dataSource?.shiftId,
        }}
        hideStartDate
        hideEndDate
      />
    </>
  )
}

export default ShiftReport
