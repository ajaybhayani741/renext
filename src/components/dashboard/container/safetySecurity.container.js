import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries, include, notEqual } from '../../../utils/javascript'
import {
  axisOptionsList,
  hostelsList,
  safetySecurityCharts,
  schoolsList,
} from '../dashboard.description'

const safetySecurity = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const [seriesData, setSeriesData] = useState({
    dash_PrecautionaryMeasures: {
      chartData: {
        category: [
          t('job_OpenSpaceLightingAtNight'),
          t('job_PolicePatrolRequired'),
        ],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [85, 45],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [15, 55],
          // pointPlacement: 0.12,
        },
      ],
    },
    dash_AnimalThreat: {
      chartData: {
        category: [
          t('job_Rats'),
          t('job_Monkeys'),
          t('job_Snakes'),
          t('job_Dogs'),
          t('txt_None'),
        ],
      },
      seriesData: [
        {
          name: t('job_Count'),
          data: [60, 45, 30, 25, 15],
        },
      ],
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  useEffect(() => {
    getSeriesData()
  }, [])

  const handleChartClick = (e, name) => {
    const data = e.point
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        type: notEqual(name, 'dash_AnimalThreat') ? data?.series?.name : null,
        value: data?.y,
      },
      list: include(['dash_PrecautionaryMeasures', 'dash_AnimalThreat'], name)
        ? [...schoolsList]
        : [...hostelsList],
      title: name,
      modalTitle: safetySecurityCharts?.[name]?.modalTitle,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(safetySecurityCharts).forEach(([key, value]) => {
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

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
  }

  return {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
  }
}

export default safetySecurity
