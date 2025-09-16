import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import {
  axisOptionsList,
  hostelInfraRoomsCharts,
  hostelsList,
  schoolsList,
} from '../dashboard.description'

const hostelInfraRooms = () => {
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
        type: data?.series?.name || data?.custom?.label,
        value: data?.y,
      },
      list: isEqual(name, 'dash_LocationBedsMattresses')
        ? [...schoolsList]
        : [...hostelsList],
      title: name,
      modalTitle: hostelInfraRoomsCharts?.[name]?.modalTitle,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(hostelInfraRoomsCharts).forEach(([key, value]) => {
      tempOptions[key] = isEqual(value?.chartType, 'column')
        ? {
            category: value?.xAxisText?.map(v => t(v)),
          }
        : {
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
      tempSeriesData[key] = isEqual(value?.chartType, 'column')
        ? [
            {
              name: '',
              color: '#eabf9f',
              data: [
                { y: 85, custom: { label: t('dash_Government') } },
                { y: 45, custom: { label: t('btn_Yes') } },
                { y: 70, custom: { label: t('btn_Yes') } },
                { y: 60, custom: { label: t('btn_Yes') } },
              ],
              // pointPlacement: -0.13,
            },
            {
              name: '',
              color: '#f1725d',
              data: [
                { y: 15, custom: { label: t('dash_Private') } },
                { y: 55, custom: { label: t('btn_No') } },
                { y: 30, custom: { label: t('btn_No') } },
                { y: 40, custom: { label: t('btn_No') } },
              ],
              // pointPlacement: 0.12,
            },
          ]
        : [
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

export default hostelInfraRooms
