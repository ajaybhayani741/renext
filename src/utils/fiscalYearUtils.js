import { dayJs } from './dayjs'

/**
 * Get default fiscal year values
 * @returns {Object} Default fiscal year configuration
 */
export const getDefaultFiscalYear = () => {
  const currentYear = dayJs().year()
  const currentFiscalYear = dayJs().isBefore(`${currentYear}-04-01`)
    ? currentYear - 1
    : currentYear

  const saveFormat = 'DD/MM/YYYY'
  const startDate = dayJs(`${currentFiscalYear}-04-01`).format(saveFormat)
  const endDate = dayJs(`${currentFiscalYear + 1}-03-31`).format(saveFormat)

  return {
    value: currentFiscalYear,
    dateRange: {
      min: startDate,
      max: endDate,
      from: startDate,
      to: endDate,
    },
  }
}

/**
 * Check if the current date range matches the default date range
 * @param {Object} currentDateRange - Current date range from Redux state
 * @returns {boolean} True if date range matches default
 */
export const isDateRangeDefault = currentDateRange => {
  if (!currentDateRange?.from || !currentDateRange?.to) {
    return false
  }

  const defaultFiscalYear = getDefaultFiscalYear()
  return (
    currentDateRange.from === defaultFiscalYear.dateRange.from &&
    currentDateRange.to === defaultFiscalYear.dateRange.to
  )
}

/**
 * Reset fiscal year to default values
 * @param {Function} dispatch - Redux dispatch function
 * @param {Array} options - Available fiscal year options
 */
export const resetFiscalYearToDefault = (dispatch, options) => {
  const defaultValues = getDefaultFiscalYear()
  
  dispatch({
    type: 'app/setFiscalYear',
    payload: {
      ...defaultValues,
      options: options || [], // Keep existing options
    },
  })
}
