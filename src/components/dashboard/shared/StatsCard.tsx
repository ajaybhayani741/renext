import { ReactNode, memo } from 'react'

import AnimatedCard from './AnimatedCard'

interface StatsCardProps {
  label: string
  value: ReactNode
  index?: number
  onValueClick?: () => void
}

const StatsCard = ({
  label,
  value,
  index = 0,
  onValueClick,
}: StatsCardProps) => {
  const hasClickableValue = Boolean(onValueClick) && value

  return (
    <AnimatedCard className="dashboard-stat-card host-kpi" index={index}>
      <span className="dashboard-stat-label">{label}</span>
      <span
        className={`dashboard-stat-value ${
          hasClickableValue ? 'dashboard-stat-value-clickable' : ''
        }`}
        onClick={hasClickableValue ? onValueClick : undefined}
        role={hasClickableValue ? 'button' : undefined}
      >
        {value}
      </span>
    </AnimatedCard>
  )
}

export default memo(StatsCard)
