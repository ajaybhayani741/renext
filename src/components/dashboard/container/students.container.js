import { useState } from 'react'

const students = () => {
  // const { t } = useTranslations()
  // const [range, setRange] = useState([0, 250])
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })

  const hostelData = [
    { hostel: 'Hostel A', students: 120 },
    { hostel: 'Hostel B', students: 90 },
    { hostel: 'Hostel C', students: 150 },
    { hostel: 'Hostel D', students: 70 },
    { hostel: 'Hostel E', students: 200 },
    { hostel: 'Hostel F', students: 40 },
  ]

  const frequencies = {}
  hostelData.forEach(h => {
    const s = h.students
    frequencies[s] = (frequencies[s] || 0) + 1
  })

  // const categories = Object.keys(frequencies)
  //   .map(Number)
  //   .sort((a, b) => a - b)
  // const counts = categories.map(c => frequencies[c])

  const options = {
    rangeSelector: {
      enabled: false,
    },

    chart: {
      zooming: {
        type: 'xy',
      },
    },
    credits: false,
    xAxis: {
      type: 'linear',
      title: {
        text: 'No. of students',
      },
      tickPositions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      labels: {
        formatter: function () {
          return this.value // show plain numbers instead of time
        },
      },
    },
    yAxis: [
      {
        // Primary yAxis
        title: {
          text: 'No. of Hostel',
        },
        lineWidth: 2,
        opposite: false,
      },
      {
        // Secondary yAxis
        title: {
          text: 'No. of Hostel',
        },
        lineWidth: 2,
        visible: false,
      },
    ],
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
    },
    tooltip: {
      shared: true,
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
    },
    series: [
      {
        type: 'column',
        data: [
          [5, 45],
          [10, 37],
          [15, 28],
          [20, 17],
          [25, 39],
          [30, 18],
          [35, 90],
          [40, 78],
          [45, 74],
          [50, 18],
          [55, 17],
          [60, 16],
        ],
      },
      {
        type: 'spline',
        name: 'Hostel',
        data: [
          [5, 45],
          [10, 37],
          [15, 28],
          [20, 17],
          [25, 39],
          [30, 18],
          [35, 90],
          [40, 78],
          [45, 74],
          [50, 18],
          [55, 17],
          [60, 16],
        ],
      },
    ],
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
  }

  return { options, selectedColumn, handleCloseModal }
}

export default students
