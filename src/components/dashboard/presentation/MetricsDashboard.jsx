import { useEffect, useState } from 'react'

import '../dashboard.scss'

import DashboardWrapper from './DashboardWrapper'
import useMandalDetails from '../../../hooks/useMandalDetails'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import pathName from '../../../routing/pathName.constant'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../utils/constant'
import { tabKeys } from '../../jobs/jobs.description'
import { getUserList } from '../../userManagement/user.api'
import {
  getDashboardMetricsApi,
  getDashboardMetricsHostelsApi,
  getDashboardMetricsMandalsApi,
} from '../dashboard.api'
import CommonPieChart from '../shared/CommonPieChart'
import StatsCard from '../shared/StatsCard'

const isMandalInspectionMetric = metric =>
  ['FULLY_COMPLETED', 'PARTIALLY_COMPLETED'].includes(metric)

const MetricsSection = ({
  title,
  items,
  startIndex = 0,
  onValueClick,
  t,
  children,
  className = '',
}) => (
  <section className={`metrics-section-card ${className}`}>
    <div className="metrics-section-header">
      <h2>{t(title)}</h2>
    </div>
    <div className="metrics-section-content">
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
      {children}
    </div>
  </section>
)

const MetricsPieChart = ({
  data,
  onPieChartClick,
  t,
  title = 'dash_HostelInspectionOverview',
}) => (
  <section className="metrics-pie-chart-card">
    <h3 className="metrics-pie-chart-title">{t(title)}</h3>
    <CommonPieChart
      data={data.map(item => ({
        ...item,
        name: t(item.name),
        category: t(title),
      }))}
      size="70%"
      showValueLabels={true}
      compact
      handleChartClick={onPieChartClick}
      name={title}
    />
  </section>
)

