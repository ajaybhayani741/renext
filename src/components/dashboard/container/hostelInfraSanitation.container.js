import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import {
  entries,
  isEqual,
  keys,
  notEqual,
  values,
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
  lineChartRange,
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

  const getDataApi = async ({
    name,
    start = lineChartRange?.start,
    end = lineChartRange?.end,
  }) => {
    const lineParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      start,
      end,
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
      case 'job_PercentageOfTotalToiletsFunctioning':
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
    start,
    end,
  } = {}) => {
    let tempSeriesData = {}
    chartType?.forEach(async key => {
      const respData = await getDataApi({ name: key, start, end })
      if (respData?.data) {
        if (isEqual(key, 'job_DrinkingWater')) {
          const isData = values(respData?.data)?.find(item => item)
          const series = isData
            ? [
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
            : []
          tempSeriesData['job_DrinkingWater'] = {
            series,
          }
        } else if (isEqual(key, 'dash_WasteManagement')) {
          const isData = values(respData?.data)?.find(item => item)
          setSeriesData(prev => ({
            ...prev,
            dash_WasteManagement: {
              ...prev.dash_WasteManagement,
              series: isData
                ? [
                    {
                      name: t('btn_Yes'),
                      data: [
                        respData.data
                          .gpMunicipalityClearingSolidWasteRegularlyYes || 0,
                        respData.data.greyBlackWaterSeparatelyDrainedYes || 0,
                        respData.data.septicTankCleanedRegularlyYes || 0,
                        respData.data.soakPitsInHostelYes || 0,
                        respData.data.sufficientDistanceSepticTankBorewellYes ||
                          0,
                        respData.data.hostelPremisesKeptCleanYes || 0,
                      ],
                    },
                    {
                      name: t('btn_No'),
                      data: [
                        respData.data
                          .gpMunicipalityClearingSolidWasteRegularlyNo || 0,
                        respData.data.greyBlackWaterSeparatelyDrainedNo || 0,
                        respData.data.septicTankCleanedRegularlyNo || 0,
                        respData.data.soakPitsInHostelNo || 0,
                        respData.data.sufficientDistanceSepticTankBorewellNo ||
                          0,
                        respData.data.hostelPremisesKeptCleanNo || 0,
                      ],
                    },
                  ]
                : [],
            },
          }))
        } else if (isEqual(key, 'dash_ToiletsSufficiency')) {
          const isData = values(respData?.data)?.find(item => item)
          setSeriesData(prev => ({
            ...prev,
            dash_ToiletsSufficiency: {
              ...prev.dash_ToiletsSufficiency,
              series: isData
                ? [
                    {
                      name: t('btn_Yes'),
                      data: [respData.data.numberOfToiletsSufficientYes || 0],
                    },
                    {
                      name: t('btn_No'),
                      data: [respData.data.numberOfToiletsSufficientNo || 0],
                    },
                  ]
                : [],
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
    filterValue,
    name,
    range,
    pageNo = 1,
    start,
    end,
    newDateRange = dateRange,
  }) => {
    const lineParams = {
      fromDate: newDateRange?.from,
      toDate: newDateRange?.to,
      ...(range && { range }),
      ...((start || end) && { start, end }),
    }
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
          params: lineParams,
        })
        return availableToiletsResp?.data
      case 'job_PercentageOfTotalToiletsFunctioning':
        const functioningToiletsResp = await getFunctioningToiletsHostelsApi({
          pageNo,
          params: lineParams,
        })
        return functioningToiletsResp?.data

      case 'dash_WasteManagement':
        const wasteManagementResp = await getWasteManagementHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: category,
            filterValue,
          },
        })
        return wasteManagementResp?.data

      case 'dash_ToiletsSufficiency':
        const toiletsSufficiencyResp = await getToiletsSufficiencyHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue,
          },
        })
        return toiletsSufficiencyResp?.data

      default:
        setHostelsData(null)
        break
    }
  }

  const handleChartClick = async ({
    e,
    name,
    startEnd,
    newDateRange,
    xAxisTitle,
  }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const type = data?.series?.name
    let categoryValue = data?.valueId
    if (isEqual(name, 'dash_WasteManagement')) {
      categoryValue = wasteManagementCategoryMapping[data?.category]
    } else if (isEqual(name, 'dash_ToiletsSufficiency')) {
      categoryValue = 'ARE_TOILETS_SUFFICIENT'
    }
    const respData = await getHandleClickDataApi({
      category: categoryValue,
      range: data?.category,
      filterValue: type === t('btn_Yes') ? 'YES' : 'NO',
      name,
      start: startEnd?.start,
      end: startEnd?.end,
      newDateRange: { ...newDateRange },
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
          ? type || data?.custom?.label
          : null,
        value: data?.y,
        start: startEnd?.start,
        end: startEnd?.end,
        range: data?.category,
        newDateRange: { ...newDateRange },
        chartType: hostelInfraSanitationCharts?.[name]?.type,
        xAxisTitle: xAxisTitle,
      },
      title: name,
      modalTitle: hostelInfraSanitationCharts?.[name]?.modalTitle,
      categoryValue: categoryValue,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      filterValue:
        selectedColumn?.chartData?.type === t('btn_Yes') ? 'YES' : 'NO',
      category: selectedColumn?.categoryValue,
      name: selectedColumn?.title,
      pageNo: current,
      range: selectedColumn?.chartData?.category,
      start: selectedColumn?.chartData?.start,
      end: selectedColumn?.chartData?.end,
      newDateRange: selectedColumn?.chartData?.newDateRange,
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
    onRangeChange: getData,
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
