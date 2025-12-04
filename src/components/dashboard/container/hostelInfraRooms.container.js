import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { isEqual, keys, values } from '../../../utils/javascript'
import {
  getFansChartApi,
  getFansHostelsApi,
  getLivingRoomsChartApi,
  getLivingRoomsHostelsApi,
  getLocationBedsMattressesBarChartApi,
  getLocationBedsMattressesHostelsApi,
  getTubelightChartApi,
  getTubelightHostelsApi,
} from '../dashboard.api'
import {
  hostelInfraRoomsCharts,
  lineChartRange,
} from '../dashboard.description'
import { setLineChartSeriesData } from '../dashboardFunctions'

const hostelInfraRooms = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)

  const locationBedsMattressesCategoryMapping = {
    [t('dash_LocationGovtPrivate')]: 'HOSTEL_LOCATION_TYPE',
    [t('dash_AreBedsAvailableForAll')]: 'BEDS_AVAILABLE_FOR_ALL',
    [t('dash_AreMattressesAvailableForAll')]: 'MATTRESSES_AVAILABLE_FOR_ALL',
    [t('dash_IsAccommodationSufficient')]: 'ACCOMMODATION_SUFFICIENT',
  }

  const filterValueMapping = {
    [t('dash_Government')]: 'GOVERNMENT',
    [t('dash_Private')]: 'PRIVATE',
    [t('btn_Yes')]: 'YES',
    [t('btn_No')]: 'NO',
  }
  const axisOptions = {
    dash_LocationBedsMattresses: {
      category: keys(locationBedsMattressesCategoryMapping),
    },
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getDataApi = async ({
    name,
    start = lineChartRange?.start,
    end = lineChartRange?.end,
  }) => {
    const lineParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      start,
      end,
    }
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'dash_TotalNumberOfLivingRooms':
        const roomsResp = await getLivingRoomsChartApi({ params: lineParams })
        return roomsResp
      case 'dash_LocationBedsMattresses':
        const bedResp = await getLocationBedsMattressesBarChartApi({
          params: columnParams,
        })
        return bedResp
      case 'job_WorkingLightsCount':
        const lightsResp = await getTubelightChartApi({ params: lineParams })
        return lightsResp
      case 'job_WorkingFansCount':
        const fansResp = await getFansChartApi({ params: lineParams })
        return fansResp
      default:
        return null
    }
  }

  const getData = async ({
    start,
    end,
    chartType = keys(hostelInfraRoomsCharts),
  } = {}) => {
    chartType?.forEach(async key => {
      const respData = await getDataApi({ name: key, start, end })
      if (isEqual(key, 'dash_LocationBedsMattresses')) {
        const isData = values(respData?.data)?.find(item => item)
        const tempSeriesData = isData && [
          {
            name: '',
            color: '#d7dff8',
            data: [
              {
                y: respData.data.governmentLocationCount || 0,
                custom: { label: t('dash_Government') },
              },
              {
                y: respData.data.bedsAvailableForAllYes || 0,
                custom: { label: t('btn_Yes') },
              },
              {
                y: respData.data.mattressesAvailableForAllYes || 0,
                custom: { label: t('btn_Yes') },
              },
              {
                y: respData.data.accommodationSufficientYes || 0,
                custom: { label: t('btn_Yes') },
              },
            ],
          },
          {
            name: '',
            color: '#6484cb',
            data: [
              {
                y: respData.data.privateLocationCount || 0,
                custom: { label: t('dash_Private') },
              },
              {
                y: respData.data.bedsAvailableForAllNo || 0,
                custom: { label: t('btn_No') },
              },
              {
                y: respData.data.mattressesAvailableForAllNo || 0,
                custom: { label: t('btn_No') },
              },
              {
                y: respData.data.accommodationSufficientNo || 0,
                custom: { label: t('btn_No') },
              },
            ],
          },
        ]
        setSeriesData(prev => ({
          ...prev,
          [key]: { series: tempSeriesData },
        }))
      } else {
        let tempSeriesData = setLineChartSeriesData({
          respData,
          key,
        })
        setSeriesData(prev => ({
          ...prev,
          [key]: tempSeriesData,
        }))
      }
    })
  }

  const getHandleClickDataApi = async ({
    range,
    category,
    filterValue,
    pageNo = 1,
    name,
    start,
    end,
    newDateRange = dateRange,
  } = {}) => {
    const lineParams = {
      fromDate: newDateRange?.from,
      toDate: newDateRange?.to,
      ...(range && { range }),
      ...((start || end) && { start, end }),
    }
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      category: category,
      filterValue: filterValue,
    }
    switch (name) {
      case 'dash_TotalNumberOfLivingRooms':
        const roomsResp = await getLivingRoomsHostelsApi({
          pageNo,
          params: lineParams,
        })
        return roomsResp?.data
      case 'dash_LocationBedsMattresses':
        const bedResp = await getLocationBedsMattressesHostelsApi({
          pageNo,
          params: columnParams,
        })
        return bedResp?.data
      case 'job_WorkingLightsCount':
        const lightsResp = await getTubelightHostelsApi({
          pageNo,
          params: lineParams,
        })
        return lightsResp?.data
      case 'job_WorkingFansCount':
        const fansResp = await getFansHostelsApi({ pageNo, params: lineParams })
        return fansResp?.data
      default:
        return null
    }
  }

  const handleChartClick = async ({
    e,
    name,
    startEnd,
    newDateRange,
    chartType,
    xAxisTitle,
  }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      category: locationBedsMattressesCategoryMapping?.[data?.category],
      filterValue: filterValueMapping?.[data?.custom?.label],
      range: data?.category,
      name,
      start: startEnd?.start,
      end: startEnd?.end,
      newDateRange: { ...newDateRange },
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
        type: data?.series?.name || data?.custom?.label,
        value: data?.y,
        start: startEnd?.start,
        end: startEnd?.end,
        range: data?.category,
        newDateRange: { ...newDateRange },
        chartType: hostelInfraRoomsCharts?.[name]?.chartType,
        xAxisTitle: xAxisTitle,
      },
      title: name,
      modalTitle: hostelInfraRoomsCharts?.[name]?.modalTitle,
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
      category:
        locationBedsMattressesCategoryMapping?.[
          selectedColumn?.chartData?.category
        ],
      filterValue: filterValueMapping?.[selectedColumn?.chartData?.type],
      range: selectedColumn?.chartData?.category,
      name: selectedColumn?.title,
      pageNo: current,
      start: selectedColumn?.chartData?.start,
      end: selectedColumn?.chartData?.end,
      newDateRange: selectedColumn?.chartData?.newDateRange,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  return {
    onRangeChange: getData,
    axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default hostelInfraRooms
