import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { keys } from '../../../utils/javascript'
import {
  getHostelStudentsChartApi,
  getStudentsHostelsApi,
} from '../dashboard.api'
import { lineChartRange, studentCharts } from '../dashboard.description'
import { setLineChartSeriesData } from '../dashboardFunctions'

const students = () => {
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
      case 'dash_TotalNumberOfStudents':
        const fansResp = await getHostelStudentsChartApi({
          params: lineParams,
        })
        return fansResp
      default:
        return null
    }
  }

  const getData = async ({
    start,
    end,
    chartType = keys(studentCharts),
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
      case 'dash_TotalNumberOfStudents':
        const studentsResp = await getStudentsHostelsApi({
          pageNo,
          params: lineParams,
        })
        return studentsResp?.data
      default:
        return null
    }
  }

  const handleChartClick = async ({
    e,
    name,
    startEnd,
    newDateRange,
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
        name,
        start: startEnd?.start,
        end: startEnd?.end,
        newDateRange: { ...newDateRange },
        chartType: studentCharts?.[name]?.chartType,
        xAxisTitle: xAxisTitle,
      },
      title: name,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
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

export default students
