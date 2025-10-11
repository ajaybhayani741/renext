import { BellFilled, PoweroffOutlined, UserOutlined } from '@ant-design/icons'

import LanguageSelector from './LanguageSelector'
import useTranslations from '../../../hooks/useTranslations'
import ANTDBadge from '../../../shared/antd/ANTDBadge'
import ANTDDropdown from '../../../shared/antd/ANTDDropdown'
import { noImage } from '../../../utils/icons'
import header from '../container/header.container'

const HeaderAction = () => {
  const { profileDetails, handleProfile, handleLogout } = header()
  const { t } = useTranslations()

  const items = [
    {
      key: 'profile',
      label: <label className="cursor-pointer">{t('txt_Profile')}</label>,
      icon: <UserOutlined />,
      onClick: handleProfile,
    },
    {
      key: 'logout',
      label: <label className="cursor-pointer">{t('btn_Logout')}</label>,
      icon: <PoweroffOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <div className="d-flex space-between align-center">
      <div className="notification-container">
        <BellFilled />
        <ANTDBadge count={0}>
          <span></span>
        </ANTDBadge>
      </div>
      <ANTDDropdown
        menu={{ items }}
        placement="bottomRight"
        trigger={['click']}
        arrow
      >
        <div className="profile-btn cursor-pointer">
          <img src={profileDetails?.profileUrl || noImage} alt="profile_img" />
        </div>
      </ANTDDropdown>
      <LanguageSelector />
    </div>
  )
}

export default HeaderAction
