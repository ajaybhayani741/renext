import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { USER_TXT } from '../../../routing/pathName.constant'
import { userWiseRole } from '../../../utils/constant'
import { entries, include, isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { addAssociateApi, getUserList } from '../user.api'
import { userRelationKey, userTranslationKey } from '../user.description'

const userList = ({ payload, isBuilding }) => {
  const { t } = useTranslations()
  const { params, location, navigate } = useRouter()
  const { dispatch } = useRedux()
  const [userData, setUserData] = useState({})
  const [associatedData, setAssociatedData] = useState({
    list: [],
    loader: false,
  })
  const [model, setModel] = useState(false)
  const [modelData, setModelData] = useState(null)
  const [selectedAssigneeUser, setSelectedAssigneeUser] = useState(null)
  const [inspectionOfficerModal, setInspectionOfficerModal] = useState({
    open: false,
    data: null,
  })
  const [inspectionOfficerData, setInspectionOfficerData] = useState({
    list: [],
    loader: false,
  })
  const [confirmAssignToSelfModal, setConfirmAssignToSelfModal] = useState({
    open: false,
    data: null,
  })
  const [buildingInfo, setBuildingInfo] = useState({ flag: false, data: {} })
  const modelTitle = userTranslationKey[payload?.roleId]
  const { hostel, inspectionOfficer, mandalSpecialOfficer } = userWiseRole
  const loginUser = JSON.parse(getItem('userData') || '{}')
  const showAssignInspectionOfficer =
    isEqual(loginUser?.roleId, mandalSpecialOfficer) &&
    isEqual(payload?.roleId, hostel)

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

  const associateApiCall = async ({ pageNo, roleId = null, userId }) => {
    setAssociatedData(pre => ({ ...pre, loader: true }))
    // const districtCollectorId =
    //   isEqual(roleId || payload?.roleId, hostel) &&
    //   isEqual(loginUserRoleId?.roleId, districtCollector)
    //     ? loginUserRoleId?.id
    //     : null
    const params = `${pageNo}?roleId=${roleId || payload?.roleId}&userId=${payload?.userId || userId || loginUser?.id}&relationType=${userRelationKey.nonAssociate}`
    const result = await getUserList({ params })
    setAssociatedData({ ...result?.data, loader: false })
  }

  const handleNonAssociateUser = async ({ rowData, roleId }) => {
    console.log('rowData', rowData)
    if (isBuilding) {
      setBuildingInfo({ flag: true, data: {} })
    } else {
      setModel(true)
      setModelData({ roleId })
      associateApiCall({ pageNo: 1, roleId, userId: rowData?.id })
      rowData && setSelectedAssigneeUser(rowData)
    }
  }

  const handleCloseModel = () => {
    setModel(false)
    setModelData({ roleId: null })
    setAssociatedData({})
  }

  const handleAssociatedTableChange = pagination => {
    associateApiCall({
      pageNo: pagination?.current,
      roleId: modelData?.roleId,
      userId: selectedAssigneeUser?.id,
    })
  }

  const onAddAssociate = async selectedUsers => {
    setAssociatedData(pre => ({ ...pre, loader: true }))
    const payloadData = `?userId=${
      selectedAssigneeUser?.id || payload?.userId
    }&associateUserId=${selectedUsers?.map(user => user?.id)}`
    const { data } = await addAssociateApi({ params: payloadData })
    setAssociatedData(pre => ({ ...pre, loader: false }))
    if (data?.success) {
      if (include([inspectionOfficer, hostel], selectedAssigneeUser?.roleId)) {
        dispatch(
          setPopupMessageModel({
            open: true,
            message: t('msg_HostelAssignedToInspectionOfficer', {
              hostelName: selectedUsers?.[0]?.lastName,
              inspectionOfficer:
                selectedAssigneeUser?.businessName ||
                selectedAssigneeUser?.lastName ||
                '-',
            }),
            success: true,
          }),
        )
      } else {
        notifyMethod.success({
          message: 'msg_UserAssociatedSuccessfully',
        })
      }
      handleCloseModel()
      apiCall({ pageNo: 1 })
    }
  }

  const handleCloseInspectionOfficerModal = () => {
    setInspectionOfficerModal({ open: false, data: null })
    setInspectionOfficerData({ list: [], loader: false })
  }

  const getInspectionOfficerList = async ({ pageNo }) => {
    setInspectionOfficerData(pre => ({ ...pre, loader: true }))
    const params = `${pageNo}?roleId=${inspectionOfficer}`
    const result = await getUserList({ params })
    setInspectionOfficerData({ ...result?.data, loader: false })
  }

  const handleInspectionOfficerTableChange = pagination => {
    getInspectionOfficerList({ pageNo: pagination?.current })
  }

  const handleAssignInspectionOfficer = async ({ rowData }) => {
    setInspectionOfficerModal({ open: true, data: rowData })
    await getInspectionOfficerList({ pageNo: 1 })
  }

  const associateHostel = async ({ userId, hostelId, onComplete }) => {
    const payloadData = `?userId=${userId}&associateUserId=${hostelId}`
    const { data } = await addAssociateApi({ params: payloadData })
    const success = data?.success || data

    if (success) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: data?.message || 'msg_HostelAssignedSuccessfully',
          success: true,
        }),
      )
    }

    if (success) {
      apiCall({ pageNo: 1 })
    }

    onComplete?.()
  }

  const onAssignInspectionOfficer = async selectedUsers => {
    const selectedInspectionOfficer = selectedUsers?.[0]
    if (!selectedInspectionOfficer?.id || !inspectionOfficerModal?.data?.id) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: 'msg_SelectUser',
          success: false,
        }),
      )
      return
    }

    setInspectionOfficerData(pre => ({ ...pre, loader: true }))
    await associateHostel({
      userId: selectedInspectionOfficer?.id,
      hostelId: inspectionOfficerModal?.data?.id,
      onComplete: handleCloseInspectionOfficerModal,
    })
  }

  const handleAssignToSelf = ({ rowData } = {}) => {
    setConfirmAssignToSelfModal({ open: true, data: rowData })
  }

  const handleCloseAssignToSelfModal = () => {
    setConfirmAssignToSelfModal({ open: false, data: null })
  }

  const onAssignToSelf = async () => {
    if (!loginUser?.id || !confirmAssignToSelfModal?.data?.id) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: 'msg_SomethingWentWrong',
          success: false,
        }),
      )
      handleCloseAssignToSelfModal()
      return
    }

    await associateHostel({
      userId: loginUser?.id,
      hostelId: confirmAssignToSelfModal?.data?.id,
      onComplete: handleCloseAssignToSelfModal,
    })
  }

  const handleCancelEdit = () => {
    setBuildingInfo({ flag: false, data: {} })
  }

  return {
    model,
    modelData,
    userData,
    modelTitle,
    associatedData,
    buildingInfo,
    inspectionOfficerModal,
    inspectionOfficerData,
    confirmAssignToSelfModal,
    showAssignInspectionOfficer,
    apiCall,
    setBuildingInfo,
    onAddAssociate,
    handleCancelEdit,
    handleCloseModel,
    handleTableChange,
    handleNonAssociateUser,
    handleAssociatedTableChange,
    handleAssignInspectionOfficer,
    handleAssignToSelf,
    handleCloseAssignToSelfModal,
    handleCloseInspectionOfficerModal,
    handleInspectionOfficerTableChange,
    onAssignInspectionOfficer,
    onAssignToSelf,
  }
}

export default userList
