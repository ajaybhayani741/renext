import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDForm, { ANTDFormItem } from '../../../shared/antd/ANTDForm'
import getFormInput from '../../../shared/form.description'
import { validationTag } from '../../../utils/customFunctions'
import { entries } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import resetPassword from '../container/resetPassword'
import { resetPasswordForm } from '../password.description'

function ResetPassword() {
  const { t } = useTranslations()
  const { form, onFinish, onFinishFailed, loading } = resetPassword()
  const lang = getItem('lang')

  return (
    <div>
      <ANTDForm
        name="reset-password"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {entries(resetPasswordForm(t)).map(([key, value]) => {
          const InputComponent = getFormInput({ inputType: value?.inputType })
          return (
            <ANTDFormItem
              key={key}
              label={value?.label}
              name={key}
              validateTrigger={value?.validateTrigger}
              rules={value?.rules}
              className={validationTag(lang)}
              dependencies={value?.dependencies}
            >
              <InputComponent />
            </ANTDFormItem>
          )
        })}
        <ANTDButton type="primary" htmlType="submit" loading={loading}>
          {t('btn_Submit')}
        </ANTDButton>
      </ANTDForm>
    </div>
  )
}

export default ResetPassword
