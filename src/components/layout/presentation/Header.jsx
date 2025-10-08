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
        <div className="mr-10" onClick={handleClick}>
          <img src={logo} alt="Mat Next" height={62} width={140} />
        </div>
        <div className="header-content space-between">
          <WelcomeUser />
          <HeaderAction />
        </div>
      </div>
    </ANTDHeader>
  )
}

export default Header
