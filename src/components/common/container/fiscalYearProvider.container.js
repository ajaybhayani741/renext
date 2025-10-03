import { useEffect } from 'react'

import { getMethod } from '../../../api/methods'
import API_ROUTES from '../../../api/routes'
import useRedux from '../../../hooks/useRedux'
import { setFiscalYear } from '../../../redux/app/reducer'
import { dayJs } from '../../../utils/dayjs'
import { length } from '../../../utils/javascript'

const fiscalYearProvider = () => {
  const { dispatch, selector } = useRedux()
  const { value, options, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )

  useEffect(() => {
    // Only initialize if fiscal year data is not already available
    if (options && options.length > 0 && value && dateRange?.from && dateRange?.to) {
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
        const saveFormat = 'DD/MM/YYYY'
        const startDate = dayJs(`${year}-04-01`).format(saveFormat)
        const endDate = dayJs(`${year + 1}-03-31`).format(saveFormat)

        dispatch(setFiscalYear({
          value: year,
          options: fiscalOptions,
          dateRange: {
            min: startDate,
            max: endDate,
            from: startDate,
            to: endDate,
          },
        }))
      } catch (error) {
        // console.error('Error initializing fiscal year:', error)
      }
    }

    initializeFiscalYear()
  }, [dispatch, options, value, dateRange])

  return {
    isInitialized: !!(options && options.length > 0 && value && dateRange?.from && dateRange?.to),
  }
}

export default fiscalYearProvider
