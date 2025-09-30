import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, include, isEqual, notEqual } from '../../../utils/javascript'
import {
  getDrinkingWaterChartApi,
  getDrinkingWaterHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  drinkingWaterKeys,
  hostelInfraSanitationCharts,
  hostelsList,
  schoolsList,
} from '../dashboard.description'

const hostelInfraSanitation = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState(null)
  const [seriesData, setSeriesData] = useState({
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
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getData = async () => {
    const [drinkingWaterResp] = await Promise.all([
      getDrinkingWaterChartApi({
        params: { fromDate: dateRange?.from, toDate: dateRange?.to },
      }),
    ])
    let tempSeriesData = {}
    if (drinkingWaterResp?.data) {
      const data = [
        {
          colorByPoint: true,
          data: entries(drinkingWaterKeys)?.map(([k, v], i) => ({
            id: i + 1,
            name: t(v?.label),
            valueId: v?.value,
            y: drinkingWaterResp?.data?.[k] || 0,
          })),
        },
      ]
      tempSeriesData['job_DrinkingWater'] = data
    }
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  const handleClickFn = async ({ category, name, pageNo = 1 }) => {
    switch (name) {
      case 'job_DrinkingWater':
        const resp = await getDrinkingWaterHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue: category,
          },
        })
        return resp?.data

      default:
        setHostelsData(null)
        break
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await handleClickFn({ category: data?.valueId, name })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }

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
      categoryValue: data?.valueId,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await handleClickFn({
      category: selectedColumn?.categoryValue,
      name: selectedColumn?.title,
      pageNo: current,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(hostelInfraSanitationCharts).forEach(([key, value]) => {
      if (
        notEqual(value?.type, 'rangeFrequency') ||
        isEqual(key, 'job_DrinkingWater')
      )
        return

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
    handleTableChange,
    hostelsData,
  }
}

export default hostelInfraSanitation
