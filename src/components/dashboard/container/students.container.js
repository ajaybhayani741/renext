import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { axisOptionsList, hostelsList } from '../dashboard.description'

const students = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [axisOptions, setAxisOptions] = useState({ ...axisOptionsList })
  const title = t('dash_TotalNumberOfStudents')

  useEffect(() => {
    getSeriesData()
  }, [])

  const handleChartClick = e => {
    const data = e.point
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        value: data?.y,
      },
      list: [...hostelsList],
      title: 'dash_Students',
    })
  }

  const getSeriesData = () => {
    setSeriesData([
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
    ])
    setAxisOptions(prev => ({
      xAxis: {
        ...prev?.xAxis,
        title: {
          text: 'No. of students',
        },
        tickPositions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      },
      yAxis: prev?.yAxis?.map(axis => ({
        ...axis,
        title: {
          text: 'No. of Hostel',
        },
      })),
    }))
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
  }

  return {
    title,
    axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
  }
}

export default students
