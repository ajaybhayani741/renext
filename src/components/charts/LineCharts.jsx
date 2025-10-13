import { useCallback, useEffect, useMemo, useRef } from 'react'

import HightChart from '.'
import { notifyMethod } from '../../App'
import useRedux from '../../hooks/useRedux'
import useTranslations from '../../hooks/useTranslations'
import debounce from '../../utils/debounce'

const LineCharts = ({
  title,
  xAxisTitle,
  yAxisTitle,
  seriesData,
  handleChartClick,
  name,
  onRangeChange,
}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const dateRange = selector(state => state?.app?.fiscalYear?.dateRange)
  const dateRangeRef = useRef(dateRange)
  const xAxisMax = seriesData?.highestCount || 100

  useEffect(() => {
    dateRangeRef.current = dateRange
  }, [dateRange])

  const debouncedScroll = useCallback(
    debounce((start, end) => {
      const rangeGap = Math.abs(end - start)
      if (rangeGap < 100) {
        onRangeChange({ start, end, chartType: [name] })
      }
    }, 500),
    [dateRangeRef.current, name, onRangeChange],
  )

  const checkRange = useCallback(
    debounce(rangeGap => {
      if (rangeGap > 100) {
        notifyMethod.error({
          message:
            'The range gap cannot exceed 100. Please select a smaller range.',
        })
        return false
      }
      return true
    }, 500),
    [],
  )

  const options = useMemo(() => {
    return {
      title: {
        text: '',
      },
      chart: {
        events: {
          load: function () {
            const chart = this
            chart.xAxis[0].setExtremes(1, 100)
            chart.renderer
              .button(
                t('btn_View'), // The text of the button
                10, // X position (e.g., from the right)
                chart.chartHeight - 8, // Y position (e.g., from the top)
                e => {
                  const { min, max } = chart?.xAxis?.[0]?.getExtremes()
                  handleChartClick({
                    e,
                    name,
                    startEnd: { start: Math.round(min), end: Math.round(max) },
                    newDateRange: dateRangeRef.current,
                  }) // Action to perform on click
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
        min: 1,
        max: xAxisMax,
        tickInterval: 1,
        title: { text: t(xAxisTitle) },
        events: {
          setExtremes: function (e) {
            if (e.trigger === 'navigator') {
              const rangeGap = Math.abs(e.max - e.min)
              checkRange(rangeGap)
            }
          },
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
            if (onRangeChange) {
              debouncedScroll(Math.round(min), Math.round(max))
            }
          },
        },
      },
      yAxis: {
        min: 1,
        max: 120,
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
              click: e =>
                handleChartClick({
                  e,
                  name,
                  newDateRange: dateRangeRef.current,
                }),
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
        xAxis: {
          min: 1,
          max: xAxisMax,
          tickInterval: 10,
          labels: { format: '{value}' },
        },
        handles: {
          backgroundColor: '#f1725d',
          borderColor: '#f1725d',
        },
        outlineColor: '#f1725d',
        maskFill: 'rgba(241, 114, 93, 0.1)',
        series: {
          color: '#f1725d',
        },
        // Set initial range selection to full range
        adaptToUpdatedData: false,
        height: 40,
        margin: 10,
      },
      scrollbar: {
        enabled: true,
      },
      series: [
        {
          name: '',
          data: seriesData?.series || [],
          color: '#f1725d',
          type: 'line',
          marker: { enabled: true, radius: 3 },
        },
      ],
    }
  }, [seriesData, dateRange?.from, dateRange?.to, xAxisMax])

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