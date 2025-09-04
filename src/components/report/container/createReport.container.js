import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setFiscalYear, setPopupMessageModel } from '../../../redux/app/reducer'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { apiParams } from '../../../utils'
import { numberFormat } from '../../../utils/customFunctions'
import { dayJs } from '../../../utils/dayjs'
import {
  entries,
  isEqual,
  keys,
  length,
  notEqual,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { getShiftReportApi } from '../../dashboard/dashboard.api'
import {
  exportToExcelApi,
  getColumnListApi,
  saveFlexibleReportApi,
} from '../report.api'

const createReport = ({ editData }) => {
  const { t } = useTranslations()
  const { selector, dispatch } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const { value: fiscalYear, dateRange } = selector(
    state => state?.app?.fiscalYear,
  )
  const form = useFormFn()

  const [viewPreviousHistory, setViewPreviousHistory] = useState({
    open: false,
    data: [],
  })
  const [modal, setModal] = useState({ open: false })
  const [selectedFilters, setSelectedFilters] = useState({})
  const [equalNotEqual, setEqualNotEqual] = useState({})
  const [columnList, setColumnList] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [loader, setLoader] = useState(false)
  const [flexibleReportData, setFlexibleReportData] = useState({})

  const userData = JSON.parse(getItem('userData'))

  useEffect(() => {
    columnListApi()
    const todayDate = dayJs().format('DD/MM/YYYY')
    const fiscalYear = dayJs().isBefore(`${dayJs().year()}-04-01`)
      ? dayJs().year() - 1
      : dayJs().year()
    dispatch(
      setFiscalYear({
        dateRange: { from: todayDate, to: todayDate },
        value: fiscalYear,
      }),
    )
  }, [])

  useEffect(() => {
    if (editData) {
      setEditDataToFilters()
    }
  }, [editData])

  useEffect(() => {
    if (storeId && fiscalYear && dateRange?.from && dateRange?.to) {
      getFlexibleReportCall()
    }
  }, [storeId, fiscalYear, dateRange])

  const setEditDataToFilters = () => {
    if (!length(keys(editData))) return

    setColumnFilters(length(editData?.columnIds) ? editData?.columnIds : [])
  }

  const cellRender = rowData => rowData ?? '-'

  const flexibleReportColumns = {
    queenPayout: {
      title: 'txt_QueenPayout',
      dataIndex: 'queenPayout',
      render: cellRender,
    },
    scratchPayout: {
      title: 'rpt_ScratchPayoutLotteryMachines',
      dataIndex: 'scratchPayout',
      render: cellRender,
    },
    lottoPayout: {
      title: 'rpt_LottoPayoutLotteryMachines',
      dataIndex: 'lottoPayout',
      render: cellRender,
    },
    cashback: {
      title: 'rpt_CashBack',
      dataIndex: 'cashback',
      render: cellRender,
    },
    vendorPayout: {
      title: 'menu_VendorPayout',
      dataIndex: 'vendorPayout',
      render: cellRender,
    },
    safeDrop: {
      title: 'rpt_SafeDrop',
      dataIndex: 'safeDrop',
      render: cellRender,
    },
    refund: {
      title: 'rpt_Refund',
      dataIndex: 'refund',
      render: cellRender,
    },
    voidTickets: {
      title: 'rpt_VoidTickets',
      dataIndex: 'voidTickets',
      render: cellRender,
    },
    total: {
      title: 'dvz_Total',
      dataIndex: 'total',
      render: cellRender,
    },
    scratchSales: {
      title: 'rpt_ScratchSales',
      dataIndex: 'scratchSales',
      render: cellRender,
    },
    scratchSalesReport: {
      title: 'rpt_ScratchSalesReportShiftReport',
      dataIndex: 'scratchSalesReport',
      render: cellRender,
    },
    lottoSalesShiftReport: {
      title: 'rpt_LottoSalesReportShiftReport',
      dataIndex: 'lottoSalesShiftReport',
      render: cellRender,
    },
    lottoSalesLotteryMachineReport: {
      title: 'rpt_LottoSalesReportLotteryMachines',
      dataIndex: 'lottoSalesLotteryMachineReport',
      render: cellRender,
    },
    prepaidSales: {
      title: 'rpt_PrepaidSalesBatchTotal',
      dataIndex: 'prepaidSales',
      render: cellRender,
    },
    prepaidSalesReport: {
      title: 'rpt_PrepaidSalesReportShiftReport',
      dataIndex: 'prepaidSalesReport',
      render: cellRender,
    },
    totalScratchDifference: {
      title: 'rpt_TotalScratchDifference',
      dataIndex: 'totalScratchDifference',
      render: cellRender,
    },
    totalLottoDifference: {
      title: 'rpt_TotalLottoDifference',
      dataIndex: 'totalLottoDifference',
      render: cellRender,
    },
    shiftSalesReport: {
      title: 'rpt_ShiftSalesReport',
      dataIndex: 'shiftSalesReport',
      render: cellRender,
    },
    cashReport: {
      title: 'rpt_CashReport',
      dataIndex: 'cashReport',
      render: cellRender,
    },
    paymentInReport: {
      title: 'rpt_PaymentInReport',
      dataIndex: 'paymentInReport',
      render: cellRender,
    },
    totalCash: {
      title: 'rpt_TotalCash',
      dataIndex: 'totalCash',
      render: cellRender,
    },
    paymentOutReport: {
      title: 'rpt_PaymentOutReport',
      dataIndex: 'paymentOutReport',
      render: cellRender,
    },
    payoutDifference: {
      title: 'rpt_PayoutDifference',
      dataIndex: 'payoutDifference',
      render: cellRender,
    },
    johnsTubesTotal: {
      title: 'rpt_JohnsTubesTotal',
      dataIndex: 'johnsTubesTotal',
      render: cellRender,
    },
    safeTubesDifference: {
      title: 'rpt_SafeTubesDifference',
      dataIndex: 'safeTubesDifference',
      render: cellRender,
    },
    balance: {
      title: 'rpt_Balance',
      dataIndex: 'balance',
      render: cellRender,
    },
    totalPrepaidDifference: {
      title: 'rpt_TotalPrepaidDifference',
      dataIndex: 'totalPrepaidDifference',
      render: cellRender,
    },
    salesDifference: {
      title: 'rpt_TotalSalesDifference',
      dataIndex: 'salesDifference',
      render: cellRender,
    },
    queenCashIn1: {
      title: 'rpt_QueenCashIn1',
      dataIndex: 'queenCashIn1',
      render: cellRender,
    },
    queenCashIn2: {
      title: 'rpt_QueenCashIn2',
      dataIndex: 'queenCashIn2',
      render: cellRender,
    },
    queenCashOut3: {
      title: 'rpt_QueenCashOut3',
      dataIndex: 'queenCashOut3',
      render: cellRender,
    },
    totalQueenCashIn: {
      title: 'rpt_TotalQueenCashIn',
      dataIndex: 'totalQueenCashIn',
      render: cellRender,
    },
    banillaCashIn: {
      title: 'rpt_BanillaCashIn',
      dataIndex: 'banillaCashIn',
      render: cellRender,
    },
    banillaCashOut: {
      title: 'rpt_BanillaCashOut',
      dataIndex: 'banillaCashOut',
      render: cellRender,
    },
    banillaDifference: {
      title: 'rpt_BanillaDifference',
      dataIndex: 'banillaDifference',
      render: cellRender,
    },
    frontierCashIn: {
      title: 'rpt_FrontierCashIn',
      dataIndex: 'frontierCashIn',
      render: cellRender,
    },
    frontierCashOut: {
      title: 'rpt_FrontierCashOut',
      dataIndex: 'frontierCashOut',
      render: cellRender,
    },
    frontierBalance: {
      title: 'rpt_FrontierBalance',
      dataIndex: 'frontierBalance',
      render: cellRender,
    },
    // 'Fuel Type': {
    //   dataIndex: ['vehicleFuelType', 'key'],
    //   render: rowData => (rowData ? t(rowData) : '-'),
    // },
    // 'Quoted Price': {
    //   dataIndex: 'quotedPrice',
    //   isNumeric: true,
    //   render: rowData => rowData ?? '-',
    // },
    // 'Date of Receipt of Vehicle': {
    //   dataIndex: 'dateOfReceipt',
    //   render: rowData => (rowData ? dayJs(rowData).format('YYYY/MM/DD') : '-'),
    // },
    // 'Pre-Inspection Completed': {
    //   dataIndex: 'preInspectionCompleted',
    //   render: rowData =>
    //     isEqual(rowData, true)
    //       ? t('btn_Yes')
    //         ? isEqual(rowData, false)
    //         : t('btn_No')
    //       : '-',
    // },
  }

  const columnListApi = async () => {
    const response = await getColumnListApi({
      params: apiParams({ params: { sheetType: 'FLEXIBLE_REPORT' } }),
    })
    if (length(response?.data?.list)) {
      const keyIdMap = response?.data?.list?.reduce((acc, item) => {
        acc[item?.columnKey] = item?.id
        return acc
      }, {})
      setColumnList(
        entries(flexibleReportColumns)
          ?.map(([key, value]) => {
            return {
              key: keyIdMap[key],
              ...value,
              render: rawData =>
                Number(rawData) ? numberFormat(rawData?.toFixed?.(2)) : rawData,
            }
          })
          ?.filter(({ key }) => key),
      )
      !editData?.id &&
        setColumnFilters([
          keyIdMap['scratchSales'],
          keyIdMap['queenPayout'],
          keyIdMap['johnsTubesTotal'],
        ])
    }
  }

  const onGenerateReport = async () => {
    const payload = {
      reportType: 'FLEXIBLE_REPORT',
      storeId,
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      columnIds: columnFilters,
    }
    const response = await exportToExcelApi({ payload })
    if (response?.data?.success) {
      dispatch(
        setPopupMessageModel({
          open: true,
          message: 'msg_ReportGenerated',
          success: true,
        }),
      )
    }
  }

  const getFlexibleReportCall = async () => {
    setLoader(true)
    try {
      const response = await getShiftReportApi({
        params: {
          storeId,
          userId: userData?.id,
          fiscalYear,
          fromDate: dateRange?.from,
          toDate: dateRange?.to,
        },
      })
      if (response?.data) {
        setFlexibleReportData(response?.data)
      }
    } catch (error) {
    } finally {
      setLoader(false)
    }
  }

  const handleColumnFilterChange = values => {
    setColumnFilters(values)
  }

  const onSelectionChange = ({ key, selectedKeys, type }) => {
    const modifySelectedFilters = (key, selectedKeys) => {
      const tempSelectedFilters = { ...selectedFilters }
      tempSelectedFilters[key] = selectedKeys
      setSelectedFilters(tempSelectedFilters)
      if (isEqual(key, 'dateFilter')) return

      //api call
      getFlexibleReportCall({ data: tempSelectedFilters })
    }
    if (type === 'deselect') {
      modifySelectedFilters(key, selectedKeys)
    } else {
      modifySelectedFilters(key, selectedKeys)
    }
  }

  const onEqualNotEqualChange = ({ key, value }) => {
    const updatedEqualNotEqual = { ...equalNotEqual, [key]: value }
    setEqualNotEqual(updatedEqualNotEqual)

    if (selectedFilters[key]) {
      getFlexibleReportCall({
        data: selectedFilters,
        matchType: updatedEqualNotEqual,
      })
    }
  }

  const handleDateRangeChange = ({ key, dates }) => {
    const tempSelectedFilters = { ...selectedFilters }
    tempSelectedFilters[key] = dates
    setSelectedFilters(tempSelectedFilters)
    //api call
    getFlexibleReportCall({ data: tempSelectedFilters })
  }

  const filterDropdownItems = []

  const onSaveModalToggle = () => {
    setModal({ open: !modal?.open })
    if (modal?.open) {
      form.resetFields()
    }
  }

  const onSaveReport = async () => {
    setLoader(true)
    const { name, description } = form.getFieldsValue()
    const payload = {
      storeId: storeId,
      reportId: editData?.id,
      columnIds: columnFilters,
      name,
      description,
      sendEmail: false,
    }
    const response = await saveFlexibleReportApi({ payload })
    if (response?.data) {
      onSaveModalToggle()
    }
    setLoader(false)
  }

  const onRemoveDateFilter = dateKey => {
    const updatedFilters = {
      ...selectedFilters,
      dateFilter: (selectedFilters?.['dateFilter'] || [])?.filter(item =>
        notEqual(item, dateKey),
      ),
      [dateKey]: null,
    }
    setSelectedFilters(updatedFilters)

    if (selectedFilters?.[dateKey]?.[0]) {
      getFlexibleReportCall({ data: updatedFilters })
    }
  }

  const viewHistoryPayload = {
    reportType: 'FLEXIBLE_REPORT',
    storeId,
  }

  return {
    t,
    form,
    modal,
    loader,
    columnList,
    equalNotEqual,
    columnFilters,
    selectedFilters,
    flexibleReportData,
    filterDropdownItems,
    viewPreviousHistory,
    viewHistoryPayload,
    onSaveModalToggle,
    onSelectionChange,
    onEqualNotEqualChange,
    handleDateRangeChange,
    setViewPreviousHistory,
    handleColumnFilterChange,
    onGenerateReport,
    onSaveReport,
    onRemoveDateFilter,
  }
}

export default createReport
