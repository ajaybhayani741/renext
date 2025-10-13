import classNames from 'classnames'

import HeaderAction from './HeaderAction'
import WelcomeUser from './WelcomeUser'
import { ANTDHeader } from '../../../shared/antd/ANTDLayout'
import { MenuOutlined } from '../../../utils/icons'

function Header({ setToggleMenu, collapsed }) {
  return (
    <ANTDHeader
      className={classNames({
        'collapsed-header': collapsed,
      })}
    >
      <div className="d-flex">
        <div className="nav-toggle">
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
