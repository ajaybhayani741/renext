import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import { userWiseRole } from '../../../utils/constant'
import { downloadReport } from '../../../utils/customFunctions'
import debounce from '../../../utils/debounce'
import { EVMasterSheet, RefurbishmentRequest } from '../../../utils/icons'
import { include, isEqual, notEqual, values } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { disAssociateApi } from '../../userManagement/user.api'
import { getJobDetailApi, getJobListApi, searchJobListApi } from '../jobs.api'
import {
  columnKeys,
  exportExcelOptions,
  getJobTabList,
  payloadType,
  searchByKeys,
  searchByLabels,
  tabKeys,
} from '../jobs.description'

const jobs = () => {
  const { inspectionOfficer } = userWiseRole
  const { t } = useTranslations()
  const { dispatch, selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
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
  const { roleId } = { ...userDetails }
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
  const [disAssociateHostel, setDisAssociateHostel] = useState({
    open: false,
    data: null,
  })

  const onExportToExcel = async () => {
    setLoading(true)
    const report = isEqual(tabKeys.smeltingRequest, jobType)
      ? RefurbishmentRequest
      : EVMasterSheet
    report && (await downloadReport(report))
    setLoading(false)
  }

  const jobFilter = () => {
    return true
  }

  const tabList = getJobTabList(roleId)
  tabList.type = isEqual(status, tabKeys.unassignHostel)
    ? []
    : tabList.type.filter(info => jobFilter({ info }))

  useEffect(() => {
    if (isEqual(status, tabKeys.unassignHostel)) {
      // When unassign hostel tab is selected, clear the type
      if (type !== null) {
        dispatch(
          setJobActiveTab({
            type: null,
          }),
        )
      }
    } else if (
      !tabList.type?.some(
        ({ key, disabled }) => isEqual(key, type) && !disabled,
      )
    ) {
      dispatch(
        setJobActiveTab({
          status: status || tabList?.status?.[0]?.key,
          type: tabList?.type?.find(({ disabled }) => !disabled)?.key,
        }),
      )
    }
    if (type) {
      setColumnFilters(currentColumns)
    }
  }, [type, status])

  useEffect(() => {
    if (!include(currentSearchBy, searchBy)) {
      setSearchBy(searchByKeys.employeeName)
    }
    if (status) {
      setColumnFilters(currentColumns)
    }
  }, [status, type])

  useEffect(() => {
    if (fiscalYear) {
      if (type) {
        apiCall()
      }
    }
  }, [fiscalYear, status, type])

  useEffect(() => {
    if (searchVal.current) {
      apiCall()
    }
  }, [searchBy])

  const currentColumns = useMemo(() => {
    const {
      jobId,
      // jobTitle,
      createdDate,
      // updatedDate,
      status,
      hostel: hostelCol,
      hostelAddress: hostelAddressCol,
      hostelContact: hostelContactCol,
      inspectionOfficer: inspectionOfficerCol,
    } = columnKeys

    return [
      jobId,
      // jobTitle,
      hostelCol,
      hostelAddressCol,
      hostelContactCol,
      ...(notEqual(roleId, userWiseRole.inspectionOfficer)
        ? [inspectionOfficerCol]
        : []),
      createdDate,

      status,
      // For dynamic columns by role or active tab
      // ...ternary(isEqual(roleId, userWiseRole.admin), ['extra'], []),
      // ...ternary(isEqual(type, tabKeys.quote), ['extra2'], []),
    ]
  }, [type, status, roleId])

  const currentSearchBy = useMemo(() => {
    const { jobId } = searchByKeys

    return [
      jobId,
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
          id: jobId,
          jobType: payloadType[type] || jobType,
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

  const handleViewClick = (jobId, jobType) => {
    setJobModel({ open: true, loader: true })
    setData(pre => ({
      ...pre,
      [type]: {
        ...pre?.[type],
        list: pre?.[type]?.list?.map(value =>
          isEqual(value.jobId, jobId) && !value.read
            ? { ...value, read: true }
            : value,
        ),
        loader: false,
      },
    }))
    viewApiCall(jobId, jobType)
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
      case tabKeys.inspection:
        return include([inspectionOfficer], roleId)

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

  const handleDisAssociateModal = ({ rowData }) => {
    setDisAssociateHostel({ open: !disAssociateHostel?.open, data: rowData })
  }

  const handleConfirmDisAssociate = async () => {
    const payloadData = `?userId=${disAssociateHostel?.data?.userId}&disAssociateUserId=${disAssociateHostel?.data?.hostelInfo?.id}`
    const { data } = await disAssociateApi({ params: payloadData })
    if (data?.success) {
      notifyMethod.success({
        message: 'msg_UserDisAssociatedSuccessfully',
      })
      apiCall(1)
    }
    setDisAssociateHostel({ open: false, data: null })
  }
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
    disAssociateHostel,
    handleDisAssociateModal,
    handleConfirmDisAssociate,
  }
}

export default jobs
