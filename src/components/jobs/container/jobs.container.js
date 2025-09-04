import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import { getDummyUser, userWiseRole } from '../../../utils/constant'
import { downloadReport } from '../../../utils/customFunctions'
import debounce from '../../../utils/debounce'
import { EVMasterSheet, RefurbishmentRequest } from '../../../utils/icons'
import {
  include,
  isArray,
  isEqual,
  notEqual,
  ternary,
  values,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { getJobDetailApi, getJobListApi, searchJobListApi } from '../jobs.api'
import {
  columnKeys,
  exportExcelOptions,
  jobTabList,
  payloadType,
  searchByKeys,
  searchByLabels,
  tabKeys,
} from '../jobs.description'

const jobs = () => {
  const { recoveryAgent, recycler, refurbisher, trader, supplier, dataEntry } =
    userWiseRole
  const { t } = useTranslations()
  const { dispatch, selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const storeId = selector(state => state?.app?.store?.selected)
  const { value: fiscalYear } = selector(state => state?.app?.fiscalYear)
  const activeTab = selector(state => state?.jobs?.activeTab)
  const { type, status } = { ...activeTab }
  const [searchBy, setSearchBy] = useState(searchByKeys.jobId)
  const [columnFilters, setColumnFilters] = useState([])
  const [columnExportToExcel, setColumnExportToExcel] = useState([
    'job_SNo',
    'job_DateOfReceiptOfVehicle',
    'job_RVSFVehicleNo',
    'user_Type',
    'job_Source',
    'user_ProducerName',
    'job_CustomerName',
    'job_VehicleNo',
    'job_ManufacturingDate',
    'job_RegistrationDate',
    'job_ELVModel',
    'job_Category',
  ])
  const searchVal = useRef(null)
  const userDetails = JSON.parse(getItem('userData'))
  const { roleId, id: loginUserId } = { ...userDetails }
  const loginUserDetails = getDummyUser({ roleId, userId: loginUserId })
  const [data, setData] = useState({})
  const [jobModel, setJobModel] = useState({
    open: false,
    loader: false,
    data: null,
  })
  const [loading, setLoading] = useState(false)
  const { type: jobType } = { ...activeTab }
  const [selectExportColModal, setSelectExportColModal] = useState({
    open: false,
    selectedColumn: [
      'S. No.',
      'Date of Receipt of Vehicle',
      'Scrapping Facility Vehicle No.',
      'Type',
      'Source',
      'Producer Name',
      'Customer Name',
      'Vehicle No.',
      'Manufacturing Date',
      'Registration Date',
      'ELV Model',
    ],
  })

  const onExportToExcel = async () => {
    setLoading(true)
    const report = isEqual(tabKeys.smeltingRequest, jobType)
      ? RefurbishmentRequest
      : EVMasterSheet
    report && (await downloadReport(report))
    setLoading(false)
  }

  const jobFilter = ({ info }) => {
    if (
      !loginUserDetails?.doAbleJobs?.partProduction &&
      isEqual(roleId, refurbisher)
    ) {
      return (
        include(info?.permission, roleId) &&
        !include(
          [
            'job_SupplierProduction',
            'job_PartSalesProducer',
            'job_PartSalesPartProducer',
          ],
          info?.label,
        )
      )
    } else {
      return include(info?.permission, roleId)
    }
  }

  const tabList = {
    status: jobTabList.status,
    type: jobTabList.type
      .filter(info => jobFilter({ info }))
      ?.map(info => ({
        ...info,
        disabled:
          isArray(loginUserDetails?.jobAccess) &&
          !include(loginUserDetails.jobAccess, info?.key),
      })),
  }

  useEffect(() => {
    if (
      !tabList.type?.some(
        ({ key, disabled }) => isEqual(key, type) && !disabled,
      )
    ) {
      dispatch(
        setJobActiveTab({
          status: tabKeys.active,
          type: tabList?.type?.find(({ disabled }) => !disabled)?.key,
        }),
      )
    }
    if (type) {
      setColumnFilters(currentColumns)
    }
  }, [type])

  useEffect(() => {
    if (!include(currentSearchBy, searchBy)) {
      setSearchBy(searchByKeys.employeeName)
    }
    if (fiscalYear && storeId) apiCall()
    if (status) {
      setColumnFilters(currentColumns)
    }
  }, [fiscalYear, status, type, storeId])

  useEffect(() => {
    if (searchVal.current) {
      apiCall()
    }
  }, [searchBy])

  const currentColumns = useMemo(() => {
    const {
      jobId,
      employeeName,
      shiftDate,
      shiftType,
      loginTime,
      logoutTime,
      shiftTime,
    } = columnKeys

    return [
      jobId,
      employeeName,
      shiftType,
      loginTime,
      ...ternary(
        isEqual(status, tabKeys.complete),
        [shiftDate, logoutTime, shiftTime],
        [],
      ),
      // For dynamic columns by role or active tab
      // ...ternary(isEqual(roleId, userWiseRole.admin), ['extra'], []),
      // ...ternary(isEqual(type, tabKeys.quote), ['extra2'], []),
    ]
  }, [type, status, roleId])

  const currentSearchBy = useMemo(() => {
    const { employeeName } = searchByKeys

    return [
      employeeName,
      // For dynamic searchBy by role or active tab
      // ...ternary(isEqual(roleId, userWiseRole.admin), ['extra'], []),
      // ...ternary(isEqual(type, tabKeys.quote), ['extra2'], []),
    ]
  }, [type, roleId])

  const columnFilterOptions = [columnKeys.all, ...values(currentColumns)].map(
    value => ({
      label: t(value),
      value: value,
    }),
  )

  const searchByOptions = values(currentSearchBy).map(value => ({
    label: t(searchByLabels[value]),
    value: value,
  }))

  const apiCall = async (pageNo = 1, range) => {
    if (!payloadType[type]) return
    const params = {
      storeId,
      jobType: payloadType[type],
      fiscalYear,
      active: isEqual(status, tabKeys.active),
    }
    setData(pre => ({
      ...pre,
      [type]: { ...pre?.[type], loader: true },
    }))
    let resp
    if (searchVal.current || range) {
      if (searchVal.current) {
        params.searchTag = searchBy
        params.search = searchVal.current
      }

      if (range) {
        const from = range?.from
        const to = range?.to
        params.fromDate = from
        params.toDate = to
      }
      resp = await searchJobListApi({ params, pageNo })
    } else {
      resp = await getJobListApi({ params, pageNo })
    }
    setData(pre => ({
      ...pre,
      [type]: {
        ...resp?.data,
        loader: false,
      },
    }))
  }

  const viewApiCall = useCallback(
    async jobId => {
      const response = await getJobDetailApi({
        params: {
          jobId,
          jobType: payloadType[tabKeys.shift],
        },
      })
      setJobModel(pre => ({ ...pre, loader: false, data: response?.data }))
    },
    [type, status],
  )

  const handleTableChange = pagination => {
    apiCall(pagination.current)
  }

  const onSearch = debounce(async e => {
    const { value } = e.target
    searchVal.current = value?.trim()
    apiCall()
  }, 600)

  const handleTabChange = tab => {
    if (tab?.status) {
      if (notEqual(tab?.status, tabKeys.active)) {
        const updatedFilters = columnFilters.filter(val =>
          notEqual(val, columnKeys.activeDays),
        )
        setColumnFilters(updatedFilters)
      } else {
        setColumnFilters(pre => [...pre, columnKeys.activeDays])
      }
    }
    dispatch(setJobActiveTab(tab))
  }

  const handleSearchByChange = value => {
    setSearchBy(value)
  }

  const handleColumnFilterChange = values => {
    let newValues = values
    if (include(values, columnKeys.all)) {
      newValues = currentColumns
    }
    setColumnFilters(newValues)
  }

  const handleColumnExcelChange = values => {
    setColumnExportToExcel(values)
  }

  const handleViewClick = jobId => {
    setJobModel({ open: true, loader: true })
    viewApiCall(jobId)
  }

  const handleCloseModel = () =>
    setJobModel({ ...jobModel, open: false, data: null })

  const searchByProps = {
    value: searchBy,
    options: searchByOptions,
    onChange: handleSearchByChange,
  }

  const exportExcelList = exportExcelOptions.map(value => ({
    label: t(value?.label),
    value: value?.value,
  }))

  const exportExcelProps = {
    mode: 'multiple',
    value: columnExportToExcel?.map(value => t(value)),
    options: exportExcelList,
    onChange: handleColumnExcelChange,
    maxTagCount: 'responsive',
  }

  const columnFilterProps = {
    mode: 'multiple',
    value: columnFilters,
    options: columnFilterOptions,
    onChange: handleColumnFilterChange,
  }

  const checkEditPermission = jobStatus => {
    if (isEqual(status, tabKeys.complete)) return false
    switch (type) {
      case tabKeys.recovery:
        return include([recoveryAgent, recycler, dataEntry], roleId)

      case tabKeys.recycleRequest:
        // const statusPermission = {
        //   RECYCLE_REQUESTED: [recycler],
        //   RECYCLE_REQUEST_AWAITING_RECEPTION: [recycler],
        // }
        return include([recycler, dataEntry], roleId)

      case tabKeys.recycle:
        return include([recycler, dataEntry], roleId)

      case tabKeys.smeltingRequest:
      case tabKeys.smelting:
      case tabKeys.materialSalesSupplier:
        return include([refurbisher], roleId)

      case tabKeys.materialSalesProducer:
        return include([supplier], roleId)

      case tabKeys.materialSalesMaterialProducer:
        return include([refurbisher], roleId)

      case tabKeys.partSalesPartProducer:
        return include([supplier], roleId)

      case tabKeys.sales:
        return include([refurbisher, trader], roleId)

      default:
        return false
    }
  }

  const onSelectExportCol = () => {
    setSelectExportColModal(prev => ({ ...prev, open: !prev.open }))
  }

  const onSelectColumn = list => {
    setSelectExportColModal(prev => ({ ...prev, selectedColumn: list }))
  }

  const onSelectAllColumn = e => {
    setSelectExportColModal(prev => ({
      ...prev,
      selectedColumn: e.target.checked
        ? exportExcelOptions?.map(value => value?.value)
        : [],
    }))
  }

  const searchSelectOptions = []

  return {
    t,
    data: data[type],
    tabList,
    jobModel,
    isDesktop,
    activeTab,
    columnFilters,
    searchByProps,
    columnFilterProps,
    searchSelectOptions,
    apiCall,
    onSearch,
    handleViewClick,
    handleCloseModel,
    handleTabChange,
    handleTableChange,
    checkEditPermission,
    loading,
    onExportToExcel,
    exportExcelProps,
    onSelectExportCol,
    selectExportColModal,
    onSelectColumn,
    onSelectAllColumn,
  }
}

export default jobs
