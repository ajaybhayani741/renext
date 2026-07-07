import { getMethod, patchMethod, postMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const {
  REFRESH_TOKEN,
  LOGIN,
  GENERATE_LOGIN_OTP,
  VERIFY_LOGIN_OTP,
  NON_LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  LOGOUT,
  DIAIKIN_LOGIN,
} = API_ROUTES

const refreshAuthtokenApi = async ({ payload }) => {
  const response = await postMethod(REFRESH_TOKEN, payload)
  return response
}
const nonLoginApi = async ({ payload }) => {
  const response = await postMethod(NON_LOGIN, payload)
  return response
}
const loginApi = async ({ payload, nonLoginAuthToken }) => {
  const response = await postMethod(LOGIN, payload, {
    nonLoginAuthToken: nonLoginAuthToken,
  })
  return response
}
const generateLoginOtpApi = async ({ payload }) => {
  const response = await postMethod(GENERATE_LOGIN_OTP, payload)
  return response
}
const verifyLoginOtpApi = async ({ payload }) => {
  const response = await postMethod(VERIFY_LOGIN_OTP, payload)
  return response
}
const forgotPasswordApi = async ({ userName }) => {
  const response = await getMethod(FORGOT_PASSWORD({ userName }), {
    hideErrorPopup: true,
  })
  return response?.data
}
const resetPasswordApi = async ({ payload }) => {
  const response = await patchMethod(RESET_PASSWORD, payload)
  return response
}
const changePasswordApi = async ({ payload }) => {
  const response = await patchMethod(CHANGE_PASSWORD, payload)
  return response
}
const logoutApi = async ({ payload }) => {
  const response = await postMethod(LOGOUT, payload)
  return response
}

const loginWithDaikinApi = async ({ payload }) => {
  const response = await postMethod(DIAIKIN_LOGIN, payload)
  return response?.data
}

export {
  forgotPasswordApi,
  generateLoginOtpApi,
  loginApi,
  logoutApi,
  nonLoginApi,
  refreshAuthtokenApi,
  resetPasswordApi,
  changePasswordApi,
  loginWithDaikinApi,
  verifyLoginOtpApi,
}

