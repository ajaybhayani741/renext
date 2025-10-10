import HeaderAction from './HeaderAction'
import WelcomeUser from './WelcomeUser'
import useRouter from '../../../hooks/useRouter'
import { ANTDHeader } from '../../../shared/antd/ANTDLayout'
import configData from '../../../utils/config'

function Header({ setToggleMenu }) {
  const { logo } = configData
  const { navigate } = useRouter()

  const handleClick = () => {
    navigate('/')
  }

  return (
    <ANTDHeader>
      <div className="d-flex">
        <div className="header-content space-between">
          <div onClick={handleClick}>
            <img
              src={logo}
              alt="Mat Next"
              height={55}
              width={170}
              className="cursor-pointer"
            />
          </div>
          <WelcomeUser />
          <HeaderAction />
        </div>
      </div>
    </ANTDHeader>
  )
}

export default Header
