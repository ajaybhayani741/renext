import axios from 'axios'

import { notifyMethod } from '../App'
import auth from '../components/authentication/container/auth.container'
import configData from '../utils/config'
import { include } from '../utils/javascript'
import { clearStorage, getItem } from '../utils/localstorage'

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
})

instance.interceptors.request.use(
  async config => {
    const authToken = getItem('token')
    const language = getItem('i18nextLng')
    config.headers.APP_NAME = configData.APP_NAME
    config.headers['country'] = configData.country
    config.headers['Accept-language'] = language
    if (config?.nonLoginAuthToken) {
      config.headers.Authorization = `Bearer ${config?.nonLoginAuthToken}`
    }
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    } /*  else if (!config?.headers?.['AUTH-TOKEN']) {// check conditions in previous version
            config.data.authToken = authToken;
        } */
    return config
  },
  error => Promise.reject(error),
)

instance.interceptors.response.use(
  async response => {
    if (!response.data?.data) {
      const errorObj = response.data.error
      if (errorObj?.errorMsg && !response?.config?.hideErrorPopup) {
        notifyMethod.error({ message: errorObj?.errorMsg })
      }
    }
    return response
  },
  async error => {
    const { refreshAuth } = auth()
    if (include([11, 32], error?.response?.data?.error?.errorCode)) {
      const refreshedData = await refreshAuth()
      if (refreshedData?.authToken) {
        const originalRequestConfig = { ...error.config }
        originalRequestConfig.headers.Authorization = `Bearer ${refreshedData.authToken}`
        const retryResponse = await instance(originalRequestConfig)
        return retryResponse
      } else {
        clearStorage()
        window.location.reload()
      }
    }
    notifyMethod.error({
      message: error.response.data.error?.errorMsg || 'msg_SomethingWentWrong',
    })
    return { data: null, error: error.response.data }
  },
)

export default instance
