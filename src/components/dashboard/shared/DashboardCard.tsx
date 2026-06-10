import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

interface DashboardCardProps {
  title: string
  description?: string
  icon: ReactNode
  index: number
  onClick: () => void
  accentColor?: string
  accentLight?: string
}

const DashboardCard = ({
  title,
  description,
  icon,
  index,
  onClick,
  accentColor = '#1D5BE0',
  accentLight = '#E8EEFB',
}: DashboardCardProps) => (
  <motion.button
    type="button"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
    whileHover={{ y: -8, boxShadow: `0 20px 50px ${accentColor}20` }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="dashboard-module-card host-card"
    aria-label={title}
  >
    <span
      className="dashboard-card-blob dashboard-card-blob-primary"
      style={{ background: accentLight }}
    />
    <span
      className="dashboard-card-blob dashboard-card-blob-secondary"
      style={{ background: `${accentColor}18` }}
    />
    <span
      className="dashboard-card-blob dashboard-card-blob-tertiary"
      style={{ background: `${accentColor}0A` }}
    />

    <span className="dashboard-card-content">
      <span
        className="dashboard-card-icon"
        style={{ background: `${accentColor}14`, color: accentColor }}
      >
        {icon}
      </span>
      <span className="dashboard-card-copy">
        <span className="dashboard-card-title">{title}</span>
        {description ? (
          <span className="dashboard-card-description">{description}</span>
        ) : null}
      </span>
    </span>
  </motion.button>
)

export default memo(DashboardCard)
