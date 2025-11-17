import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { setFiscalYear } from '../../../redux/app/reducer'
import { DASHBOARD_TXT } from '../../../routing/pathName.constant'
import { calendarYearDate } from '../../../utils/customFunctions'
import { dayJs } from '../../../utils/dayjs'
import { cardKeys } from '../dashboard.description'

const dashboard = () => {
  const { dispatch, selector } = useRedux()
  const { navigate } = useRouter()
  const { value: fiscalYear, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams({
    tab: cardKeys.overview,
  })
  // const [activeTab, setActiveTab] = useState(() => {
  //   const tab = searchParams.get('tab')
  //   const tabArr = values(cardKeys)
  //   return include(tabArr, tab) ? tab : cardKeys.overview
  // })

  useEffect(() => {
    // Only handle session storage restoration if fiscal year data is not already available
    if (fiscalYear && dateRange?.from && dateRange?.to) {
      return
    }

    const cachedStoreString = sessionStorage.getItem('fiscalYear')
    const fiscalYearObj = cachedStoreString ? JSON.parse(cachedStoreString) : {}

    const currentYear = dayJs().year()
    const currentFiscalYear = dayJs().isBefore(`${currentYear}-01-01`)
      ? currentYear - 1
      : currentYear

    const updateValues = {
      value: fiscalYearObj?.value || currentFiscalYear,
    }

    if (fiscalYearObj?.dateRange?.from && fiscalYearObj?.dateRange?.to) {
      updateValues.dateRange = {
        ...fiscalYearObj?.dateRange,
      }
    } else {
      const { startDate, endDate } = calendarYearDate(currentFiscalYear)
      updateValues.dateRange = {
        from: startDate,
        to: endDate,
      }
    }

    dispatch(setFiscalYear(updateValues))

    return () => {
      sessionStorage.removeItem('fiscalYear')
    }
  }, [fiscalYear, dateRange, dispatch])

  useEffect(() => {
    const cachedStoreData = {
      value: fiscalYear,
      dateRange,
    }
    sessionStorage.setItem('fiscalYear', JSON.stringify(cachedStoreData))
  }, [dateRange, fiscalYear])

  // const handleTabChange = tab => {
  //   setActiveTab(tab)
  //   setSearchParams(searchParams => {
  //     searchParams.set('tab', tab)
  //     return searchParams
  //   })
  // }

  // const getFilterValue = ({ setFilterValue }) => {
  //   if (
  //     isEqual(
  //       dateRange?.from,
  //       dayJs().subtract(5, 'month').format('DD/MM/YYYY'),
  //     )
  //   ) {
  //     setFilterValue('6M')
  //   } else if (
  //     isEqual(dateRange?.from, dayJs().month(3).date(1).format('DD/MM/YYYY'))
  //   ) {
  //     setFilterValue('YTD')
  //   } else if (
  //     isEqual(dateRange?.from, dayJs().subtract(1, 'year').format('DD/MM/YYYY'))
  //   ) {
  //     setFilterValue('1Y')
  //   } else {
  //     setFilterValue('')
  //   }
  // }

  const handleCardSelect = key => {
    navigate(`${DASHBOARD_TXT}/${key}`)
  }

  return { handleCardSelect }
}

export default dashboard
