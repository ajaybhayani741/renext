import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import useRedux from '../../../hooks/useRedux'
import { setFiscalYear } from '../../../redux/app/reducer'
import { dayJs } from '../../../utils/dayjs'
import { include, isEqual, values } from '../../../utils/javascript'
import { tabKeys } from '../dashboard.description'

const dashboard = () => {
  const { dispatch, selector } = useRedux()
  const { value: fiscalYear, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const [searchParams, setSearchParams] = useSearchParams({
    tab: tabKeys.overview,
  })
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab')
    const tabArr = values(tabKeys)
    return include(tabArr, tab) ? tab : tabKeys.overview
  })

  useEffect(() => {
    const cachedStoreString = sessionStorage.getItem('fiscalYear')
    const fiscalYearObj = cachedStoreString ? JSON.parse(cachedStoreString) : {}

    const currentYear = dayJs().year()

    const currentFiscalYear = dayJs().isBefore(`${currentYear}-04-01`)
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
      const saveFormat = 'DD/MM/YYYY'
      const startDate = dayJs(`${currentFiscalYear}-04-01`).format(saveFormat)
      const endDate = dayJs(`${currentFiscalYear + 1}-03-31`).format(saveFormat)
      updateValues.dateRange = {
        from: startDate,
        to: endDate,
      }
    }

    dispatch(setFiscalYear(updateValues))

    return () => {
      sessionStorage.removeItem('fiscalYear')
    }
  }, [])

  useEffect(() => {
    const cachedStoreData = {
      value: fiscalYear,
      dateRange,
    }
    sessionStorage.setItem('fiscalYear', JSON.stringify(cachedStoreData))
  }, [dateRange, fiscalYear])

  const handleTabChange = tab => {
    setActiveTab(tab)
    setSearchParams(searchParams => {
      searchParams.set('tab', tab)
      return searchParams
    })
  }

  const getFilterValue = ({ setFilterValue }) => {
    if (
      isEqual(
        dateRange?.from,
        dayJs().subtract(5, 'month').format('DD/MM/YYYY'),
      )
    ) {
      setFilterValue('6M')
    } else if (
      isEqual(dateRange?.from, dayJs().month(3).date(1).format('DD/MM/YYYY'))
    ) {
      setFilterValue('YTD')
    } else if (
      isEqual(dateRange?.from, dayJs().subtract(1, 'year').format('DD/MM/YYYY'))
    ) {
      setFilterValue('1Y')
    } else {
      setFilterValue('')
    }
  }

  return { activeTab, handleTabChange, getFilterValue }
}

export default dashboard
