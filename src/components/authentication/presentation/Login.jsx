import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
} from '../../../shared/antd/ANTDForm'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import getFormInput from '../../../shared/form.description'
import { validationTag } from '../../../utils/customFunctions'
import { entries } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import login from '../container/login'
import { formData, initialValues } from '../login.description'

function Login() {
  const form = useFormFn()
  const { t } = useTranslations()
  const {
    loading,
    pageLoader,
    onFinish,
    onFinishFailed,
    handleForgotPassword,
  } = login()
  const lang = getItem('lang')

  if (pageLoader)
    return (
      <div className="d-flex justify-center">
        <ANTDSpin size="large" />
      </div>
    )

  return (
    <div className="login-panel">
      <div className="login-head">
        <h2 className="login-title">{t('txt_Welcome')}</h2>
        <p className="login-subtitle">Sign in to your account to continue.</p>
      </div>

      <ANTDForm
        name="login"
        initialValues={initialValues}
        form={form}
        onFinish={onFinish}
        layout="vertical"
        onFinishFailed={onFinishFailed}
      >
        {entries(formData(t)).map(([key, value]) => {
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

        <div className="login-forgot">
          <h4
            aria-hidden="true"
            className="primary-color font-bold cursor-pointer"
            onClick={handleForgotPassword}
          >
            {t('auth_ForgetPassword')}?
          </h4>
        </div>

        <ANTDButton
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          block
          className="login-submit"
        >
          {t('btn_Login')}
        </ANTDButton>
      </ANTDForm>


    </div>
  )
}

export default Login
