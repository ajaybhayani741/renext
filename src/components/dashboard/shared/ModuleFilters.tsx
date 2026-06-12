import { Select } from 'antd'
import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { userWiseRole } from '../../../utils/constant'
import { getUserList, searchUserApi } from '../../userManagement/user.api'

const { Option } = Select

interface ModuleFiltersProps {
  districtFilter: string
  setDistrictFilter: (val: string) => void
  hostelFilter: string | number
  setHostelFilter: (val: string | number) => void
  extraFilters?: React.ReactNode
  leadingContent?: React.ReactNode
}

interface HostelOption {
  id: number
  lastName: string
}

interface HostelListState {
  list: HostelOption[]
  pageNo: number
  lastPage: number
  hasMore: boolean
  loader: boolean
}

const ModuleFilters: React.FC<ModuleFiltersProps> = ({
  districtFilter,
  setDistrictFilter,
  hostelFilter,
  setHostelFilter,
  extraFilters,
  leadingContent,
}) => {
  const [hostelsData, setHostelsData] = useState<HostelListState>({
    list: [],
    pageNo: 0,
    lastPage: 1,
    hasMore: true,
    loader: false,
  })
  const loadingRef = useRef(false)
  const searchRequestRef = useRef(0)
  const activeSearchRef = useRef('')

  const getHostelList = useCallback(async (pageNo = 1) => {
    if (loadingRef.current) {
      return
    }

    loadingRef.current = true
    setHostelsData(prev => ({ ...prev, loader: true }))

    const response = await getUserList({
      params: `${pageNo}?roleId=${userWiseRole.hostel}`,
    })
    const responseData = response?.data || response || {}
    const nextList: HostelOption[] = (responseData?.list || []).filter(
      item => item?.id && item?.lastName,
    )
    const nextPageNo = responseData?.pageNo || pageNo
    const nextLastPage = responseData?.lastPage || nextPageNo
    const nextHasMore =
      typeof responseData?.hasMore === 'boolean'
        ? responseData.hasMore
        : nextPageNo < nextLastPage

    if (activeSearchRef.current) {
      loadingRef.current = false
      return
    }

    setHostelsData(prev => {
      const mergedList = pageNo === 1 ? nextList : [...prev.list, ...nextList]
      const uniqueList = Array.from(
        new Map(mergedList.map(item => [item.id, item])).values(),
      )

      return {
        list: uniqueList,
        pageNo: nextPageNo,
        lastPage: nextLastPage,
        hasMore: nextHasMore,
        loader: false,
      }
    })
    loadingRef.current = false
  }, [])

  const searchHostelList = useCallback(async (searchText: string, pageNo = 1) => {
    const trimmedSearch = searchText.trim()
    const requestId = searchRequestRef.current + 1
    searchRequestRef.current = requestId
    activeSearchRef.current = trimmedSearch

    if (!trimmedSearch) {
      loadingRef.current = false
      getHostelList(1)
      return
    }

    loadingRef.current = true
    setHostelsData(prev => ({ ...prev, loader: true }))

    try {
      const response = await searchUserApi({
        params: `${pageNo}?name=${encodeURIComponent(trimmedSearch)}&roleId=${
          userWiseRole.hostel
        }`,
      })

      if (searchRequestRef.current !== requestId) {
        return
      }

      const responseData = response?.data || response || {}
      const nextList: HostelOption[] = (responseData?.list || []).filter(
        item => item?.id && item?.lastName,
      )
      const nextPageNo = responseData?.pageNo || pageNo
      const nextLastPage = responseData?.lastPage || nextPageNo
      const nextHasMore =
        typeof responseData?.hasMore === 'boolean'
          ? responseData.hasMore
          : nextPageNo < nextLastPage

      setHostelsData(prev => {
        const mergedList = pageNo === 1 ? nextList : [...prev.list, ...nextList]
        const uniqueList = Array.from(
          new Map(mergedList.map(item => [item.id, item])).values(),
        )

        return {
          list: uniqueList,
          pageNo: nextPageNo,
          lastPage: nextLastPage,
          hasMore: nextHasMore,
          loader: false,
        }
      })
    } catch (error) {
      if (searchRequestRef.current === requestId) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } finally {
      if (searchRequestRef.current === requestId) {
        loadingRef.current = false
      }
    }
  }, [getHostelList])

  useEffect(() => {
    getHostelList()
  }, [getHostelList])

  const handleHostelPopupScroll = event => {
    const target = event.target
    const isBottom =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 24

    if (isBottom && hostelsData.hasMore && !hostelsData.loader) {
      const activeSearch = activeSearchRef.current

      if (activeSearch) {
        searchHostelList(activeSearch, hostelsData.pageNo + 1)
        return
      }

      getHostelList(hostelsData.pageNo + 1)
    }
  }

  return (
    <motion.div
      className="dashboard-filter-bar"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {leadingContent}
      {/* <div className="dashboard-filter-card">
        <div className="text-sm font-medium text-slate-500 mb-2">
          Filter by District
        </div>
        <Select
          showSearch
          value={districtFilter}
          onChange={setDistrictFilter}
          style={{ width: '100%' }}
        >
          <Option value="All">All Districts</Option>
          {Array.from(new Set(districts)).map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div> */}

      <div className="dashboard-filter-card">
        <div className="text-sm font-medium text-slate-500 mb-2">
          Filter by Hostel
        </div>
        <Select
          showSearch
          value={hostelFilter}
          onChange={setHostelFilter}
          style={{ width: '100%' }}
          filterOption={false}
          onSearch={searchHostelList}
          onPopupScroll={handleHostelPopupScroll}
          loading={hostelsData.loader}
        >
          <Option value="All">All Hostels</Option>
          {hostelsData.list.map(hostel => (
            <Option key={hostel.id} value={hostel.id}>
              {hostel.lastName}
            </Option>
          ))}
        </Select>
      </div>

      {extraFilters}
    </motion.div>
  )
}

export default React.memo(ModuleFilters)
