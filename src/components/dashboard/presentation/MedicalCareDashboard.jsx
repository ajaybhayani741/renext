import React from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import HCPieChart from '../../charts/HCPieChart'
import HCPolarChart from '../../charts/HCPolarChart'
import medicalCare from '../container/medicalCare.container'
import { medicalCareCharts } from '../dashboard.description'

const MedicalCareDashboard = () => {
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
  } = medicalCare()
  const { t } = useTranslations()
  return (
    <DashboardWrapper {...{ handleCloseModal, selectedColumn }}>
      {axisOptions &&
        entries(medicalCareCharts)?.map(([key, value]) => {
          return (
            <ANTDColumn xs={24} md={value?.md || 12} key={key}>
              {isEqual(value?.type, 'columnCompare') ? (
                <ColumnComparison
                  {...{
                    name: key,
                    chartData: seriesData?.[key]?.chartData,
                    handleChartClick,
                    seriesData: seriesData?.[key]?.seriesData,
                    title: `${t(key)}`,
                  }}
                />
              ) : isEqual(value?.type, 'polar') ? (
                <HCPolarChart
                  {...{
                    name: key,
                    chartData: seriesData?.[key]?.chartData,
                    handleChartClick,
                    seriesData: seriesData?.[key]?.seriesData,
                    yAxis: seriesData?.[key]?.yAxis,
                    title: `${t(key)}`,
                  }}
                />
              ) : isEqual(value?.type, 'pie') ? (
                <HCPieChart
                  {...{
                    handleChartClick,
                    seriesData: seriesData?.[key],
                    title: `${t(key)}`,
                    name: key,
                  }}
                />
              ) : null}
            </ANTDColumn>
          )
        })}
    </DashboardWrapper>
  )
}

export default MedicalCareDashboard
