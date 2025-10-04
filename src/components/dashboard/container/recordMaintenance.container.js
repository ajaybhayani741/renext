import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { values } from '../../../utils/javascript'
import {
  getRecordMaintenanceBarChartApi,
  getRecordMaintenanceHostelsApi,
} from '../dashboard.api'

const recordMaintenance = () => {
  const { t } = useTranslations()
  const title = t('job_RecordMaintenance')
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)

  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getSeriesData()
    }
  }, [dateRange])

  const chartData = {
    category: [
      t('dash_Staff'),
      t('dash_Boarder'),
      t('dash_Sick'),
      t('dash_BoarderMovement'),
      t('dash_VisitorRegister'),
      t('dash_OtherRecords'),
    ],
  }

  const categoryMapping = {
    [t('dash_Staff')]: 'STAFF_ATTENDANCE',
    [t('dash_Boarder')]: 'BOARDER_ATTENDANCE',
    [t('dash_Sick')]: 'SICK_BOARDERS',
    [t('dash_BoarderMovement')]: 'BOARDER_MOVEMENT',
    [t('dash_VisitorRegister')]: 'VISITOR_REGISTER',
    [t('dash_OtherRecords')]: 'ALL_OTHER_RECORDS',
  }

  const getHostelsData = async ({
    data,
    pageNo = selectedColumn?.pageNo || 1,
  }) => {
    const category = data?.category || selectedColumn?.chartData?.category
    const type = data?.series?.name || selectedColumn?.chartData?.type
    const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
    const apiCategory = categoryMapping[category]

    try {
      setHostelsData(prev => ({ ...prev, loader: true }))
      const params = {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        category: apiCategory,
        filterValue: filterValue,
      }

      const response = await getRecordMaintenanceHostelsApi({
        params,
        pageNo,
      })

      if (response && response.data) {
        setSelectedColumn({
          selected: true,
          chartData: {
            category,
            type,
          },
          list: response.data.hostels || [],
          title: 'job_RecordMaintenance',
          modalTitle: true,
          ...response.data,
        })
        setHostelsData({ ...response.data, loader: false })
      }
    } catch (error) {
      return
    } finally {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  const handleChartClick = async e => {
    const data = e.point
    getHostelsData({ data })
  }

  const getSeriesData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getRecordMaintenanceBarChartApi({
      params,
    })

    if (response && response.data) {
      const isData = values(response?.data)?.find(item => item)
      setSeriesData(
        isData && [
          {
            name: t('btn_Yes'),
            data: [
              response.data.staffAttendanceRecordMaintainedYes || 0,
              response.data.boarderAttendanceRecordMaintainedYes || 0,
              response.data.sickBoardersRecordMaintainedYes || 0,
              response.data.boarderMovementRecordMaintainedYes || 0,
              response.data.visitorRegisterMaintainedYes || 0,
              response.data.allOtherRecordsMaintainedRegularlyYes || 0,
            ],
          },
          {
            name: t('btn_No'),
            data: [
              response.data.staffAttendanceRecordMaintainedNo || 0,
              response.data.boarderAttendanceRecordMaintainedNo || 0,
              response.data.sickBoardersRecordMaintainedNo || 0,
              response.data.boarderMovementRecordMaintainedNo || 0,
              response.data.visitorRegisterMaintainedNo || 0,
              response.data.allOtherRecordsMaintainedRegularlyNo || 0,
            ],
          },
        ],
      )
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

  const handleTableChange = async ({ current }) => {
    getHostelsData({ pageNo: current })
  }

  return {
    title,
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
