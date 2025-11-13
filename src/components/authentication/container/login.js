import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { profileDetails } from '../../../redux/user_management/reducer'
import pathName from '../../../routing/pathName.constant'
import { LOGOUT, userWiseRole } from '../../../utils/constant'
import {
  entries,
  isEqual,
  removeFalsyValues,
  ternary,
} from '../../../utils/javascript'
import { getItem, setItem } from '../../../utils/localstorage'
import { loginApi, loginWithDaikinApi } from '../authentication.api'
import { infoBean } from '../login.description'

const login = () => {
  const { navigate, queryParams, location } = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoader, setPageLoader] = useState(false)
  const { dispatch } = useRedux()
  const FCMToken = getItem('FCMToken')
  const { inspectionOfficer } = userWiseRole

  useEffect(() => {
    const code = queryParams.get('code')
    if (code) {
      setPageLoader(true)
      handleDaikinRedirect(code)
    }
    if (location.state?.clearStore) {
      dispatch({ type: LOGOUT })
    }
  }, [])

  const handleDaikinRedirect = async code => {
    const resp = await loginWithDaikinApi({
      payload: { infoBean: { ...infoBean, fcmId: FCMToken }, code },
    })
    setPageLoader(false)
    if (!resp?.data?.userExists || resp?.error) {
      return notifyMethod.error({ message: 'msg_UserNotExist' })
    }
    setItem('token', resp?.data?.authToken)
    setItem('refreshToken', resp?.data?.refreshToken)
    setItem('userExists', resp?.data?.userExists)
    setItem('userData', JSON.stringify(resp?.data?.userProfile))
    navigate(pathName.HOME)
  }

  const onFinish = async value => {
    setLoading(true)
    const payload = { ...value, infoBean: { ...infoBean, fcmId: FCMToken } }
    const response = await loginApi({
      payload,
    })
    setLoading(false)

    if (response?.data?.data?.userExists) {
      setItem('token', response?.data?.data?.authToken)
      setItem('refreshToken', response?.data?.data?.refreshToken)
      setItem('userExists', response?.data?.data?.userExists)
      setItem('userData', JSON.stringify(response?.data?.data?.userProfile))
      dispatch(profileDetails(response?.data?.data?.userProfile))
      if (
        isEqual(response?.data?.data?.userProfile?.roleId, inspectionOfficer)
      ) {
        navigate(pathName.JOBS)
        return
      }
      if (location?.state?.params?.jobId) {
        const paramObj = removeFalsyValues(location.state.params)
        let params = ''
        entries(paramObj).forEach(([key, value], i) => {
          params += `${ternary(isEqual(i, 0), '?', '&')}${key}=${value}`
        })
        navigate(`${pathName.JOBS}${params}`)
      } else {
        navigate(pathName.HOME)
      }
    } else {
      notifyMethod.error({ message: 'msg_UserNotExist' })
    }
  }

  const handleForgotPassword = () => {
    // navigate(pathName.FORGOT_PASSWORD)
    notifyMethod.warning({
      message: 'msg_ForgetPasswordContactDistrictCollector',
    })
  }

  const onFinishFailed = () => {}

  return {
    loading,
    pageLoader,
    onFinish,
    onFinishFailed,
    handleForgotPassword,
  }
}

export default login
