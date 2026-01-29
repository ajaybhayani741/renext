import React, { useEffect, useMemo, useRef, useState } from 'react'

import HightChart from '.'
import useRedux from '../../hooks/useRedux'
import useTranslations from '../../hooks/useTranslations'
import ANTDInputNumber from '../../shared/antd/ANTDInputNumber'
import Label from '../../shared/Label'
import { isEqual } from '../../utils/javascript'

const HCBarChart = ({
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
  const [binSize, setBinSize] = useState(3)
  const isMobile = selector(state => state.app.isMobile)
  const isDesktop = selector(state => state.app.isDesktop)

  const maxDataValue = useMemo(() => {
    if (!seriesData?.series?.length) return seriesData?.highestCount ?? 100
    return Math.max(...seriesData.series.map(([x]) => x))
  }, [seriesData?.series, seriesData?.highestCount])

  const xAxisMax = useMemo(() => {
    if (!binSize) return 100
    const min = 1
    const binStart = Math.floor((maxDataValue - min) / binSize) * binSize + min
    return binStart + binSize - 1
  }, [maxDataValue, binSize])

  useEffect(() => {
    dateRangeRef.current = dateRange
  }, [dateRange])

  // const debouncedScroll = useCallback(
  //   debounce((start, end) => {
  //     const rangeGap = Math.abs(end - start)
  //     if (rangeGap < 100) {
  //       onRangeChange({ start, end, chartType: [name] })
  //     }
  //   }, 500),
  //   [dateRangeRef.current, name, onRangeChange],
  // )

  // const checkRange = useCallback(
  //   debounce(rangeGap => {
  //     if (rangeGap > 100) {
  //       notifyMethod.error({
  //         message:
  //           'The range gap cannot exceed 100. Please select a smaller range.',
  //       })
  //       return false
  //     }
  //     return true
  //   }, 500),
  //   [],
  // )

  const min = 1
  // const navigatorTickInterval = 3

  const groupedData = useMemo(() => {
    if (!seriesData?.series || seriesData?.series?.length === 0 || !binSize)
      return []
    const result = []
    const valueMap = new Map()

    for (const [x, y] of seriesData?.series) {
      valueMap.set(x, (valueMap.get(x) || 0) + y)
    }

    for (let start = min; start <= xAxisMax; start += binSize) {
      const end = Math.min(start + binSize - 1, xAxisMax)

      let sum = 0
      for (let v = start; v <= end; v++) {
        if (valueMap.has(v)) {
          sum += valueMap.get(v)
        }
      }

      if (sum > 0) {
        result.push([isEqual(binSize, 1) ? start : `${start}-${end}`, sum])
      }
    }
    return result
  }, [seriesData?.series, min, xAxisMax, binSize])

  const xAxisValues = useMemo(() => {
    if (!binSize) return []
    const result = []
    for (let start = min; start <= xAxisMax; start += binSize) {
      const end = start + binSize - 1
      result.push(isEqual(binSize, 1) ? start : `${start}-${end}`)
    }
    return result
  }, [min, xAxisMax, binSize])

  const valuesOnly = useMemo(() => {
    if (!binSize) return []
    const dataMap = new Map(groupedData)
    return xAxisValues.map(range => dataMap.get(range) || 0)
  }, [xAxisValues, groupedData, binSize])

  const yAxisMin = 10
  const yMaxValue = Math.max(...valuesOnly)
  const yAxisMax =
    yMaxValue < yAxisMin ? yAxisMin : Math.ceil(yMaxValue / 10) * 10

  const xAxisTickInterval = useMemo(() => {
    const maxLength = isMobile ? 10 : !isDesktop ? 15 : 20
    if (xAxisValues.length > maxLength) {
      return Math.ceil(xAxisValues.length / maxLength)
    }
    return 0
  }, [xAxisValues.length, isMobile, isDesktop])

  const getRandomID = useMemo(() => {
    return Math.random().toString(36).slice(2)
  }, [valuesOnly])

  const options = useMemo(() => {
    return {
      title: {
        text: '',
      },
      chart: {
        type: 'column',
        // events: {
        //   load: function () {
        //     const chart = this
        //     // chart.xAxis[0].setExtremes(1, 100)
        //     chart.renderer
        //       .button(
        //         t('btn_View'), // The text of the button
        //         10, // X position (e.g., from the right)
        //         chart.chartHeight - 8, // Y position (e.g., from the top)
        //         e => {
        //           const { min, max } = chart?.xAxis?.[0]?.getExtremes()
        //           const minVal = Math.round(min)
        //           const maxVal = Math.round(max)
        //           const minValue = xAxisValues[minVal]?.split('-')?.[0]
        //           const maxValue = xAxisValues[maxVal]?.split('-')?.[1]
        //           handleChartClick({
        //             e,
        //             name,
        //             startEnd: {
        //               start: Number(minValue || 0),
        //               end: Number(maxValue || 0),
        //             },
        //             newDateRange: dateRangeRef.current,
        //             chartType: 'rangeFrequency',
        //             xAxisTitle: xAxisTitle,
        //           }) // Action to perform on click
        //         },
        //         {
        //           // Normal state styling
        //           fill: '#f6d4be',
        //           r: 5,
        //           stroke: 'none',
        //           padding: 8,
        //         },
        //         {
        //           // Normal state styling
        //           fill: '#f6d4be',
        //           r: 5,
        //           padding: 8,
        //         },
        //       )
        //       .css({
        //         border: 'none',
        //       })
        //       .add() // Adds the button to the chart
        //   },
        // },
      },
      xAxis: {
        min: 0,
        // max: length(xAxisValues) < 15 ? length(xAxisValues) - 1 : 15 - 1,
        categories: xAxisValues,
        title: { text: t(xAxisTitle) },
        labels: {
          step: xAxisTickInterval,
          // allowOverlap: true,
          // autoRotation: [0],
          // reserveSpace: false,
          // staggerLines: 1,
          rotation: xAxisValues.length > 50 ? -45 : 0,
          // style: {
          //   fontSize:
          //     xAxisValues.length > 100
          //       ? '8px'
          //       : xAxisValues.length > 50
          //         ? '9px'
          //         : '11px',
          // },
          // formatter: function () {
          //   // Always return the label to ensure it's displayed
          //   return this.value
          // },
        },
        // events: {
        // afterSetExtremes: function () {
        // Force step: 0 after extremes are set
        // const axis = this
        // if (axis.options.labels.step !== 0) {
        //   axis.update(
        //     {
        //       labels: {
        //         step: 0,
        //         allowOverlap: true,
        //         autoRotation: [0],
        //       },
        //     },
        //     false,
        //   )
        // }
        // Force all labels to show
        // if (axis.ticks) {
        //   Object.keys(axis.ticks).forEach(key => {
        //     const tick = axis.ticks[key]
        //     if (tick && tick.label) {
        //       tick.label.show()
        //     }
        //   })
        // }
        // },
        // },
        // events: {
        //   setExtremes: function (e) {
        //     if (e.trigger === 'navigator') {
        //       const rangeGap = Math.abs(e.max - e.min)
        //       checkRange(rangeGap)
        //     }
        //   },
        //   afterSetExtremes: function (e) {
        //     if (e.trigger !== 'navigator') return
        //     const chart = this.chart
        //     const { min, max } = e
        //     const navAxis = chart.navigator.xAxis

        //     // Remove old labels if they exist
        //     if (chart.customLeftLabel) {
        //       chart.customLeftLabel.destroy()
        //       chart.customRightLabel.destroy()
        //     }

        //     const leftX = navAxis.toPixels(min)
        //     const rightX = navAxis.toPixels(max)
        //     chart.customLeftLabel = chart.renderer
        //       .label(`${Math.round(min)}`, leftX - 8, chart.plotHeight + 60)
        //       .css({ color: '#000', fontSize: '10px' })
        //       .add()

        //     chart.customRightLabel = chart.renderer
        //       .label(`${Math.round(max)}`, rightX - 8, chart.plotHeight + 60)
        //       .css({ color: '#000', fontSize: '10px' })
        //       .add()
        //     if (onRangeChange) {
        //       debouncedScroll(Math.round(min), Math.round(max))
        //     }
        //   },
        // },
      },
      yAxis: {
        min: 1,
        max: yAxisMax,
        tickInterval: 2,
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
        column: {
          pointPadding: 0.1,
          borderWidth: 0,
          groupPadding: 0.05,
          pointWidth: null, // Let Highcharts calculate, but we'll make it narrower if needed
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: e => {
                const value = e?.point?.category
                const minValue = value?.split('-')?.[0]
                const maxValue = value?.split('-')?.[1]
                handleChartClick({
                  e,
                  name,
                  newDateRange: dateRangeRef.current,
                  chartType: 'rangeFrequency',
                  xAxisTitle: xAxisTitle,
                  startEnd: {
                    start: Number(minValue || 0),
                    end: Number(maxValue || 0),
                  },
                })
              },
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
        enabled: false,
        // xAxis: {
        //   min: 0,
        //   max: xAxisValues.length - 1,
        //   tickInterval: navigatorTickInterval,
        //   labels: {
        //     formatter: value => {
        //       return xAxisValues[value?.pos]
        //     },
        //   },
        // },
        // handles: {
        //   backgroundColor: '#f1725d',
        //   borderColor: '#f1725d',
        // },
        // outlineColor: '#f1725d',
        // maskFill: 'rgba(241, 114, 93, 0.1)',
        // series: {
        //   color: '#f1725d',
        // },
        // // Set initial range selection to full range
        // adaptToUpdatedData: false,
        // height: 40,
        // margin: 10,
      },
      scrollbar: {
        enabled: true,
      },
      series: [
        {
          name: '',
          data: valuesOnly || [],
          color: '#6484cb',
          type: 'column',
          marker: { enabled: true, radius: 3 },
        },
      ],
    }
  }, [
    dateRange?.from,
    dateRange?.to,
    xAxisValues,
    valuesOnly,
    xAxisTickInterval,
    t,
    xAxisTitle,
    yAxisTitle,
    yAxisMax,
    handleChartClick,
    name,
  ])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '0px',
          right: '10px',
          width: '200px',
          height: '30px',
          padding: '0px 8px',
          zIndex: 1,
          textAlign: 'left',
        }}
      >
        <Label text="Bin size" className="mt-0" />
        <ANTDInputNumber
          name="binSize"
          value={binSize}
          onChange={e => {
            setBinSize(!e || e <= 0 ? 0 : e)
          }}
          className="w-100"
        />
      </div>
      <HightChart
        key={`column-chart-${name}-${getRandomID}`} // Stable key to prevent remounting when binSize changes
        options={options}
        title={title}
        className="frequency-chart-card"
      />
    </div>
  )
}

export default HCBarChart
