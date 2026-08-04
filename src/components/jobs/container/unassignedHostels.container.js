import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { userWiseRole } from '../../../utils/constant'
import { addAssociateApi, getUserList } from '../../userManagement/user.api'
import { userRelationKey } from '../../userManagement/user.description'

const unassignedHostels = () => {
  const { dispatch, selector } = useRedux()
  const [hostelData, setHostelData] = useState({})
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
  const userData = selector(state => state.user?.profile_details)
  const { hostel, inspectionOfficer } = userWiseRole

  useEffect(() => {
    hostelApiCall()
  }, [])

  const hostelApiCall = async (pageNo = 1) => {
    setHostelData(pre => ({ ...pre, loader: true }))
    const params = `${pageNo}?roleId=${hostel}&relationType=${userRelationKey?.nonAssociate}`
    const response = await getUserList({ params })
    setHostelData({
      ...response?.data,
      loader: false,
    })
  }

  const handleTableChange = pagination => {
    hostelApiCall(pagination.current)
  }

  const handleCloseInspectionOfficerModal = () => {
    setInspectionOfficerModal({ open: false, data: null })
    setInspectionOfficerData({ list: [], loader: false })
  }

  const handleInspectionOfficerTableChange = pagination => {
    getInspectionOfficerList({ pageNo: pagination?.current })
  }

  const associateHostel = async ({ userId, hostelId, onComplete }) => {
    const payloadData = `?userId=${userId}&associateUserId=${hostelId}`
    const resp = await addAssociateApi({ params: payloadData })
    const success = resp?.data?.success || resp?.data

    dispatch(
      setPopupMessageModel({
        open: true,
        message: success
          ? resp?.data?.message || 'msg_HostelAssignedSuccessfully'
          : resp?.data?.message || 'msg_SomethingWentWrong',
        success: !!success,
      }),
    )

    if (success) {
      hostelApiCall()
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

  const getInspectionOfficerList = async ({ pageNo }) => {
    setInspectionOfficerData(pre => ({ ...pre, loader: true }))
    const params = `${pageNo}?roleId=${inspectionOfficer}`
    const result = await getUserList({ params })
    setInspectionOfficerData({ ...result?.data, loader: false })
  }

  const handleAssignInspectionOfficer = async ({ rowData }) => {
    setInspectionOfficerModal({ open: true, data: rowData })
    await getInspectionOfficerList({ pageNo: 1 })
  }

  const handleAssignToSelf = ({ rowData } = {}) => {
    setConfirmAssignToSelfModal({ open: true, data: rowData })
  }

  const handleCloseAssignToSelfModal = () => {
    setConfirmAssignToSelfModal({ open: false, data: null })
  }

  const onAssignToSelf = async () => {
    if (!userData?.id || !confirmAssignToSelfModal?.data?.id) {
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
      userId: userData?.id,
      hostelId: confirmAssignToSelfModal?.data?.id,
      onComplete: handleCloseAssignToSelfModal,
    })
  }

  return {
    hostelData,
    inspectionOfficerModal,
    handleTableChange,
    onAssignInspectionOfficer,
    handleAssignToSelf,
    handleCloseAssignToSelfModal,
    onAssignToSelf,
    handleAssignInspectionOfficer,
    handleCloseInspectionOfficerModal,
    inspectionOfficerData,
    handleInspectionOfficerTableChange,
    confirmAssignToSelfModal,
  }
}

export default unassignedHostels
