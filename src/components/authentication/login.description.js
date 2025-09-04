const initialValues = { username: '', password: '' }

const formData = t => ({
  username: {
    label: t('auth_UserName'),
    validateTrigger: 'onChange',
    rules: [
      { required: true },
      { pattern: /^\S*$/, message: t('error_OnlySpaceNotAllowed') },
    ],
    inputType: 'input',
    md: 24,
  },
  password: {
    label: t('auth_Password'),
    validateTrigger: 'onChange',
    rules: [{ required: true }],
    inputType: 'password',
  },
})

const infoBean = {
  androidId: 'string',
  androidVersion: 'string',
  appName: 'RETNEXT',
  appSignature: 'string',
  appVersion: 'string',
  deviceModel: 'string',
  fcmId: '',
  manufacturer: 'string',
  platform: 'WEB',
  userAgent: 'Web',
}
export { formData, infoBean, initialValues }
