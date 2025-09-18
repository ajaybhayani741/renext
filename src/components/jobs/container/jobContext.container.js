import { useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { MAX_FILE_SIZE } from '../../../utils/constant'
import { isEqual, length } from '../../../utils/javascript'
import { deleteImageFileApi, getImageFileApi } from '../../common/common.api'

const jobContext = () => {
  const { t } = useTranslations()
  const { params } = useRouter()

  const [selectedUsers, setSelectedUsers] = useState({})
  const { selector } = useRedux()
  const userData = selector(state => state.user?.profile_details)
  const { roleId, id: loginUserId } = { ...userData }
  const [nextBtnLoader, setNextBtnLoader] = useState(false)

  const onUserClear = (id, index = 0) => {
    let newSelectedUsers = {}
    switch (id) {
      default:
        newSelectedUsers[id] = []
        break
    }
    setSelectedUsers({ ...selectedUsers, ...newSelectedUsers })
  }

  const onSelfUser = (id, index = 0) => {
    let newSelectedUsers = {}
    newSelectedUsers[id] = [userData]
    setSelectedUsers({ ...selectedUsers, ...newSelectedUsers })
  }

  const onSelectUser = ({ data, roleId, userIndex = 0 }) => {
    const existingUser = selectedUsers[roleId] || []
    existingUser[userIndex] = data?.[0]
    setSelectedUsers({
      ...selectedUsers,
      [roleId]: existingUser,
    })
  }

  const onFileUploadOrRemove = async ({ file, source = 'USER' }) => {
    if (!file) return
    if (isEqual(file?.file?.status, 'removed')) {
      await deleteImageFileApi({
        params: `?dmsId=${file?.file?.dmsId}`,
      })
      return null
    }
    const isLt5MB = file?.file?.size < MAX_FILE_SIZE
    if (!isLt5MB) return null
    const fileList = file?.fileList || []
    const fileBlob = fileList[length(fileList) - 1]
    if (!fileBlob?.originFileObj) return null
    const formData = new FormData()
    formData.append('file', fileBlob?.originFileObj)
    const resp = await getImageFileApi({
      params: `?source=${source}`,
      payload: formData,
    })
    return resp?.data?.dmsId
  }

  const getPayloadForUserList = (roleId, maxUsers) => {
    return { roleId, maxUsers }
    // if (isEqual(roleId, 'building')) {
    //   return { pageSize: 5, customerId: selectedUsers?.[customer]?.[0]?.id }
    // } else {
    //   const params = { roleId }
    //   if (
    //     include([fieldEngineer, dealerUser], loginRoleId) &&
    //     notEqual(customer, roleId)
    //   )
    //     params.userId = adminId
    //   if (isEqual(customer, roleId)) params.userId = parentAdminId
    //   if (isDealerLogin && isEqual(dealer, roleId)) {
    //     params.userId = selectedUsers?.[contractor]?.[0]?.id
    //   }
    //   return params
    // }
  }

  return {
    t,
    roleId,
    params,
    loginUserId,
    selectedUsers,
    nextBtnLoader,
    setNextBtnLoader,
    onSelfUser,
    onFileUploadOrRemove,
    onUserClear,
    onSelectUser,
    setSelectedUsers,
    getPayloadForUserList,
  }
}

export default jobContext
