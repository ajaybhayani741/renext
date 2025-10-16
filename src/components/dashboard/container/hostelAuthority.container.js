import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { isEqual, keys, values } from '../../../utils/javascript'
import {
  getPrincipalAuthorityBarChartApi,
  getPrincipalAuthorityHostelsApi,
} from '../dashboard.api'
import { hostelAuthorityCharts } from '../dashboard.description'

const hostelAuthority = () => {
  const { t } = useTranslations()
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
      getData()
    }
  }, [dateRange])

  const getDataApi = async ({ name }) => {
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'job_HostelAuthority':
        const authorityResp = await getPrincipalAuthorityBarChartApi({
          params: columnParams,
        })
        return authorityResp
      default:
        return null
    }
  }

  const getData = async () => {
    keys(hostelAuthorityCharts)?.forEach(async key => {
      const respData = await getDataApi({ name: key })
      if (isEqual(key, 'job_HostelAuthority')) {
        const isData = values(respData?.data)?.find(item => item)
        const tempSeriesData = isData
          ? [
              {
                name: t('btn_Yes'),
                data: [
                  respData.data.isRegularInChargeYes || 0,
                  respData.data.staysInHeadquartersYes || 0,
                ],
              },
              {
                name: t('btn_No'),
                data: [
                  respData.data.isRegularInChargeNo || 0,
                  respData.data.staysInHeadquartersNo || 0,
                ],
              },
            ]
          : []
        setSeriesData(prev => ({
          ...prev,
          [key]: { series: tempSeriesData },
        }))
      }
    })
  }

  const getHandleClickDataApi = async ({
    category,
    filterValue,
    pageNo = 1,
    name,
  } = {}) => {
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      category,
      filterValue,
    }
    switch (name) {
      case 'job_HostelAuthority':
        const roomsResp = await getPrincipalAuthorityHostelsApi({
          pageNo,
          params: columnParams,
        })
        return roomsResp?.data
      default:
        return null
    }
  }

  const handleChartClick = async ({ e, name }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const type = data?.series?.name || selectedColumn?.chartData?.type
    const respData = await getHandleClickDataApi({
      category: categoryMapping[data?.category],
      filterValue: type === t('btn_Yes') ? 'YES' : 'NO',
      name,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        type,
        chartType: hostelAuthorityCharts?.[name]?.chartType,
      },
      title: name,
      modalTitle: hostelAuthorityCharts?.[name]?.modalTitle,
    })
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
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      category: categoryMapping[selectedColumn?.chartData?.category],
      filterValue:
        selectedColumn?.chartData?.type === t('btn_Yes') ? 'YES' : 'NO',
      name: selectedColumn?.title,
      pageNo: current,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  return {
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
