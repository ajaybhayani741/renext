import '../dashboard.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDTab from '../../../shared/antd/ANTDTab'
import dashboard from '../container/dashboard.conainer'
import { tabKeys } from '../dashboard.description'
import DashboardContext from '../DashboardContext'

const Dashboard = () => {
  const { t } = useTranslations()
  const { handleTabChange, activeTab, getFilterValue } = dashboard()

  const tabList = [
    {
      label: 'dash_Overview',
      key: tabKeys.overview,
      children: <></>,
    },
    {
      label: 'dash_Revenue',
      key: tabKeys.revenue,
      children: <></>,
    },
    {
      label: 'dash_CostOfGoodsSold',
      key: tabKeys.costOfGoodsSold,
      children: <></>,
    },
    {
      label: 'menu_ProfitLoss',
      key: tabKeys.profitLoss,
      children: <></>,
    },
  ]

  return (
    <>
      <h2 className="page-title">{t('job_Dashboard')}</h2>
      <DashboardContext.Provider value={{ handleTabChange, getFilterValue }}>
        <ANTDTab
          activeKey={activeTab}
          items={tabList.map(({ key, addHeader, ...item }) => ({
            ...item,
            key,
            label: t(item.label),
          }))}
          centered
          onChange={handleTabChange}
        />
      </DashboardContext.Provider>
    </>
  )
}

export default Dashboard
