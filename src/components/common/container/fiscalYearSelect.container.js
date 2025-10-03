import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { setFiscalYear } from '../../../redux/app/reducer'
import { dayJs, DISPLAY_DATE_FORMAT, formatDate } from '../../../utils/dayjs'

const fiscalYearSelect = ({
  onDateChange,
  setDefault = true,
  isDateRange,
} = {}) => {
  const { dispatch, selector } = useRedux()
  const { value, options, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const [isDisable, setIsDisable] = useState(true)
  const saveFormat = 'DD/MM/YYYY'

  useEffect(() => {
    // Enable the component if fiscal year data is already available
    if (options && options.length > 0) {
      setIsDisable(false)
      return
    }

    // If no data is available yet, keep disabled
    // The global initializer will handle fetching the data
    setIsDisable(true)
  }, [options])

  const handleFiscalYearChange = value => {
    const startDate = dayJs(`${value}-04-01`).format(saveFormat)
    const endDate = dayJs(`${value + 1}-03-31`).format(saveFormat)
    dispatch(
      setFiscalYear({
        value,
        dateRange: {
          min: startDate,
          max: endDate,
          from: startDate,
          to: endDate,
        },
      }),
    )
  }

  const handleDateRangeChange = ([start, end]) => {
    const startDate = start?.format(saveFormat)
    const endDate = end?.format(saveFormat)
    dispatch(
      setFiscalYear({
        dateRange: {
          ...dateRange,
          from: startDate,
          to: endDate,
        },
      }),
    )
    onDateChange && onDateChange(startDate, endDate)
  }

  const fiscalYearSelector = {
    width: '100%',
    value: value,
    options,
    disabled: isDisable,
    onChange: handleFiscalYearChange,
  }

  const dateRangeProps = {
    format: DISPLAY_DATE_FORMAT,
    value: [
      formatDate(dateRange?.from, saveFormat),
      formatDate(dateRange?.to, saveFormat),
    ],
    minDate: isDateRange ? formatDate(dateRange?.min, saveFormat) : undefined,
    maxDate: isDateRange ? formatDate(dateRange?.max, saveFormat) : undefined,
    onChange: handleDateRangeChange,
    allowClear: false,
    allowEmpty: isDisable,
    disabled: isDisable,
  }

  return { dateRangeProps, fiscalYearSelector }
}

export default fiscalYearSelect
