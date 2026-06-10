import { ReactNode, memo } from 'react'

import AnimatedCard from './AnimatedCard'

interface StatsCardProps {
  label: string
  value: ReactNode
  index?: number
}

const StatsCard = ({ label, value, index = 0 }: StatsCardProps) => (
  <AnimatedCard className="dashboard-stat-card host-kpi" index={index}>
    <span className="dashboard-stat-label">{label}</span>
    <span className="dashboard-stat-value">{value}</span>
  </AnimatedCard>
)

export default memo(StatsCard)
