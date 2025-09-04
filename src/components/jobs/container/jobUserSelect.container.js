import { useState } from 'react'

// import { apiParams } from '../../../utils'
// import { isEqual } from '../../../utils/javascript'
// import { getBuildingList, getUserList } from '../../userManagement/user.api'
import { userDataList } from '../../../utils/constant'
import { notEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { userRelationKey } from '../../userManagement/user.description'

const jobUserSelect = ({ roleId, apiPayload }) => {
  const [selectUserModal, setSelectUserModal] = useState({
    isOpen: false,
  })
  const [buildingInfo, setBuildingInfo] = useState({ flag: false, data: {} })
  const userData = JSON.parse(getItem('userData'))
  const { id: loginUserId } = { ...userData }

  const handleCancelEdit = () => {
    setBuildingInfo({ flag: false, data: {} })
  }

  const getUsers = async ({ pageNo = 1, params }) => {
    // let response
    // if (isEqual(roleId, 'building')) {
    //   response = await getBuildingList({
    //     params: apiParams({ params, pageNo }),
    //   })
    // } else {
    //   response = await getUserList({
    //     params: apiParams({ params, pageNo }),
    //   })
    // }
    // return response?.data
    const userList = userDataList({ roleId: params?.roleId })
    return {
      ...userList,
      list: userList?.list
        ?.filter(({ id } = {}) => notEqual(id, loginUserId))
        .slice(0, params?.maxUsers),
    }
  }

  const handleSelectUserPopup = async ({ pageNo, parent, associated }) => {
    setSelectUserModal(pre => ({ ...pre, isOpen: true }))
    let newSelected = {}
    if (parent) {
      setSelectUserModal(pre => ({
        ...pre,
        parent: { ...pre?.parent, loader: true },
      }))
      const userList = await getUsers({ pageNo, params: apiPayload })
      newSelected = { parent: { ...userList, loader: false } }
    }
    if (associated) {
      setSelectUserModal(pre => ({
        ...pre,
        associated: { ...pre?.associated, loader: true },
      }))
      const associatedList = await getUsers({
        pageNo,
        params: { ...apiPayload, relationType: userRelationKey.associate },
      })
      newSelected = {
        ...newSelected,
        associated: { ...associatedList, loader: false },
      }
    }
    setSelectUserModal(pre => ({ ...pre, ...newSelected }))
  }

  const onModelClose = () => setSelectUserModal({ isOpen: false })

  return {
    buildingInfo,
    selectUserModal,
    setBuildingInfo,
    onModelClose,
    handleSelectUserPopup,
    handleCancelEdit,
  }
}

export default jobUserSelect
