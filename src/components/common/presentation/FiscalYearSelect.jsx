import useTranslations from '../../../hooks/useTranslations'
import { ANTDDateRange } from '../../../shared/antd/ANTDDatePicker'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import fiscalYearSelect from '../container/fiscalYearSelect.container'

const FiscalYearSelect = ({
  onDateChange,
  className = '',
  showDateRange = true,
  setDefault,
  isDateRange = true,
  showRecentPresets = false,
  showWeekCounter = false,
}) => {
  const { t } = useTranslations()
  const { dateRangeProps, fiscalYearSelector, weekCounterLabel } =
    fiscalYearSelect({
      onDateChange,
      setDefault,
      isDateRange,
      showRecentPresets,
      showWeekCounter,
    })

  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
          {t('txt_FiscalYear')}:
        </span>
        <ANTDSelect
          {...fiscalYearSelector}
          className="min-w-[100px]"
          size="middle"
        />
      </div>
      {showDateRange && (
        <div className="flex items-center">
          <ANTDDateRange {...dateRangeProps} size="middle" />
          {showWeekCounter && weekCounterLabel && (
            <span className="inspection-week-counter ml-5">
              <span className="inspection-week-counter__icon" />
              <span className="inspection-week-counter__text">
                {weekCounterLabel}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default FiscalYearSelect
