import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import {
  getOverallHostelConditionBarChartApi,
  getOverallHostelConditionHostelsApi,
  getRecordMaintenanceHostelsApi,
} from '../dashboard.api'
import { recordMaintenanceCharts } from '../dashboard.description'
import { getHostelChartParams } from '../dashboardFunctions'

const recordMaintenance = ({ hostelFilter } = {}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const seriesData = null
  const [hostelsData, setHostelsData] = useState(null)
  const [overallAssessment, setOverallAssessment] = useState(null)

  const chartData = {
    category: [
      t('dash_Staff'),
      t('dash_Boarder'),
      t('dash_Sick'),
      t('dash_BoarderMovement'),
      t('dash_VisitorRegister'),
      t('job_TreasuryBillRegisterMaintained'),
      t('dash_OtherRecords'),
    ],
  }

  const categoryMapping = {
    [t('dash_Staff')]: 'STAFF_ATTENDANCE',
    [t('dash_Boarder')]: 'BOARDER_ATTENDANCE',
    [t('dash_Sick')]: 'SICK_BOARDERS',
    [t('dash_BoarderMovement')]: 'BOARDER_MOVEMENT',
    [t('dash_VisitorRegister')]: 'VISITOR_REGISTER',
    [t('job_TreasuryBillRegisterMaintained')]: 'TREASURY_BILL_REGISTER',
    [t('dash_OtherRecords')]: 'ALL_OTHER_RECORDS',
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter])

  const getData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      ...getHostelChartParams(hostelFilter),
    }
    const overallAssessmentResp = await getOverallHostelConditionBarChartApi({
      params,
    })
    setOverallAssessment(overallAssessmentResp?.data || null)

    // The record-maintenance/bar-chart API call is disabled while its
    // category charts are hidden.
    // await getDataApi({ name: 'job_RecordMaintenance' })
  }

  const getHandleClickDataApi = async ({
    category,
    filterValue,
    pageNo = 1,
    name,
  } = {}) => {
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      category,
      filterValue,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'overallHostelCondition': {
        const response = await getOverallHostelConditionHostelsApi({
          pageNo,
          params: columnParams,
        })
        return response?.data
      }
      case 'job_RecordMaintenance':
        const roomsResp = await getRecordMaintenanceHostelsApi({
          pageNo,
          params: columnParams,
        })
        return roomsResp?.data
      default:
        return null
    }
  }

  const handleChartClick = async ({ e, name }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const type = data?.series?.name
    const isOverallAssessment = name === 'overallHostelCondition'
    const filterValue = isOverallAssessment
      ? data?.filterValue
      : type === t('btn_Yes')
        ? 'YES'
        : 'NO'
    const respData = await getHandleClickDataApi({
      category: isOverallAssessment
        ? undefined
        : categoryMapping[data?.category],
      filterValue,
      name,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }

    setSelectedColumn({
      selected: true,
      reportChartType: isOverallAssessment
        ? 'OVERALL_HOSTEL_CONDITION'
        : undefined,
      chartData: {
        category: data?.category,
        type,
        filterValue,
        chartType: recordMaintenanceCharts?.[name]?.chartType,
      },
      title: name,
      modalTitle: recordMaintenanceCharts?.[name]?.modalTitle,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      category: categoryMapping[selectedColumn?.chartData?.category],
      filterValue:
        selectedColumn?.chartData?.filterValue ||
        (selectedColumn?.chartData?.type === t('btn_Yes') ? 'YES' : 'NO'),
      name: selectedColumn?.title,
      pageNo: current,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
    setHostelsData({})
  }

  return {
    chartData,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
    overallAssessment,
  }
}

export default recordMaintenance
