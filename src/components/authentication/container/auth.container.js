import { getItem, setItem } from '../../../utils/localstorage'
import { refreshAuthtokenApi } from '../authentication.api'
import { infoBean } from '../login.description'

const auth = () => {
  const refreshAuth = async () => {
    const refreshToken = getItem('refreshToken')
    const FCMToken = getItem('FCMToken')
    infoBean.fcmId = FCMToken
    const response = await refreshAuthtokenApi({
      payload: { refreshToken, infoBean },
    })
    if (response?.data?.data) {
      setItem('token', response?.data?.data?.authToken)
      setItem('refreshToken', response?.data?.data?.refreshToken)
    }
    return response?.data?.data
  }

  return { refreshAuth }
}

export default auth
