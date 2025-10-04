import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  getStaffAvailabilityChartApi,
  getStaffAvailabilityHostelsApi,
  getMedicalCareBarChartApi,
  getMedicalCareHostelsApi,
} from '../dashboard.api'
import {
  availableNursingStaffKeys,
  axisOptionsList,
  medicalCareCharts,
  schoolsList,
} from '../dashboard.description'

const medicalCare = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [hostelsData, setHostelsData] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const [seriesData, setSeriesData] = useState({})
  const [axisOptions, setAxisOptions] = useState(null)

  const categoryMapping = {
    [t('job_MedicalOfficerVisits')]: 'MEDICAL_OFFICER_REGULAR_VISITS',
    [t('job_FirstAidKitAvailability')]: 'FIRST_AID_KIT_AVAILABLE_IN_HOSTEL',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getDataApi = name => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'dash_IsTheStaffNurseAvailableInTheHostel':
        return getStaffAvailabilityChartApi({ params })
      case 'job_MedicalCare':
        return getMedicalCareBarChartApi({ params })
      default:
        return null
    }
  }

  const getData = async () => {
    let tempSeriesData = {}
    for (const key of Object.keys(medicalCareCharts)) {
      const response = await getDataApi(key)
      if (response && response.data) {
        if (key === 'dash_IsTheStaffNurseAvailableInTheHostel') {
          tempSeriesData[key] = [
            {
              colorByPoint: true,
              data: entries(availableNursingStaffKeys)?.map(([k, v], i) => ({
                id: i + 1,
                name: t(v?.label),
                valueId: v?.value,
                y: response?.data?.[k] || 0,
              })),
            },
          ]
        } else if (key === 'job_MedicalCare') {
          tempSeriesData[key] = {
            chartData: {
              category: [
                t('job_MedicalOfficerVisits'),
                t('job_FirstAidKitAvailability'),
              ],
            },
            seriesData: [
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
            ],
          }
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
      default:
        return null
    }
  }

  const handleChartClick = async (e, name) => {
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
      pageNo: 1,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category,
        type,
        value: data?.y,
      },
      list:
        name === 'job_MedicalCare'
          ? response?.data?.hostels || []
          : [...schoolsList],
      title: name,
      modalTitle: medicalCareCharts[name]?.modalTitle,
      categoryValue: data?.valueId,
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
      pageNo: current,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(medicalCareCharts).forEach(([key, value]) => {
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

export default medicalCare