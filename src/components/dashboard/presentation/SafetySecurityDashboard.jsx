import React from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import FrequencyBarRange from '../../charts/FrequencyBarRange'
import safetySecurity from '../container/safetySecurity.container'
import { safetySecurityCharts } from '../dashboard.description'

const SafetySecurityDashboard = () => {
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = safetySecurity()
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      {axisOptions &&
        entries(safetySecurityCharts)?.map(([key, value]) => {
          return (
            <ANTDColumn xs={24} md={value?.md || 12} key={key}>
              {isEqual(value?.type, 'rangeFrequency') ? (
                <FrequencyBarRange
                  {...{
                    name: key,
                    axisOptions: axisOptions?.[key],
                    handleChartClick: e => handleChartClick(e, key),
                    seriesData: seriesData?.[key],
                    title: `${t(key)}: ${value?.total}`,
                  }}
                />
              ) : isEqual(value?.type, 'columnCompare') ? (
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

export default SafetySecurityDashboard
