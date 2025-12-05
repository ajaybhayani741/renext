import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { apiParams } from '../../../utils'
import { userWiseRole } from '../../../utils/constant'
import { addAssociateApi, getUserList } from '../../userManagement/user.api'
import { userRelationKey } from '../../userManagement/user.description'

const unassignedHostels = () => {
  const { t } = useTranslations()
  const { dispatch } = useRedux()
  const [hostelData, setHostelData] = useState({})
  const [inspectionOfficerModal, setInspectionOfficerModal] = useState({
    open: false,
    data: null,
  })
  const [inspectionOfficerData, setInspectionOfficerData] = useState({
    list: [],
    loader: false,
  })
  const [
    confirmAssignInspectionRandomModal,
    setConfirmAssignInspectionRandomModal,
  ] = useState({ open: false, data: null })
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

  const onAssignInspectionOfficer = async selectedUsers => {
    setInspectionOfficerData(pre => ({ ...pre, loader: true }))
    const payloadData = `?userId=${
      inspectionOfficerModal?.data?.id
    }&associateUserId=${selectedUsers?.map(user => user?.id)}`
    const { data } = await addAssociateApi({ params: payloadData })
    setInspectionOfficerData(pre => ({ ...pre, loader: false }))
    if (data?.success) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: t('msg_HostelAssignedToInspectionOfficer', {
            hostelName: inspectionOfficerModal?.data?.lastName,
            inspectionOfficer:
              selectedUsers?.[0]?.businessName ||
              selectedUsers?.[0]?.lastName ||
              '-',
          }),
          success: true,
        }),
      )
      handleCloseInspectionOfficerModal()
      hostelApiCall()
    }
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

  const handleAssignInspectionOfficerRandomly = async ({ rowData } = {}) => {
    setConfirmAssignInspectionRandomModal({
      open: !confirmAssignInspectionRandomModal?.open,
      data: rowData,
    })
  }

  const confirmAssignInspectionOfficer = async () => {
    const payload = {
      roleId: inspectionOfficer,
      userId: confirmAssignInspectionRandomModal?.data?.id,
      associateInspectionOfficer: true,
    }
    const resp = await addAssociateApi({
      params: apiParams({ params: payload }),
    })
    if (resp?.data) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: resp?.data?.message,
          success: true,
        }),
      )
      hostelApiCall()
    } else {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: resp?.data?.message || 'msg_SomethingWentWrong',
          success: false,
        }),
      )
    }
    handleAssignInspectionOfficerRandomly()
  }

  return {
    hostelData,
    inspectionOfficerModal,
    handleTableChange,
    onAssignInspectionOfficer,
    handleAssignInspectionOfficerRandomly,
    confirmAssignInspectionOfficer,
    handleAssignInspectionOfficer,
    handleCloseInspectionOfficerModal,
    inspectionOfficerData,
    handleInspectionOfficerTableChange,
    confirmAssignInspectionRandomModal,
  }
}

export default unassignedHostels
