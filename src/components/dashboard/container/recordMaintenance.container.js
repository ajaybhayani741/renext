import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { isEqual, keys, values } from '../../../utils/javascript'
import {
  getRecordMaintenanceBarChartApi,
  getRecordMaintenanceHostelsApi,
} from '../dashboard.api'
import { recordMaintenanceCharts } from '../dashboard.description'

const recordMaintenance = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)

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
  }, [dateRange])

  const getDataApi = async ({ name }) => {
    const columnParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'job_RecordMaintenance':
        const authorityResp = await getRecordMaintenanceBarChartApi({
          params: columnParams,
        })
        return authorityResp
      default:
        return null
    }
  }

  const getData = async () => {
    keys(recordMaintenanceCharts)?.forEach(async key => {
      const respData = await getDataApi({ name: key })
      if (isEqual(key, 'job_RecordMaintenance')) {
        const isData = values(respData?.data)?.find(item => item)
        const tempSeriesData = isData
          ? [
              {
                name: t('btn_Yes'),
                data: [
                  respData.data.staffAttendanceRecordMaintainedYes || 0,
                  respData.data.boarderAttendanceRecordMaintainedYes || 0,
                  respData.data.sickBoardersRecordMaintainedYes || 0,
                  respData.data.boarderMovementRecordMaintainedYes || 0,
                  respData.data.visitorRegisterMaintainedYes || 0,
                  respData.data.treasuryBillRegisterMaintainedYes || 0,
                  respData.data.allOtherRecordsMaintainedRegularlyYes || 0,
                ],
              },
              {
                name: t('btn_No'),
                data: [
                  respData.data.staffAttendanceRecordMaintainedNo || 0,
                  respData.data.boarderAttendanceRecordMaintainedNo || 0,
                  respData.data.sickBoardersRecordMaintainedNo || 0,
                  respData.data.boarderMovementRecordMaintainedNo || 0,
                  respData.data.visitorRegisterMaintainedNo || 0,
                  respData.data.treasuryBillRegisterMaintainedNo || 0,
                  respData.data.allOtherRecordsMaintainedRegularlyNo || 0,
                ],
              },
            ]
          : []
        setSeriesData(prev => ({
          ...prev,
          [key]: { series: tempSeriesData },
        }))
      }
    })
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
    }
    switch (name) {
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
    const respData = await getHandleClickDataApi({
      category: categoryMapping[data?.category],
      filterValue: type === t('btn_Yes') ? 'YES' : 'NO',
      name,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        type,
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
        selectedColumn?.chartData?.type === t('btn_Yes') ? 'YES' : 'NO',
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
  }
}

export default recordMaintenance
