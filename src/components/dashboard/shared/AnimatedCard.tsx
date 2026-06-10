import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  index?: number
  onClick?: () => void
}

const AnimatedCard = ({
  children,
  className = '',
  index = 0,
  onClick,
}: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
    whileTap={onClick ? { scale: 0.97 } : undefined}
    onClick={onClick}
    className={className}
  >
    {children}
  </motion.div>
)

export default memo(AnimatedCard)
