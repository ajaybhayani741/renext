const initialValues = { phoneNumber: '', otp: '' }

const formData = () => ({
  phoneNumber: {
    label: 'Phone number',
    validateTrigger: 'onChange',
    rules: [
      { required: true, message: 'Please enter your phone number' },
      {
        pattern: /^[0-9]{10}$/,
        message: 'Please enter a valid 10 digit phone number',
      },
    ],
    inputType: 'input',
    md: 24,
  },
  otp: {
    label: 'OTP',
    validateTrigger: 'onChange',
    rules: [
      { required: true, message: 'Please enter the OTP' },
      { pattern: /^[0-9]+$/, message: 'OTP can contain numbers only' },
      { len: 6, message: 'Please enter the 6 digit OTP' },
    ],
    inputType: 'input',
  },
})

const infoBean = {
  androidId: 'string',
  androidVersion: 'string',
  appName: 'RENEXT',
  appSignature: 'string',
  appVersion: 'string',
  deviceModel: 'string',
  fcmId: '',
  manufacturer: 'string',
  platform: 'WEB',
  userAgent: 'Web',
}
export { formData, infoBean, initialValues }
