import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
} from '../../../shared/antd/ANTDForm'
import ANTDRow from '../../../shared/antd/ANTDRow'
import getFormInput from '../../../shared/form.description'
import { validationTag } from '../../../utils/customFunctions'
import { entries } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import forgotPassword from '../container/forgotPassword'
import { forgotInitial, forgotPasswordForm } from '../password.description'

function ForgotPassword() {
  const form = useFormFn()
  const { t } = useTranslations()
  const { onFinish, onFinishFailed, loading, handleBackToLogin } =
    forgotPassword()
  const lang = getItem('lang')

  return (
    <div>
      <div className="mb-20">{t('msg_PleaseEnterRegisteredUsername')}</div>
      <ANTDForm
        name="forgot-password"
        initialValues={forgotInitial}
        form={form}
        onFinish={onFinish}
        layout="vertical"
        onFinishFailed={onFinishFailed}
      >
        {entries(forgotPasswordForm(t)).map(([key, value]) => {
          const InputComponent = getFormInput({ inputType: value?.inputType })
          return (
            <ANTDFormItem
              key={key}
              label={value?.label}
              name={key}
              validateTrigger={value?.validateTrigger}
              rules={value?.rules}
              className={validationTag(lang)}
            >
              <InputComponent />
            </ANTDFormItem>
          )
        })}
        <ANTDRow>
          <ANTDColumn md={10}>
            <ANTDButton type="primary" htmlType="submit" loading={loading}>
              {t('btn_Submit')}
            </ANTDButton>
          </ANTDColumn>
          <ANTDColumn md={14} className="d-flex flex-end align-center">
            <h4
              aria-hidden="true"
              className="primary-color font-bold cursor-pointer"
              onClick={handleBackToLogin}
            >
              {t('auth_BackToLogin')}
            </h4>
          </ANTDColumn>
        </ANTDRow>
      </ANTDForm>
    </div>
  )
}

export default ForgotPassword
