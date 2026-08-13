import { useEffect, useState } from 'react'

import '../dashboard.scss'

import DashboardWrapper from './DashboardWrapper'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import pathName from '../../../routing/pathName.constant'
import { userWiseRole } from '../../../utils/constant'
import { tabKeys } from '../../jobs/jobs.description'
import { getUserList } from '../../userManagement/user.api'
import { inspectionOfficerMandalOptions } from '../../userManagement/user.description'
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

const MetricsPieChart = ({ data, onPieChartClick, t }) => (
  <section className="metrics-pie-chart-card">
    <h3 className="metrics-pie-chart-title">
      {t('dash_HostelInspectionOverview')}
    </h3>
    <CommonPieChart
      data={data.map(item => ({
        ...item,
        name: t(item.name),
        category: t('dash_HostelInspectionOverview'),
      }))}
      size="70%"
      showValueLabels={true}
      compact
      handleChartClick={onPieChartClick}
      name="dash_HostelInspectionOverview"
    />
  </section>
)

const MetricsDashboard = ({ navigatePieChartToInspection = false }) => {
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
        inspectionOfficerMandalOptions.find(
          option => option.value === rowData?.mandal,
        )?.label ||
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
      modalColumns={isUserListModal ? inspectionOfficerColumns : null}
      modalDataKey={isUserListModal ? 'list' : 'hostels'}
      showPaginationOnSinglePage={isUserListModal}
    >
      <div className="dashboard-module-surface metrics-dashboard-surface">
        <div className="metrics-sections-grid">
          <div className="metrics-sections-column">
            <MetricsSection
              className="metrics-hostel-card"
              title="dash_MetricsHostel"
              items={hostelMetrics}
              onValueClick={handleMetricValueClick}
              t={t}
            >
              <MetricsPieChart
                data={hostelPieChartData}
                onPieChartClick={handlePieChartClick}
                t={t}
              />
            </MetricsSection>
            <MetricsSection
              title="dash_MetricsInspectionOfficer"
              items={inspectionOfficerMetrics}
              startIndex={hostelMetrics.length}
              onValueClick={handleMetricValueClick}
              t={t}
            />
            {/* {navigatePieChartToInspection && ( */}
            <MetricsSection
              title="user_MandalSpecialOfficer"
              items={mandalSpecialOfficerMetrics}
              startIndex={hostelMetrics.length}
              onValueClick={handleMetricValueClick}
              t={t}
              className="mb-5"
            />
            {/* )} */}
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default MetricsDashboard
