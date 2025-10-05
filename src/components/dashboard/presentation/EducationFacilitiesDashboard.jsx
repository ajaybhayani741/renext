import React from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import educationFacilities from '../container/educationFacilities.container'
import { educationFacilitiesCharts } from '../dashboard.description'

const EducationFacilitiesDashboard = () => {
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = educationFacilities()
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      {axisOptions &&
        entries(educationFacilitiesCharts)?.map(([key, value]) => {
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
              ) : null}
            </ANTDColumn>
          )
        })}
    </DashboardWrapper>
  )
}

export default EducationFacilitiesDashboard
