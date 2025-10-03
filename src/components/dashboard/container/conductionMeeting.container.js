import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  getConductionMeetingsBarChartApi,
  getConductionMeetingsHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  conductionMeetingCharts,
  schoolsList,
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

  const [seriesData, setSeriesData] = useState({
    dash_PrincipalHWOSpecialOfficer: {
      chartData: {
        category: [t('job_HWOMeetingsRegular')],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [],
          // pointPlacement: 0.12,
        },
      ],
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getConductionMeetingsBarChartData()
    }
  }, [dateRange])

  // Conduction Meetings Bar Chart API call
  const getConductionMeetingsBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getConductionMeetingsBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        dash_PrincipalHWOSpecialOfficer: {
          ...prev.dash_PrincipalHWOSpecialOfficer,
          seriesData: [
            {
              name: t('btn_Yes'),
              data: [response.data.meetingsConvenedRegularlyYes || 0],
            },
            {
              name: t('btn_No'),
              data: [response.data.meetingsConvenedRegularlyNo || 0],
            },
          ],
        },
      }))
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point

    if (name === 'dash_PrincipalHWOSpecialOfficer') {
      // Handle conduction meetings bar chart click
      const type = data?.series?.name
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getConductionMeetingsHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue: filterValue,
          },
          pageNo: 1,
        })

        if (response && response.data) {
          setSelectedColumn({
            selected: true,
            chartData: {
              category: data?.category,
              type: data?.series?.name,
              value: data?.y,
            },
            list: response.data.hostels || [],
            title: name,
            modalTitle: true,
          })
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } else {
      setSelectedColumn({
        selected: true,
        chartData: {
          category: data?.category,
          type: data?.series?.name,
          value: data?.y,
        },
        list: [...schoolsList],
        title: name,
        modalTitle: true,
      })
    }
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
      tempSeriesData[key] = [
        {
          type: 'column',
          data: [
            [5, 45],
            [10, 37],
            [15, 28],
            [20, 17],
            [25, 39],
            [30, 18],
            [35, 90],
            [40, 78],
            [45, 74],
            [50, 18],
            [55, 17],
            [60, 16],
          ],
        },
        {
          type: 'spline',
          data: [
            [5, 45],
            [10, 37],
            [15, 28],
            [20, 17],
            [25, 39],
            [30, 18],
            [35, 90],
            [40, 78],
            [45, 74],
            [50, 18],
            [55, 17],
            [60, 16],
          ],
        },
      ]
      // tempTotalData[key] = 1100
    })
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
    setAxisOptions(prev => ({ ...prev, ...tempOptions }))
    // setTotalData(tempTotalData)
  }

  const handleTableChange = async ({ current }) => {
    if (selectedColumn?.title === 'dash_PrincipalHWOSpecialOfficer') {
      // Handle conduction meetings bar chart pagination
      const type = selectedColumn?.chartData?.type
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getConductionMeetingsHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue: filterValue,
          },
          pageNo: current,
        })

        if (response && response.data) {
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
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
