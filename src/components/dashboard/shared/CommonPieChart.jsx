import { useMemo } from 'react'

import HightChart from '../../charts'

const CommonPieChart = ({
  title,
  data = [],
  size = '320px',
  handleChartClick,
  name,
}) => {
  const options = useMemo(
    () => ({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
      },
      title: { text: '' },
      credits: false,
      legend: {
        enabled: true,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.0f}%</b>',
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
            format: '{point.percentage:.0f}%',
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
          })),
        },
      ],
    }),
    [data, handleChartClick, name, size],
  )

  return <HightChart options={options} title={title} />
}

export default CommonPieChart
