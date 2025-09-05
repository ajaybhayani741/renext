import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { getItem } from '../../../utils/localstorage'
import { getDiscrepanciesApi, getShiftReportApi } from '../dashboard.api'

const studentMetrics = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const { value: fiscalYear, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const [tiles, setTiles] = useState({
    revenue: 81600,
    costOfGoodsSold: 70560,
  })
  const [totalOverviewChart, setTotalOverviewChart] = useState({})
  const [discrepanciesChart, setDiscrepanciesChart] = useState({})
  const [discrepanciesTable, setDiscrepanciesTable] = useState({})
  const [viewModel, setViewModel] = useState({
    open: false,
    loader: false,
    data: null,
  })

  const userData = JSON.parse(getItem('userData'))

  useEffect(() => {
    if (tiles?.revenue && tiles?.costOfGoodsSold) {
      const profitLoss = tiles?.revenue - tiles?.costOfGoodsSold

      setTiles(prev => ({
        ...prev,
        profitLoss,
      }))
    } else {
      setTiles(prev => ({
        ...prev,
        profitLoss: 0,
      }))
    }
  }, [tiles?.revenue, tiles?.costOfGoodsSold])

  useEffect(() => {
    // if (dateRange?.from && dateRange?.to) {
    getTotalOverviewChart()
    getDiscrepanciesChart()
    // }
    // }, [selected, selectedFilters, equalNotEqual, dateRange?.from, dateRange?.to])
  }, [])

  useEffect(() => {
    if (storeId && fiscalYear && dateRange?.from && dateRange?.to) {
      getDiscrepanciesTableData()
    }
  }, [storeId, fiscalYear, dateRange])

  const getTotalOverviewChart = async () => {
    // const resp = await getTotalOverviewChartApi({
    //   params: { ...commonParams, type: 'TOTAL_OVERVIEW_CHART' },
    // })

    // const respData = resp?.data?.list
    // if (!respData) return

    const respData = [
      {
        monthYear: 'Apr 2025',
        revenue: 0,
        costOfGoodsSold: 750650,
        profitLoss: -750650,
      },
      {
        monthYear: 'May 2025',
        revenue: 84412,
        costOfGoodsSold: 3250,
        profitLoss: 81162,
      },
      {
        monthYear: 'Jun 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Jul 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Aug 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Sep 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Oct 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Nov 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Dec 2025',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Jan 2026',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Feb 2026',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
      {
        monthYear: 'Mar 2026',
        revenue: 0,
        costOfGoodsSold: 0,
        profitLoss: 0,
      },
    ]

    const monthList = respData.map(item => item?.monthYear)

    const metrics = ['revenue', 'costOfGoodsSold', 'profitLoss']
    const dataMap = metrics.reduce((acc, key) => {
      acc[key] = Array.from(
        { length: respData.length },
        (_, i) => respData[i]?.[key] ?? 0,
      )
      return acc
    }, {})

    const maxValue = dataMap ? Math.max(...Object.values(dataMap)?.flat()) : 0

    const series = [
      {
        name: t('dash_Revenue'),
        data: dataMap.revenue,
        color: 'black',
      },
      {
        name: t('dash_CostOfGoodsSold'),
        data: dataMap.costOfGoodsSold,
        color: 'blue',
      },
      {
        name: t('menu_ProfitLoss'),
        data: dataMap.profitLoss,
        color: 'red',
      },
    ]

    setTotalOverviewChart({ monthYear: monthList, series, maxValue })
  }
  const getDiscrepanciesChart = async () => {
    // const resp = await getTotalOverviewChartApi({
    //   params: { ...commonParams, type: 'TOTAL_OVERVIEW_CHART' },
    // })

    // const respData = resp?.data?.list
    // if (!respData) return

    const respData = [
      {
        monthYear: 'Apr 2025',
        ssd: 1200,
        lsd: 100,
        psd: 800,
        std: 500,
        payout: 15,
      },
      {
        monthYear: 'May 2025',
        ssd: 1300,
        lsd: 105,
        psd: 900,
        std: 520,
        payout: 20,
      },
      {
        monthYear: 'Jun 2025',
        ssd: 1500,
        lsd: 110,
        psd: 1000,
        std: 550,
        payout: 25,
      },
      {
        monthYear: 'Jul 2025',
        ssd: 1600,
        lsd: 115,
        psd: 1100,
        std: 600,
        payout: 30,
      },
      {
        monthYear: 'Aug 2025',
        ssd: 1800,
        lsd: 120,
        psd: 1200,
        std: 650,
        payout: 35,
      },
      {
        monthYear: 'Sep 2025',
        ssd: 2000,
        lsd: 125,
        psd: 1300,
        std: 700,
        payout: 40,
      },
      {
        monthYear: 'Oct 2025',
        ssd: 1900,
        lsd: 120,
        psd: 1250,
        std: 675,
        payout: 38,
      },
      {
        monthYear: 'Nov 2025',
        ssd: 1700,
        lsd: 115,
        psd: 1150,
        std: 625,
        payout: 32,
      },
      {
        monthYear: 'Dec 2025',
        ssd: 1500,
        lsd: 110,
        psd: 1000,
        std: 580,
        payout: 28,
      },
      {
        monthYear: 'Jan 2026',
        ssd: 1300,
        lsd: 105,
        psd: 900,
        std: 530,
        payout: 22,
      },
      {
        monthYear: 'Feb 2026',
        ssd: 1100,
        lsd: 100,
        psd: 800,
        std: 480,
        payout: 18,
      },
      {
        monthYear: 'Mar 2026',
        ssd: 1000,
        lsd: 95,
        psd: 700,
        std: 430,
        payout: 15,
      },
    ]

    const monthList = respData.map(item => item?.monthYear)

    const metrics = ['ssd', 'lsd', 'psd', 'std', 'payout']
    const dataMap = metrics.reduce((acc, key) => {
      acc[key] = Array.from(
        { length: respData.length },
        (_, i) => respData[i]?.[key] ?? 0,
      )
      return acc
    }, {})

    const maxValue = dataMap ? Math.max(...Object.values(dataMap)?.flat()) : 0

    const series = [
      {
        name: t('txt_ScratchSalesDifference'),
        data: dataMap.ssd,
        color: 'black',
      },
      {
        name: t('txt_LottoSalesDifference'),
        data: dataMap.lsd,
        color: 'blue',
      },
      {
        name: t('txt_PrepaidSalesDifference'),
        data: dataMap.psd,
        color: 'red',
      },
      {
        name: t('txt_SalesTubesDifference'),
        data: dataMap.std,
        color: 'grey',
      },
      {
        name: t('txt_PayoutDifference'),
        data: dataMap.payout,
        color: 'orange',
      },
    ]

    setDiscrepanciesChart({ monthYear: monthList, series, maxValue })
  }

  const getShiftReportCall = async () => {
    setViewModel(prev => ({ ...prev, loader: true }))
    const resp = await getShiftReportApi({
      params: {
        storeId,
        userId: userData?.id,
        fiscalYear,
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
      },
    })
    setViewModel(prev => ({ ...prev, loader: false, data: resp?.data }))
  }

  const onViewShiftReportClick = () => {
    setViewModel({ open: true })
    getShiftReportCall()
  }

  const onViewModelClose = () => {
    setViewModel({ open: false, loader: false })
  }

  const getDiscrepanciesTableData = async () => {
    setDiscrepanciesTable(prev => ({ ...prev, loader: true }))
    const resp = await getDiscrepanciesApi({
      params: {
        storeId,
        userId: userData?.id,
        fiscalYear,
        fromDate: dateRange?.from,
        toDate: dateRange?.to,
      },
    })
    setDiscrepanciesTable(prev => ({ ...prev, loader: false, ...resp?.data }))
  }

  return {
    t,
    tiles,
    viewModel,
    totalOverviewChart,
    discrepanciesChart,
    discrepanciesTable,
    onViewModelClose,
    onViewShiftReportClick,
  }
}

export default studentMetrics
