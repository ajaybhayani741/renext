import { useMemo } from 'react'

import HightChart from '../../charts'

const CommonPieChart = ({
  title,
  data = [],
  size = '320px',
  handleChartClick,
  name,
  showValueLabels = false,
  compact = false,
}) => {
  const options = useMemo(
    () => ({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        ...(compact && {
          height: 360,
          spacing: [0, 0, 0, 0],
        }),
      },
      title: { text: '' },
      credits: false,
      legend: {
        enabled: true,
        ...(compact && {
          margin: 0,
          padding: 0,
          itemMarginTop: 0,
          itemMarginBottom: 2,
        }),
      },
      tooltip: {
        pointFormat: showValueLabels
          ? '<b>{point.y}</b>'
          : '<b>{point.percentage:.0f}%</b>',
      },
      plotOptions: {
        pie: {
          size,
          borderWidth: 2,
          borderColor: '#f5f7fb',
          showInLegend: true,
          cursor: handleChartClick ? 'pointer' : 'default',
          point: {
            events: {
              click: function () {
                if (handleChartClick) {
                  handleChartClick({ e: { point: this }, name })
                }
              },
            },
          },
          dataLabels: {
            enabled: true,
            distance: -46,
            format: showValueLabels ? '{point.y}' : '{point.percentage:.0f}%',
            style: {
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '700',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          data: data.map(item => ({
            name: item.name,
            y: item.value,
            color: item.color,
            category: item.category,
            categoryValue: item.categoryValue,
            filterValue: item.filterValue,
            label: item.label,
          })),
        },
      ],
    }),
    [compact, data, handleChartClick, name, showValueLabels, size],
  )

  return <HightChart options={options} title={title} />
}

export default CommonPieChart
