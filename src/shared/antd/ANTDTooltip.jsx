import { Tooltip } from 'antd'

function ANTDToolTip({ children, title, mouseEnterDelay = 0.7, ...rest }) {
  return (
    <Tooltip
      title={title || children}
      {...rest}
      mouseEnterDelay={mouseEnterDelay}
    >
      {children}
    </Tooltip>
  )
}
export default ANTDToolTip
