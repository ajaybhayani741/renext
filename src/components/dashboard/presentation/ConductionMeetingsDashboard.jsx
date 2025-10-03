import React from 'react'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { entries, isEqual } from '../../../utils/javascript'
import ColumnComparison from '../../charts/ColumnComparison'
import conductionMeeting from '../container/conductionMeeting.container'
import { conductionMeetingCharts } from '../dashboard.description'

const ConductionMeetingsDashboard = () => {
  const {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = conductionMeeting()
  const { t } = useTranslations()
  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      {axisOptions &&
        entries(conductionMeetingCharts)?.map(([key, value]) => {
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

export default ConductionMeetingsDashboard
