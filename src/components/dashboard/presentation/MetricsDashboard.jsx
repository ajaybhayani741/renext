import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import { getDashboardMetricsApi } from '../dashboard.api'
import CommonPieChart from '../shared/CommonPieChart'
import StatsCard from '../shared/StatsCard'

const MetricsSection = ({
  title,
  items,
  startIndex = 0,
  onValueClick,
  t,
  pieChartData = [],
}) => (
  <section className="metrics-section-card">
    <div className="metrics-section-header">
      <h2>{t(title)}</h2>
    </div>
    <div className="metrics-tiles-grid">
      {items.map((item, index) => (
        <StatsCard
          key={item?.label}
          label={t(item?.label)}
          value={item?.value || 0}
          index={startIndex + index}
          onValueClick={() => onValueClick(item?.label)}
        />
      ))}
    </div>
    {pieChartData.length ? (
      <div className="metrics-pie-chart-card">
        <h3 className="metrics-pie-chart-title">
          {t('dash_HostelInspectionOverview')}
        </h3>
        <CommonPieChart
          data={pieChartData.map(item => ({
            ...item,
            name: t(item.name),
          }))}
          size="70%"
          showValueLabels={true}
        />
      </div>
    ) : null}
  </section>
)

const MetricsDashboard = () => {
  const { t } = useTranslations()
  const [metricsData, setMetricsData] = useState(null)

  useEffect(() => {
    const loadMetrics = async () => {
      setMetricsData({ loader: true })
      const response = await getDashboardMetricsApi()
      setMetricsData({ loader: false, ...response?.data })
    }
    loadMetrics()
  }, [])

  const handleMetricValueClick = () => {}

  const hostelMetrics = [
    {
      label: 'dash_TotalHostelsOnboarded',
      value: metricsData?.totalHostelsOnboarded,
    },
    {
      label: 'dash_TotalHostelsInspectedThisWeek',
      value: metricsData?.totalHostelsInspectedThisWeek,
    },
    {
      label: 'dash_TotalHostelsInspectedLastWeek',
      value: metricsData?.totalHostelsInspectedLastWeek,
    },
    {
      label: 'dash_TotalHostelsUnderActiveInspectionThisWeek',
      value: metricsData?.totalHostelsUnderActiveInspectionThisWeek,
    },
    {
      label: 'dash_TotalHostelsYetToBeAssignedForInspectionThisWeek',
      value: metricsData?.totalHostelsYetToBeAssignedThisWeek,
    },
  ]

  const inspectionOfficerMetrics = [
    {
      label: 'dash_TotalInspectionOfficersOnboarded',
      value: metricsData?.totalInspectionOfficersOnboarded,
    },
    {
      label: 'dash_IOsCompletedAtLeastOneInspectionCurrentWeek',
      value: metricsData?.inspectionOfficersCompletedAtLeastOneLastWeek,
    },
    {
      label: 'dash_IOsCompletedAtLeastOneInspectionLastWeek',
      value: metricsData?.inspectionOfficersCompletedAtLeastOneThisWeek,
    },
  ]

  const hostelPieChartData = [
    {
      name: 'dash_TotalHostelsInspectedThisWeek',
      value: metricsData?.hostelInspectionPieChart?.inspectedThisWeek,
      color: '#5BB764',
    },
    {
      name: 'dash_TotalHostelsUnderActiveInspectionThisWeek',
      value: metricsData?.hostelInspectionPieChart?.activeInspectionThisWeek,
      color: '#F6BE1A',
    },
    {
      name: 'dash_TotalHostelsYetToBeAssignedForInspectionThisWeek',
      value: metricsData?.hostelInspectionPieChart?.yetToBeAssignedThisWeek,
      color: '#EF4444',
    },
  ]

  return (
    <div className="dashboard-module-surface metrics-dashboard-surface">
      <div className="metrics-sections-grid">
        <MetricsSection
          title="dash_MetricsHostel"
          items={hostelMetrics}
          onValueClick={handleMetricValueClick}
          t={t}
          pieChartData={hostelPieChartData}
        />
        <MetricsSection
          title="dash_MetricsInspectionOfficer"
          items={inspectionOfficerMetrics}
          startIndex={hostelMetrics.length}
          onValueClick={handleMetricValueClick}
          t={t}
        />
      </div>
    </div>
  )
}

export default MetricsDashboard
