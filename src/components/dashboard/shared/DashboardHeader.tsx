import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

interface DashboardHeaderProps {
  title: string
  action?: ReactNode
  subtitle?: string
}

const DashboardHeader = ({ title, action, subtitle }: DashboardHeaderProps) => (
  <motion.header
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="dashboard-modern-header"
  >
    <div className="dashboard-modern-header-copy">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    {action ? <div className="dashboard-modern-header-action">{action}</div> : null}
  </motion.header>
)

export default memo(DashboardHeader)
