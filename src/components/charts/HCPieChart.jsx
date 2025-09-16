import { useMemo } from 'react'

import HightChart from '.'

const HCPieChart = ({ handleChartClick, seriesData, title, name }) => {
  const options = useMemo(
    () => ({
      chart: {
        type: 'pie',
      },
      title: { text: '' },
      credits: false,
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          point: {
            events: {
              click: e => handleChartClick(e, name),
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y > 0 ? `${this.point.name}: ${this.point.y}` : null
            },
            distance: 20,
          },
          size: '240px',
          showInLegend: true,
        },
      },
      tooltip: {
        shared: true,
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> ' +
          '{point.name}: <b>{point.y}</b><br/>',
      },
      legend: {
        enabled: true,
        maxHeight: 65,
        itemStyle: {
          fontSize: '12px',
        },
        useHTML: true,
      },
      colors: ['#eabf9f', '#f1725d', '#e79a8c', '#b17165'],
      series: seriesData,
      exporting: {
        allowHTML: true,
      },
    }),
    [],
  )

  return (
    <>
      <HightChart options={options} id="column-comparison" title={title} />
    </>
  )
}

export default HCPieChart
