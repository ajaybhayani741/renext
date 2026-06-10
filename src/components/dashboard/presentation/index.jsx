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
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import dashboard from '../container/dashboard.container'
import { cardList } from '../dashboard.description'
import DashboardCard from '../shared/DashboardCard'
import DashboardGrid from '../shared/DashboardGrid'
import DashboardHeader from '../shared/DashboardHeader'

const cardAesthetics = [
  { icon: <TeamOutlined />, accent: '#7C3AED', accentLight: '#EDE9FE' },
  { icon: <UserOutlined />, accent: '#059669', accentLight: '#D1FAE5' },
  { icon: <BookOutlined />, accent: '#D97706', accentLight: '#FEF3C7' },
  { icon: <BankOutlined />, accent: '#1D5BE0', accentLight: '#DBEAFE' },
  { icon: <MedicineBoxOutlined />, accent: '#7C3AED', accentLight: '#F3E8FF' },
  { icon: <ExperimentOutlined />, accent: '#0891B2', accentLight: '#CFFAFE' },
  { icon: <MedicineBoxOutlined />, accent: '#16A34A', accentLight: '#DCFCE7' },
  { icon: <BookOutlined />, accent: '#EA580C', accentLight: '#FFF7ED' },
  { icon: <CoffeeOutlined />, accent: '#DC2626', accentLight: '#FEE2E2' },
  { icon: <BankOutlined />, accent: '#1D5BE0', accentLight: '#DBEAFE' },
  { icon: <ProfileOutlined />, accent: '#7C3AED', accentLight: '#EDE9FE' },
  { icon: <ProfileOutlined />, accent: '#0891B2', accentLight: '#E0F2FE' },
  { icon: <ProfileOutlined />, accent: '#059669', accentLight: '#ECFDF5' },
]

const Dashboard = () => {
  const { t } = useTranslations()
  const { handleCardSelect } = dashboard()

  return (
    <div className="dashboard-container">
      <DashboardHeader
        title={t('job_Dashboard')}
        action={<FiscalYearSelect setDefault={false} />}
      />
      <DashboardGrid>
        {cardList.map((card, index) => {
          const aesthetic = cardAesthetics[index % cardAesthetics.length]
          const title = t(card.subLabel || card.label)
          const description = card.subLabel ? t(card.label) : ''

          return (
            <DashboardCard
              key={card.key}
              title={title}
              description={description}
              icon={aesthetic.icon}
              index={index}
              onClick={() => handleCardSelect(card.key)}
              accentColor={aesthetic.accent}
              accentLight={aesthetic.accentLight}
            />
          )
        })}
      </DashboardGrid>
      {/* </DashboardContext.Provider> */}
    </div>
  )
}

export default Dashboard
