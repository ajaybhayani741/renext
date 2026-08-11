/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { setFiscalYear } from '../../../redux/app/reducer'
import { calendarYearDate } from '../../../utils/customFunctions'
import { dayJs, DISPLAY_DATE_FORMAT, formatDate } from '../../../utils/dayjs'
import {
  getCurrentMonthDateRange,
  getLastWeekDateRange,
  getWeekCounterLabel,
} from '../../../utils/weekDateUtils'

const fiscalYearSelect = ({
  onDateChange,
  setDefault = true,
  isDateRange,
  showRecentPresets = false,
  showWeekCounter = false,
  showDateShortcutButtons = false,
} = {}) => {
  const { dispatch, selector } = useRedux()
  const { value, options, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const [isDisable, setIsDisable] = useState(false)
  const saveFormat = 'DD/MM/YYYY'

  // useEffect(() => {
  //   // Enable the component if fiscal year data is already available
  //   if (options && options.length > 0) {
  //     setIsDisable(false)
  //     return
  //   }

  //   // If no data is available yet, keep disabled
  //   // The global initializer will handle fetching the data
  //   setIsDisable(true)
  // }, [options])

  const handleFiscalYearChange = value => {
    const { startDate, endDate } = calendarYearDate(value)
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

  const getLastDaysRange = days => {
    const end = dayJs()
    return [end.subtract(days - 1, 'day'), end]
  }

  const handleDateShortcutClick = range => {
    dispatch(
      setFiscalYear({
        dateRange: {
          ...dateRange,
          ...range,
        },
      }),
    )
    onDateChange && onDateChange(range.from, range.to)
  }

  const isActiveShortcut = range =>
    dateRange?.from === range?.from && dateRange?.to === range?.to

  const shortcutRanges = showDateShortcutButtons
    ? [
        {
          label: 'LAST WEEK',
          range: getLastWeekDateRange(),
        },
        {
          label: 'Current Month',
          range: getCurrentMonthDateRange(),
        },
      ]
    : []

  const dateShortcutButtons = shortcutRanges.map(({ label, range }) => ({
    label,
    active: isActiveShortcut(range),
    onClick: () => handleDateShortcutClick(range),
  }))

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
    presets: showRecentPresets
      ? [
          { label: 'Last 7 Days', value: getLastDaysRange(7) },
          { label: 'Last 14 Days', value: getLastDaysRange(14) },
          { label: 'Last 30 Days', value: getLastDaysRange(30) },
          { label: 'Last 90 Days', value: getLastDaysRange(90) },
        ]
      : undefined,
  }

  const weekCounterLabel = showWeekCounter
    ? getWeekCounterLabel({ from: dateRange?.from, inputFormat: saveFormat })
    : ''

  return {
    dateRangeProps,
    fiscalYearSelector,
    weekCounterLabel,
    dateShortcutButtons,
  }
}

export default fiscalYearSelect

