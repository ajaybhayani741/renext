import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'

const HCDonutRace = ({ title, subTitle, optionsProps, total = '' }) => {
  const { t } = useTranslations()

  const options = {
    title: {
      text: t(title),
      align: 'center',
    },
    credits: false,
    subtitle: {
      useHTML: true,
      text: `<span class="d-flex justify-center align-center flex-column">
          <span style="font-size: 70px">${total}</span>
          <span style="font-size: 18px">
            ${t(subTitle)}
          </span>
        </span>`,
      floating: true,
      verticalAlign: 'middle',
      y: 20,
    },

    tooltip: {
      valueDecimals: 0,
      // valueSuffix: 'TWh',
    },

    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        type: 'pie',
        size: '100%',
        innerSize: '80%',
        dataLabels: {
          enabled: true,
          crop: false,
          distance: '-10%',
          style: {
            fontWeight: 'bold',
            fontSize: '16px',
          },
          connectorWidth: 0,
          formatter: function () {
            return this.y > 0 ? this.point.name : null
          },
        },
        showInLegend: true,
      },
    },
    colors: ['#f7a35c', '#07a107'],

    ...optionsProps,
  }

  return (
    <>
      <HightChart options={options} />
    </>
  )
}

export default HCDonutRace
