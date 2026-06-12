import { useState } from 'react'

import { notifyMethod } from '../../../App'
import useRouter from '../../../hooks/useRouter'
import { include, isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { generateMasterSheetApi } from '../../jobs/jobs.api'
import { payloadType } from '../../jobs/jobs.description'
import { userChildrenList } from '../../layout/sidebar.description'
import {
  associateKey,
  roleIdByPath,
  userTranslationKey,
} from '../user.description'

const userManagement = () => {
  const { params, location, navigate } = useRouter()
  const { userType } = params
  const pathRoleId = roleIdByPath[userType]
  const userTitle = pathRoleId && userTranslationKey[pathRoleId]
  const userDetails = JSON.parse(getItem('userData'))
  const { roleId, adminId } = { ...userDetails }
  let permission = false
  const userViewObj = userChildrenList.find(v =>
    isEqual(v?.userId, roleId),
  )?.userView
  const currentUserView =
    userViewObj?.[userTitle] || userViewObj?.[associateKey[userTitle]]
  const defaultPayload = { roleId: pathRoleId }
  const [excelLoader, setExcelLoader] = useState(false)
  const [viewRequestsModal, setViewRequestsModal] = useState({ open: false })

  userChildrenList.forEach(value => {
    if (isEqual(value?.label, userTitle)) {
      permission = include(value.addEdit, roleId)
    }
  })

  const handleAdd = () => {
    navigate(`${location.pathname}/add`)
  }

  const onExportToExcel = async () => {
    setExcelLoader(true)
    const payload = { type: payloadType?.['hostelListSheet'] }
    const resp = await generateMasterSheetApi({ payload })
    if (resp?.data?.success) {
      notifyMethod.success({
        message: 'msg_ReportGenerated',
      })
    }
    setExcelLoader(false)
  }

  const onViewPreviousRequests = () => {
    setViewRequestsModal(prev => ({ ...prev, open: !prev.open }))
  }

  return {
    adminId,
    userTitle,
    permission,
    defaultPayload,
    currentUserView,
    handleAdd,
    pathRoleId,
    onExportToExcel,
    onViewPreviousRequests,
    viewRequestsModal,
    excelLoader,
  }
}

export default userManagement
