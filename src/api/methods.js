import Api from './Api'

const getMethod = async (route, extraConfig) => {
  try {
    return await Api.get(route, extraConfig)
  } catch (error) {
    return error
  }
}
const postMethod = async (route, payload, headers) => {
  try {
    return await Api.post(route, payload, headers)
  } catch (error) {
    return error
  }
}
const patchMethod = async (route, payload) => {
  try {
    return await Api.patch(route, payload)
  } catch (error) {
    return error
  }
}
const deleteMethod = async (route, payload) => {
  try {
    return await Api.delete(route, payload)
  } catch (error) {
    return error
  }
}

export { deleteMethod, getMethod, patchMethod, postMethod }
