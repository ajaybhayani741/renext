/* eslint-disable jsx-a11y/anchor-has-content */
import { BellOutlined } from '@ant-design/icons'

import LanguageSelector from './LanguageSelector'
import ANTDBadge from '../../../shared/antd/ANTDBadge'
import header from '../container/header.container'

const HeaderAction = () => {
  const { notificationCount, onNotificationClick } = header()

  return (
    <div className="header-actions d-flex align-center">
      <button
        type="button"
        className="header-icon-btn notification-btn"
        onClick={onNotificationClick}
        aria-label="Notifications"
      >
        <ANTDBadge count={notificationCount || 0} size="small" offset={[2, -2]}>
          <BellOutlined />
        </ANTDBadge>
      </button>

      <LanguageSelector />
    </div>
  )
}

export default HeaderAction
