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

const overallAssessmentData = [
  { assessment: '1 - Excellent', hostels: 10, color: '#168451' },
  { assessment: '2 - Good', hostels: 22, color: '#58b766' },
  { assessment: '3 - Average', hostels: 15, color: '#f4d36f' },
  { assessment: '4 - Poor', hostels: 8, color: '#ef7d32' },
  { assessment: '5 - Critical', hostels: 5, color: '#d33f62' },
]

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
  } = recordMaintenance({ hostelFilter })

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
                    <Tooltip formatter={value => [value, 'Number of Hostels']} />
                    <Bar
                      dataKey="hostels"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={72}
                      cursor="pointer"
                      onClick={data =>
                        handleChartClick({
                          e: {
                            point: {
                              category: data.assessment,
                              series: { name: data.assessment },
                            },
                          },
                          name: 'job_RecordMaintenance',
                        })
                      }
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