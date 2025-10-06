import { useEffect, useRef } from 'react'

import useRedux from './useRedux'
import { getMethod } from '../api/methods'
import API_ROUTES from '../api/routes'
import { setFiscalYear } from '../redux/app/reducer'
import { dayJs } from '../utils/dayjs'
import { length } from '../utils/javascript'
import { getItem } from '../utils/localstorage'

const useFiscalYearInitializer = () => {
  const { dispatch, selector } = useRedux()
  const { value, options, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const userExists = getItem('userExists')
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!userExists) return
    // Only initialize once and only if data is not already available
    if (
      isInitializedRef.current ||
      (options &&
        options.length > 0 &&
        value &&
        dateRange?.from &&
        dateRange?.to)
    ) {
      return
    }

    const initializeFiscalYear = async () => {
      try {
        isInitializedRef.current = true
        const { data } = await getMethod(API_ROUTES.FISCAL_YEARS)
        const list = data?.data?.list
        const fiscalOptions =
          list?.map(({ year }) => ({ label: year, value: year })) || []
        const lastElem = fiscalOptions.at(length(fiscalOptions) - 1)
        const year = lastElem?.value
        const saveFormat = 'DD/MM/YYYY'
        const startDate = dayJs(`${year}-04-01`).format(saveFormat)
        const endDate = dayJs(`${year + 1}-03-31`).format(saveFormat)

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
        isInitializedRef.current = false // Reset on error to allow retry
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
