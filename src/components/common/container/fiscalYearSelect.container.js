import { useEffect, useState } from 'react'

import { getMethod } from '../../../api/methods'
import API_ROUTES from '../../../api/routes'
import useRedux from '../../../hooks/useRedux'
import { setFiscalYear } from '../../../redux/app/reducer'
import { dayJs, DISPLAY_DATE_FORMAT, formatDate } from '../../../utils/dayjs'
import { length } from '../../../utils/javascript'

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
    const getFiscalYears = async () => {
      const { data } = await getMethod(API_ROUTES.FISCAL_YEARS)
      setIsDisable(false)
      const list = data?.data?.list
      const fiscalOptions =
        list?.map(({ year }) => ({ label: year, value: year })) || []
      const lastElem = fiscalOptions.at(length(fiscalOptions) - 1)
      const year = lastElem?.value
      const startDate = dayJs(`${year}-04-01`).format(saveFormat)
      const endDate = dayJs(`${year + 1}-03-31`).format(saveFormat)

      const updateValues = {
        options: fiscalOptions,
      }

      if (setDefault) {
        updateValues.value = year
        updateValues.dateRange = {
          min: startDate,
          max: endDate,
          from: startDate,
          to: endDate,
        }
      }

      dispatch(setFiscalYear(updateValues))
    }
    getFiscalYears()
  }, [])

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
