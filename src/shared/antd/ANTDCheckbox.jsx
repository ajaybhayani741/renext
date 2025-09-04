import { Checkbox } from 'antd'

function ANTDCheckbox({ ...props }) {
  return <Checkbox {...props} />
}

function ANTDCheckboxGroup({ ...props }) {
  const CheckboxGroup = Checkbox.Group
  return <CheckboxGroup {...props} />
}

export default ANTDCheckbox
export { ANTDCheckboxGroup }
