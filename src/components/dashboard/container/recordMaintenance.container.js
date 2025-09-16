import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { schoolsList } from '../dashboard.description'

const recordMaintenance = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const title = t('job_RecordMaintenance')

  useEffect(() => {
    getSeriesData()
  }, [])

  const chartData = {
    category: [
      t('dash_Staff'),
      t('dash_Boarder'),
      t('dash_Sick'),
      t('dash_BoarderMovement'),
      t('dash_VisitorRegister'),
      t('dash_OtherRecords'),
    ],
    staff: [85, 15],
    boarder: [45, 55],
    sick: [45, 55],
    boarderMovement: [45, 55],
    visitorRegister: [45, 55],
    otherRecords: [45, 55],
  }

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
      title: 'job_RecordMaintenance',
      modalTitle: true,
    })
  }

  const getSeriesData = () => {
    setSeriesData([
      {
        name: t('btn_Yes'),
        data: [85, 45, 45, 45, 45, 45],
        // pointPlacement: -0.13,
      },
      {
        name: t('btn_No'),
        data: [15, 55, 55, 55, 55, 55],
        // pointPlacement: 0.12,
      },
    ])
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
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
  }
}

export default recordMaintenance
