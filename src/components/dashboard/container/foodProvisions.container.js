import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  getFoodProvisionsBarChartApi,
  getFoodProvisionsHostelsApi,
  getCookingFuelBarChartApi,
  getCookingFuelHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  foodPrevisionsCharts,
  schoolsList,
} from '../dashboard.description'

const foodProvisions = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState(null)

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
          { name: t('job_LPG'), y: 0, color: '#f3caaa' },
          { name: t('job_Firewood'), y: 0, color: '#f1725e' },
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
          { name: t('job_NoLPGCylinders'), y: 0, color: '#9c6644' },
          { name: t('job_SufficientLPGCylinders'), y: 0, color: '#ab815f' },
          { name: t('job_NonSufficientLPGCylinders'), y: 0, color: '#ddb892' },
          {
            name: t('job_Firewood'),
            y: 0,
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
          data: [],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [],
          // pointPlacement: 0.12,
        },
      ],
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  const categoryMapping = {
    [t('dash_MenuChartDisplay')]: 'MENU_CHART_DISPLAYED',
    [t('dash_MenuImplementationAsPrescribed')]:
      'MENU_IMPLEMENTED_AS_PRESCRIBED',
    [t('job_StockRegisterMaintained')]: 'STOCK_REGISTER_MAINTAINED',
    [t('job_VegetablesStoredAboveGround')]: 'VEGETABLES_STORED_ABOVE_GROUND',
    [t('job_ExhaustFanInKitchen')]: 'EXHAUST_FAN_IN_KITCHEN',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getFoodProvisionsBarChartData()
      getCookingFuelBarChartData()
    }
  }, [dateRange])

  // Food Provisions Bar Chart API call
  const getFoodProvisionsBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getFoodProvisionsBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        job_FoodProvisions: {
          ...prev.job_FoodProvisions,
          seriesData: [
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
          ],
        },
      }))
    }
  }

  // Cooking Fuel Bar Chart API call
  const getCookingFuelBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getCookingFuelBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        job_NatureOfCookingFuel: [
          ...prev.job_NatureOfCookingFuel.slice(0, 1), // Keep Level 1 as is
          {
            ...prev.job_NatureOfCookingFuel[1], // Level 2
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
          },
          {
            ...prev.job_NatureOfCookingFuel[2], // Level 3
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
          },
        ],
      }))
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point

    if (name === 'job_FoodProvisions') {
      // Handle food provisions bar chart click
      const category = data?.category
      const type = data?.series?.name
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = categoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getFoodProvisionsHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
          pageNo: 1,
        })

        if (response && response.data) {
          setSelectedColumn({
            selected: true,
            chartData: {
              category: data?.category,
              type: data?.series?.name,
              value: data?.y,
            },
            list: response.data.hostels || [],
            title: name,
            modalTitle: true,
          })
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } else if (name === 'job_NatureOfCookingFuel') {
      // Handle cooking fuel donut chart click
      const pointName = data?.name
      const seriesName = data?.series?.name

      // Determine category and filter value based on the clicked point
      let category, filterValue

      if (seriesName === 'Level 2') {
        category = 'NATURE_OF_COOKING_FUEL'
        filterValue = pointName === t('job_LPG') ? 'LPG' : 'FIREWOOD'
      } else if (seriesName === 'Level 3') {
        category = 'LPG_CYLINDERS_AVAILABLE'
        if (pointName === t('job_NoLPGCylinders')) {
          filterValue = 'NO'
        } else if (pointName === t('job_SufficientLPGCylinders')) {
          filterValue = 'YES_SUFFICIENT'
        } else if (pointName === t('job_NonSufficientLPGCylinders')) {
          filterValue = 'YES_INSUFFICIENT'
        } else if (pointName === t('job_Firewood')) {
          category = 'NATURE_OF_COOKING_FUEL'
          filterValue = 'FIREWOOD'
        }
      }

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getCookingFuelHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: category,
            filterValue: filterValue,
          },
          pageNo: 1,
        })

        if (response && response.data) {
          setSelectedColumn({
            selected: true,
            chartData: {
              category: pointName,
              type: seriesName,
              value: data?.y,
            },
            list: response.data.hostels || [],
            title: name,
            modalTitle: true,
          })
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } else {
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
    if (selectedColumn?.title === 'job_FoodProvisions') {
      // Handle food provisions bar chart pagination
      const category = selectedColumn?.chartData?.category
      const type = selectedColumn?.chartData?.type
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = categoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getFoodProvisionsHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
          pageNo: current,
        })

        if (response && response.data) {
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } else if (selectedColumn?.title === 'job_NatureOfCookingFuel') {
      // Handle cooking fuel donut chart pagination
      const pointName = selectedColumn?.chartData?.category
      const seriesName = selectedColumn?.chartData?.type

      // Determine category and filter value based on the clicked point
      let category, filterValue

      if (seriesName === 'Level 2') {
        category = 'NATURE_OF_COOKING_FUEL'
        filterValue = pointName === t('job_LPG') ? 'LPG' : 'FIREWOOD'
      } else if (seriesName === 'Level 3') {
        category = 'LPG_CYLINDERS_AVAILABLE'
        if (pointName === t('job_NoLPGCylinders')) {
          filterValue = 'NO'
        } else if (pointName === t('job_SufficientLPGCylinders')) {
          filterValue = 'YES_SUFFICIENT'
        } else if (pointName === t('job_NonSufficientLPGCylinders')) {
          filterValue = 'YES_INSUFFICIENT'
        } else if (pointName === t('job_Firewood')) {
          category = 'NATURE_OF_COOKING_FUEL'
          filterValue = 'FIREWOOD'
        }
      }

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getCookingFuelHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: category,
            filterValue: filterValue,
          },
          pageNo: current,
        })

        if (response && response.data) {
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
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
