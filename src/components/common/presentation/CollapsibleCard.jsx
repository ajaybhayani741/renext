import ANTDCollapse from '../../../shared/antd/ANTDCollapse'

const CollapsibleCard = ({ className = '', items = [] }) => {
  return (
    <ANTDCollapse
      bordered={false}
      className={`secondary-collapse ${className}`}
      items={items}
    />
  )
}

export default CollapsibleCard
