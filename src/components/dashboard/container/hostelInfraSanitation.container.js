import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, include, notEqual } from '../../../utils/javascript'
import {
  getAvailableToiletsChartApi,
  getAvailableToiletsHostelsApi,
  getDrinkingWaterChartApi,
  getDrinkingWaterHostelsApi,
  getFunctioningToiletsChartApi,
  getFunctioningToiletsHostelsApi,
  getToiletsSufficiencyBarChartApi,
  getToiletsSufficiencyHostelsApi,
  getWasteManagementBarChartApi,
  getWasteManagementHostelsApi,
} from '../dashboard.api'
import {
  drinkingWaterKeys,
  hostelInfraSanitationCharts,
  hostelsList,
  lineChartRange,
  schoolsList,
} from '../dashboard.description'
import { setLineChartSeriesData } from '../dashboardFunctions'

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
  const axisOptions = null

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
    if (dateRange?.from && dateRange?.to) {
      getData()
      getWasteManagementData()
      getToiletsSufficiencyData()
    }
  }, [dateRange])

  const getData = async () => {
    const [availableToiletsResp, functioningToiletsResp, drinkingWaterResp] =
      await Promise.all([
        getAvailableToiletsChartApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            start: lineChartRange?.start,
            end: lineChartRange?.end,
          },
        }),
        getFunctioningToiletsChartApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            start: lineChartRange?.start,
            end: lineChartRange?.end,
          },
        }),
        getDrinkingWaterChartApi({
          params: { fromDate: dateRange?.from, toDate: dateRange?.to },
        }),
      ])

    let tempSeriesData = {}
    if (drinkingWaterResp?.data) {
      const series = [
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
      tempSeriesData['job_DrinkingWater'] = {
        series,
      }
    }
    setLineChartSeriesData({
      respData: availableToiletsResp,
      tempSeriesData,
      key: 'dash_TotalToiletsAvailable',
    })
    setLineChartSeriesData({
      respData: functioningToiletsResp,
      tempSeriesData,
      key: 'dash_PercentageOfToiletsFunctioning',
    })

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
          series: [
            {
              name: t('btn_Yes'),
              data: [
                response.data.gpMunicipalityClearingSolidWasteRegularlyYes || 0,
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
                response.data.gpMunicipalityClearingSolidWasteRegularlyNo || 0,
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
          series: [
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

  const handleClickFn = async ({ category, name, range, pageNo = 1 }) => {
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
      case 'dash_TotalToiletsAvailable':
        const availableToiletsResp = await getAvailableToiletsHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            range,
          },
        })
        return availableToiletsResp?.data
      case 'dash_PercentageOfToiletsFunctioning':
        const functioningToiletsResp = await getFunctioningToiletsHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            range,
          },
        })
        return functioningToiletsResp?.data

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

    const respData = await handleClickFn({
      category: categoryValue,
      range: data?.category,
      name,
    })
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
