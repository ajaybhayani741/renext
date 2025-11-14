import { getMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const { GET_NOTIFICATIONS } = API_ROUTES

export const getNotificationsApi = async ({ pageNo }) => {
  const response = await getMethod(GET_NOTIFICATIONS({ pageNo }))
  return response?.data
}
