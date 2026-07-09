import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import DashboardWrapper from './DashboardWrapper'
import useTranslations from '../../../hooks/useTranslations'
import { entries } from '../../../utils/javascript'
import recordMaintenance from '../container/recordMaintenance.container'
import { recordMaintenanceCharts } from '../dashboard.description'
import ChartCard from '../shared/ChartCard'
import ModernCompareChart from '../shared/ModernCompareChart'
import ModuleFilters from '../shared/ModuleFilters'

const RecordMaintenanceDashboard = () => {
  const { t } = useTranslations()
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
    overallAssessment,
  } = recordMaintenance({ hostelFilter })

  const overallAssessmentData = useMemo(
    () => [
      {
        assessment: 'Excellent',
        filterValue: 'EXCELLENT',
        hostels: overallAssessment?.excellent || 0,
        color: '#168451',
      },
      {
        assessment: 'Good',
        filterValue: 'GOOD',
        hostels: overallAssessment?.good || 0,
        color: '#58b766',
      },
      {
        assessment: 'Average',
        filterValue: 'AVERAGE',
        hostels: overallAssessment?.average || 0,
        color: '#f4d36f',
      },
      {
        assessment: 'Poor',
        filterValue: 'POOR',
        hostels: overallAssessment?.poor || 0,
        color: '#ef7d32',
      },
      {
        assessment: 'Critical',
        filterValue: 'CRITICAL',
        hostels: overallAssessment?.critical || 0,
        color: '#d33f62',
      },
    ],
    [overallAssessment],
  )

  const categoryLabels = useMemo(
    () => chartData?.category?.map((_, index) => `${index + 1}`) || [],
    [chartData],
  )

  const legendMapping = useMemo(
    () =>
      chartData?.category?.reduce(
        (acc, category, index) => ({
          ...acc,
          [`${index + 1}`]: t(category) || category,
        }),
        {},
      ) || {},
    [chartData, t],
  )

  return (
    <DashboardWrapper
      handleCloseModal={handleCloseModal}
      selectedColumn={selectedColumn}
      handleTableChange={handleTableChange}
      hostelsData={hostelsData}
    >
      <div className="dashboard-module-surface dashboard-record-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          <div className="dashboard-full-chart">
            <ChartCard title="Overall Assessment">
              <div style={{ width: '100%', height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={overallAssessmentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="assessment"
                      interval={0}
                      tick={{ fill: '#111827', fontSize: 12 }}
                      height={55}
                    />
                    <YAxis
                      allowDecimals={false}
                      label={{
                        value: 'Number of Hostels',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip
                      formatter={value => [value, 'Number of Hostels']}
                    />
                    <Bar
                      dataKey="hostels"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={72}
                      cursor="pointer"
                      onClick={data => {
                        const chartItem = data?.payload || data
                        handleChartClick({
                          e: {
                            point: {
                              category: chartItem?.assessment,
                              filterValue: chartItem?.filterValue,
                              series: { name: chartItem?.assessment },
                            },
                          },
                          name: 'overallHostelCondition',
                        })
                      }}
                    >
                      {overallAssessmentData.map(item => (
                        <Cell key={item.assessment} fill={item.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          {/* Existing category charts are intentionally hidden for now. */}
          {false && (
            <>
              {entries(recordMaintenanceCharts)?.map(([key]) => {
                return (
                  <div className="dashboard-full-chart" key={key}>
                    <ModernCompareChart
                      {...{
                        name: key,
                        chartData,
                        handleChartClick,
                        seriesData: seriesData?.[key]?.series,
                        title: `${t(key)}`,
                        categoryLabels,
                        legendMapping,
                        showFooterTitle: false,
                      }}
                    />
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default RecordMaintenanceDashboard
