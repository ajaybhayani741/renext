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
  const { value, options } = selector(
    state => state?.app?.fiscalYear,
  )
  const userExists = getItem('userExists')
  const authToken = getItem('token')

  useEffect(() => {
    if (!userExists || !authToken) return
    // An empty date filter is valid after a shortcut is deselected.
    if (options?.length > 0 && value) {
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
  }, [dispatch, options, value, userExists, authToken])

  return {
    isInitialized: !!(options?.length > 0 && value),
  }
}

export default useFiscalYearInitializer
