import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
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
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)
  // const [axisOptions, setAxisOptions] = useState(null)
  // const [totalData, setTotalData] = useState(null)
  const title = t('dash_StaffDetails')

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      start: lineChartRange?.start,
      end: lineChartRange?.end,
    }
    const [
      workersResp,
      cooksResp,
      kamatiResp,
      watchmenResp,
      availableScavengersResp,
      requiredScavengersResp,
    ] = await Promise.all([
      getWorkersChartApi({ params }),
      getCooksChartApi({ params }),
      getKamatiChartApi({ params }),
      getWatchmanChartApi({ params }),
      getAvailableScavengersChartApi({ params }),
      getRequiredScavengersChartApi({ params }),
    ])

    let tempSeriesData = {}
    setLineChartSeriesData({
      respData: workersResp,
      tempSeriesData,
      key: 'dash_TotalNumberOfWorkersOnPayroll',
    })
    setLineChartSeriesData({
      respData: cooksResp,
      tempSeriesData,
      key: 'dash_TotalNumberOfCooksEnrolled',
    })
    setLineChartSeriesData({
      respData: kamatiResp,
      tempSeriesData,
      key: 'dash_TotalNumberOfKamatiEnrolled',
    })
    setLineChartSeriesData({
      respData: watchmenResp,
      tempSeriesData,
      key: 'dash_TotalNumberOfWatchmenEnrolled',
    })
    setLineChartSeriesData({
      respData: availableScavengersResp,
      tempSeriesData,
      key: 'dash_TotalNumberOfScavengersAvailable',
    })
    setLineChartSeriesData({
      respData: requiredScavengersResp,
      tempSeriesData,
      key: 'dash_TotalNumberOfScavengersRequired',
    })
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  const handleClickFn = async ({ name, range, pageNo = 1 }) => {
    const params = {
      pageNo,
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        range,
      },
    }
    switch (name) {
      case 'dash_TotalNumberOfWorkersOnPayroll':
        const workersResp = await getWorkersHostelsApi(params)
        return workersResp?.data
      case 'dash_TotalNumberOfCooksEnrolled':
        const cooksResp = await getCooksHostelsApi(params)
        return cooksResp?.data
      case 'dash_TotalNumberOfKamatiEnrolled':
        const kamatiResp = await getKamatiHostelsApi(params)
        return kamatiResp?.data
      case 'dash_TotalNumberOfWatchmenEnrolled':
        const watchmenResp = await getWatchmanHostelsApi(params)
        return watchmenResp?.data
      case 'dash_TotalNumberOfScavengersAvailable':
        const availableScavengersResp =
          await getAvailableScavengersHostelsApi(params)
        return availableScavengersResp?.data
      case 'dash_TotalNumberOfScavengersRequired':
        const requiredScavengersResp =
          await getRequiredScavengersHostelsApi(params)
        return requiredScavengersResp?.data

      default:
        setHostelsData(null)
        break
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await handleClickFn({
      range: data?.category,
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
        value: data?.y,
      },
      title: name,
      modalTitle: staffDetailsCharts?.[name]?.modalTitle,
      range: data?.category,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await handleClickFn({
      range: selectedColumn?.range,
      name: selectedColumn?.title,
      pageNo: current,
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
    title,
    // axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
  }
}

export default staffDetails
