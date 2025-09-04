import { Modal } from 'antd'

const ANTDModal = ({ destroyOnClose, ...props }) => {
  return <Modal destroyOnClose={destroyOnClose} {...props} />
}

export default ANTDModal
