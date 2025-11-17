import { useEffect } from 'react'

import useRedux from './useRedux'
import { getMethod } from '../api/methods'
import API_ROUTES from '../api/routes'
import { setFiscalYear } from '../redux/app/reducer'
import { calendarYearDate } from '../utils/customFunctions'
import { length } from '../utils/javascript'
import { getItem } from '../utils/localstorage'

const useFiscalYearInitializer = () => {
  const { dispatch, selector } = useRedux()
  const { value, options, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const userExists = getItem('userExists')

  useEffect(() => {
    if (!userExists) return
    // Only initialize once and only if data is not already available
    if (
      options &&
      options.length > 0 &&
      value &&
      dateRange?.from &&
      dateRange?.to
    ) {
      return
    }

    const initializeFiscalYear = async () => {
      try {
        const { data } = await getMethod(API_ROUTES.FISCAL_YEARS)
        const list = data?.data?.list
        const fiscalOptions =
          list?.map(({ year }) => ({ label: year, value: year })) || []
        const lastElem = fiscalOptions.at(length(fiscalOptions) - 1)
        const year = lastElem?.value
        const { startDate, endDate } = calendarYearDate(year)
        dispatch(
          setFiscalYear({
            value: year,
            options: fiscalOptions,
            dateRange: {
              min: startDate,
              max: endDate,
              from: startDate,
              to: endDate,
            },
          }),
        )
      } catch (error) {
        // console.error('Error initializing fiscal year:', error)
      }
    }

    initializeFiscalYear()
  }, [dispatch, options, value, dateRange, userExists])

  return {
    isInitialized: !!(
      options &&
      options.length > 0 &&
      value &&
      dateRange?.from &&
      dateRange?.to
    ),
  }
}

export default useFiscalYearInitializer
