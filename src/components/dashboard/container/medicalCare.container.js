import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  axisOptionsList,
  medicalCareCharts,
  schoolsList,
} from '../dashboard.description'

const medicalCare = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const [seriesData, setSeriesData] = useState({
    job_MedicalCare: {
      chartData: {
        category: [
          t('job_MedicalOfficerVisits'),
          t('job_FirstAidKitAvailability'),
        ],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [85, 45],
        },
        {
          name: t('btn_No'),
          data: [15, 55],
        },
      ],
      yAxis: [
        {
          labels: { format: '{value} km' },
        },
        {
          labels: { format: '{value} km' },
        },
        {
          labels: { format: '{value} km' },
        },
        {
          labels: { format: '{value} km' },
        },
        {
          labels: { format: '{value} km' },
          min: -0.5,
          max: 2.5,
        },
      ],
    },
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
    dash_IsTheStaffNurseAvailableInTheHostel: [
      {
        colorByPoint: true,
        data: [
          { id: 1, name: t('job_StaffNurseAvailability_Available'), y: 10 },
          { id: 1, name: t('job_StaffNurseAvailability_ANMVisits'), y: 10 },
          { id: 1, name: t('job_StaffNurseAvailability_NotAvailable'), y: 10 },
        ],
      },
    ],
  })
  const [axisOptions, setAxisOptions] = useState(null)

  useEffect(() => {
    getSeriesData()
  }, [])

  const handleChartClick = (e, name) => {
    const data = e.point
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category || data?.name,
        type: notEqual(name, 'dash_IsTheStaffNurseAvailableInTheHostel')
          ? data?.series?.name || data?.custom?.label
          : null,
        value: data?.y,
      },
      list: [...schoolsList],
      title: name,
      modalTitle: true,
    })
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
  }

  return {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
  }
}

export default medicalCare
