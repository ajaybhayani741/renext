import { useEffect } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { setNotificationList } from '../../../redux/app/reducer'
import pathName from '../../../routing/pathName.constant'
import { userWiseRole } from '../../../utils/constant'
import { isEqual } from '../../../utils/javascript'
import { getItem, removeItem } from '../../../utils/localstorage'
import { logoutApi } from '../../authentication/authentication.api'
import { getNotificationsApi } from '../../notifications/notification.api'

const header = () => {
  const { navigate } = useRouter()
  const { dispatch, selector } = useRedux()
  const profileDetails = selector(state => state.user?.profile_details)
  const notificationCount =
    selector(state => state.app.notificationsList?.unreadCount) || 0

  useEffect(() => {
    getNotification()
  }, [])

  const getNotification = async () => {
    const response = await getNotificationsApi({ pageNo: 1 })
    if (response?.data) {
      dispatch(setNotificationList(response?.data))
    }
  }

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

  const onNotificationClick = () => {
    if (isEqual(profileDetails?.roleId, userWiseRole.inspectionOfficer)) {
      navigate(pathName.NOTIFICATIONS)
    }
  }

  return {
    handleLogout,
    handleProfile,
    profileDetails,
    notificationCount: isEqual(
      profileDetails?.roleId,
      userWiseRole.inspectionOfficer,
    )
      ? notificationCount
      : 0,
    onNotificationClick,
  }
}

export default header
