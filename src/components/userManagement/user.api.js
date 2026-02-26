import { postMethod, patchMethod, getMethod } from '../../api/methods'
import API_ROUTES from '../../api/routes'

const {
  GET_USER,
  ADD_NEW_USER,
  UPDATE_USER,
  UPDATE_USER_CONTENT,
  SEARCH_USER,
  GET_USER_PROFILE,
  ADD_ASSOCIATE,
  DIS_ASSOCIATE,
  GET_BUILDING,
  ADD_BUILDING,
  USER_VALIDATION,
  GENERATE_MASTER_SHEET,
} = API_ROUTES

const getUserList = async ({ params }) => {
  const response = await getMethod(GET_USER({ params }))
  return response?.data
}
const getBuildingList = async ({ params }) => {
  const response = await getMethod(GET_BUILDING({ params }))
  return response?.data
}
const addNewUserApi = async ({ payload }) => {
  const response = await postMethod(ADD_NEW_USER, payload)
  return response
}
const addNewBuildingApi = async ({ payload }) => {
  const response = await postMethod(ADD_BUILDING, payload)
  return response
}
const updateBuildingApi = async ({ payload }) => {
  const response = await patchMethod(ADD_BUILDING, payload)
  return response
}
const updateUserApi = async ({ payload }) => {
  const response = await patchMethod(UPDATE_USER, payload)
  return response
}
const updateUserContentApi = async ({ payload }) => {
  const response = await patchMethod(UPDATE_USER_CONTENT, payload)
  return response
}
const getUserProfileApi = async ({ id }) => {
  const response = await getMethod(GET_USER_PROFILE(id))
  return response
}

const searchUserApi = async ({ params }) => {
  const response = await getMethod(SEARCH_USER({ params }))
  return response?.data
}

const addAssociateApi = async ({ payload, params }) => {
  const response = await postMethod(ADD_ASSOCIATE({ params }), payload)
  return response?.data
}

const disAssociateApi = async ({ payload, params }) => {
  const response = await postMethod(DIS_ASSOCIATE({ params }), payload)
  return response?.data
}

const userValidationApi = async ({ params }) => {
  const response = await getMethod(USER_VALIDATION({ params }), {
    hideErrorPopup: true,
  })
  return response?.data
}

const getPreviousExportRequestsApi = async ({ pageNo, params }) => {
  const response = await getMethod(`${GENERATE_MASTER_SHEET}/${pageNo}`, {
    params,
  })
  return response?.data
}

export {
  getUserList,
  addNewUserApi,
  updateUserApi,
  updateUserContentApi,
  getUserProfileApi,
  searchUserApi,
  addAssociateApi,
  disAssociateApi,
  getBuildingList,
  addNewBuildingApi,
  updateBuildingApi,
  userValidationApi,
  getPreviousExportRequestsApi,
}
