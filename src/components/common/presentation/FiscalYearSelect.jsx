import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { ANTDDateRange } from '../../../shared/antd/ANTDDatePicker'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import Label from '../../../shared/Label'
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
    <ANTDColumn className={`fiscal-year-select ${className}`}>
      <Label text={t('txt_FiscalYear')} />
      <ANTDRow>
        <ANTDSelect {...fiscalYearSelector} className="w-100" />
      </ANTDRow>
      {showDateRange && (
        <ANTDRow className="mt-10" span={24}>
          <ANTDDateRange {...dateRangeProps} />
        </ANTDRow>
      )}
    </ANTDColumn>
  )
}

export default FiscalYearSelect
