import { motion } from 'framer-motion'
import React from 'react'

interface CustomLegendProps {
  mapping: Record<string, string>
}

const CustomLegend: React.FC<CustomLegendProps> = ({ mapping }) => {
  return (
    <motion.div
      className="dashboard-custom-legend"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Object.entries(mapping).map(([short, long]) => (
        <div key={short} className="dashboard-custom-legend-item">
          <span>{short}:</span>
          <span>{long}</span>
        </div>
      ))}
    </motion.div>
  )
}

export default React.memo(CustomLegend)
