import { useMemo, useState } from 'react'

import { schoolsList } from '../dashboard.description'

const staffDetails = () => {
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const data = [
    [Date.UTC(2025, 0, 1), 30],
    [Date.UTC(2025, 0, 5), 50],
    [Date.UTC(2025, 0, 10), 70],
    [Date.UTC(2025, 0, 15), 20],
    [Date.UTC(2025, 0, 20), 90],
    [Date.UTC(2025, 0, 25), 40],
    [Date.UTC(2025, 1, 1), 60],
    [Date.UTC(2025, 1, 5), 100],
    [Date.UTC(2025, 1, 10), 80],
    [Date.UTC(2025, 1, 15), 120],
  ]

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
    })
  }

  const options = useMemo(
    () => ({
      chart: {
        type: 'column', // bar chart
      },
      title: {
        text: '',
      },
      xAxis: {
        title: { text: 'Number of students' },
        type: 'datetime',
      },
      yAxis: {
        title: { text: 'Number of hostels' },
      },
      series: [
        {
          name: 'Students',
          data: data,
        },
      ],
      navigator: {
        enabled: true, // bottom slider
      },
      scrollbar: {
        enabled: true, // horizontal scroll bar
      },
      rangeSelector: {
        enabled: false, // buttons like 1m, 3m
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: handleChartClick,
            },
          },
        },
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

export default staffDetails
