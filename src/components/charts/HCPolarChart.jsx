import HightChart from '.'

const HCPolarChart = ({ title, chartData, seriesData, yAxis }) => {
  const data = seriesData || []

  const options = {
    chart: {
      polar: true,
      parallelCoordinates: true,
      type: 'area',
    },
    pane: {
      size: '80%',
      // startAngle: 72,
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      categories: chartData?.category,
      gridLineWidth: 1,
      gridLineColor: '#ccc',
      gridLineInterpolation: 'polygon', // try "circle" for radar style
      lineWidth: 0,
      labels: {
        style: { fontWeight: 'bold' },
      },
    },
    yAxis,
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      symbolHeight: 8,
      symbolWidth: 17,
      symbolRadius: 3,
      squareSymbol: false,
    },
    series: data.map(set => ({
      name: set[0],
      data: set.slice(1),
    })),
    plotOptions: {
      series: {
        fillOpacity: 0.2,
        states: { hover: { lineWidthPlus: 0 } },
        legendSymbol: 'rectangle',
      },
    },
  }

  return <HightChart options={options} title={title} />
}

export default HCPolarChart
