import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, include, isEqual, notEqual } from '../../../utils/javascript'
import {
  getDrinkingWaterChartApi,
  getDrinkingWaterHostelsApi,
  getWasteManagementBarChartApi,
  getWasteManagementHostelsApi,
  getToiletsSufficiencyBarChartApi,
  getToiletsSufficiencyHostelsApi,
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
      seriesData: null,
    },
    dash_ToiletsSufficiency: {
      chartData: {
        category: [t('job_AreToiletsSufficient')],
      },
      seriesData: null,
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  const wasteManagementCategoryMapping = {
    [t('dash_GPMunicipalityIsRegularlyCleaningTheSolidWaste')]:
      'GP_MUNICIPALITY_CLEARING_SOLID_WASTE',
    [t('dash_GreyWaterAndBlackWaterSeparatelyDrainedOut')]:
      'GREY_BLACK_WATER_SEPARATELY_DRAINED',
    [t('dash_SepticTankCleanedRegularly')]: 'SEPTIC_TANK_CLEANED_REGULARLY',
    [t('dash_SoakPitsInTheHostel')]: 'SOAK_PITS_IN_HOSTEL',
    [t('dash_MoreThan30mDistanceBetweenSepticTankAndBoreWell')]:
      'SUFFICIENT_DISTANCE_SEPTIC_TANK_BOREWELL',
    [t('dash_HostelPremisesAreKeptCleanInsideAndOutside')]:
      'HOSTEL_PREMISES_KEPT_CLEAN',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getData()
      getWasteManagementData()
      getToiletsSufficiencyData()
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

  const getWasteManagementData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getWasteManagementBarChartApi({ params })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        dash_WasteManagement: {
          ...prev.dash_WasteManagement,
          seriesData: [
            {
              name: t('btn_Yes'),
              data: [
                response.data.gpMunicipalityClearingSolidWasteYes || 0,
                response.data.greyBlackWaterSeparatelyDrainedYes || 0,
                response.data.septicTankCleanedRegularlyYes || 0,
                response.data.soakPitsInHostelYes || 0,
                response.data.sufficientDistanceSepticTankBorewellYes || 0,
                response.data.hostelPremisesKeptCleanYes || 0,
              ],
            },
            {
              name: t('btn_No'),
              data: [
                response.data.gpMunicipalityClearingSolidWasteNo || 0,
                response.data.greyBlackWaterSeparatelyDrainedNo || 0,
                response.data.septicTankCleanedRegularlyNo || 0,
                response.data.soakPitsInHostelNo || 0,
                response.data.sufficientDistanceSepticTankBorewellNo || 0,
                response.data.hostelPremisesKeptCleanNo || 0,
              ],
            },
          ],
        },
      }))
    }
  }

  const getToiletsSufficiencyData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getToiletsSufficiencyBarChartApi({ params })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        dash_ToiletsSufficiency: {
          ...prev.dash_ToiletsSufficiency,
          seriesData: [
            {
              name: t('btn_Yes'),
              data: [response.data.numberOfToiletsSufficientYes || 0],
            },
            {
              name: t('btn_No'),
              data: [response.data.numberOfToiletsSufficientNo || 0],
            },
          ],
        },
      }))
    }
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

      case 'dash_WasteManagement':
        const wasteManagementResp = await getWasteManagementHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: category,
            filterValue:
              selectedColumn?.chartData?.type === t('btn_Yes') ? 'YES' : 'NO',
          },
        })
        return wasteManagementResp?.data

      case 'dash_ToiletsSufficiency':
        const toiletsSufficiencyResp = await getToiletsSufficiencyHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue:
              selectedColumn?.chartData?.type === t('btn_Yes') ? 'YES' : 'NO',
          },
        })
        return toiletsSufficiencyResp?.data

      default:
        setHostelsData(null)
        break
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))

    let categoryValue = data?.valueId
    if (name === 'dash_WasteManagement') {
      // For waste management, we need to map the category to API format
      const categoryIndex = data?.category
      const categoryKeys = Object.keys(wasteManagementCategoryMapping)
      if (categoryIndex !== undefined && categoryKeys[categoryIndex]) {
        categoryValue =
          wasteManagementCategoryMapping[categoryKeys[categoryIndex]]
      }
    }

    const respData = await handleClickFn({ category: categoryValue, name })
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
      categoryValue: categoryValue,
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
