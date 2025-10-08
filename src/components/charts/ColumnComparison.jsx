import { useMemo } from 'react'

import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'
import { isEqual } from '../../utils/javascript'

const ColumnComparison = ({
  chartData,
  handleChartClick,
  seriesData,
  title,
  name = null,
}) => {
  const { t } = useTranslations()
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
          cursor: 'pointer',
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
          point: {
            events: {
              click: e => handleChartClick({ e, name: name || title }),
            },
          },
        },
      },
      tooltip: {
        shared: true,
        formatter: function () {
          return `<b>${this.x}</b><br/>${this?.points?.map(p => `${p?.point?.series?.name || p?.point?.custom?.label}: <b>${p.y}</b>`)}`
        },
      },
      legend: {
        symbolRadius: 0,
        itemStyle: {
          cursor: 'default',
        },
        labelFormatter: function () {
          if (this.name) return this.name
          if (isEqual(this.color, '#eabf9f'))
            return `${t('dash_Government')} / ${t('btn_Yes')}`
          if (isEqual(this.color, '#f1725d'))
            return `${t('dash_Private')} / ${t('btn_No')}`
          return ''
        },
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
      series: seriesData,
      exporting: {
        allowHTML: true,
      },
    }),
    [seriesData],
  )

  return (
    <>
      <HightChart options={options} id="column-comparison" title={title} />
    </>
  )
}

export default ColumnComparison
