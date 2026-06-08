import '../dashboard.scss'

import {
  BankOutlined,
  BookOutlined,
  CoffeeOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import dashboard from '../container/dashboard.container'
import { cardList } from '../dashboard.description'

// Utility to assign random pastel colors/icons to cards if not provided
const cardAesthetics = [
  { icon: <TeamOutlined />, color: 'var(--color-pastel-purple)', iconColor: '#9333EA' },
  { icon: <UserOutlined />, color: 'var(--color-pastel-blue)', iconColor: '#2563EB' },
  { icon: <BookOutlined />, color: 'var(--color-pastel-orange)', iconColor: '#EA580C' },
  { icon: <BankOutlined />, color: 'var(--color-pastel-green)', iconColor: '#16A34A' },
  { icon: <MedicineBoxOutlined />, color: 'var(--color-pastel-red)', iconColor: '#DC2626' },
  { icon: <CoffeeOutlined />, color: 'var(--color-pastel-yellow)', iconColor: '#CA8A04' },
  { icon: <ExperimentOutlined />, color: 'var(--color-pastel-blue)', iconColor: '#0284C7' },
  { icon: <ProfileOutlined />, color: 'var(--color-pastel-purple)', iconColor: '#7C3AED' },
]

const Dashboard = () => {
  const { t } = useTranslations()
  const { handleCardSelect } = dashboard()

  return (
    <div className="dashboard-container">
      <div className="flex flex-wrap items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white gap-4 shadow-sm mb-6 sticky top-0 z-10 -mx-4 md:-mx-8">
        <h1 className="text-2xl font-bold text-slate-800 m-0">{t('job_Dashboard')}</h1>
        <FiscalYearSelect setDefault={false} />
      </div>
      <div className="card-container">
        {cardList.map((card, index) => {
          const aesthetic = cardAesthetics[index % cardAesthetics.length]
          return (
            <ANTDCard
              key={card.key}
              className="card"
              onClick={() => handleCardSelect(card.key)}
              style={{
                '--card-blob-color': aesthetic.color,
                '--card-icon-color': aesthetic.iconColor,
                borderColor: aesthetic.color
              }}
            >
              <div className="card-icon" style={{ borderColor: aesthetic.color }}>
                {aesthetic.icon}
              </div>
              <h3>{t(card.subLabel || card.label)}</h3>
              {card.subLabel && <h4>{t(card.label)}</h4>}
            </ANTDCard>
          )
        })}
      </div>
      {/* </DashboardContext.Provider> */}
    </div>
  )
}

export default Dashboard
