import { useCallback, useEffect, useState } from 'react'

import { apiParams, nameParam } from '../../../utils'
import { userWiseRole } from '../../../utils/constant'
import debounce from '../../../utils/debounce'
import {
  include,
  isArray,
  isEqual,
  keys,
  length,
  notEqual,
  ternary,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import {
  getUserList,
  getUserProfileApi,
  searchUserApi,
} from '../../userManagement/user.api'
import { userRelationKey } from '../../userManagement/user.description'
import { getFEDataApi, getTotalUserDataApi } from '../visualization.api'
import { feInitial, userLabelRoleId } from '../visualization.description'

const fieldEngineerView = () => {
  const [formData, setFormData] = useState(feInitial)
  const lastColumn = keys(formData)?.[length(keys(formData)) - 1]
  const [fieldTableData, setFieldTableData] = useState({})
  const [totalFE, setTotalFE] = useState({})
  const [isDisabled, setIsDisabled] = useState({})
  const [loader, setLoader] = useState({})
  const [brandLoader, setBrandLoader] = useState(false)
  const userData = JSON.parse(getItem('userData'))
  const { roleId, adminId, allParentId } = { ...userData }
  const { admin, dealer, dealerUser, contractor, fieldEngineer } = userWiseRole
  const isParentLogin = include([admin, dealer, dealerUser], roleId)

  useEffect(() => {
    initialRoleWiseSelect()
  }, [])

  useEffect(() => {
    const tableClasses = [
      'user_Dealer',
      'user_Contractor',
      'user_FieldEngineer',
      'user_Child',
      'user_Associate',
    ]
    const handleOnScroll = debounce(e => {
      const { target } = e
      const name = [...(target?.classList || [])].find(className =>
        include(tableClasses, className),
      )
      const isChild = include(['user_Child', 'user_Associate'], name)
      const {
        pageNo = 1,
        hasMore,
        search,
      } = {
        ...ternary(isChild, formData.user_Contractor?.[name], formData[name]),
      }
      if (
        hasMore &&
        isEqual(target.scrollHeight - target.scrollTop, target.clientHeight)
      ) {
        searchUser({
          pageNo: pageNo + 1,
          name,
          search,
          formData,
          isChild,
        })
      }
    }, 200)

    const elementArr = []
    tableClasses.forEach(key => {
      const element = document.getElementsByClassName(key)?.[0]
      element?.addEventListener('scroll', handleOnScroll)
      elementArr.push(element)
    })

    return () => {
      elementArr.forEach(element => {
        element?.removeEventListener('scroll', handleOnScroll)
      })
    }
  }, [formData])

  useEffect(() => {
    const handleScroll = debounce(e => {
      const container = e.target
      const scrollPosition =
        container.scrollHeight - container.scrollTop - container.clientHeight

      if (scrollPosition <= 2 && fieldTableData?.hasMore) {
        const { lastSelected, pageNo } = { ...fieldTableData }
        getBrandData({ selected: lastSelected, pageNo: pageNo + 1 })
      }
    }, 500)
    const container = document.querySelector('#fe-table .ant-table-body')
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fieldTableData])

  const initialRoleWiseSelect = () => {
    switch (roleId) {
      case dealer:
        setIsDisabled({
          user_Dealer: true,
        })
        setFormData(preFormData => ({
          ...preFormData,
          user_Dealer: {
            selected: null,
            search: '',
            list: [userData],
            filtered: [userData],
          },
        }))
        getData({ currentType: 'user_Dealer', selected: userData })
        break

      case dealerUser:
        setIsDisabled({
          user_Dealer: true,
        })
        getUserProfile({ id: adminId, type: 'user_Dealer' })
        getData({ currentType: 'user_Dealer', selected: { id: adminId } })
        break

      case contractor:
        setIsDisabled({
          user_Dealer: true,
          user_Contractor: true,
        })
        getUserProfile({
          id: adminId,
          type: 'user_Dealer',
          loginData: {
            user_Contractor: {
              selected: userData,
              search: '',
              list: [userData],
              filtered: [userData],
            },
          },
        })
        getData({ currentType: 'user_Contractor', selected: userData })
        break

      case fieldEngineer:
        setIsDisabled({
          user_Dealer: true,
          user_Contractor: true,
          user_FieldEngineer: true,
        })
        getUserProfile({ id: allParentId?.[1], type: 'user_Dealer' })
        getUserProfile({
          id: allParentId?.[0],
          type: 'user_Contractor',
          loginData: {
            user_FieldEngineer: {
              selected: userData,
              search: '',
              list: [userData],
              filtered: [userData],
            },
          },
        })
        getBrandDataList({ selected: userData })
        break

      default:
        getData({})
        break
    }
  }

  const getUserProfile = async ({ id, type, loginData }) => {
    const resp = await getUserProfileApi({ id })
    const userData = resp?.data?.data
    setFormData(preFormData => ({
      ...preFormData,
      [type]: {
        selected: userData,
        search: '',
        list: [userData],
        filtered: [userData],
      },
      ...(loginData && { ...loginData }),
    }))
  }

  const getParams = ({ pageNo, currentType, selected, associate }) => {
    const params = {
      pageSize: 20,
      roleId: userLabelRoleId[currentType],
      ...(selected && { userId: selected?.id }),
      ...(associate && { relationType: userRelationKey.associate }),
    }
    return apiParams({ params, pageNo })
  }

  const getBrandData = async ({ selected, pageNo = 1 }) => {
    const params = {
      userId: selected?.id,
    }
    setBrandLoader(true)
    const response = await getFEDataApi({ params, pageNo })
    if (response?.data) {
      const { fullCount, hasMore, lastPage, list, pageNo } = response?.data
      setFieldTableData(prev => {
        const updatedState = { ...prev }
        updatedState.fullCount = fullCount
        updatedState.hasMore = hasMore
        updatedState.lastPage = lastPage
        updatedState.pageNo = pageNo
        updatedState.list = length(prev?.list) ? [...prev?.list, ...list] : list
        updatedState.lastSelected = selected
        return updatedState
      })
    }
    setBrandLoader(false)
  }

  const getBrandDataList = async ({ selected }) => {
    const params = {
      userId: selected?.id,
    }
    getBrandData({ selected })
    const totalResponse = await getTotalUserDataApi({ params })
    if (totalResponse?.data) {
      setTotalFE(totalResponse?.data)
    }
  }

  const getData = async ({ currentType, selected, pageNo = 1, clear }) => {
    const findIndex = keys(formData)?.findIndex(v => isEqual(v, currentType))
    const nextType = ternary(
      currentType,
      keys(formData)?.[findIndex + 1],
      'user_Dealer',
    )

    if (selected) {
      setFormData(preFormData => ({
        ...preFormData,
        [currentType]: { ...preFormData?.[currentType], selected },
      }))
      getBrandDataList({ pageNo: 1, selected })
    }

    if (notEqual(currentType, lastColumn)) {
      setLoader(preLoader => ({ ...preLoader, [nextType]: true }))
      const params = getParams({ pageNo, currentType: nextType, selected })
      let response = (await getUserList({ params }))?.data
      if (isParentLogin && isEqual(nextType, 'user_Contractor')) {
        const resp = await getUserList({
          params: `${params}&relationType=${userRelationKey.associate}`,
        })
        response = [response, resp?.data]
      }
      setLoader(preLoader => ({ ...preLoader, [nextType]: false }))
      setData({
        response,
        findIndex,
        clear,
      })
    }
  }

  const setData = ({ response, findIndex, clear }) => {
    setFormData(preFormData => {
      const tempForm = { ...preFormData }
      Object.entries(tempForm)?.forEach(([key, value], index) => {
        if (isEqual(index, findIndex + 1)) {
          const hasChild = isArray(response)
          tempForm[key] = {
            ...ternary(clear, { selected: null }, tempForm[key]),
            ...ternary(
              hasChild,
              {
                user_Child: {
                  list: response?.[0]?.list,
                  filtered: response?.[0]?.list,
                  hasMore: response?.[0]?.hasMore,
                  pageNo: response?.[0]?.pageNo,
                  search: null,
                },
                user_Associate: {
                  list: response?.[1]?.list,
                  filtered: response?.[1]?.list,
                  hasMore: response?.[1]?.hasMore,
                  pageNo: response?.[1]?.pageNo,
                  search: null,
                },
              },
              {
                list: response?.list,
                filtered: response?.list,
                hasMore: response?.hasMore,
                pageNo: response?.pageNo,
                search: null,
              },
            ),
          }
        } else if (clear && index > findIndex + 1) {
          const hasChild = !!value?.user_Child
          const initialObj = {
            list: [],
            filtered: [],
            hasMore: false,
            pageNo: 1,
            search: null,
          }
          tempForm[key] = {
            selected: null,
            ...ternary(
              hasChild,
              {
                user_Child: initialObj,
                user_Associate: initialObj,
              },
              initialObj,
            ),
          }
        }
      })
      return tempForm
    })
  }

  const handleSelect = ({ value, name, isClear }) => {
    if (notEqual(formData?.[name]?.selected?.id, value?.id) || isClear) {
      setFieldTableData({})
      setTotalFE({})
      getData({ currentType: name, selected: value, clear: true })
    }
  }
  const handleClear = ({ currentType, index, previousType }) => {
    setFieldTableData({})
    setTotalFE({})

    let tempForm = { ...formData }
    setData({
      findIndex: index - 1,
      response: tempForm[currentType],
      clear: true,
    })
    handleSelect({
      value: tempForm?.[previousType]?.selected,
      name: previousType,
      isClear: true,
    })
  }

  const searchUser = useCallback(
    debounce(
      async ({ name, search = '', isChild, formData, pageNo = 1 }) => {
        const currentType = ternary(isChild, 'user_Contractor', name)
        const findIndex = keys(formData)?.findIndex(v =>
          isEqual(v, currentType),
        )
        const preSelected =
          formData?.[keys(formData)?.[findIndex - 1]]?.selected
        const params = getParams({
          pageNo,
          currentType,
          ...(isEqual(name, 'user_Associate') && { associate: true }),
          ...(preSelected && { selected: preSelected }),
        })
        setLoader(preLoader => ({ ...preLoader, [name]: true }))
        let response
        if (search?.trim()) {
          response = await searchUserApi({
            params: `${params}&${nameParam(
              userLabelRoleId[currentType],
            )}=${search}`,
          })
          if (!response?.data) return
        } else {
          response = await getUserList({ params })
          if (!response?.data) return
        }
        setLoader(preLoader => ({ ...preLoader, [name]: false }))
        setFormData(preFormData => {
          const updatedState = { ...preFormData }
          if (isChild) {
            updatedState.user_Contractor = {
              ...updatedState.user_Contractor,
              [name]: {
                ...updatedState.user_Contractor?.[name],
                filtered: [
                  ...((notEqual(pageNo, 1) &&
                    updatedState.user_Contractor?.[name]?.filtered) ||
                    []),
                  ...response?.data?.list,
                ],
                hasMore: response?.data?.hasMore,
                pageNo: response?.data?.pageNo,
              },
            }
          } else {
            updatedState[name] = {
              ...updatedState[name],
              filtered: [
                ...((notEqual(pageNo, 1) && updatedState?.[name]?.filtered) ||
                  []),
                ...response?.data?.list,
              ],
              hasMore: response?.data?.hasMore,
              pageNo: response?.data?.pageNo,
            }
          }
          return updatedState
        })
      },
      [400],
    ),
    [],
  )

  const handleSearch = ({ e, name }) => {
    const { value } = e.target
    const isChild = include(['user_Child', 'user_Associate'], name)
    setFormData(preFormData => {
      const updatedState = { ...preFormData }
      if (isChild) {
        updatedState.user_Contractor[name] = {
          ...updatedState?.user_Contractor?.[name],
          search: value,
        }
      } else {
        updatedState[name].search = value
      }
      return updatedState
    })

    searchUser({ name, search: value, isChild, formData })
  }

  return {
    brandLoader,
    formData,
    fieldTableData,
    totalFE,
    loader,
    isDisabled,
    isParentLogin,
    handleSelect,
    handleClear,
    handleSearch,
  }
}

export default fieldEngineerView
