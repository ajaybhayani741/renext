import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import {
  getHostelStudentsChartApi,
  getStudentsHostelsApi,
} from '../dashboard.api'
import { hostelsList, lineChartRange } from '../dashboard.description'
import { setLineChartSeriesData } from '../dashboardFunctions'

const students = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)
  // const [axisOptions, setAxisOptions] = useState({ ...axisOptionsList })
  const title = t('dash_TotalNumberOfStudents')

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getData = async () => {
    let tempSeriesData = {}
    const respData = await getHostelStudentsChartApi({
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        start: lineChartRange?.start,
        end: lineChartRange?.end,
      },
    })
    setLineChartSeriesData({
      respData,
      tempSeriesData,
      key: 'dash_Students',
    })
    setSeriesData(tempSeriesData)
  }

  const handleChartClick = async e => {
    const data = e.point
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        value: data?.y,
      },
      list: [...hostelsList],
      title: 'dash_Students',
    })
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getStudentsHostelsApi({
      pageNo: 1,
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        range: data?.category,
      },
    })
    if (respData) {
      setHostelsData({ ...respData?.data, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await await getStudentsHostelsApi({
      pageNo: 1,
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        range: selectedColumn?.chartData?.category,
      },
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
    xAxisTitle: 'dash_NumberOfStudents',
    yAxisTitle: 'dash_NumberOfHostels',
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
  }
}

export default students
