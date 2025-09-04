import { useMemo, useState } from 'react'

import HightChart from '.'
import NoDataLoaderCard from './NoDataLoaderCard'
import useTranslations from '../../hooks/useTranslations'
import ANTDSpin from '../../shared/antd/ANTDSpin'
import { length } from '../../utils/javascript'
import { colorByRegion } from '../dashboard/dashboard.description'

const PieCharts = ({ activeFilter, loading }) => {
  const { t } = useTranslations()
  const [drillLoader, setDrillLoader] = useState(false)

  const MATERIAL = [
    { name: t('inv_CatalyticConverter'), count: 4.54 },
    { name: t('inv_TyresRubber'), count: 4.54 },
    { name: t('dash_HazardousWasteMaterial'), count: 4.54 },
    { name: t('dash_SeatFoam'), count: 4.54 },
    { name: t('job_Aluminium'), count: 4.54 },
    { name: t('job_Muffler'), count: 4.54 },
    { name: t('job_SteelCasting'), count: 4.54 },
    { name: t('inv_SteelScrap'), count: 4.54 },
    { name: t('job_WireHarness'), count: 4.54 },
    { name: t('inv_Fastner'), count: 4.54 },
    { name: t('job_Plastic'), count: 4.54 },
    { name: t('job_LeadAcidBattery'), count: 4.54 },
    { name: t('job_Glasses'), count: 4.54 },
    { name: t('job_ShellAndPaintedSteel'), count: 4.54 },
    { name: t('job_MixMotors'), count: 4.54 },
    { name: t('inv_WasteOil'), count: 4.54 },
    { name: t('inv_EWaste'), count: 4.54 },
    { name: t('inv_Misc'), count: 4.54 },
    { name: t('dash_OuterBodyParts'), count: 4.54 },
    { name: t('dash_InnerBodyParts'), count: 4.54 },
    { name: t('inv_ProcessLoss'), count: 4.54 },
    { name: t('dash_FullEngine'), count: 4.54 },
  ];
  

  const chartData = {
    totalCount: 100,
    stateCityList: [
      {
        id: null,
        name: t('job_DirectRecovery'),
        count: 50,
      },
      {
        id: null,
        name: t('user_CollectionCenter'),
        count: 25,
      },
      {
        id: null,
        name: t('user_Dealer'),
        count: 25,
      },
    ],
  }

  const drilldownData = useMemo(() => {
    const data = {}
    chartData.stateCityList.forEach(item => {
      data[item.name] = {
        totalCount: MATERIAL.length * 4.54,
        errorCodesList: MATERIAL.map(error => ({
          name: error.name,
          count: error.count,
        })),
      }
    })
    return data
  }, [chartData.stateCityList])

  const handleDrilldown = async (e, chart) => {
    const point = { ...e.point }
    setDrillLoader(true)

    setDrillLoader(false)
    if (!length(drilldownData?.[point?.name]?.errorCodesList)) return
    const drilldowns = {
      errorCode: {
        name: point.name,
        id: 'errorCode',
        color: '#1890ff',
        data: drilldownData?.[point?.name]?.errorCodesList?.map(obj => ({
          ...obj,
          y: obj?.count,
        })),
      },
    }
    if (!e.seriesOptions) {
      const drilldownSeries =
        drilldowns[point.name] || drilldowns[point.drilldown]
      chart.addSeriesAsDrilldown(point, drilldownSeries)
    }
  }

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'pie',
        events: {
          drilldown: function (e) {
 handleDrilldown(e, this)
          },
        },
      },
      title: {
        text: t('dash_SourceOfScrap'),
      },
      tooltip: {
        headerFormat: '',
        pointFormat: `
          <span style="color:{point.color}">\u25CF ${t(
            'dash_TotalScraps',
          )} : </span> 
          <span>${chartData?.totalCount}</span>`,
        formatter: function () {
          return `<span style="font-size: 12px">
                 ${this.point?.name?.replace(/_/g, ' ')} : ${this.point.y}
                 </span><br/>
                <span style="color:${this.point.color}">\u25CF</span>
                 ${t('dash_TotalScraps')}: <b>${chartData?.totalCount}</b>`
        },
      },
      accessibility: {
        point: {
          valueSuffix: '',
        },
      },
      credits: false,
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:f}',
            distance: 20,
          },
          size: '240px',
        },
      },
      series: [
        {
          colorByPoint: true,
          data: chartData?.stateCityList?.map(obj => ({
            name: obj?.name,
            y: obj?.count,
            id: obj?.id,
            drilldown: 'errorCode',
            color: colorByRegion?.[obj?.name],
          })),
        },
      ],
      drilldown: {
        series: [],
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 400,
            },
          },
        ],
      },
    }),
    [chartData?.stateCityList, activeFilter],
  )

  return (
    <>
      {drillLoader && (
        <div className="opacity-loader">
          <ANTDSpin size="large" />
        </div>
      )}
      {length(chartData?.stateCityList) && !loading ? (
        <HightChart options={chartOptions} />
      ) : (
        <NoDataLoaderCard
          title={t('dash_DealerWiseScrapConsumed')}
          loading={loading}
        />
      )}
    </>
  )
}

export default PieCharts