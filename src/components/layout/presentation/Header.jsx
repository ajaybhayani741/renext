import DigitalClockWithShift from './DigitalClockWithShift'
import HeaderAction from './HeaderAction'
import WelcomeUser from './WelcomeUser'
import { ANTDHeader } from '../../../shared/antd/ANTDLayout'
import { userWiseRole } from '../../../utils/constant'
import { MenuOutlined } from '../../../utils/icons'
import { include } from '../../../utils/javascript'
import header from '../container/header.container'

function Header({ setToggleMenu }) {
  const { profileDetails } = header()
  const { roleId } = {
    ...profileDetails,
  }

  const { admin, storeOwner, store, storeEmployee, storeManager } = userWiseRole

  return (
    <ANTDHeader>
      <div className="d-flex">
        <div className="nav-toggle">
          <MenuOutlined onClick={() => setToggleMenu(true)} />
        </div>
        <div className="header-content space-between">
          <WelcomeUser />
          {include(
            [admin, storeOwner, store, storeEmployee, storeManager],
            roleId,
          ) && (
            <DigitalClockWithShift
              showShiftSelector={include([storeEmployee], roleId)}
            />
          )}
          <HeaderAction />
        </div>
      </div>
    </ANTDHeader>
  )
}

export default Header
