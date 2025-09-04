import { Radio } from 'antd'
import React from 'react'

const ANTDRadio = ({ ...props }) => {
  return <Radio {...props} />
}

export default ANTDRadio

const ANTDRadioGroup = ({ ...props }) => {
  return <Radio.Group {...props} />
}
export { ANTDRadioGroup }
