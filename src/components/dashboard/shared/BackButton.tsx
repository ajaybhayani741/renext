import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const BackButton = ({
  onClick,
  className = '',
  label = 'Back',
}: {
  onClick: () => void
  className?: string
  label?: string
}) => (
  <Button
    icon={<ArrowLeftOutlined />}
    onClick={onClick}
    type="text"
    className={`font-medium text-slate-500 hover:!text-slate-800 ${className}`}
  >
    {label}
  </Button>
)

export default BackButton
