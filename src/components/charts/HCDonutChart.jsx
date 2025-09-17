import HightChart from '.'

const HCDonutChart = ({ title, seriesData }) => {
  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: "",
    },
    credits: false,
    plotOptions: {
      pie: {
        shadow: false,
        center: ['50%', '50%'],
        showInLegend: true,
      },
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.point.name + '</b>: ' + this.y + ' %'
      },
    },
    series: seriesData,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 400,
          },
          chartOptions: {
            series: [
              {},
              {
                dataLabels: {
                  enabled: false,
                },
              },
              {
                dataLabels: {
                  enabled: false,
                },
              },
            ],
          },
        },
      ],
    },
  }

  return (
    <>
      <HightChart options={options} title={title} />
    </>
  )
}

export default HCDonutChart
