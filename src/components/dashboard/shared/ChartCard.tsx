import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

const ChartCard = ({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    whileHover={{ y: -2 }}
    className={`host-chart-container ${className}`}
  >
    {title ? (
      <h3 className="text-base font-semibold text-foreground mb-5">{title}</h3>
    ) : null}
    <div className="dashboard-chart-scroll">
      <div className="dashboard-chart-canvas">
        {children}
      </div>
    </div>
  </motion.div>
)

export default memo(ChartCard)
