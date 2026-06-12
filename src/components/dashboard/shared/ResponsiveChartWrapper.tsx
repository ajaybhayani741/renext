import { ReactNode, memo } from 'react'

interface ResponsiveChartWrapperProps {
  children: ReactNode
  minWidth?: number
}

const ResponsiveChartWrapper = ({
  children,
  minWidth = 480,
}: ResponsiveChartWrapperProps) => (
  <div className="dashboard-chart-scroll">
    <div className="dashboard-chart-canvas" style={{ minWidth }}>
      {children}
    </div>
  </div>
)

export default memo(ResponsiveChartWrapper)
