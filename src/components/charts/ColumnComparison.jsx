import { useMemo } from 'react'

import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'
import { isEqual, ternary } from '../../utils/javascript'

const ColumnComparison = ({ data, onScroll, activeFilter }) => {
  const { list = [] } = { ...data }
  const { t } = useTranslations()
  const title = t('inv_ComparisonofPaymentDonetoCustomerAndDealer')

  const chartData = {
    category: [t('dash_Oct'), t('dash_Nov'), t('dash_Dec')],
    customer: [60, 50, 30],
    dealer: [50, 42, 22],
  }

  const options = useMemo(
    () => ({
      chart: {
        type: 'column',
        scrollablePlotArea: {
          minWidth: chartData?.category.length * 180,
          scrollPositionX: 0,
        },
      },
      maxLength: 3,
      credits: false,
      title: {
        text: title,
        align: 'left',
      },
      subtitle: {
        text: '',
        align: 'left',
      },
      plotOptions: {
        series: {
          grouping: false,
          borderWidth: 0,
        },
        column: {
          pointWidth: 50,
          point: {
            events: {
              click: e => {
                // handleClick()
              },
            },
          },
        },
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> ' +
          '{series.name}: <b>{point.y}</b><br/>',
      },
      xAxis: {
        type: 'category',
        categories: chartData?.category,
      },
      yAxis: [
        {
          title: {
            text: ' ',
            // text: t('dash_JobsCreatedVsCompleted'),
          },
          showFirstLabel: false,
        },
      ],
      series: [
        {
          zIndex: 2,
          pointPlacement: -0.15,
          color: '#07a107',
          linkedTo: 'main',
          showInLegend: true,
          name: t('user_Customer'),
          dataLabels: [
            {
              enabled: true,
              inside: true,
              style: {
                fontSize: '14px',
              },
              formatter: function () {
                return ternary(isEqual(this.y, 0), null, this.y)
              },
            },
          ],
          data: chartData?.customer,
        },
        {
          zIndex: 1.5,
          pointPlacement: 0.06,
          name: t('user_Dealer'),
          color: '#95ceff',
          id: 'main',
          dataSorting: {
            enabled: true,
            matchByName: true,
          },
          dataLabels: [
            {
              enabled: true,
              inside: true,
              style: {
                fontSize: '14px',
              },
              formatter: function () {
                return ternary(isEqual(this.y, 0), null, this.y)
              },
            },
          ],
          data: chartData?.dealer,
        },
        // {
        //   zIndex: 0.1,
        //   pointPlacement: 0.25,
        //   name: t('dash_FossilFuel'),
        //   color: 'red',
        //   id: 'main1',
        //   dataSorting: {
        //     enabled: true,
        //     matchByName: true,
        //   },
        //   dataLabels: [
        //     {
        //       enabled: true,
        //       inside: true,
        //       style: {
        //         fontSize: '14px',
        //       },
        //       formatter: function () {
        //         return ternary(isEqual(this.y, 0), null, this.y)
        //       },
        //     },
        //   ],
        //   data: chartData?.Hydrogen,
        // },
      ],
      exporting: {
        allowHTML: true,
      },
    }),
    [list],
  )

  return (
    <>
      <HightChart options={options} id="column-comparison" />
      {/* {length(list) && !loader ? (
      ) : (
        <NoDataLoaderCard title={title} loading={loader} />
      )} */}
    </>
  )
}

export default ColumnComparison
