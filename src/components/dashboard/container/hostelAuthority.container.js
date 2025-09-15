import { useMemo, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { schoolsList } from '../dashboard.description'

const hostelAuthority = () => {
  const { t } = useTranslations()
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const chartData = {
    category: [t('dash_RegularInCharge'), t('dash_StayInHeadquarters')],
    regularInCharge: [85, 15],
    stayInHeadquarters: [45, 55],
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
      title: 'dash_HostelAuthority',
    })
  }

  const options = useMemo(
    () => ({
      chart: {
        type: 'column',
      },
      title: { text: '' },
      plotOptions: {
        column: {
          borderWidth: 0,
          pointWidth: 50,
          pointPadding: 0,
          groupPadding: 0.1,
          grouping: true,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
              textOutline: 'none',
            },
          },
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: handleChartClick,
            },
          },
        },
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> ' +
          '{series.name}: <b>{point.y}</b><br/>',
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        symbolRadius: 0,
      },
      colors: ['#eabf9f', '#f1725d'],
      xAxis: {
        categories: chartData?.category,
        labels: {
          style: {
            fontSize: '14px',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
        gridLineColor: '#eee',
      },
      series: [
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
      ],
      exporting: {
        allowHTML: true,
      },
    }),
    [],
  )

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
  }

  return { options, selectedColumn, handleCloseModal }
}

export default hostelAuthority
