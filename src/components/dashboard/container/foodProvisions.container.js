import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual, values } from '../../../utils/javascript'
import {
  getFoodProvisionsBarChartApi,
  getFoodProvisionsHostelsApi,
  getCookingFuelBarChartApi,
  getCookingFuelHostelsApi,
  getVariationBarChartApi,
  getVariationHostelsApi,
} from '../dashboard.api'
import { axisOptionsList, foodPrevisionsCharts } from '../dashboard.description'
import { getHostelChartParams } from '../dashboardFunctions'

const foodProvisions = ({ hostelFilter } = {}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState(null)

  const [seriesData, setSeriesData] = useState({})
  const [axisOptions, setAxisOptions] = useState(null)

  const categoryMapping = {
    [t('dash_MenuChartDisplay')]: 'MENU_CHART_DISPLAYED',
    [t('dash_MenuImplementationAsPrescribed')]:
      'MENU_IMPLEMENTED_AS_PRESCRIBED',
    [t('job_StockRegisterMaintained')]: 'STOCK_REGISTER_MAINTAINED',
    [t('job_VegetablesStoredAboveGround')]: 'VEGETABLES_STORED_ABOVE_GROUND',
    [t('job_ExhaustFanInKitchen')]: 'EXHAUST_FAN_IN_KITCHEN',
    [t('job_VariationInRice')]: 'VARIATION_IN_RICE',
    [t('job_VariationInDal')]: 'VARIATION_IN_DAL',
    [t('job_VariationInCookingOil')]: 'VARIATION_IN_COOKING_OIL',
    [t('job_VariationInSugar')]: 'VARIATION_IN_SUGAR',
    [t('job_VariationInIdliRava')]: 'VARIATION_IN_IDLI_RAVA',
    [t('job_VariationInRagiMalt')]: 'VARIATION_IN_RAGI_MALT',
  }

  const cookingFuelCategoryMapping = {
    'Level 2': {
      [t('job_LPG')]: {
        category: 'NATURE_OF_COOKING_FUEL',
        filterValue: 'LPG',
      },
      [t('job_Firewood')]: {
        category: 'NATURE_OF_COOKING_FUEL',
        filterValue: 'FIREWOOD',
      },
    },
    'Level 3': {
      [t('job_NoLPGCylinders')]: {
        category: 'LPG_CYLINDERS_AVAILABLE',
        filterValue: 'NO',
      },
      [t('job_SufficientLPGCylinders')]: {
        category: 'LPG_CYLINDERS_AVAILABLE',
        filterValue: 'YES_SUFFICIENT',
      },
      [t('job_NonSufficientLPGCylinders')]: {
        category: 'LPG_CYLINDERS_AVAILABLE',
        filterValue: 'YES_INSUFFICIENT',
      },
      [t('job_Firewood')]: {
        category: 'NATURE_OF_COOKING_FUEL',
        filterValue: 'FIREWOOD',
      },
    },
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter])

  const getDataApi = name => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'job_FoodProvisions':
        return getFoodProvisionsBarChartApi({ params })
      case 'job_Variation':
        return getVariationBarChartApi({ params })
      case 'job_NatureOfCookingFuel':
        return getCookingFuelBarChartApi({ params })
      default:
        return null
    }
  }

  const getData = async () => {
    let tempSeriesData = {}
    for (const key of Object.keys(foodPrevisionsCharts)) {
      const response = await getDataApi(key)
      if (response && response.data) {
        const isData = values(response?.data)?.find(item => item)
        if (key === 'job_FoodProvisions') {
          tempSeriesData[key] = {
            chartData: {
              category: [
                t('dash_MenuChartDisplay'),
                t('dash_MenuImplementationAsPrescribed'),
                t('job_StockRegisterMaintained'),
                t('job_VegetablesStoredAboveGround'),
                t('job_ExhaustFanInKitchen'),
              ],
            },
            seriesData: isData
              ? [
                  {
                    name: t('btn_Yes'),
                    data: [
                      response.data.menuChartDisplayedYes || 0,
                      response.data.menuImplementedAsPrescribedYes || 0,
                      response.data.stockRegisterMaintainedYes || 0,
                      response.data.vegetablesStoredAboveGroundYes || 0,
                      response.data.exhaustFanInKitchenYes || 0,
                    ],
                  },
                  {
                    name: t('btn_No'),
                    data: [
                      response.data.menuChartDisplayedNo || 0,
                      response.data.menuImplementedAsPrescribedNo || 0,
                      response.data.stockRegisterMaintainedNo || 0,
                      response.data.vegetablesStoredAboveGroundNo || 0,
                      response.data.exhaustFanInKitchenNo || 0,
                    ],
                  },
                ]
              : [],
          }
        } else if (key === 'job_Variation') {
          tempSeriesData[key] = {
            chartData: {
              category: [
                t('job_VariationInRice'),
                t('job_VariationInDal'),
                t('job_VariationInCookingOil'),
                t('job_VariationInSugar'),
                t('job_VariationInIdliRava'),
                t('job_VariationInRagiMalt'),
              ],
            },
            seriesData: isData
              ? [
                  {
                    name: t('btn_Yes'),
                    data: [
                      response.data.variationInRiceYes || 0,
                      response.data.variationInDalYes || 0,
                      response.data.variationInCookingOilYes || 0,
                      response.data.variationInSugarYes || 0,
                      response.data.variationInIdliRavaYes || 0,
                      response.data.variationInRagiMaltYes || 0,
                    ],
                  },
                  {
                    name: t('btn_No'),
                    data: [
                      response.data.variationInRiceNo || 0,
                      response.data.variationInDalNo || 0,
                      response.data.variationInCookingOilNo || 0,
                      response.data.variationInSugarNo || 0,
                      response.data.variationInIdliRavaNo || 0,
                      response.data.variationInRagiMaltNo || 0,
                    ],
                  },
                ]
              : [],
          }
        } else if (key === 'job_NatureOfCookingFuel') {
          tempSeriesData[key] = isData
            ? [
                {
                  name: 'Level 1',
                  data: [],
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
                    {
                      name: t('job_LPG'),
                      y: response.data.lpgCount || 0,
                      color: '#f3caaa',
                    },
                    {
                      name: t('job_Firewood'),
                      y: response.data.firewoodCount || 0,
                      color: '#f1725e',
                    },
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
                    {
                      name: t('job_NoLPGCylinders'),
                      y: response.data.noLpgCylindersCount || 0,
                      color: '#9c6644',
                    },
                    {
                      name: t('job_SufficientLPGCylinders'),
                      y: response.data.sufficientLpgCylindersCount || 0,
                      color: '#ab815f',
                    },
                    {
                      name: t('job_NonSufficientLPGCylinders'),
                      y: response.data.insufficientLpgCylindersCount || 0,
                      color: '#ddb892',
                    },
                    {
                      name: t('job_Firewood'),
                      y: response.data.firewoodCount || 0,
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
              ]
            : []
        }
      }
    }
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  const getHandleClickDataApi = ({ name, category, pageNo, type }) => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      pageNo,
    }
    switch (name) {
      case 'job_FoodProvisions':
        const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
        const apiCategory = categoryMapping[category]
        return getFoodProvisionsHostelsApi({
          pageNo,
          params: { ...params, category: apiCategory, filterValue },
        })
      case 'job_Variation':
        const filteredValue = type === t('btn_Yes') ? 'YES' : 'NO'
        const apiCategoryValue = categoryMapping[category]
        return getVariationHostelsApi({
          pageNo,
          params: {
            ...params,
            category: apiCategoryValue,
            filterValue: filteredValue,
          },
        })
      case 'job_NatureOfCookingFuel':
        const mapping = cookingFuelCategoryMapping[type]?.[category]
        if (mapping) {
          return getCookingFuelHostelsApi({
            pageNo,
            params: {
              ...params,
              category: mapping.category,
              filterValue: mapping.filterValue,
            },
          })
        }
        return null
      default:
        return null
    }
  }

  const handleChartClick = async ({ e, name }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const category = data?.category || data?.name
    const type = data?.series?.name || data?.type
    const response = await getHandleClickDataApi({
      name,
      category,
      type,
      pageNo: 1,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category,
        type,
        value: data?.y,
        chartType: foodPrevisionsCharts[name]?.type,
      },
      list: response?.data?.hostels || [],
      title: name,
      modalTitle: foodPrevisionsCharts[name]?.modalTitle,
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
    })
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
    setAxisOptions(prev => ({ ...prev, ...tempOptions }))
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const { title, chartData } = selectedColumn
    const response = await getHandleClickDataApi({
      name: title,
      category: chartData?.category,
      type: chartData?.type,
      pageNo: current,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
    setHostelsData({})
  }

  return {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default foodProvisions
