import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'

const DonutChartRace = ({ data }) => {
  const { t } = useTranslations()
  const options = {
    title: {
      text: t('inv_TotalOEMvsELVsrecovered'),
      align: 'center',
    },
    credits: false,
    subtitle: {
      useHTML: true,
      text: `<span class="d-flex justify-center align-center flex-column">
          <span style="font-size: 70px">${/* data?.total */ 77 ?? 0}</span>
          <span style="font-size: 18px">
            ${t('dash_TotalInput')}
          </span>
        </span>`,
      floating: true,
      verticalAlign: 'middle',
      y: 20,
    },

    legend: {
      enabled: false,
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
        },
      },
    },
    colors: ['#f7a35c', '#07a107'],
    series: [
      {
        type: 'pie',
        name: 77 ?? data?.total ?? 0,
        data: [
          [t('dash_TestVehiclesOEM'), 39 ?? data?.active ?? 0],
          [t('dash_ELVConsumer'), 38 ?? data?.completed ?? 0],
        ],
      },
    ],
  }
  return (
    <>
      <HightChart options={options} />
      {/* {!data.loader ? (
      ) : (
        <NoDataLoaderCard
          title={t('dash_TotalJobsOpenVSCompleted')}
          loading={data.loader}
        />
      )} */}
    </>
  )
}

export default DonutChartRace
