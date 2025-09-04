import { memo } from 'react'

import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'

const DonutChart = () => {
  const { t } = useTranslations()

  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: t('inv_QuantityofScrapRecoveredvsUsed'),
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
    series: [
      {
        name: 'Level 1',
        data: [
          { name: t('dash_TotalScrapRecovered'), y: 100, color: '#95ceff' },
        ],
        size: '42%',
        dataLabels: {
          formatter: function () {
            return this.y > 5 ? this.point.name : null
          },
          color: '#000000',
          distance: -65,
          style: {
            fontSize: 14,
          },
        },
      },
      {
        name: 'Level 2',
        data: [
          { name: t('inv_Refurbishment'), y: 70, color: '#09a109' },
          { name: t('inv_Destroy'), y: 30, color: '#d76786' },
          { name: t('inv_Reuse'), y: 70, color: '#FF0000' },
          { name: t('inv_NotDecidedYet'), y: 30, color: '#0000FF' },
        ],
        size: '75%',
        innerSize: '60%',
        id: 'level2',
        dataLabels: {
          style: {
            fontSize: 14,
          },
          distance: -28,
        },
      },
      {
        name: 'Level 3',
        data: [
          { name: t('inv_ReachedANewVehicle'), y: 10, color: '#FF5733' },
          { name: t('inv_NotReachedNewVehicle'), y: 13, color: '#90ee90' },

          {
            name: t('inv_NotProcessed'),
            y: 43,
            color: '#FFFFC5',
          },
        ],
        size: '95%',
        innerSize: '80%',
        id: 'level3',
        dataLabels: {
          style: {
            fontSize: 14,
          },
        },
      },
    ],
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

  return <HightChart {...{ options }} />
}

export default memo(DonutChart)
