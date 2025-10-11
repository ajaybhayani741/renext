import HeaderAction from './HeaderAction'
import WelcomeUser from './WelcomeUser'
import { ANTDHeader } from '../../../shared/antd/ANTDLayout'
import { MenuOutlined } from '../../../utils/icons'

function Header({ setToggleMenu }) {
  return (
    <ANTDHeader>
      <div className="d-flex">
        <div className="nav-toggle">
          <MenuOutlined onClick={() => setToggleMenu(true)} />
        </div>
        <div className="header-content space-between">
          <WelcomeUser />
          {/* {include(
            [admin, storeOwner, store, storeEmployee, storeManager],
            roleId,
          ) && (
            <DigitalClockWithShift
              showShiftSelector={include([storeEmployee], roleId)}
            />
          )} */}
          <HeaderAction />
        </div>
      </div>
    </ANTDHeader>
  )
}

export default Header
