import { memo, useMemo } from 'react'

import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'

const BubbleCharts = ({ data, activeFilter }) => {
  const { t } = useTranslations()
  const { list = [] } = { ...data }
  const title = t('dash_TotalScrapReceivedVSSmeltedOutputProduced')

  const seriesList = [
    {
      name: t('job_Steel'),
      color: '#114169',
      data: [
        {
          name: t('dash_Recovered'),
          key: 'repairJobsClosed',
          color: '#157ed9',
          value: 12,
        },
        {
          name: t('dash_SentForRefurbishment'),
          key: 'maintenanceJobsClosed',
          color: '#54e854',
          value: 8,
        },
      ],
    },
    {
      name: t('job_Plastic'),
      color: '#51c8f5',
      data: [
        {
          name: t('dash_Recovered'),
          key: 'repairJobsClosed',
          color: '#157ed9',
          value: 9,
        },
        {
          name: t('dash_SentForRefurbishment'),
          key: 'maintenanceJobsClosed',
          color: '#54e854',
          value: 4,
        },
      ],
    },
    {
      name: t('inv_CastIron'),
      color: '#ee5234',
      data: [
        {
          name: t('dash_Recovered'),
          key: 'repairJobsClosed',
          color: '#157ed9',
          value: 65,
        },
        {
          name: t('dash_SentForRefurbishment'),
          key: 'maintenanceJobsClosed',
          color: '#54e854',
          value: 45,
        },
      ],
    },
    {
      name: t('job_Battery'),
      color: '#a02d2a',
      data: [
        {
          name: t('dash_Recovered'),
          key: 'repairJobsClosed',
          color: '#4f8fac',
          value: 60,
        },
        {
          name: t('dash_SentForRefurbishment'),
          key: 'maintenanceJobsClosed',
          color: '#6bd466',
          value: 40,
        },
      ],
    },
  ]

  const options = useMemo(
    () => ({
      chart: {
        type: 'packedbubble',
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: title,
      },
      credits: false,
      plotOptions: {
        packedbubble: {
          minSize: 80,
          maxSize: 135,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: false,
            parentNodeLimit: true,
          },
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            useHTML: true,
            //   format: "{point.name} <br/> {point.value}",
            formatter: function () {
              return (
                "<span class='text-center'>" +
                "<div class='d-block fs-10'>" +
                this.point.name +
                '</div>' +
                "<div class='d-block fs-10'>" +
                this.point.value +
                '</div>' +
                '</span>'
              )
            },
          },
        },
      },
      series: seriesList,
    }),
    [list],
  )

  return (
    <>
      <HightChart options={options} />
      {/* {length(list) && !loader ? (
      ) : (
        <NoDataLoaderCard title={title} loading={loader} />
      )} */}
    </>
  )
}

export default memo(BubbleCharts)
