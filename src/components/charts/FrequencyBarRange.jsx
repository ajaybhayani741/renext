import { useMemo } from 'react'

import HightChart from '.'

const FrequencyBarRange = ({
  handleChartClick,
  axisOptions,
  seriesData,
  title,
  name = null,
}) => {
  const options = useMemo(
    () => ({
      rangeSelector: {
        enabled: false,
      },
      title: { text: '' },
      chart: {
        zooming: {
          type: 'xy',
          mouseWheel: false,
        },
      },
      credits: false,
      xAxis: {
        type: 'linear',
        title: {
          text: '',
        },
        tickPositions: [],
        labels: {
          formatter: function () {
            return this.value // show plain numbers instead of time
          },
        },
        minRange: 10,
        ...axisOptions?.xAxis,
      },
      yAxis: [...axisOptions?.yAxis],
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: e => handleChartClick(e, name),
            },
          },
        },
        spline: {
          color: '#f1725d',
        },
        column: {
          color: '#eabf9f',
        },
      },
      navigator: {
        enabled: true,
        xAxis: {
          type: 'linear',
          labels: {
            formatter: function () {
              return this.value // plain numbers in the slider
            },
          },
        },
        height: 30,
      },
      scrollbar: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        formatter: function () {
          return `<b>${this.x}</b><br/> X:${this.y}`
        },
      },
      legend: {
        enabled: false,
      },
      series: seriesData,
    }),
    [seriesData],
  )

  return (
    <>
      <HightChart options={options} id="column-comparison" title={title} />
    </>
  )
}

export default FrequencyBarRange
