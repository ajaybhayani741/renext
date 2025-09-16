import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries, include, notEqual } from '../../../utils/javascript'
import {
  axisOptionsList,
  hostelInfraSanitationCharts,
  hostelsList,
  schoolsList,
} from '../dashboard.description'

const hostelInfraSanitation = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState({
    job_DrinkingWater: [
      {
        colorByPoint: true,
        data: [
          { id: 1, name: t('dash_TapMunicipalityOrMissionBhageeratha'), y: 10 },
          { id: 1, name: t('dash_OpenWell'), y: 10 },
          { id: 1, name: t('dash_ROPlant'), y: 10 },
        ],
      },
    ],
    dash_WasteManagement: {
      chartData: {
        category: [
          t('dash_GPMunicipalityIsRegularlyCleaningTheSolidWaste'),
          t('dash_GreyWaterAndBlackWaterSeparatelyDrainedOut'),
          t('dash_SepticTankCleanedRegularly'),
          t('dash_SoakPitsInTheHostel'),
          t('dash_MoreThan30mDistanceBetweenSepticTankAndBoreWell'),
          t('dash_HostelPremisesAreKeptCleanInsideAndOutside'),
        ],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [85, 45, 10, 18, 58, 35],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [15, 55, 25, 32, 72, 42],
          // pointPlacement: 0.12,
        },
      ],
    },
    dash_ToiletsSufficiency: {
      chartData: {
        category: [t('job_AreToiletsSufficient')],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [68],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [32],
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
        category: data?.category || data?.name,
        type: notEqual(name, 'job_DrinkingWater')
          ? data?.series?.name || data?.custom?.label
          : null,
        value: data?.y,
      },
      list: include(
        [
          'dash_WasteManagement',
          'dash_ToiletsSufficiency',
          'job_DrinkingWater',
        ],
        name,
      )
        ? [...schoolsList]
        : [...hostelsList],
      title: name,
      modalTitle: hostelInfraSanitationCharts?.[name]?.modalTitle,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(hostelInfraSanitationCharts).forEach(([key, value]) => {
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
    handleChartClick,
    seriesData,
    axisOptions,
    selectedColumn,
    handleCloseModal,
  }
}

export default hostelInfraSanitation
