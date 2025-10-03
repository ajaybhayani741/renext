import { useMemo } from 'react'

import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'

const LineCharts = ({
  title,
  xAxisTitle,
  yAxisTitle,
  seriesData,
  handleChartClick,
  name,
}) => {
  const { t } = useTranslations()

  const options = useMemo(() => {
    return {
      title: {
        text: '',
      },
      chart: {
        events: {
          load: function () {
            const chart = this
            chart.renderer
              .button(
                'View', // The text of the button
                10, // X position (e.g., from the right)
                chart.chartHeight + 40, // Y position (e.g., from the top)
                e => {
                  // handleChartClick(e) // Action to perform on click
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
      xAxis: {
        min: 0,
        max: 100,
        tickInterval: 1,
        title: { text: t(xAxisTitle) },
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
              .label(`${Math.round(min)}`, leftX - 8, chart.plotHeight + 60)
              .css({ color: '#000', fontSize: '10px' })
              .add()

            chart.customRightLabel = chart.renderer
              .label(`${Math.round(max)}`, rightX - 8, chart.plotHeight + 60)
              .css({ color: '#000', fontSize: '10px' })
              .add()
          },
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 10,
        title: { text: t(yAxisTitle) },
      },
      tooltip: {
        formatter: function () {
          return (
            `<span>${t(yAxisTitle)}: <b>${this.y}</b></span><br/>` +
            `<span>${t(xAxisTitle)}: <b>${this.x}</b></span>`
          )
        },
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: e => handleChartClick(e, name),
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: true,
      },
      scrollbar: {
        enabled: true,
      },
      series: [
        {
          name: '',
          data: seriesData,
          color: '#f1725d',
          type: 'line',
          marker: { enabled: true, radius: 3 },
        },
      ],
    }
  }, [seriesData])

  return (
    <>
      <HightChart
        options={options}
        title={title}
        className="frequency-chart-card"
      />
    </>
  )
}

export default LineCharts
