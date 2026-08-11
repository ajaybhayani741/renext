import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { ANTDDateRange } from '../../../shared/antd/ANTDDatePicker'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import fiscalYearSelect from '../container/fiscalYearSelect.container'
import './FiscalYearSelect.scss'

const FiscalYearSelect = ({
  onDateChange,
  className = '',
  showDateRange = true,
  setDefault,
  isDateRange = true,
  showRecentPresets = false,
  showWeekCounter = false,
  showDateShortcutButtons = false,
}) => {
  const { t } = useTranslations()
  const {
    dateRangeProps,
    fiscalYearSelector,
    weekCounterLabel,
    dateShortcutButtons,
  } = fiscalYearSelect({
    onDateChange,
    setDefault,
    isDateRange,
    showRecentPresets,
    showWeekCounter,
    showDateShortcutButtons,
  })

  return (
    <div className={`fiscal-filter-bar ${className}`}>
      <div className="fiscal-filter-bar__group fiscal-filter-bar__group--year">
        <span className="fiscal-filter-bar__label">
          {t('txt_FiscalYear')}:
        </span>
        <ANTDSelect
          {...fiscalYearSelector}
          className="fiscal-filter-bar__select"
          size="middle"
        />
      </div>

      {showDateRange && (
        <>
          <div className="fiscal-filter-bar__group">
            <ANTDDateRange {...dateRangeProps} size="middle" />
          </div>

          {dateShortcutButtons?.length > 0 && (
            <div className="fiscal-filter-bar__group">
              <div className="fiscal-filter-bar__shortcuts">
                {dateShortcutButtons.map(({ label, onClick, active }) => (
                  <ANTDButton
                    key={label}
                    onClick={onClick}
                    size="middle"
                    className={`fiscal-filter-bar__shortcut-btn ${
                      active ? 'fiscal-filter-bar__shortcut-btn--active' : ''
                    }`}
                  >
                    {label}
                  </ANTDButton>
                ))}
              </div>
            </div>
          )}

          {showWeekCounter && weekCounterLabel && (
            <div className="fiscal-filter-bar__group fiscal-filter-bar__group--chip">
              <span className="fiscal-filter-bar__week-chip">
                <span className="fiscal-filter-bar__week-chip-dot" />
                {weekCounterLabel}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FiscalYearSelect
