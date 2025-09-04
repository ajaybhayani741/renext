import { Collapse } from 'antd'

import { CaretDownOutlined } from '../../utils/icons'
const { Panel } = Collapse

const ANTDCollapse = ({ ...props }) => {
  return (
    <Collapse
      {...props}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <CaretDownOutlined rotate={isActive ? -180 : 0} />
      )}
    />
  )
}

export default ANTDCollapse

const ANTDPanel = ({ ...props }) => {
  return <Panel {...props} />
}

export { ANTDPanel }
