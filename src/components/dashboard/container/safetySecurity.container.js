import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { isEqual, keys, values } from '../../../utils/javascript'
import {
  getAnimalThreatBarChartApi,
  getAnimalThreatHostelsApi,
  getAvailableCCTVChartApi,
  getAvailableCCTVHostelsApi,
  getFunctioningCCTVChartApi,
  getFunctioningCCTVHostelsApi,
  getPrecautionaryMeasuresBarChartApi,
  getPrecautionaryMeasuresHostelsApi,
} from '../dashboard.api'
import { lineChartRange, safetySecurityCharts } from '../dashboard.description'
import {
  getHostelChartParams,
  setLineChartSeriesData,
} from '../dashboardFunctions'

const safetySecurity = ({ hostelFilter } = {}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState({})
  const [hostelsData, setHostelsData] = useState(null)

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

  const axisOptions = {
    dash_PrecautionaryMeasures: {
      category: keys(precautionaryMeasuresCategoryMapping),
    },
    dash_AnimalThreat: {
      category: keys(animalThreatCategoryMapping),
    },
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter])

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
      ...getHostelChartParams(hostelFilter),
    }
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'dash_PrecautionaryMeasures':
        const roomsResp = await getPrecautionaryMeasuresBarChartApi({
          params: columnParams,
        })
        return roomsResp
      case 'dash_AnimalThreat':
        const bedResp = await getAnimalThreatBarChartApi({
          params: columnParams,
        })
        return bedResp
      case 'dash_NumberOfCCTVsAvailable':
        const lightsResp = await getAvailableCCTVChartApi({
          params: lineParams,
        })
        return lightsResp
      case 'dash_NumberOfCCTVsFunctioning':
        const fansResp = await getFunctioningCCTVChartApi({
          params: lineParams,
        })
        return fansResp
      default:
        return null
    }
  }

  const getData = async ({
    start,
    end,
    chartType = keys(safetySecurityCharts),
  } = {}) => {
    chartType?.forEach(async key => {
      const respData = await getDataApi({ name: key, start, end })
      if (isEqual(key, 'dash_AnimalThreat')) {
        const isData = values(respData?.data)?.find(item => item)
        const tempSeriesData = isData
          ? [
              {
                name: t('job_Count'),
                data: [
                  respData.data.rats || 0,
                  respData.data.monkeys || 0,
                  respData.data.snakes || 0,
                  respData.data.dogs || 0,
                  respData.data.none || 0,
                ],
              },
            ]
          : []
        setSeriesData(prev => ({
          ...prev,
          [key]: { series: tempSeriesData },
        }))
      } else if (isEqual(key, 'dash_PrecautionaryMeasures')) {
        const isData = values(respData?.data)?.find(item => item)
        const tempSeriesData = isData
          ? [
              {
                name: t('btn_Yes'),
                data: [
                  respData.data.sufficientLightingOpenSpacesYes || 0,
                  respData.data.dailyNightPolicePatrollingRequiredYes || 0,
                ],
              },
              {
                name: t('btn_No'),
                data: [
                  respData.data.sufficientLightingOpenSpacesNo || 0,
                  respData.data.dailyNightPolicePatrollingRequiredNo || 0,
                ],
              },
            ]
          : []
        setSeriesData(prev => ({
          ...prev,
          [key]: { series: tempSeriesData },
        }))
      } else {
        let tempSeriesData = setLineChartSeriesData({
          respData,
          key,
        })
        setSeriesData(prev => ({
          ...prev,
          [key]: tempSeriesData,
        }))
      }
    })
  }

  const getHandleClickDataApi = async ({
    range,
    category,
    filterValue,
    pageNo = 1,
    name,
    start,
    end,
    newDateRange = dateRange,
  } = {}) => {
    const isRangeFrequency = safetySecurityCharts?.[name]?.type === 'rangeFrequency'
    const rangeValue = isRangeFrequency && range && typeof range === 'number' ? range : null
    const selectedDateRange =
      newDateRange?.from && newDateRange?.to ? newDateRange : dateRange
    const lineParams = {
      fromDate: selectedDateRange?.from,
      toDate: selectedDateRange?.to,
      ...(rangeValue && { range: rangeValue }),
      ...(!rangeValue && (start || end) && { start, end }),
      ...getHostelChartParams(hostelFilter),
    }
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      ...(isEqual(name, 'dash_PrecautionaryMeasures') && {
        category: category,
      }),
      filterValue: filterValue,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'dash_PrecautionaryMeasures':
        const roomsResp = await getPrecautionaryMeasuresHostelsApi({
          pageNo,
          params: columnParams,
        })
        return roomsResp?.data
      case 'dash_AnimalThreat':
        const bedResp = await getAnimalThreatHostelsApi({
          pageNo,
          params: columnParams,
        })
        return bedResp?.data
      case 'dash_NumberOfCCTVsAvailable':
        const lightsResp = await getAvailableCCTVHostelsApi({
          pageNo,
          params: lineParams,
        })
        return lightsResp?.data
      case 'dash_NumberOfCCTVsFunctioning':
        const fansResp = await getFunctioningCCTVHostelsApi({
          pageNo,
          params: lineParams,
        })
        return fansResp?.data
      default:
        return null
    }
  }

  const handleChartClick = async ({
    e,
    name,
    startEnd,
    newDateRange,
    chartType,
    xAxisTitle,
  }) => {
    const data = e.point
    const selectedDateRange =
      newDateRange?.from && newDateRange?.to ? newDateRange : dateRange
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      category: isEqual(name, 'dash_PrecautionaryMeasures')
        ? precautionaryMeasuresCategoryMapping[data?.category]
        : null,
      filterValue: isEqual(name, 'dash_PrecautionaryMeasures')
        ? data?.series?.name === t('btn_Yes')
          ? 'YES'
          : 'NO'
        : animalThreatCategoryMapping[data?.category],
      range: data?.category,
      name,
      start: startEnd?.start,
      end: startEnd?.end,
      newDateRange: selectedDateRange,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category: isEqual('dash_AnimalThreat', name) ? null : data?.category,
        type: isEqual(name, 'dash_PrecautionaryMeasures')
          ? data?.series?.name
          : data?.category,
        value: data?.y,
        start: startEnd?.start,
        end: startEnd?.end,
        range: data?.category,
        newDateRange: selectedDateRange,
        chartType: safetySecurityCharts?.[name]?.type,
        xAxisTitle: xAxisTitle,
      },
      title: name,
      modalTitle: safetySecurityCharts?.[name]?.modalTitle,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      category: isEqual(selectedColumn?.title, 'dash_PrecautionaryMeasures')
        ? precautionaryMeasuresCategoryMapping[
            selectedColumn?.chartData?.category
          ]
        : null,
      filterValue: isEqual(selectedColumn?.title, 'dash_PrecautionaryMeasures')
        ? selectedColumn?.chartData?.type === t('btn_Yes')
          ? 'YES'
          : 'NO'
        : animalThreatCategoryMapping[selectedColumn?.chartData?.type],
      range: selectedColumn?.chartData?.category,
      name: selectedColumn?.title,
      pageNo: current,
      start: selectedColumn?.chartData?.start,
      end: selectedColumn?.chartData?.end,
      newDateRange: selectedColumn?.chartData?.newDateRange,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
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
    onRangeChange: getData,
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
