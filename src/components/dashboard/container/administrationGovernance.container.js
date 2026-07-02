import { useEffect, useMemo, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import {
  getInspectionAssessmentHostelsApi,
  getInspectionAssessmentPieChartApi,
} from '../dashboard.api'
import { getHostelChartParams } from '../dashboardFunctions'

const administrationGovernance = ({
  hostelFilter = 'All',
  moduleName = 'ADMINISTRATION_GOVERNANCE',
} = {}) => {
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState({})
  const [summaryData, setSummaryData] = useState({})

  const pieData = useMemo(
    () => [
      {
        name: 'Satisfactory',
        value: summaryData?.satisfactoryCount || 0,
        color: '#58b766',
        category: 'Satisfactory',
        filterValue: 'SATISFACTORY',
      },
      {
        name: 'Needs Attention',
        value: summaryData?.needsAttentionCount || 0,
        color: '#f8c21c',
        category: 'Needs Attention',
        filterValue: 'NEEDS_ATTENTION',
      },
      {
        name: 'Critical',
        value: summaryData?.criticalCount || 0,
        color: '#ef4444',
        category: 'Critical',
        filterValue: 'CRITICAL',
      },
    ],
    [summaryData],
  )

  const chartDefinitions = useMemo(() => [{ data: pieData }], [pieData])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter, moduleName])

  const getData = async () => {
    const resp = await getInspectionAssessmentPieChartApi({
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        moduleName,
        ...getHostelChartParams(hostelFilter),
      },
    })

    setSummaryData(resp?.data || {})
  }

  const getHandleClickDataApi = async ({
    filterValue,
    pageNo = 1,
  } = {}) => {
    const resp = await getInspectionAssessmentHostelsApi({
      pageNo,
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        moduleName,
        filterValue,
        ...getHostelChartParams(hostelFilter),
      },
    })

    return resp?.data
  }

  const handleChartClick = async ({ e, name }) => {
    const point = e?.point
    const filterValue = point?.filterValue

    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      filterValue,
    })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
    setSelectedColumn({
      selected: true,
      chartData: {
        category: point?.category,
        type: point?.name,
        chartType: 'pie',
      },
      categoryValue: filterValue,
      moduleName,
      reportChartType: 'INSPECTION_ASSESSMENT',
      title: name,
      modalTitle: true,
    })
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
    })
    setHostelsData({})
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))

    const respData = await getHandleClickDataApi({
      filterValue: selectedColumn?.categoryValue,
      pageNo: current,
    })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
  }

  return {
    chartDefinitions,
    pieData,
    handleChartClick,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default administrationGovernance