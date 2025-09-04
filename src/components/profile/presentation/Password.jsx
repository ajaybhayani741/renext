import { useState } from 'react'

import { notifyMethod } from '../../../App'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import pathName from '../../../routing/pathName.constant'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDForm, { useFormFn } from '../../../shared/antd/ANTDForm'
import { changePasswordApi } from '../../authentication/authentication.api'
import FormLayout from '../../common/presentation/FormLayout'

const Password = () => {
  const form = useFormFn()
  const { t } = useTranslations()
  const { navigate } = useRouter()
  const [loading, setLoading] = useState(false)

  const onFinish = async values => {
    setLoading(true)
    const response = await changePasswordApi({
      payload: { password: values?.newPassword },
    })
    setLoading(false)
    if (response?.data?.data?.success) {
      notifyMethod.success({ message: t('msg_PasswordUpdatedSuccessfully') })
      form.resetFields()
      navigate(pathName.HOME)
    }
  }

  const formFieldAttributes = {
    newPassword: {
      label: 'newPassword',
      inputType: 'password',
      xs: 24,
      required: true,
    },
    confirmPassword: {
      label: 'confirmPassword',
      inputType: 'password',
      xs: 24,
      required: true,
      rules: [
        {},
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve()
            }
            return Promise.reject(
              new Error(t('msg_NewPasswordAndConfirmPasswordAreNotMatching')),
            )
          },
        }),
      ],
    },
  }

  return (
    <>
      <ANTDForm
        name="login"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{}}
        className="m-5-percent"
      >
        <FormLayout formFieldAttributes={formFieldAttributes} />

        <ANTDButton loading={loading} type="primary" htmlType="submit">
          {t('btn_Update')}
        </ANTDButton>
      </ANTDForm>
    </>
  )
}

export default Password
