import '../dashboard.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import dashboard from '../container/dashboard.container'
import { cardList } from '../dashboard.description'

const Dashboard = () => {
  const { t } = useTranslations()
  const { handleCardSelect } = dashboard()

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between">
        <h2 className="page-title">{t('job_Dashboard')}</h2>
        {/* <DashboardContext.Provider value={{ handleTabChange, getFilterValue }}> */}
        <FiscalYearSelect className="ml-auto" setDefault={false} />
      </div>
      <div className="card-container">
        {cardList.map(card => {
          return (
            <ANTDCard
              key={card.key}
              className="card"
              onClick={() => handleCardSelect(card.key)}
            >
              <h3>{t(card.label)}</h3>
              <h4>{t(card.subLabel)}</h4>
            </ANTDCard>
          )
        })}
      </div>
      {/* </DashboardContext.Provider> */}
    </div>
  )
}

export default Dashboard
