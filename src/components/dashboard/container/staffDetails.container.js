import { keys } from 'highcharts'
import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import {
  getAvailableScavengersChartApi,
  getAvailableScavengersHostelsApi,
  getCooksChartApi,
  getCooksHostelsApi,
  getKamatiChartApi,
  getKamatiHostelsApi,
  getRequiredScavengersChartApi,
  getRequiredScavengersHostelsApi,
  getWatchmanChartApi,
  getWatchmanHostelsApi,
  getWorkersChartApi,
  getWorkersHostelsApi,
} from '../dashboard.api'
import { lineChartRange, staffDetailsCharts } from '../dashboard.description'
import { setLineChartSeriesData } from '../dashboardFunctions'

const staffDetails = () => {
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)

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
    switch (name) {
      case 'dash_TotalNumberOfWorkersOnPayroll':
        const workersResp = await getWorkersChartApi({
          params: lineParams,
        })
        return workersResp
      case 'dash_TotalNumberOfCooksEnrolled':
        const cooksResp = await getCooksChartApi({
          params: lineParams,
        })
        return cooksResp
      case 'dash_TotalNumberOfKamatiEnrolled':
        const kamatiResp = await getKamatiChartApi({
          params: lineParams,
        })
        return kamatiResp
      case 'dash_TotalNumberOfWatchmenEnrolled':
        const watchmenResp = await getWatchmanChartApi({
          params: lineParams,
        })
        return watchmenResp
      case 'dash_TotalNumberOfScavengersAvailable':
        const availableScavengersResp = await getAvailableScavengersChartApi({
          params: lineParams,
        })
        return availableScavengersResp
      case 'dash_TotalNumberOfScavengersRequired':
        const requiredScavengersResp = await getRequiredScavengersChartApi({
          params: lineParams,
        })
        return requiredScavengersResp
      default:
        return null
    }
  }

  const getData = async ({
    start,
    end,
    chartType = keys(staffDetailsCharts),
  } = {}) => {
    chartType?.forEach(async key => {
      const respData = await getDataApi({ name: key, start, end })
      let tempSeriesData = setLineChartSeriesData({
        respData,
        key,
      })
      setSeriesData(prev => ({
        ...prev,
        [key]: tempSeriesData,
      }))
    })
  }

  const getHandleClickDataApi = async ({
    range,
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
    switch (name) {
      case 'dash_TotalNumberOfWorkersOnPayroll':
        const workersResp = await getWorkersHostelsApi({
          pageNo,
          params: lineParams,
        })
        return workersResp?.data
      case 'dash_TotalNumberOfCooksEnrolled':
        const cooksResp = await getCooksHostelsApi({
          pageNo,
          params: lineParams,
        })
        return cooksResp?.data
      case 'dash_TotalNumberOfKamatiEnrolled':
        const kamatiResp = await getKamatiHostelsApi({
          pageNo,
          params: lineParams,
        })
        return kamatiResp?.data
      case 'dash_TotalNumberOfWatchmenEnrolled':
        const watchmenResp = await getWatchmanHostelsApi({
          pageNo,
          params: lineParams,
        })
        return watchmenResp?.data
      case 'dash_TotalNumberOfScavengersAvailable':
        const availableScavengersResp = await getAvailableScavengersHostelsApi({
          pageNo,
          params: lineParams,
        })
        return availableScavengersResp?.data
      case 'dash_TotalNumberOfScavengersRequired':
        const requiredScavengersResp = await getRequiredScavengersHostelsApi({
          pageNo,
          params: lineParams,
        })
        return requiredScavengersResp?.data

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
        value: data?.y,
        range: data?.category,
        start: startEnd?.start,
        end: startEnd?.end,
        newDateRange: { ...newDateRange },
        chartType: chartType,
        xAxisTitle: xAxisTitle,
      },
      title: name,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      range: selectedColumn?.chartData?.range,
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

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
  }

  return {
    onRangeChange: getData,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
  }
}

export default staffDetails
