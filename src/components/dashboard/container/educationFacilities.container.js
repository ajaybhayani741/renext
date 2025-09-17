import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  axisOptionsList,
  educationFacilitiesCharts,
  schoolsList,
} from '../dashboard.description'

const educationFacilities = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const [seriesData, setSeriesData] = useState({
    dash_EducationRequirements: {
      chartData: {
        category: [
          t('job_TextbooksSupplied'),
          t('job_NotebooksSupplied'),
          t('job_UniformsSupplied'),
          t('job_TrunkBoxesSupplied'),
          t('job_PlatesGlassesSupplied'),
          t('job_SchoolBagsSupplied'),
          t('job_BeddingMaterialSupplied'),
          t('job_TreasuryBillRegisterMaintained'),
          t('job_TeachingAsPerLessonPlan'),
        ],
      },
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [85, 45, 78, 90, 56, 45, 23, 67, 89],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [15, 55, 22, 34, 56, 78, 90, 45, 67],
          // pointPlacement: 0.12,
        },
      ],
    },
  })
  const [axisOptions, setAxisOptions] = useState(null)

  useEffect(() => {
    getSeriesData()
  }, [])

  const handleChartClick = e => {
    const data = e.point
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        type: data?.series?.name,
        value: data?.y,
      },
      list: [...schoolsList],
      title: 'job_HostelAuthority',
      modalTitle: true,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(educationFacilitiesCharts).forEach(([key, value]) => {
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

export default educationFacilities
