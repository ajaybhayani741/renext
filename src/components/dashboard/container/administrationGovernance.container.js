import { useEffect, useMemo, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import {
  getPrincipalAuthorityBarChartApi,
  getPrincipalAuthorityHostelsApi,
} from '../dashboard.api'
import { getHostelChartParams } from '../dashboardFunctions'

const administrationGovernance = ({ hostelFilter } = {}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState({})
  const [summaryData, setSummaryData] = useState({})

  const chartDefinitions = useMemo(() => [], [summaryData, t])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter])

  const getData = async () => {
    const resp = await getPrincipalAuthorityBarChartApi({
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        ...getHostelChartParams(hostelFilter),
      },
    })

    setSummaryData(resp?.data || {})
  }

  const getHandleClickDataApi = async ({
    category,
    filterValue,
    pageNo = 1,
  } = {}) => {
    const resp = await getPrincipalAuthorityHostelsApi({
      pageNo,
      params: {
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
        category,
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
      category: point?.categoryValue,
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

    const selectedCategoryValue = chartDefinitions
      .flatMap(chart => chart.data)
      .find(
        item => item.category === selectedColumn?.chartData?.category,
      )?.categoryValue

    const respData = await getHandleClickDataApi({
      category: selectedCategoryValue,
      filterValue: selectedColumn?.categoryValue,
      pageNo: current,
    })

    setHostelsData(
      respData ? { ...respData, loader: false } : { loader: false },
    )
  }

  return {
    chartDefinitions,
    handleChartClick,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default administrationGovernance
