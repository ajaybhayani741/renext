import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries } from '../../../utils/javascript'
import {
  axisOptionsList,
  hostelsList,
  staffDetailsCharts,
} from '../dashboard.description'

const staffDetails = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [axisOptions, setAxisOptions] = useState(null)
  // const [totalData, setTotalData] = useState(null)
  const title = t('dash_StaffDetails')

  useEffect(() => {
    getSeriesData()
  }, [])

  const handleChartClick = (e, name) => {
    const data = e.point
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        value: data?.y,
      },
      list: [...hostelsList],
      title: 'dash_Students',
      modalTitle: staffDetailsCharts?.[name]?.modalTitle,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(staffDetailsCharts).forEach(([key, value]) => {
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
    setSeriesData(tempSeriesData)
    setAxisOptions(tempOptions)
    // setTotalData(tempTotalData)
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
    axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
  }
}

export default staffDetails
