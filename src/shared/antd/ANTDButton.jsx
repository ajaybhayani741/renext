import { Button } from 'antd'
import React from 'react'

function ANTDButton({ loading, ...props }) {
  return <Button loading={loading} {...props} />
}

export default ANTDButton
