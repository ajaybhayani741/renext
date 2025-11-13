import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRouter from '../../../hooks/useRouter'
import { USER_TXT } from '../../../routing/pathName.constant'
import { userWiseRole } from '../../../utils/constant'
import { entries, isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { addAssociateApi, getUserList } from '../user.api'
import { userRelationKey, userTranslationKey } from '../user.description'

const userList = ({ payload, isBuilding }) => {
  const { params, location, navigate } = useRouter()
  const [userData, setUserData] = useState({})
  const [associatedData, setAssociatedData] = useState({
    list: [],
    loader: false,
  })
  const [model, setModel] = useState(false)
  const [buildingInfo, setBuildingInfo] = useState({ flag: false, data: {} })
  const modelTitle = userTranslationKey[payload?.roleId]
  const loginUserRoleId = JSON.parse(getItem('userData'))
  const { hostel, districtCollector } = userWiseRole

  const apiCall = async ({ pageNo }) => {
    let params = `${pageNo}`
    setUserData(prev => ({
      ...prev,
      loader: true,
    }))

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
    const districtCollectorId =
      isEqual(payload?.roleId, hostel) &&
      isEqual(loginUserRoleId?.roleId, districtCollector)
        ? loginUserRoleId?.id
        : null
    const params = `${pageNo}?roleId=${payload?.roleId}&userId=${districtCollectorId || payload?.userId}&relationType=${userRelationKey.nonAssociate}`
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

  const handleCancelEdit = () => {
    setBuildingInfo({ flag: false, data: {} })
  }

  return {
    model,
    userData,
    modelTitle,
    associatedData,
    buildingInfo,
    apiCall,
    setBuildingInfo,
    onAddAssociate,
    handleCancelEdit,
    handleCloseModel,
    handleTableChange,
    handleNonAssociateUser,
    handleAssociatedTableChange,
  }
}

export default userList
