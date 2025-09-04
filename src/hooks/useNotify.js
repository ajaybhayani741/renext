import { notification } from 'antd'

import useTranslations from './useTranslations'

const useNotify = config => {
  const { duration = 3, ...restConfig } = { ...config }
  const { t } = useTranslations()
  const [api, contextHolder] = notification.useNotification({
    duration,
    ...restConfig,
  })

  const notify = {
    info: ({ message, description, placement = 'top', ...rest }) =>
      api.info({ message: t(message), description, placement, ...rest }),

    success: ({ message, description, placement = 'top', ...rest }) =>
      api.success({ message: t(message), description, placement, ...rest }),

    error: ({ message, description, placement = 'top', ...rest }) =>
      api.error({ message: t(message), description, placement, ...rest }),

    warning: ({ message, description, placement = 'top', ...rest }) =>
      api.warning({ message: t(message), description, placement, ...rest }),

    destroy: key => api.destroy(key),
  }

  return { notify, contextHolder }
}

export default useNotify
