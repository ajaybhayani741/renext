import { Modal } from 'antd'

const ANTDModal = ({ destroyOnClose, ...props }) => {
  return <Modal destroyOnHidden={destroyOnClose} {...props} />
}

export default ANTDModal
