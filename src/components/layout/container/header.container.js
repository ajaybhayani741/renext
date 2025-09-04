import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import pathName from '../../../routing/pathName.constant'
import { getItem, removeItem } from '../../../utils/localstorage'
import { logoutApi } from '../../authentication/authentication.api'

const header = () => {
  const { navigate } = useRouter()

  const { selector } = useRedux()
  const profileDetails = selector(state => state.user?.profile_details)
  const handleLogout = async () => {
    const refreshToken = getItem('refreshToken')
    await logoutApi({ payload: { refreshToken } })
    // const response = await logoutApi({ payload: { refreshToken } })
    // if (response?.data?.data?.success) {
    navigate(pathName.LOGIN, { state: { clearStore: true } })
    removeItem('token')
    removeItem('refreshToken')
    removeItem('nonLoginAuthToken')
    removeItem('userExists')
    removeItem('userData')
    removeItem('adminId')
    sessionStorage.clear()
    // }
  }

  const handleProfile = () => {
    navigate(pathName.PROFILE)
  }

  return { handleLogout, handleProfile, profileDetails }
}

export default header
