import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, keys, notEqual, values } from '../../../utils/javascript'
import {
  getMedicalCareBarChartApi,
  getMedicalCareHostelsApi,
  getPHCDistanceChartApi,
  getPHCDistanceHostelsApi,
  getStaffAvailabilityChartApi,
  getStaffAvailabilityHostelsApi,
} from '../dashboard.api'
import {
  availableNursingStaffKeys,
  lineChartRange,
  medicalCareCharts,
} from '../dashboard.description'
import {
  getHostelChartParams,
  setLineChartSeriesData,
} from '../dashboardFunctions'

const medicalCare = ({ hostelFilter } = {}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [hostelsData, setHostelsData] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState({})

  const categoryMapping = {
    [t('job_MedicalOfficerVisits')]: 'MEDICAL_OFFICER_REGULAR_VISITS',
    [t('job_FirstAidKitAvailability')]: 'FIRST_AID_KIT_AVAILABLE_IN_HOSTEL',
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter])

  const getDataApi = ({
    name,
    start = lineChartRange?.start,
    end = lineChartRange?.end,
  }) => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'dash_IsTheStaffNurseAvailableInTheHostel':
        return getStaffAvailabilityChartApi({ params })
      case 'job_MedicalCare':
        return getMedicalCareBarChartApi({ params })
      case 'job_DistanceToNearestPHC':
        return getPHCDistanceChartApi({ params: { ...params, start, end } })
      default:
        return null
    }
  }

  const getData = async ({
    start,
    end,
    chartType = keys(medicalCareCharts),
  } = {}) => {
    let tempSeriesData = {}
    for (const key of Object.keys(medicalCareCharts)) {
      const response = await getDataApi({ name: key, start, end })
      if (response && response.data) {
        const isData = values(response?.data)?.find(item => item)
        if (key === 'dash_IsTheStaffNurseAvailableInTheHostel') {
          tempSeriesData[key] = {
            series: isData
              ? [
                  {
                    colorByPoint: true,
                    data: entries(availableNursingStaffKeys)?.map(
                      ([k, v], i) => ({
                        id: i + 1,
                        name: t(v?.label),
                        valueId: v?.value,
                        y: response?.data?.[k] || 0,
                      }),
                    ),
                  },
                ]
              : [],
          }
        } else if (key === 'job_MedicalCare') {
          tempSeriesData[key] = {
            chartData: {
              category: [
                t('job_MedicalOfficerVisits'),
                t('job_FirstAidKitAvailability'),
              ],
            },
            series: isData
              ? [
                  {
                    name: t('btn_Yes'),
                    data: [
                      response.data.medicalOfficerRegularVisitsYes || 0,
                      response.data.firstAidKitAvailableInHostelYes || 0,
                    ],
                  },
                  {
                    name: t('btn_No'),
                    data: [
                      response.data.medicalOfficerRegularVisitsNo || 0,
                      response.data.firstAidKitAvailableInHostelNo || 0,
                    ],
                  },
                ]
              : [],
          }
        } else if (key === 'job_DistanceToNearestPHC') {
          let tempSeriesData = setLineChartSeriesData({
            respData: response,
            key,
          })
          setSeriesData(prev => ({
            ...prev,
            [key]: tempSeriesData,
          }))
        }
      }
    }
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  const getHandleClickDataApi = ({
    name,
    category,
    pageNo,
    type,
    start,
    end,
    newDateRange = dateRange,
  }) => {
    const params = {
      fromDate: newDateRange?.from,
      toDate: newDateRange?.to,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'dash_IsTheStaffNurseAvailableInTheHostel':
        return getStaffAvailabilityHostelsApi({
          pageNo,
          params: { ...params, filterValue: category },
        })
      case 'job_MedicalCare':
        const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
        const apiCategory = categoryMapping[category]
        return getMedicalCareHostelsApi({
          pageNo,
          params: { ...params, category: apiCategory, filterValue },
        })
      case 'job_DistanceToNearestPHC':
        return getPHCDistanceHostelsApi({
          pageNo,
          params: {
            fromDate: newDateRange?.from,
            toDate: newDateRange?.to,
            ...((start || end) && { start, end }),
            ...getHostelChartParams(hostelFilter),
            // ...params,
          },
        })
      default:
        return null
    }
  }

  const handleChartClick = async ({
    e,
    name,
    startEnd,
    newDateRange = dateRange,
    xAxisTitle,
  }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const category = data?.category || data?.name
    const type = notEqual(name, 'dash_IsTheStaffNurseAvailableInTheHostel')
      ? data?.series?.name || data?.custom?.label
      : null
    const response = await getHandleClickDataApi({
      name,
      category:
        name === 'job_MedicalCare' ? category : data?.valueId || data?.name,
      type,
      range: data?.category,
      pageNo: 1,
      start: startEnd?.start,
      end: startEnd?.end,
      newDateRange: { ...newDateRange },
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
        chartType: medicalCareCharts[name]?.type,
        xAxisTitle: xAxisTitle,
        range: data?.category,
        start: startEnd?.start,
        end: startEnd?.end,
      },
      list: response?.data?.hostels || [],
      title: name,
      modalTitle: medicalCareCharts[name]?.modalTitle,
      categoryValue: data?.valueId,
      start: startEnd?.start,
      end: startEnd?.end,
      newDateRange: { ...newDateRange },
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const { title, chartData, categoryValue } = selectedColumn
    const response = await getHandleClickDataApi({
      name: title,
      category:
        title === 'job_MedicalCare' ? chartData?.category : categoryValue,
      type: chartData?.type,
      range: chartData?.category,
      pageNo: current,
      start: selectedColumn?.chartData?.start,
      end: selectedColumn?.chartData?.end,
      newDateRange: selectedColumn?.chartData?.newDateRange,
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
    onRangeChange: getData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default medicalCare
