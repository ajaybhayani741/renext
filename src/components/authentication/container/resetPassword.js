import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import pathName from '../../../routing/pathName.constant'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { resetPasswordApi } from '../authentication.api'

const resetPassword = () => {
  const { dispatch } = useRedux()
  const { navigate, queryParams } = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useFormFn()
  const uuid = queryParams.get('uuid')

  useEffect(() => {
    if (!uuid) {
      navigate(pathName.LOGIN)
    }
  }, [])

  const onFinish = async formValue => {
    setLoading(true)
    const payload = { uuId: uuid, ...formValue }
    const response = await resetPasswordApi({ payload })
    setLoading(false)
    if (response?.data?.data) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: 'msg_PasswordUpdatedSuccessfully',
          success: true,
        }),
      )
      navigate(pathName.LOGIN)
    } else {
      // response?.data?.error?.errorMsg && dispatch(setPopUpMessageData({ modal: true, message: [response?.data?.error?.errorMsg] }))
      navigate(pathName.FORGOT_PASSWORD)
    }
    form.setFieldsValue({ password: '', confirmPassword: '' })
  }
  const onFinishFailed = () => {}

  return { form, onFinish, onFinishFailed, loading }
}

export default resetPassword
