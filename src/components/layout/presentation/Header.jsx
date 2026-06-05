import classNames from 'classnames'

import HeaderAction from './HeaderAction'
import WelcomeUser from './WelcomeUser'
import { ANTDHeader } from '../../../shared/antd/ANTDLayout'
import { LeftOutlined, MenuOutlined } from '../../../utils/icons'
import { useNavigate } from 'react-router-dom'

function Header({ setToggleMenu, collapsed }) {
  const navigate = useNavigate()
  return (
    <ANTDHeader
      className={classNames({
        'collapsed-header': collapsed,
      })}
    >
      <div className="d-flex">
        <div className="nav-toggle" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <LeftOutlined 
            onClick={() => navigate(-1)} 
            style={{ fontSize: '20px', cursor: 'pointer', color: 'var(--color-primary-dark)' }} 
            title="Go Back" 
          />
          <MenuOutlined onClick={() => setToggleMenu(true)} />
        </div>
        <div className="right-content d-flex space-between align-center">
          <WelcomeUser />
          <HeaderAction />
        </div>
      </div>
    </ANTDHeader>
  )
}

export default Header
