import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

interface DashboardGridProps {
  children: ReactNode
  className?: string
}

const DashboardGrid = ({ children, className = '' }: DashboardGridProps) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
      },
    }}
    className={`dashboard-grid ${className}`}
  >
    {children}
  </motion.div>
)

export default memo(DashboardGrid)
