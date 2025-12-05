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
        events: {
          load: function () {
            const chart = this
            chart.renderer
              .button(
                'View', // The text of the button
                5, // X position (e.g., from the right)
                chart.chartHeight - 46, // Y position (e.g., from the top)
                e => {
                  handleChartClick({ e }) // Action to perform on click
                },
                {
                  // Normal state styling
                  fill: '#f6d4be',
                  r: 5,
                  stroke: 'none',
                  padding: 8,
                },
                {
                  // Normal state styling
                  fill: '#f6d4be',
                  r: 5,
                  padding: 8,
                },
              )
              .css({
                border: 'none',
              })
              .add() // Adds the button to the chart
          },
        },
      },
      credits: false,
      xAxis: {
        type: 'linear',
        events: {
          afterSetExtremes: function (e) {
            if (e.trigger !== 'navigator') return
            const chart = this.chart
            const { min, max } = e
            const navAxis = chart.navigator.xAxis

            // Remove old labels if they exist
            if (chart.customLeftLabel) {
              chart.customLeftLabel.destroy()
              chart.customRightLabel.destroy()
            }

            const leftX = navAxis.toPixels(min)
            const rightX = navAxis.toPixels(max)

            chart.customLeftLabel = chart.renderer
              .label(`${Math.round(min)}`, leftX - 8, chart.plotHeight + 52)
              .css({ color: '#000', fontSize: '10px' })
              .add()

            chart.customRightLabel = chart.renderer
              .label(`${Math.round(max)}`, rightX - 8, chart.plotHeight + 52)
              .css({ color: '#000', fontSize: '10px' })
              .add()
          },
        },
        title: {
          text: '',
        },
        tickPositions: [],
        labels: {
          formatter: function () {
            return this.value // show plain numbers instead of time
          },
        },
        ...axisOptions?.xAxis,
        minRange: 5,
      },
      yAxis: [...axisOptions?.yAxis],
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: e => handleChartClick({ e, name }),
            },
          },
        },
        spline: {
          color: '#6484cb',
        },
        column: {
          color: '#d7dff8',
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
        margin: 10,
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
