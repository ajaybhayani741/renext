import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, include, notEqual } from '../../../utils/javascript'
import {
  getPrecautionaryMeasuresBarChartApi,
  getPrecautionaryMeasuresHostelsApi,
  getAnimalThreatBarChartApi,
  getAnimalThreatHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  hostelsList,
  safetySecurityCharts,
  schoolsList,
} from '../dashboard.description'

const safetySecurity = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState(null)

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
          data: [],
        },
      ],
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  const precautionaryMeasuresCategoryMapping = {
    [t('job_OpenSpaceLightingAtNight')]: 'SUFFICIENT_LIGHTING_OPEN_SPACES',
    [t('job_PolicePatrolRequired')]: 'DAILY_NIGHT_POLICE_PATROLLING_REQUIRED',
  }

  const animalThreatCategoryMapping = {
    [t('job_Rats')]: 'RATS',
    [t('job_Monkeys')]: 'MONKEYS',
    [t('job_Snakes')]: 'SNAKES',
    [t('job_Dogs')]: 'DOGS',
    [t('txt_None')]: 'NONE',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getPrecautionaryMeasuresBarChartData()
      getAnimalThreatBarChartData()
    }
  }, [dateRange])

  // Precautionary Measures Bar Chart API call
  const getPrecautionaryMeasuresBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getPrecautionaryMeasuresBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        dash_PrecautionaryMeasures: {
          ...prev.dash_PrecautionaryMeasures,
          seriesData: [
            {
              name: t('btn_Yes'),
              data: [
                response.data.sufficientLightingOpenSpacesYes || 0,
                response.data.dailyNightPolicePatrollingRequiredYes || 0,
              ],
            },
            {
              name: t('btn_No'),
              data: [
                response.data.sufficientLightingOpenSpacesNo || 0,
                response.data.dailyNightPolicePatrollingRequiredNo || 0,
              ],
            },
          ],
        },
      }))
    }
  }

  // Animal Threat Bar Chart API call
  const getAnimalThreatBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getAnimalThreatBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        dash_AnimalThreat: {
          ...prev.dash_AnimalThreat,
          seriesData: [
            {
              name: t('job_Count'),
              data: [
                response.data.rats || 0,
                response.data.monkeys || 0,
                response.data.snakes || 0,
                response.data.dogs || 0,
                response.data.none || 0,
              ],
            },
          ],
        },
      }))
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point

    if (name === 'dash_PrecautionaryMeasures') {
      // Handle precautionary measures bar chart click
      const category = data?.category
      const type = data?.series?.name
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = precautionaryMeasuresCategoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getPrecautionaryMeasuresHostelsApi({
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
            modalTitle: safetySecurityCharts?.[name]?.modalTitle,
          })
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } else if (name === 'dash_AnimalThreat') {
      // Handle animal threat bar chart click
      const category = data?.category
      const filterValue = animalThreatCategoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getAnimalThreatHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue: filterValue,
          },
          pageNo: 1,
        })

        if (response && response.data) {
          setSelectedColumn({
            selected: true,
            chartData: {
              category: data?.category,
              type: null,
              value: data?.y,
            },
            list: response.data.hostels || [],
            title: name,
            modalTitle: safetySecurityCharts?.[name]?.modalTitle,
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
    })
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
    setAxisOptions(prev => ({ ...prev, ...tempOptions }))
  }

  const handleTableChange = async ({ current }) => {
    if (selectedColumn?.title === 'dash_PrecautionaryMeasures') {
      // Handle precautionary measures bar chart pagination
      const category = selectedColumn?.chartData?.category
      const type = selectedColumn?.chartData?.type
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = precautionaryMeasuresCategoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getPrecautionaryMeasuresHostelsApi({
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
    } else if (selectedColumn?.title === 'dash_AnimalThreat') {
      // Handle animal threat bar chart pagination
      const category = selectedColumn?.chartData?.category
      const filterValue = animalThreatCategoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getAnimalThreatHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
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

export default safetySecurity
