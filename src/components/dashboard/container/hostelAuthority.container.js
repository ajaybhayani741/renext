import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import {
  getPrincipalAuthorityBarChartApi,
  getPrincipalAuthorityHostelsApi,
} from '../dashboard.api'

const hostelAuthority = () => {
  const { t } = useTranslations()
  const title = t('job_HostelAuthority')
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)

  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)

  const chartData = {
    category: [t('dash_RegularInCharge'), t('dash_StayInHeadquarters')],
  }

  const categoryMapping = {
    [t('dash_RegularInCharge')]: 'IS_REGULAR_INCHARGE',
    [t('dash_StayInHeadquarters')]: 'STAYS_IN_HEADQUARTERS',
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getSeriesData()
    }
  }, [dateRange])

  const getHostelsData = async ({
    data,
    pageNo = selectedColumn?.pageNo || 1,
  }) => {
    const category = data?.category || selectedColumn?.chartData?.category
    const type = data?.series?.name || selectedColumn?.chartData?.type
    const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
    const apiCategory = categoryMapping[category]

    try {
      setHostelsData(prev => ({ ...prev, loader: true }))
      const params = {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        category: apiCategory,
        filterValue: filterValue,
      }

      const response = await getPrincipalAuthorityHostelsApi({
        params,
        pageNo,
      })

      if (response && response.data) {
        setSelectedColumn({
          selected: true,
          chartData: {
            category,
            type,
          },
          list: response.data.hostels || [],
          title: 'job_HostelAuthority',
          modalTitle: true,
          ...response.data,
        })
        setHostelsData({ ...response.data, loader: false })
      }
    } catch (error) {
      return
    } finally {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  const handleChartClick = async e => {
    const data = e.point
    getHostelsData({ data })
  }

  const getSeriesData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getPrincipalAuthorityBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData([
        {
          name: t('btn_Yes'),
          data: [
            response.data.isRegularInChargeYes || 0,
            response.data.staysInHeadquartersYes || 0,
          ],
        },
        {
          name: t('btn_No'),
          data: [
            response.data.isRegularInChargeNo || 0,
            response.data.staysInHeadquartersNo || 0,
          ],
        },
      ])
    }
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
    setHostelsData({})
  }

  const handleTableChange = async ({ current }) => {
    getHostelsData({ pageNo: current })
  }

  return {
    title,
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default hostelAuthority
