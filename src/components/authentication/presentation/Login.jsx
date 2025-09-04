import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
} from '../../../shared/antd/ANTDForm'
import ANTDRow from '../../../shared/antd/ANTDRow'
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
    <>
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
        <ANTDRow>
          <ANTDColumn xs={12}>
            <ANTDButton type="primary" htmlType="submit" loading={loading}>
              {t('btn_Login')}
            </ANTDButton>
          </ANTDColumn>
          <ANTDColumn xs={12} className="d-flex flex-end align-center">
            <h4
              aria-hidden="true"
              className="primary-color font-bold cursor-pointer"
              onClick={handleForgotPassword}
            >
              {t('auth_ForgetPassword')}?
            </h4>
          </ANTDColumn>
        </ANTDRow>
      </ANTDForm>
    </>
  )
}

export default Login
