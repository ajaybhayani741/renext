import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  axisOptionsList,
  foodPrevisionsCharts,
  schoolsList,
} from '../dashboard.description'

const foodProvisions = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const [seriesData, setSeriesData] = useState({
    job_NatureOfCookingFuel: [
      {
        name: 'Level 1',
        data: [
          // { name: "", y: , color: '#95ceff' },
        ],
        size: '42%',
        dataLabels: {
          formatter: function () {
            return this.y > 5 ? this.point.name : null
          },
          color: '#000000',
          distance: -65,
          style: {
            fontSize: 14,
          },
        },
      },
      {
        name: 'Level 2',
        data: [
          { name: t('job_LPG'), y: 50, color: '#f3caaa' },
          { name: t('job_Firewood'), y: 50, color: '#f1725e' },
        ],
        size: '75%',
        innerSize: '60%',
        id: 'level2',
        dataLabels: {
          style: {
            fontSize: 14,
          },
          distance: -28,
        },
      },
      {
        name: 'Level 3',
        data: [
          { name: t('job_NoLPGCylinders'), y: 20, color: '#9c6644' },
          { name: t('job_SufficientLPGCylinders'), y: 15, color: '#ab815f' },
          { name: t('job_NonSufficientLPGCylinders'), y: 15, color: '#ddb892' },

          {
            name: t('job_Firewood'),
            y: 50,
            color: '#f08700',
          },
        ],
        size: '95%',
        innerSize: '80%',
        id: 'level3',
        dataLabels: {
          style: {
            fontSize: 14,
          },
        },
      },
    ],
    job_FoodProvisions: {
      chartData: {
        category: [
          t('dash_MenuChartDisplay'),
          t('dash_MenuImplementationAsPrescribed'),
          t('job_StockRegisterMaintained'),
          t('job_VegetablesStoredAboveGround'),
          t('job_ExhaustFanInKitchen'),
        ],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [85, 45, 78, 90, 56],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [15, 55, 22, 34, 56],
          // pointPlacement: 0.12,
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
        type: data?.series?.name,
        value: data?.y,
      },
      list: [...schoolsList],
      title: name,
      modalTitle: true,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(foodPrevisionsCharts).forEach(([key, value]) => {
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

export default foodProvisions
