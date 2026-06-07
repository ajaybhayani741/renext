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
}) => {
  const { t } = useTranslations()
  const { dateRangeProps, fiscalYearSelector } = fiscalYearSelect({
    onDateChange,
    setDefault,
    isDateRange,
  })

  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{t('txt_FiscalYear')}:</span>
        <ANTDSelect {...fiscalYearSelector} className="min-w-[100px]" size="middle" />
      </div>
      {showDateRange && (
        <div className="flex items-center">
          <ANTDDateRange {...dateRangeProps} size="middle" />
        </div>
      )}
    </div>
  )
}

export default FiscalYearSelect
