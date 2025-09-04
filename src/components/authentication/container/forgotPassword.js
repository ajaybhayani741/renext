import { useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import pathName from '../../../routing/pathName.constant'
import { forgotPasswordApi } from '../authentication.api'

const forgotPassword = () => {
  const { navigate } = useRouter()
  const { dispatch } = useRedux()
  const [loading, setLoading] = useState(false)

  const onFinish = async formValue => {
    setLoading(true)
    const response = await forgotPasswordApi({ userName: formValue?.username })
    setLoading(false)
    if (response?.data) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: 'msg_CheckMailAndResetPassword',
          success: true,
        }),
      )
      navigate(pathName.LOGIN)
    } else if (response?.error?.errorMsg) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: response?.error?.errorMsg,
        }),
      )
    }
  }

  const onFinishFailed = () => {}

  const handleBackToLogin = () => {
    navigate(pathName.LOGIN)
  }

  return { onFinish, onFinishFailed, loading, handleBackToLogin }
}

export default forgotPassword
