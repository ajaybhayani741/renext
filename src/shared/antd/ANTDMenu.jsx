import { Menu } from 'antd'
import { forwardRef } from 'react'

const ANTDMenu = forwardRef((props, ref) => {
  return <Menu {...props} ref={ref} />
})

export default ANTDMenu
