import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
  useWatchFn,
} from '../../../shared/antd/ANTDForm'
import { ANTDInputOTP } from '../../../shared/antd/ANTDInput'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import getFormInput from '../../../shared/form.description'
import { validationTag } from '../../../utils/customFunctions'
import { getItem } from '../../../utils/localstorage'
import login from '../container/login'
import { formData, initialValues } from '../login.description'

function Login() {
  const form = useFormFn()
  const { t } = useTranslations()
  const {
    loading,
    otpSent,
    pageLoader,
    onFinish,
    onFinishFailed,
    verifiedPhoneNumber,
  } = login()
  const lang = getItem('lang')
  const loginFormData = formData(t)
  const phoneNumber = useWatchFn('phoneNumber', form)
  const phoneNumberChanged = otpSent && phoneNumber !== verifiedPhoneNumber
  const PhoneInput = getFormInput({
    inputType: loginFormData.phoneNumber.inputType,
  })

  const handlePhoneNumberChange = e => {
    const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10)
    form.setFieldValue('phoneNumber', numbersOnly)
    form.setFieldValue('otp', '')
  }

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
        <p className="login-subtitle">
          Verify your phone number to continue.
        </p>
      </div>

      <ANTDForm
        name="login"
        initialValues={initialValues}
        form={form}
        onFinish={onFinish}
        layout="vertical"
        onFinishFailed={onFinishFailed}
      >
        <ANTDFormItem
          label={loginFormData.phoneNumber.label}
          name="phoneNumber"
          validateTrigger={loginFormData.phoneNumber.validateTrigger}
          rules={loginFormData.phoneNumber.rules}
          className={validationTag(lang)}
        >
          <PhoneInput
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter phone number"
            onChange={handlePhoneNumberChange}
          />
        </ANTDFormItem>

        {otpSent && !phoneNumberChanged && (
          <ANTDFormItem
            label={loginFormData.otp.label}
            name="otp"
            validateTrigger={loginFormData.otp.validateTrigger}
            rules={loginFormData.otp.rules}
            className={validationTag(lang)}
          >
            <ANTDInputOTP
              autoFocus
              length={6}
              inputMode="numeric"
              formatter={value => value.replace(/\D/g, '')}
            />
          </ANTDFormItem>
        )}

        <ANTDButton
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          block
          className="login-submit"
        >
          {otpSent && !phoneNumberChanged ? 'Verify OTP' : 'Generate OTP'}
        </ANTDButton>
      </ANTDForm>
    </div>
  )
}

export default Login
