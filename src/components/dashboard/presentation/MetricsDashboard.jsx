import { useEffect, useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import useMandalDetails from '../../../hooks/useMandalDetails'
import useTranslations from '../../../hooks/useTranslations'
import { userWiseRole } from '../../../utils/constant'
import { getUserList } from '../../userManagement/user.api'
import {
  getDashboardMetricsApi,
  getDashboardMetricsHostelsApi,
} from '../dashboard.api'
import CommonPieChart from '../shared/CommonPieChart'
import StatsCard from '../shared/StatsCard'

const MetricsSection = ({
  title,
  items,
  startIndex = 0,
  onValueClick,
  onPieChartClick,
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
          onValueClick={
            (item?.metric || item?.userRoleId) && onValueClick
              ? () => onValueClick(item)
              : undefined
          }
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
            category: t('dash_HostelInspectionOverview'),
          }))}
          size="70%"
          showValueLabels={true}
          handleChartClick={onPieChartClick}
          name="dash_HostelInspectionOverview"
        />
      </div>
    ) : null}
  </section>
)

const MetricsDashboard = () => {
  const mandalDetails = useMandalDetails()
  const { t } = useTranslations()
  const [metricsData, setMetricsData] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState({})
  const isInspectionOfficerModal =
    selectedColumn?.listType === 'inspectionOfficer'

  useEffect(() => {
    const loadMetrics = async () => {
      setMetricsData({ loader: true })
      const response = await getDashboardMetricsApi()
      setMetricsData({ loader: false, ...response?.data })
    }
    loadMetrics()
  }, [])

  const getMetricHostels = async ({ metric, pageNo = 1 }) => {
    const response = await getDashboardMetricsHostelsApi({
      pageNo,
      params: { metric },
    })

    return response?.data
  }

  const getInspectionOfficers = async ({ pageNo = 1 }) => {
    const response = await getUserList({
      params: `${pageNo}?roleId=${userWiseRole.inspectionOfficer}`,
    })

    return response?.data
  }

  const openInspectionOfficerModal = async ({ label }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getInspectionOfficers({ pageNo: 1 })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
    setSelectedColumn({
      selected: true,
      chartData: {
        category: 'dash_MetricsInspectionOfficer',
        type: t(label),
      },
      title: label,
      listType: 'inspectionOfficer',
      modalTitle: true,
    })
  }
  const openHostelsModal = async ({ metric, label, type }) => {
    if (!metric) return

    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getMetricHostels({ metric })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
    setSelectedColumn({
      selected: true,
      chartData: {
        category: 'dash_MetricsHostel',
        type: type || t(label),
        chartType: 'pie',
      },
      categoryValue: metric,
      title: label,
      reportChartType: 'DASHBOARD_METRICS_OVERVIEW',
      modalTitle: true,
    })
  }

  const handleMetricValueClick = item => {
    if (item?.userRoleId) {
      openInspectionOfficerModal({ label: item?.label })
      return
    }

    openHostelsModal({
      metric: item?.metric,
      label: item?.label,
    })
  }
  const handlePieChartClick = ({ e }) => {
    const point = e?.point

    openHostelsModal({
      metric: point?.filterValue,
      label: point?.label,
      type: point?.name,
    })
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
    })
    setHostelsData({})
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))

    const respData = isInspectionOfficerModal
      ? await getInspectionOfficers({ pageNo: current })
      : await getMetricHostels({
          metric: selectedColumn?.categoryValue,
          pageNo: current,
        })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
  }
  const hostelMetrics = [
    {
      label: 'dash_TotalHostelsOnboarded',
      value: metricsData?.totalHostelsOnboarded,
      metric: 'TOTAL_HOSTELS_ONBOARDED',
    },
    {
      label: 'dash_TotalHostelsInspectedThisWeek',
      value: metricsData?.totalHostelsInspectedThisWeek,
      metric: 'INSPECTED_THIS_WEEK',
    },
    {
      label: 'dash_TotalHostelsInspectedLastWeek',
      value: metricsData?.totalHostelsInspectedLastWeek,
      metric: 'INSPECTED_LAST_WEEK',
    },
    {
      label: 'dash_TotalHostelsUnderActiveInspectionThisWeek',
      value: metricsData?.totalHostelsUnderActiveInspectionThisWeek,
      metric: 'ACTIVE_INSPECTION_THIS_WEEK',
    },
    {
      label: 'dash_TotalHostelsYetToBeAssignedForInspectionThisWeek',
      value: metricsData?.totalHostelsYetToBeAssignedThisWeek,
      metric: 'YET_TO_BE_ASSIGNED_THIS_WEEK',
    },
  ]

  const inspectionOfficerMetrics = [
    {
      label: 'dash_TotalInspectionOfficersOnboarded',
      value: metricsData?.totalInspectionOfficersOnboarded,
      userRoleId: userWiseRole.inspectionOfficer,
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

  const inspectionOfficerColumns = [
    {
      title: '',
      key: 'id',
      render: (_, __, index) => {
        return ((hostelsData?.pageNo || 1) - 1) * 10 + index + 1
      },
    },
    {
      title: t('user_Name'),
      key: 'user_Name',
      render: rowData => rowData?.lastName || rowData?.name || '-',
    },
    {
      title: t('user_Designation'),
      dataIndex: 'designation',
      key: 'designation',
      render: rowData => rowData || '-',
    },
    {
      title: t('mso_Mandal'),
      key: 'mso_Mandal',
      render: rowData =>
        mandalDetails.find(option => option.value === rowData?.mandal)?.label ||
        rowData?.mandal ||
        '-',
    },
    {
      title: t('user_Contact'),
      dataIndex: 'phoneNumber',
      key: 'user_Contact',
      render: rowData => rowData || '-',
    },
  ]

  const hostelPieChartData = [
    {
      name: 'dash_TotalHostelsInspectedThisWeek',
      value: metricsData?.hostelInspectionPieChart?.inspectedThisWeek,
      color: '#5BB764',
      filterValue: 'INSPECTED_THIS_WEEK',
      label: 'dash_TotalHostelsInspectedThisWeek',
    },
    {
      name: 'dash_TotalHostelsUnderActiveInspectionThisWeek',
      value: metricsData?.hostelInspectionPieChart?.activeInspectionThisWeek,
      color: '#F6BE1A',
      filterValue: 'ACTIVE_INSPECTION_THIS_WEEK',
      label: 'dash_TotalHostelsUnderActiveInspectionThisWeek',
    },
    {
      name: 'dash_TotalHostelsYetToBeAssignedForInspectionThisWeek',
      value: metricsData?.hostelInspectionPieChart?.yetToBeAssignedThisWeek,
      color: '#EF4444',
      filterValue: 'YET_TO_BE_ASSIGNED_THIS_WEEK',
      label: 'dash_TotalHostelsYetToBeAssignedForInspectionThisWeek',
    },
  ]

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
      hideExportButton
      modalColumns={isInspectionOfficerModal ? inspectionOfficerColumns : null}
      modalDataKey={isInspectionOfficerModal ? 'list' : 'hostels'}
      showPaginationOnSinglePage={isInspectionOfficerModal}
    >
      <div className="dashboard-module-surface metrics-dashboard-surface">
        <div className="metrics-sections-grid">
          <MetricsSection
            title="dash_MetricsHostel"
            items={hostelMetrics}
            onValueClick={handleMetricValueClick}
            onPieChartClick={handlePieChartClick}
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
    </DashboardWrapper>
  )
}

export default MetricsDashboard
