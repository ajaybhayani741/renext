import HightChart from '.'

const HCPolarChart = ({ title, chartData, seriesData, yAxis }) => {
  const options = {
    chart: {
      polar: true,
      type: 'line',
    },
    title: {
      text: null,
    },
    pane: {
      size: '85%',
    },
    xAxis: {
      categories: chartData?.category,
      tickmarkPlacement: 'on',
      lineWidth: 0,
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      // max: 20,
      tickInterval: 2,
      title: {
        text: 'km',
        align: 'middle',
        offset: -40, // Adjust position to be visible
        style: {
          fontWeight: 'normal',
        },
      },
    },
    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{series.color}">{series.name}: <b>{point.y:,.1f}</b><br/>',
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
    },
    series: seriesData,
    credits: {
      enabled: false,
    },
  }

  return <HightChart options={options} title={title} />
}

export default HCPolarChart
