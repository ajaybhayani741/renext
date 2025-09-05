import React from 'react'

import HightChart from '.'
import NoDataLoaderCard from './NoDataLoaderCard'
import useTranslations from '../../hooks/useTranslations'
import { length } from '../../utils/javascript'
import TitleWithSelectFilter from '../dashboard/presentation/TitleWithSelectFilter'

const HCBarChart = ({
  loading,
  title,
  chartData,
  showSelect,
  selectOption,
  defaultValue,
  onSelectChange,
}) => {
  const { t } = useTranslations()
  const chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: showSelect ? '' : t(title),
    },
    credits: false,
    xAxis: chartData?.xAxis,
    yAxis: {
      max: chartData?.yAxis?.max || null,
      title: {
        text: chartData?.yAxis?.title || null,
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: chartData?.series,
  }
  return (
    <>
      {length(chartData?.series) && !loading ? (
        <HightChart
          options={chartOptions}
          header={
            showSelect ? (
              <TitleWithSelectFilter
                title={title}
                options={selectOption}
                defaultValue={defaultValue}
                onChange={onSelectChange}
              />
            ) : null
          }
        />
      ) : (
        <NoDataLoaderCard title={t(title)} loading={loading} />
      )}
    </>
  )
}

export default HCBarChart
