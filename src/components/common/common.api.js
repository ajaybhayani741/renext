import { deleteMethod, postMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const { GET_IMAGE_FILE, DELETE_IMAGE_FILES } = API_ROUTES

const getImageFileApi = async ({ params, payload }) => {
  const response = await postMethod(GET_IMAGE_FILE({ params }), payload)
  return response?.data
}
const deleteImageFileApi = async ({ params }) => {
  const response = await deleteMethod(GET_IMAGE_FILE({ params }))
  return response?.data
}
const deleteMultipleImageApi = async ({ params }) => {
  const response = await deleteMethod(DELETE_IMAGE_FILES({ params }))
  return response?.data
}

export { getImageFileApi, deleteImageFileApi, deleteMultipleImageApi }
