import { useState } from 'react'

import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { userWiseRole } from '../../../utils/constant'
import { notEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'

const jobContext = () => {
  const { t } = useTranslations()
  const { location, params } = useRouter()
  const { status } = { ...location.state }
  const { customer, site } = userWiseRole
  const [selectedUsers, setSelectedUsers] = useState({})
  const [fileList, setFileList] = useState([])
  const [nextBtnLoader, setNextBtnLoader] = useState(false)
  const userData = JSON.parse(getItem('userData'))
  const { roleId, id: loginUserId } = { ...userData }

  const onUserClear = (id, index = 0) => {
    let newSelectedUsers = {}
    switch (id) {
      case customer:
        newSelectedUsers = {
          [id]: [],
          [site]: [],
        }
        break

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
    existingUser[userIndex] = data[0]
    setSelectedUsers({
      ...selectedUsers,
      [roleId]: existingUser,
    })
  }

  // const handleDealerAddMore = () => {
  //   const updatedDealerList = selectedUsers[dealer]
  //   if (length(keys(updatedDealerList[updatedDealerList.length - 1]))) {
  //     updatedDealerList.push({})
  //     setSelectedUsers({
  //       ...selectedUsers,
  //       [`${dealer}`]: updatedDealerList,
  //     })
  //   } else {
  //     notifyMethod.warning({ message: 'msg_SelectUser' })
  //   }
  // }

  // const onContractDealerChange = (e, index) => {
  //   const existingUser = selectedUsers[dealer] || []
  //   const dealerUser = existingUser[index - 1]
  //   if (existingUser?.[index]?.id && dealerUser?.id) {
  //     if (isEqual(checkType(e), 'object')) {
  //       existingUser[index].contract = e.target ? e.target.checked : ''
  //     } else {
  //       existingUser[index].date = dayJs(e).valueOf()
  //     }
  //     existingUser[index].dealerId = dealerUser?.id
  //     existingUser[index].contractDealerId = existingUser[index]?.id
  //     setSelectedUsers({
  //       ...selectedUsers,
  //       [dealer]: existingUser,
  //     })
  //   } else {
  //     notifyMethod.warning({ message: 'msg_SelectUser' })
  //   }
  // }

  const onFileUpload = ({ dmsId, key, file, index = 0 }) => {
    const updatedFileList = [...fileList]
    const keyFileList = [...(updatedFileList[index]?.[key] || [])]
    keyFileList.push(file)
    updatedFileList[index] = {
      ...updatedFileList[index],
      [key]: keyFileList,
    }
    setFileList(updatedFileList)
  }

  const onFileRemove = ({ dmsId, key, index = 0 }) => {
    const updatedFileList = [...fileList]
    const keyFileList = [...(updatedFileList[index]?.[key] || [])].filter(
      file => notEqual(file?.uid, dmsId),
    )
    updatedFileList[index] = {
      ...updatedFileList[index],
      [key]: keyFileList,
    }
    setFileList(updatedFileList)
  }

  const addNewBuildData = ({ newBuilding }) => {
    setSelectedUsers(prev => ({ ...prev, building: [newBuilding] }))
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
    status,
    params,
    fileList,
    loginUserId,
    selectedUsers,
    nextBtnLoader,
    setNextBtnLoader,
    onSelfUser,
    setFileList,
    onFileUpload,
    onFileRemove,
    onUserClear,
    onSelectUser,
    addNewBuildData,
    setSelectedUsers,
    // handleDealerAddMore,
    // onContractDealerChange,
    getPayloadForUserList,
  }
}

export default jobContext