const MetricsDashboard = ({ navigatePieChartToInspection = false }) => {
  const mandalDetails = useMandalDetails()
  const { t } = useTranslations()
  const { dispatch } = useRedux()
  const { navigate } = useRouter()
  const [metricsData, setMetricsData] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState({})
  const isUserListModal = selectedColumn?.listType === 'user'
  const isMandalInspectionModal =
    selectedColumn?.listType === 'mandalInspection'
  const [pendingHostelsModal, setPendingHostelsModal] = useState(null)

  useEffect(() => {
    const loadMetrics = async () => {
      setMetricsData({ loader: true })
      const response = await getDashboardMetricsApi()
      setMetricsData({ loader: false, ...response?.data })
    }
    loadMetrics()
  }, [])

  const getMetricDetails = async ({ metric, pageNo = 1 }) => {
    const getMetricsApi = isMandalInspectionMetric(metric)
      ? getDashboardMetricsMandalsApi
      : getDashboardMetricsHostelsApi
    const response = await getMetricsApi({
      pageNo,
      params: { metric },
    })

    const data = response?.data
    if (isMandalInspectionMetric(metric) && data) {
      return {
        ...data,
        mandals: data.mandals ?? data.list ?? [],
      }
    }

    return data
  }

  const getUsersByRole = async ({ pageNo = 1, roleId }) => {
    const response = await getUserList({
      params: `${pageNo}?roleId=${roleId}`,
    })

    return response?.data
  }

  const openUserListModal = async ({ label, userRoleId, category }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getUsersByRole({ pageNo: 1, roleId: userRoleId })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
    setSelectedColumn({
      selected: true,
      chartData: {
        category,
        type: t(label),
      },
      title: label,
      listType: 'user',
      userRoleId,
      modalTitle: true,
    })
  }
  const openHostelsModal = async ({ metric, label, type }) => {
    if (!metric) return

    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getMetricDetails({ metric })

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
      listType: isMandalInspectionMetric(metric)
        ? 'mandalInspection'
        : 'hostel',
      modalTitle: true,
    })
  }

  const handleMetricValueClick = item => {
    if (item?.userRoleId) {
      openUserListModal({
        label: item?.label,
        userRoleId: item?.userRoleId,
        category: item?.category,
      })
      return
    }

    openHostelsModal({
      metric: item?.metric,
      label: item?.label,
    })
  }
  const handlePieChartClick = ({ e }) => {
    const point = e?.point

    if (navigatePieChartToInspection) {
      const statusByMetric = {
        INSPECTED_THIS_WEEK: tabKeys.complete,
        ACTIVE_INSPECTION_THIS_WEEK: tabKeys.active,
        YET_TO_BE_ASSIGNED_THIS_WEEK: tabKeys.unassignHostel,
      }
      const status = statusByMetric[point?.filterValue]

      if (status) {
        dispatch(
          setJobActiveTab({
            status,
            type: status === tabKeys.unassignHostel ? null : tabKeys.inspection,
          }),
        )
        navigate(pathName.JOBS, { state: { preserveJobTab: true } })
      }
      return
    }

    openHostelsModal({
      metric: point?.filterValue,
      label: point?.label,
      type: point?.name,
    })
  }

  const handleCloseModal = () => {
    setPendingHostelsModal(null)
    setSelectedColumn({
      selected: false,
      chartData: null,
    })
    setHostelsData({})
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))

    const respData = isUserListModal
      ? await getUsersByRole({
          pageNo: current,
          roleId: selectedColumn?.userRoleId,
        })
      : await getMetricDetails({
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
      category: 'dash_MetricsInspectionOfficer',
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

  const mandalSpecialOfficerMetrics = [
    {
      label: 'dash_TotalMandalSpecialOfficersOnboarded',
      value: metricsData?.totalMsoOnboarded,
      userRoleId: userWiseRole.mandalSpecialOfficer,
      category: 'user_MandalSpecialOfficer',
    },
    {
      label: 'dash_FullyMandalInspectionCompleted',
      value: metricsData?.fullyMandalInspectionCompletedCount,
      metric: 'FULLY_COMPLETED',
    },
    {
      label: 'dash_PartiallyMandalInspectionCompleted',
      value: metricsData?.partiallyMandalInspectionCompletedCount,
      metric: 'PARTIALLY_COMPLETED',
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

  const renderCount = value => value ?? '-'
  const renderMandalName = rowData =>
    mandalDetails.find(
      option =>
        option.value === (rowData?.mandalId ?? rowData?.mandal) ||
        option.label === (rowData?.mandalName ?? rowData?.mandal),
    )?.label ||
    rowData?.mandalName ||
    rowData?.mandal ||
    '-'

  const openPendingHostelsModal = rowData => {
    const pendingHostels = Array.isArray(rowData?.hostels)
      ? rowData?.hostels
      : []
    const normalizedHostels = pendingHostels.map(hostel =>
      typeof hostel === 'string' ? { hostelName: hostel } : hostel,
    )
    setPendingHostelsModal({
      hostels: normalizedHostels,
      mandalName: renderMandalName(rowData),
    })
  }

  const mandalInspectionColumns = [
    {
      title: t('dash_MandalName'),
      key: 'mandalName',
      render: renderMandalName,
    },
    {
      title: t('dash_TotalHostelsOnboarded'),
      key: 'totalHostelsOnboarded',
      dataIndex: 'totalHostelsOnboarded',
      render: rowData => renderCount(rowData || 0),
    },
    ...(selectedColumn?.categoryValue === 'FULLY_COMPLETED'
      ? [
          {
            title: t('dash_TotalInspectionsCompleted'),
            key: 'totalInspectionsCompleted',
            render: rowData =>
              renderCount(
                rowData?.totalInspectionsCompleted ??
                  rowData?.totalInspectionCompleted ??
                  rowData?.completedCount,
              ),
          },
        ]
      : [
          {
            title: t('dash_CompletedCount'),
            key: 'completedCount',
            dataIndex: 'totalInspectionsCompleted',
            render: rowData => renderCount(rowData || 0),
          },
          {
            title: t('dash_PendingHostelsCount'),
            key: 'pendingHostelsCount',
            render: rowData => {
              const pendingCount = renderCount(
                rowData?.pendingHostelsCount ?? rowData?.pendingHostelCount,
              )

              return (
                <ANTDButton
                  type="link"
                  className="p-0"
                  onClick={() => openPendingHostelsModal(rowData)}
                >
                  {pendingCount}
                </ANTDButton>
              )
            },
          },
        ]),
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

  const mandalPieChartData = mandalSpecialOfficerMetrics
    .filter(item => item.metric)
    .map(item => ({
      name: item.label,
      label: item.label,
      value: item.value ?? 0,
      filterValue: item.metric,
      color: item.metric === 'FULLY_COMPLETED' ? '#5BB764' : '#F59E0B',
    }))

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
      hideExportButton
      modalColumns={
        isUserListModal
          ? inspectionOfficerColumns
          : isMandalInspectionModal
            ? mandalInspectionColumns
            : null
      }
      modalDataKey={
        isUserListModal
          ? 'list'
          : isMandalInspectionModal
            ? 'mandals'
            : 'hostels'
      }
      showPaginationOnSinglePage={isUserListModal}
    >
      <ANTDModal
        title={`${t('dash_PendingHostelsCount')} (${pendingHostelsModal?.mandalName || ''})`}
        centered
        open={!!pendingHostelsModal}
        onCancel={() => setPendingHostelsModal(null)}
        footer={false}
        width={520}
        zIndex={1100}
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
      >
        {pendingHostelsModal?.hostels?.length ? (
          <ul className="pending-hostels-list">
            {pendingHostelsModal.hostels.map((hostel, index) => (
              <li key={hostel?.id ?? index}>
                {hostel?.lastName || hostel?.hostelName || hostel?.name || '-'}
              </li>
            ))}
          </ul>
        ) : (
          <div className="pending-hostels-list-empty">{t('txt_NoData')}</div>
        )}
      </ANTDModal>
      <div className="dashboard-module-surface metrics-dashboard-surface">
        <div
          className={`metrics-sections-grid ${
            navigatePieChartToInspection
              ? 'metrics-sections-grid--district-home'
              : ''
          }`}
        >
          <div className="metrics-sections-column">
            <MetricsSection
              className="metrics-hostel-card"
              title="dash_MetricsHostel"
              items={hostelMetrics}
              onValueClick={handleMetricValueClick}
              t={t}
            />
            <MetricsSection
              title="dash_MetricsInspectionOfficer"
              items={inspectionOfficerMetrics}
              startIndex={hostelMetrics.length}
              onValueClick={handleMetricValueClick}
              t={t}
            />
            <MetricsSection
              title="user_MandalSpecialOfficer"
              items={mandalSpecialOfficerMetrics}
              startIndex={hostelMetrics.length}
              onValueClick={handleMetricValueClick}
              t={t}
            />
          </div>
          <div className="metrics-pie-charts-grid">
            <MetricsPieChart
              data={hostelPieChartData}
              onPieChartClick={handlePieChartClick}
              t={t}
            />
            <MetricsPieChart
              title="dash_MandalWiseInspectionOverview"
              data={mandalPieChartData}
              onPieChartClick={({ e }) =>
                openHostelsModal({
                  metric: e?.point?.filterValue,
                  label: e?.point?.label,
                  type: e?.point?.name,
                })
              }
              t={t}
            />
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default MetricsDashboard
