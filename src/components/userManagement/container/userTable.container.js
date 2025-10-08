import { useCallback, useRef, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { apiParams, nameParam } from '../../../utils'
import debounce from '../../../utils/debounce'
import { entries, notEqual, ternary } from '../../../utils/javascript'
import { addAssociateApi, searchUserApi } from '../user.api'

const userTable = ({ payload, multiSelect, searchByEmail }) => {
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
  const userDetail = selector(state => state.user.profile_details)

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
    entries(payload)?.forEach(([key, value]) => {
      if (value) {
        params += `&${key}=${value}`
      }
    })
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
  const handleAssignHostel = async ({ rowData }) => {
    const payload = {
      userId: userDetail?.id,
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
  }
}

export default userTable
