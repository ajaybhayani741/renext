import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual, values } from '../../../utils/javascript'
import {
  getConductionMeetingsBarChartApi,
  getConductionMeetingsHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  conductionMeetingCharts,
} from '../dashboard.description'

const conductionMeeting = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState(null)

  const [seriesData, setSeriesData] = useState({})
  const [axisOptions, setAxisOptions] = useState(null)

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getDataApi = name => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'dash_PrincipalHWOSpecialOfficer':
        return getConductionMeetingsBarChartApi({ params })
      default:
        return null
    }
  }

  const getData = async () => {
    let tempSeriesData = {}
    for (const key of Object.keys(conductionMeetingCharts)) {
      const response = await getDataApi(key)
      if (response && response.data) {
        const isData = values(response?.data)?.find(item => item)
        if (key === 'dash_PrincipalHWOSpecialOfficer') {
          tempSeriesData[key] = {
            chartData: {
              category: [t('job_HWOMeetingsRegular')],
            },
            seriesData: isData
              ? [
                  {
                    name: t('btn_Yes'),
                    data: [response.data.meetingsConvenedRegularlyYes || 0],
                  },
                  {
                    name: t('btn_No'),
                    data: [response.data.meetingsConvenedRegularlyNo || 0],
                  },
                ]
              : [],
          }
        }
      }
    }
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  const getHandleClickDataApi = ({ name, pageNo, type }) => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      pageNo,
    }
    switch (name) {
      case 'dash_PrincipalHWOSpecialOfficer':
        const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
        return getConductionMeetingsHostelsApi({
          pageNo,
          params: { ...params, filterValue },
        })
      default:
        return null
    }
  }

  const handleChartClick = async ({ e, name }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const category = data?.category
    const type = data?.series?.name
    const response = await getHandleClickDataApi({
      name,
      type,
      pageNo: 1,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category,
        type,
        value: data?.y,
      },
      list: response?.data?.hostels || [],
      title: name,
      modalTitle: conductionMeetingCharts[name]?.modalTitle,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(conductionMeetingCharts).forEach(([key, value]) => {
      if (notEqual(value?.type, 'rangeFrequency')) return

      tempOptions[key] = {
        xAxis: {
          ...axisOptionsList?.xAxis,
          title: {
            text: t(value?.xAxisText),
          },
          tickPositions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        },
        yAxis: axisOptionsList?.yAxis?.map(axis => ({
          ...axis,
          title: {
            text: t(value?.yAxisText),
          },
        })),
      }
    })
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
    setAxisOptions(prev => ({ ...prev, ...tempOptions }))
    // setTotalData(tempTotalData)
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const { title, chartData } = selectedColumn
    const response = await getHandleClickDataApi({
      name: title,
      type: chartData?.type,
      pageNo: current,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
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
    setHostelsData({})
  }

  return {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default conductionMeeting
