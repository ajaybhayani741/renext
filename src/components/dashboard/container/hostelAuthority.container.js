import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { schoolsList } from '../dashboard.description'

const hostelAuthority = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const title = t('job_HostelAuthority')

  useEffect(() => {
    getSeriesData()
  }, [])

  const chartData = {
    category: [t('dash_RegularInCharge'), t('dash_StayInHeadquarters')],
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
      title: 'job_HostelAuthority',
      modalTitle: true,
    })
  }

  const getSeriesData = () => {
    setSeriesData([
      {
        name: t('btn_Yes'),
        data: [85, 45],
        // pointPlacement: -0.13,
      },
      {
        name: t('btn_No'),
        data: [15, 55],
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

export default hostelAuthority
