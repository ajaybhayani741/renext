import { getMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const { INVENTORY } = API_ROUTES

const getInventoryListApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${INVENTORY}/${pageNo}`, {
    params,
  })
  return response?.data
}

export { getInventoryListApi }
