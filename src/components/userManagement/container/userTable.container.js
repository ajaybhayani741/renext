import { useCallback, useRef, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { apiParams, nameParam } from '../../../utils'
import { userWiseRole } from '../../../utils/constant'
import debounce from '../../../utils/debounce'
import { entries, notEqual, ternary } from '../../../utils/javascript'
import { addAssociateApi, searchUserApi } from '../user.api'

const userTable = ({ payload, multiSelect, searchByEmail, searchPayload }) => {
  const [viewModel, setViewModel] = useState({ open: false, userDetails: null })
  const searchValue = useRef(null)
  const [searchResult, setSearchResult] = useState({
    loader: false,
    data: null,
  })
  const [selectedUsers, setSelectedUsers] = useState([])
  const { dispatch, selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const [editInfo, setEditInfo] = useState({ flag: false, data: {} })
  const [assignConfirmation, setAssignConfirmation] = useState({
    open: false,
    data: null,
  })
  const { hostel } = userWiseRole

  const handleView = data => {
    setViewModel({ open: true, userDetails: data })
  }

  const onSearch = debounce(async e => {
    const { value } = e.target
    if (!value?.trim()) return setSearchResult({ loader: false, data: null })
    searchValue.current = value
    apiCall({ pageNo: 1, value })
  }, 500)

  const apiCall = useCallback(async ({ pageNo, value }) => {
    setSearchResult(pre => ({ ...pre, loader: true }))
    let params = `${pageNo}?${nameParam({
      roleId: payload?.roleId,
      searchByEmail,
    })}=${value}`
    entries(searchPayload ? searchPayload : payload)?.forEach(
      ([key, value]) => {
        if (value) {
          params += `&${key}=${value}`
        }
      },
    )
    const result = await searchUserApi({ params })
    setSearchResult({ loader: false, data: result?.data })
  }, [])

  const handleSearchTableChange = pagination => {
    apiCall({ pageNo: pagination.current, value: searchValue.current })
  }

  const handleCancel = () => {
    setViewModel({ open: false, userDetails: null })
  }

  const handleSelectChange = e => {
    const { checked, value } = e.target
    let tempList = [...selectedUsers]
    if (checked) {
      tempList = ternary(multiSelect, [...tempList, value], [value])
    } else {
      tempList = tempList.filter(v => notEqual(v?.id, value?.id))
    }
    setSelectedUsers(tempList)
  }

  const handleEdit = rowData => {
    setEditInfo({ flag: true, data: rowData })
  }
  const handleCancelEdit = () => {
    setEditInfo({ flag: false, data: {} })
  }

  const handleAssignHostelConfirmation = ({ rowData } = {}) => {
    setAssignConfirmation({
      open: !assignConfirmation?.open,
      data: rowData || null,
    })
  }

  const handleAssignHostel = async () => {
    const payload = {
      roleId: hostel,
      userId: assignConfirmation?.data?.id,
      associateHostel: true,
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
    } else {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: resp?.data?.message || 'msg_SomethingWentWrong',
          success: false,
        }),
      )
    }
    handleAssignHostelConfirmation()
  }

  return {
    viewModel,
    isDesktop,
    searchResult,
    onSearch,
    handleView,
    handleSearchTableChange,
    handleCancel,
    selectedUsers,
    handleSelectChange,
    handleEdit,
    handleCancelEdit,
    editInfo,
    setEditInfo,
    handleAssignHostel,
    assignConfirmation,
    handleAssignHostelConfirmation,
  }
}

export default userTable
