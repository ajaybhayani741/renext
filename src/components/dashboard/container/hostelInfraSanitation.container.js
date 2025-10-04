import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import {
  entries,
  include,
  notEqual,
  keys,
  isEqual,
} from '../../../utils/javascript'
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
    }
  }, [dateRange])

  const getDataApi = async ({ name }) => {
    const lineParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      start: lineChartRange?.start,
      end: lineChartRange?.end,
    }
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const pieParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'dash_TotalToiletsAvailable':
        const availableToiletsResp = await getAvailableToiletsChartApi({
          params: lineParams,
        })
        return availableToiletsResp
      case 'dash_PercentageOfToiletsFunctioning':
        const functioningToiletsResp = await getFunctioningToiletsChartApi({
          params: lineParams,
        })
        return functioningToiletsResp
      case 'job_DrinkingWater':
        const drinkingWaterResp = await getDrinkingWaterChartApi({
          params: pieParams,
        })
        return drinkingWaterResp
      case 'dash_WasteManagement':
        const wasteManagementResp = await getWasteManagementBarChartApi({
          params: columnParams,
        })
        return wasteManagementResp
      case 'dash_ToiletsSufficiency':
        const toiletsSufficiencyResp = await getToiletsSufficiencyBarChartApi({
          params: columnParams,
        })
        return toiletsSufficiencyResp
      default:
        return null
    }
  }

  const getData = async ({
    chartType = keys(hostelInfraSanitationCharts),
  } = {}) => {
    let tempSeriesData = {}
    chartType?.forEach(async key => {
      const respData = await getDataApi({ name: key })
      if (respData?.data) {
        if (isEqual(key, 'job_DrinkingWater')) {
          const series = [
            {
              colorByPoint: true,
              data: entries(drinkingWaterKeys)?.map(([k, v], i) => ({
                id: i + 1,
                name: t(v?.label),
                valueId: v?.value,
                y: respData?.data?.[k] || 0,
              })),
            },
          ]
          tempSeriesData['job_DrinkingWater'] = {
            series,
          }
        } else if (isEqual(key, 'dash_WasteManagement')) {
          setSeriesData(prev => ({
            ...prev,
            dash_WasteManagement: {
              ...prev.dash_WasteManagement,
              series: [
                {
                  name: t('btn_Yes'),
                  data: [
                    respData.data
                      .gpMunicipalityClearingSolidWasteRegularlyYes || 0,
                    respData.data.greyBlackWaterSeparatelyDrainedYes || 0,
                    respData.data.septicTankCleanedRegularlyYes || 0,
                    respData.data.soakPitsInHostelYes || 0,
                    respData.data.sufficientDistanceSepticTankBorewellYes || 0,
                    respData.data.hostelPremisesKeptCleanYes || 0,
                  ],
                },
                {
                  name: t('btn_No'),
                  data: [
                    respData.data.gpMunicipalityClearingSolidWasteRegularlyNo ||
                      0,
                    respData.data.greyBlackWaterSeparatelyDrainedNo || 0,
                    respData.data.septicTankCleanedRegularlyNo || 0,
                    respData.data.soakPitsInHostelNo || 0,
                    respData.data.sufficientDistanceSepticTankBorewellNo || 0,
                    respData.data.hostelPremisesKeptCleanNo || 0,
                  ],
                },
              ],
            },
          }))
        } else if (isEqual(key, 'dash_ToiletsSufficiency')) {
          setSeriesData(prev => ({
            ...prev,
            dash_ToiletsSufficiency: {
              ...prev.dash_ToiletsSufficiency,
              series: [
                {
                  name: t('btn_Yes'),
                  data: [respData.data.numberOfToiletsSufficientYes || 0],
                },
                {
                  name: t('btn_No'),
                  data: [respData.data.numberOfToiletsSufficientNo || 0],
                },
              ],
            },
          }))
        } else {
          setLineChartSeriesData({
            respData,
            tempSeriesData,
            key,
          })
        }
      }
      setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
    })
  }

  const getHandleClickDataApi = async ({
    category,
    name,
    range,
    pageNo = 1,
  }) => {
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
    if (isEqual(name, 'dash_WasteManagement')) {
      categoryValue = wasteManagementCategoryMapping[data?.category]
    } else if (isEqual(name, 'dash_ToiletsSufficiency')) {
      categoryValue = 'ARE_TOILETS_SUFFICIENT'
    }

    const respData = await getHandleClickDataApi({
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
    const respData = await getHandleClickDataApi({
      category: selectedColumn?.categoryValue,
      name: selectedColumn?.title,
      pageNo: current,
      range: selectedColumn?.chartData?.category,
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