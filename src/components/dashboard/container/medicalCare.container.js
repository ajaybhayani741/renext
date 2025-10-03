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

  const [seriesData, setSeriesData] = useState({
    job_DistanceToNearestPHC: {
      chartData: {
        category: [
          'Ekalavya Model Residential School',
          'Govt. BC Hostel',
          'Govt. BC College',
          'Govt. ST Ashram School',
          'Govt. ST Hostel',
          'Govt. ST PMH',
          'Govt. ST Hostel',
          'Ekalavya Model Residential School',
        ],
      },
      seriesData: [
        {
          name: t('dash_Distance'),
          data: [13, 9, 6, 3, 25, 10, 3, 5],
          color: '#f1725e',
          pointPlacement: 'on',
        },
      ],
    },
    // Medical Care Bar Chart
    job_MedicalCare: {
      chartData: {
        category: [
          t('job_MedicalOfficerVisits'),
          t('job_FirstAidKitAvailability'),
        ],
      },
      seriesData: null, // Will be populated by API
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  const categoryMapping = {
    [t('job_MedicalOfficerVisits')]: 'MEDICAL_OFFICER_REGULAR_VISITS',
    [t('job_FirstAidKitAvailability')]: 'FIRST_AID_KIT_AVAILABLE_IN_HOSTEL',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getData()
      getMedicalCareBarChartData()
    }
  }, [dateRange])

  const getData = async () => {
    const [staffResp] = await Promise.all([
      getStaffAvailabilityChartApi({
        params: { fromDate: dateRange?.from, toDate: dateRange?.to },
      }),
    ])

    let tempSeriesData = {}
    if (staffResp?.data) {
      const data = [
        {
          colorByPoint: true,
          data: entries(availableNursingStaffKeys)?.map(([k, v], i) => ({
            id: i + 1,
            name: t(v?.label),
            valueId: v?.value,
            y: staffResp?.data?.[k] || 0,
          })),
        },
      ]
      tempSeriesData['dash_IsTheStaffNurseAvailableInTheHostel'] = data
    }
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  // Medical Care Bar Chart API call
  const getMedicalCareBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getMedicalCareBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        job_MedicalCare: {
          ...prev.job_MedicalCare,
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
        },
      }))
    }
  }

  const handleClickFn = async ({ category, name, pageNo = 1 }) => {
    switch (name) {
      case 'dash_IsTheStaffNurseAvailableInTheHostel':
        const resp = await getStaffAvailabilityHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            filterValue: category,
          },
        })
        return resp?.data

      case 'job_MedicalCare':
        const categoryValue = category || selectedColumn?.chartData?.category
        const type = selectedColumn?.chartData?.type
        const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
        const apiCategory = categoryMapping[categoryValue]

        const medicalResp = await getMedicalCareHostelsApi({
          pageNo,
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
        })
        return medicalResp?.data

      default:
        setHostelsData(null)
        break
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))

    let respData
    if (name === 'job_MedicalCare') {
      // Handle medical care bar chart click
      const category = data?.category
      const type = data?.series?.name
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = categoryMapping[category]

      try {
        const response = await getMedicalCareHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
          pageNo: 1,
        })
        respData = response?.data
      } catch (error) {
        respData = null
      }
    } else {
      respData = await handleClickFn({ category: data?.valueId, name })
    }

    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category || data?.name,
        type: notEqual(name, 'dash_IsTheStaffNurseAvailableInTheHostel')
          ? data?.series?.name || data?.custom?.label
          : null,
        value: data?.y,
      },
      list:
        name === 'job_MedicalCare' ? respData?.hostels || [] : [...schoolsList],
      title: name,
      modalTitle: true,
      categoryValue: data?.valueId,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))

    let respData
    if (selectedColumn?.title === 'job_MedicalCare') {
      // Handle medical care bar chart pagination
      const category = selectedColumn?.chartData?.category
      const type = selectedColumn?.chartData?.type
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = categoryMapping[category]

      try {
        const response = await getMedicalCareHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
          pageNo: current,
        })
        respData = response?.data
      } catch (error) {
        respData = null
      }
    } else {
      respData = await handleClickFn({
        category: selectedColumn?.categoryValue,
        name: selectedColumn?.title,
        pageNo: current,
      })
    }

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
