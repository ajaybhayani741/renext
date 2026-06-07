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

      <div className="login-divider">
        <span>or continue with</span>
      </div>

      <div className="social-row">
        <button type="button" className="social-btn" aria-label="Google">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-7.9Z" />
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8l3.7-2.8Z" />
            <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4Z" />
          </svg>
          <span>Google</span>
        </button>
        <button type="button" className="social-btn" aria-label="Microsoft">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
            <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
            <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
            <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
          </svg>
          <span>Microsoft</span>
        </button>
      </div>
    </div>
  )
}

export default Login
