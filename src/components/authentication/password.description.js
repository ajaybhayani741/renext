import { isEqual, length } from '../../utils/javascript'

const forgotInitial = { username: '' }
const resetInitial = { password: '', confirmPassword: '' }

const forgotPasswordForm = t => ({
  username: {
    label: t('auth_UserName'),
    validateTrigger: 'onChange',
    rules: [
      { required: true, message: t('error_FieldISRequire') },
      { pattern: /^\S*$/, message: t('error_OnlySpaceNotAllowed') },
    ],
    inputType: 'input',
  },
})

const resetPasswordForm = t => ({
  password: {
    label: t('auth_NewPassword'),
    validateTrigger: 'onChange',
    rules: [
      { required: true },
      {
        validator: (_, value) => {
          const replacedValue = value?.replace(/\s/g, '')
          if (length(value) && !length(replacedValue)) {
            return Promise.reject(t('error_OnlySpaceNotAllowed'))
          }
          return Promise.resolve()
        },
      },
    ],
    inputType: 'password',
  },
  confirmPassword: {
    label: t('auth_ConfirmPassword'),
    validateTrigger: 'onChange',
    rules: [
      { required: true },
      ({ getFieldValue }) => ({
        validator: (_, value) => {
          if (!value) return Promise.resolve()
          const replacedValue = value?.replace(/\s/g, '')
          if (length(value) && !length(replacedValue)) {
            return Promise.reject(t('error_OnlySpaceNotAllowed'))
          }
          if (!isEqual(value, getFieldValue('password'))) {
            return Promise.reject(t('msg_PasswordShouldBeSame'))
          }
          return Promise.resolve()
        },
      }),
    ],
    inputType: 'password',
    dependencies: ['password'],
  },
})

export { forgotInitial, resetInitial, forgotPasswordForm, resetPasswordForm }
