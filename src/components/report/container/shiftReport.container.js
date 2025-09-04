import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { deepClone, fixedNumber } from '../../../utils/customFunctions'
import { dayJs } from '../../../utils/dayjs'
import { include, isEqual, nullOrUndefined } from '../../../utils/javascript'
import {
  getReportDetailsApi,
  triggerReportApi,
  updateReportApi,
} from '../report.api'
import { allPayoutData } from '../report.description'

const shiftReport = ({ isDailyReport, shiftId }) => {
  const { t } = useTranslations()
  const { dispatch, selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const { shiftId: activeShiftId } = selector(state => state?.app?.shift) || {}
  const [loader, setLoader] = useState(false)
  const [viewPreviousHistory, setViewPreviousHistory] = useState({
    open: false,
    data: [],
  })

  const [disabled, setDisabled] = useState(false)
  const [dataSource, setDataSource] = useState({})
  const [date, setDate] = useState(dayJs())

  useEffect(() => {
    if (storeId && date) {
      getReportDetailsCall()
    }
  }, [storeId, date])

  const getReportDetailsCall = async () => {
    setLoader(true)
    const params = {
      reportType: isDailyReport ? 'DAILY_CLOSING_REPORT' : 'SHIFT_REPORT',
      date: date.format('DD/MM/YYYY'),
      storeId,
      shiftId: isDailyReport ? null : shiftId || activeShiftId,
    }
    const response = await getReportDetailsApi({ params })
    const currentData = { ...response?.data }
    currentData.total = calcTotalPayout(currentData)
    currentData.totalScratchDifference = calcTotalScratchDiff(currentData)
    currentData.safeTubesDifference = calcSafeTubesDifference(currentData)
    currentData.balance = calcBalance(currentData)
    currentData.banillaDifference = calcBanillaDiff(currentData)

    setDataSource(currentData)
    setDisabled(!currentData?.edit)
    setLoader(false)
  }

  const handleSubmitShift = async () => {
    if (!dataSource?.shiftId)
      return notifyMethod.error({ message: 'msg_ThereIsNoActiveShift' })

    const resp = await updateReportApi({
      payload: { ...dataSource, reportSubmitted: true },
    })
    if (resp?.data?.success) {
      notifyMethod.success({
        message: 'msg_ShiftReportSubmittedSuccessfully',
      })
      setDisabled(true)
    }
  }

  const toggleViewHistoryModal = () => {
    setViewPreviousHistory(prev => ({ ...prev, open: !prev?.open }))
  }

  const calcTotalScratchDiff = data => {
    const scratchSales = data['scratchSales']
    const scratchSalesReport = data['scratchSalesReport']
    return nullOrUndefined(scratchSales) && nullOrUndefined(scratchSalesReport)
      ? null
      : fixedNumber((scratchSales || 0) - (scratchSalesReport || 0))
  }

  const calcTotalLottoDiff = data => {
    const lottoSalesShiftReport = data['lottoSalesShiftReport']
    const lottoSalesLotteryMachineReport =
      data['lottoSalesLotteryMachineReport']
    return nullOrUndefined(lottoSalesShiftReport) &&
      nullOrUndefined(lottoSalesLotteryMachineReport)
      ? null
      : fixedNumber(
          (lottoSalesLotteryMachineReport || 0) - (lottoSalesShiftReport || 0),
        )
  }

  const calcTotalPrepaidDiff = data => {
    const prepaidSales = data['prepaidSales']
    const prepaidSalesReport = data['prepaidSalesReport']
    return nullOrUndefined(prepaidSales) && nullOrUndefined(prepaidSalesReport)
      ? null
      : fixedNumber((prepaidSales || 0) - (prepaidSalesReport || 0))
  }

  const calcSalesDifference = data => {
    return fixedNumber(
      (data.totalScratchDifference || 0) +
        (data.totalLottoDifference || 0) +
        (data?.totalPrepaidDifference || 0),
    )
  }

  const calcTotalPayout = data => {
    const total = allPayoutData
      ?.reduce((init, val) => {
        if (val?.dataIndex === 'total') return init // skip  'Total'
        return (init += parseFloat(data?.[val?.dataIndex] || 0))
      }, 0)
      .toFixed(2)

    return +total
  }

  const calcSafeTubesDifference = data => {
    const johnAmount = data['johnsTubesTotal']
    const paymentInReport = data['paymentInReport']

    return nullOrUndefined(johnAmount) && nullOrUndefined(paymentInReport)
      ? null
      : fixedNumber((johnAmount || 0) - (paymentInReport || 0))
  }

  const calcBalance = data => {
    const totalPayout = data.total
    const payoutDifference = data.payoutDifference

    return nullOrUndefined(totalPayout) && nullOrUndefined(payoutDifference)
      ? null
      : fixedNumber((totalPayout || 0) - (payoutDifference || 0))
  }

  const calcBanillaDiff = data => {
    const banillaCashIn = data['banillaCashIn']
    const banillaCashOut = data['banillaCashOut']

    return nullOrUndefined(banillaCashIn) && nullOrUndefined(banillaCashOut)
      ? null
      : fixedNumber((banillaCashIn || 0) - (banillaCashOut || 0))
  }

  const handleSave = async (values, type = 'payout') => {
    const cloneDataSource = deepClone(dataSource)
    const updatedDataSource = {
      ...dataSource,
      [values?.dataIndex]: values?.[values?.dataIndex],
    }
    if (type === 'payout') {
      updatedDataSource.total = calcTotalPayout(updatedDataSource)
    } else if (type === 'sales') {
      if (include([1, 2], values?.id)) {
        updatedDataSource.totalScratchDifference =
          calcTotalScratchDiff(updatedDataSource)
      } else if (include([3, 4], values?.id)) {
        updatedDataSource.totalLottoDifference =
          calcTotalLottoDiff(updatedDataSource)
      } else if (include([5, 6], values?.id)) {
        updatedDataSource.totalPrepaidDifference =
          calcTotalPrepaidDiff(updatedDataSource)
      }

      updatedDataSource.salesDifference = calcSalesDifference(updatedDataSource)
    } else if (type === 'final') {
      if (include([2, 3, 15], values?.id)) {
        if (include([2, 3], values?.id)) {
          const paymentInReport = updatedDataSource['paymentInReport']
          const cashReport = updatedDataSource['cashReport']
          const totalCash =
            nullOrUndefined(cashReport) && nullOrUndefined(paymentInReport)
              ? null
              : fixedNumber((cashReport || 0) + (paymentInReport || 0))

          updatedDataSource.totalCash = totalCash
        }

        if (include([3, 15], values?.id)) {
          updatedDataSource.safeTubesDifference =
            calcSafeTubesDifference(updatedDataSource)
        }
      } else if (isEqual(values?.id, 5)) {
        const paymentOutReport = updatedDataSource['paymentOutReport']
        const payoutDifference =
          nullOrUndefined(paymentOutReport) &&
          nullOrUndefined(updatedDataSource.totalCash)
            ? null
            : fixedNumber(
                (updatedDataSource.totalCash || 0) - (paymentOutReport || 0),
              )

        updatedDataSource.payoutDifference = payoutDifference
      } else if (include([9, 10, 11], values?.id)) {
        const queenCashIn1 = updatedDataSource['queenCashIn1']
        const queenCashIn2 = updatedDataSource['queenCashIn2']
        const queenCashOut3 = updatedDataSource['queenCashOut3']
        const totalQueenCashIn =
          nullOrUndefined(queenCashIn1) &&
          nullOrUndefined(queenCashIn2) &&
          nullOrUndefined(queenCashOut3)
            ? null
            : fixedNumber(
                (queenCashIn1 || 0) +
                  (queenCashIn2 || 0) +
                  (queenCashOut3 || 0),
              )

        updatedDataSource.totalQueenCashIn = totalQueenCashIn
      } else if (include([13, 14], values?.id)) {
        updatedDataSource.banillaDifference = calcBanillaDiff(updatedDataSource)
      }
    } else if (type === 'frontier') {
      if (include([1, 2], values?.id)) {
        const frontierCashIn = updatedDataSource['frontierCashIn']
        const frontierCashOut = updatedDataSource['frontierCashOut']

        const frontierBalance =
          nullOrUndefined(frontierCashIn) && nullOrUndefined(frontierCashOut)
            ? null
            : fixedNumber((frontierCashIn || 0) - (frontierCashOut || 0))

        updatedDataSource.frontierBalance = frontierBalance
      }
    }

    updatedDataSource.balance = calcBalance(updatedDataSource)

    setDataSource(updatedDataSource)

    if (!updatedDataSource?.id) return

    const response = await updateReportApi({ payload: updatedDataSource })
    if (!response?.data?.success) {
      setDataSource(cloneDataSource)
    }
  }

  const onDateChange = val => setDate(val)

  const onGenerateReport = async () => {
    if (!isDailyReport && !dataSource?.id) return
    const payload = {
      reportType: isDailyReport ? 'DAILY_CLOSING_REPORT' : 'SHIFT_REPORT',
      reportId: dataSource?.id,
      storeId,
      shiftId: dataSource?.shiftId,
      date: date.format('DD/MM/YYYY'),
    }

    const response = await triggerReportApi({ payload })
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

  return {
    t,
    date,
    storeId,
    loader,
    disabled,
    dataSource,
    viewPreviousHistory,
    handleSave,
    handleSubmitShift,
    toggleViewHistoryModal,
    onDateChange,
    onGenerateReport,
  }
}

export default shiftReport
