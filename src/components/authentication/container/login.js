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
import {
  generateLoginOtpApi,
  loginWithDaikinApi,
  verifyLoginOtpApi,
} from '../authentication.api'
import { infoBean } from '../login.description'

const login = () => {
  const { navigate, queryParams, location } = useRouter()
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState('')
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

  const redirectAfterLogin = userProfile => {
    if (isEqual(userProfile?.roleId, inspectionOfficer)) {
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
      return
    }
    navigate(pathName.HOME)
  }

  const getResponseData = response => response?.data?.data || response?.data

  const getResponseMessage = response =>
    response?.data?.errorMsg ||
    response?.error?.errorMsg ||
    response?.error?.error?.errorMsg ||
    response?.message

  const generateOtp = async ({ phoneNumber }) => {
    setLoading(true)
    const response = await generateLoginOtpApi({
      payload: { phoneNumber },
    })
    setLoading(false)
    const responseData = getResponseData(response)

    if (responseData?.success) {
      setOtpSent(true)
      setVerifiedPhoneNumber(phoneNumber)
      notifyMethod.success({ message: 'OTP sent successfully' })
      return
    }
    notifyMethod.error({
      message: getResponseMessage(response) || 'Unable to generate OTP',
    })
  }

  const verifyOtp = async value => {
    if (value?.phoneNumber !== verifiedPhoneNumber) {
      await generateOtp({ phoneNumber: value?.phoneNumber })
      return
    }

    setLoading(true)
    const response = await verifyLoginOtpApi({
      payload: {
        phoneNumber: value?.phoneNumber,
        otp: value?.otp,
        infoBean: { ...infoBean, fcmId: FCMToken },
      },
    })
    setLoading(false)
    const responseData = getResponseData(response)

    if (responseData?.success) {
      setItem('token', responseData?.authToken)
      setItem('refreshToken', responseData?.refreshToken)
      setItem('userExists', true)
      setItem('userData', JSON.stringify(responseData?.userProfile))
      dispatch(profileDetails(responseData?.userProfile))
      redirectAfterLogin(responseData?.userProfile)
      return
    }
    notifyMethod.error({ message: 'Invalid OTP' })
  }

  const onFinish = async value => {
    if (otpSent) {
      await verifyOtp(value)
      return
    }
    await generateOtp(value)
  }


  const onFinishFailed = () => {}

  return {
    loading,
    otpSent,
    pageLoader,
    onFinish,
    onFinishFailed,
    verifiedPhoneNumber,
  }
}

export default login


