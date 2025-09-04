import configData from './config'
import { fieldContactFormat } from './customFunctions'
import { isArray, length, notEqual } from './javascript'
const { contactNumberLength } = configData

const userValidation = ({ type, t, fieldName }) => {
  switch (type) {
    case 'emailId':
      return [
        {
          pattern: /[a-z0-9]+@[a-z-0-9-]+\.[a-z-0-9-]{2,3}/,
          message: t('error_InvalidEmail'),
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            const emailList = getFieldValue(fieldName)
            if (value && isArray(emailList) && length(emailList)) {
              const isDuplicate = notEqual(
                emailList?.indexOf(value),
                emailList?.lastIndexOf(value),
              )
              if (isDuplicate) {
                return Promise.reject(t('error_SameEmail'))
              }
            }
            return Promise.resolve()
          },
        }),
      ]
    case 'phoneNumber':
      return [
        ({ setFieldValue }) => ({
          validator(_, value) {
            const numbers = value && value.toString().replace(/\D/g, '')
            setFieldValue(fieldName, fieldContactFormat(value))
            if (
              numbers &&
              (length(numbers) < contactNumberLength ||
                length(numbers) > contactNumberLength)
            ) {
              return Promise.reject(t('error_LengthValidation'))
            }
            return Promise.resolve()
          },
        }),
      ]
    case 'username':
      return [
        {
          pattern: /^\S*$/,
          message: t('error_SpacesNotAllowed'),
        },
      ]
    case 'password':
      return [
        {
          validator: (_, value) => {
            if (!length(value)) return Promise.resolve()
            const replacedValue = value.replace(/\s/g, '')
            if (!length(replacedValue)) {
              return Promise.reject(t('error_OnlySpaceNotAllowed'))
            }
            return Promise.resolve()
          },
        },
      ]

    default:
      return []
  }
}

const hasOnlySpace = str => /^\s+$/.test(str)

export { userValidation, hasOnlySpace }
