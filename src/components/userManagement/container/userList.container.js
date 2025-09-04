import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRouter from '../../../hooks/useRouter'
import { USER_TXT } from '../../../routing/pathName.constant'
import { entries, isEqual } from '../../../utils/javascript'
import { addAssociateApi, disAssociateApi, getUserList } from '../user.api'
import { userRelationKey, userTranslationKey } from '../user.description'

const userList = ({ payload, isBuilding }) => {
  const { params, location, navigate } = useRouter()
  const [userData, setUserData] = useState({})
  const [associatedData, setAssociatedData] = useState({
    list: [],
    loader: false,
  })
  const [model, setModel] = useState(false)
  const [disAssociated, setDisAssociated] = useState({
    open: false,
    userId: null,
  })
  const [buildingInfo, setBuildingInfo] = useState({ flag: false, data: {} })
  const modelTitle = userTranslationKey[payload?.roleId]

  const apiCall = async ({ pageNo }) => {
    let params = `${pageNo}`
    setUserData({
      ...userData,
      loader: true,
    })

    entries(payload).forEach(([key, val], i) => {
      params += `${isEqual(i, 0) ? '?' : '&'}${key}=${val}`
    })
    const response = await getUserList({ params })

    setUserData({
      ...response?.data,
      loader: false,
    })
  }

  useEffect(() => {
    apiCall({ pageNo: 1 })
  }, [])

  useEffect(() => {
    if (location?.state?.renderUserAPI) {
      apiCall({ pageNo: 1 })
      navigate(`${USER_TXT}/${params?.userType}`, {
        state: { renderUserAPI: false },
      })
    }
  }, [location?.state?.renderUserAPI])

  const handleTableChange = pagination => {
    apiCall({ pageNo: pagination.current })
  }

  const associateApiCall = async ({ pageNo }) => {
    setAssociatedData(pre => ({ ...pre, loader: true }))
    const params = `${pageNo}?roleId=${payload?.roleId}&userId=${payload?.userId}&relationType=${userRelationKey.nonAssociate}`
    const result = await getUserList({ params })
    setAssociatedData({ ...result?.data, loader: false })
  }

  const handleNonAssociateUser = async () => {
    if (isBuilding) {
      setBuildingInfo({ flag: true, data: {} })
    } else {
      setModel(true)
      associateApiCall({ pageNo: 1 })
    }
  }

  const handleCloseModel = () => {
    setModel(false)
    setAssociatedData({})
    setDisAssociated({ open: false, userId: null })
  }
  const handleDAssociate = async user => {
    setDisAssociated({ open: true, userId: user?.id })
  }

  const handleAssociatedTableChange = pagination => {
    associateApiCall({ pageNo: pagination?.current })
  }

  const onAddAssociate = async selectedUsers => {
    setAssociatedData(pre => ({ ...pre, loader: true }))
    const payloadData = `?userId=${
      payload?.userId
    }&associateUserId=${selectedUsers?.map(user => user?.id)}`
    const { data } = await addAssociateApi({ params: payloadData })
    setAssociatedData(pre => ({ ...pre, loader: false }))
    if (data?.success) {
      notifyMethod.success({
        message: 'msg_UserAssociatedSuccessfully',
      })
      handleCloseModel()
      apiCall({ pageNo: 1 })
    }
  }

  const removeAssociateUser = async () => {
    const payloadData = `?userId=${payload?.userId}&disAssociateUserId=${disAssociated?.userId}`
    const { data } = await disAssociateApi({ params: payloadData })
    if (data?.success) {
      notifyMethod.success({
        message: 'msg_UserDisAssociatedSuccessfully',
      })
      apiCall({ pageNo: 1 })
    }
    setDisAssociated({ open: false, userId: null })
  }

  const handleCancelEdit = () => {
    setBuildingInfo({ flag: false, data: {} })
  }

  return {
    model,
    userData,
    modelTitle,
    associatedData,
    disAssociated,
    buildingInfo,
    apiCall,
    setBuildingInfo,
    onAddAssociate,
    handleCancelEdit,
    handleCloseModel,
    handleDAssociate,
    handleTableChange,
    removeAssociateUser,
    handleNonAssociateUser,
    handleAssociatedTableChange,
  }
}

export default userList
