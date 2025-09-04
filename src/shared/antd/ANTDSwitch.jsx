import { Switch } from 'antd'
import React from 'react'

const ANTDSwitch = ({
  onChange,
  value,
  defaultChecked,
  defaultValue,
  disabled,
  checked,
  ...props
}) => {
  return (
    <Switch
      onChange={onChange}
      value={value}
      defaultChecked={defaultChecked}
      defaultValue={defaultValue}
      disabled={disabled}
      checked={checked}
      {...props}
    />
  )
}

export default ANTDSwitch
