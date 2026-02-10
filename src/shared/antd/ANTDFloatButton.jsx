import { FloatButton } from 'antd'
import React from 'react'

function ANTDFloatButton({ ...props }) {
  return <FloatButton {...props} />
}

function ANTDFloatButtonGroup({ ...props }) {
  return <FloatButton.Group {...props} />
}

export default ANTDFloatButton
export { ANTDFloatButtonGroup }
