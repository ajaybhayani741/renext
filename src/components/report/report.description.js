//do not change id, if needed to add another row then give it unique id
const allPayoutData = [
  {
    id: 1,
    title: 'txt_QueenPayout',
    dataIndex: 'queenPayout',
  },
  {
    id: 2,
    title: 'rpt_ScratchPayoutLotteryMachines',
    dataIndex: 'scratchPayout',
  },
  {
    id: 3,
    title: 'rpt_LottoPayoutLotteryMachines',
    dataIndex: 'lottoPayout',
  },
  {
    id: 4,
    title: 'rpt_CashBack',
    dataIndex: 'cashback',
  },
  {
    id: 5,
    title: 'menu_VendorPayout',
    dataIndex: 'vendorPayout',
  },
  {
    id: 6,
    title: 'rpt_SafeDrop',
    dataIndex: 'safeDrop',
  },
  {
    id: 7,
    title: 'rpt_Refund',
    dataIndex: 'refund',
  },
  {
    id: 8,
    title: 'rpt_VoidTickets',
    dataIndex: 'voidTickets',
  },
  {
    id: 9,
    title: 'dvz_Total',
    dataIndex: 'total',
  },
]

const salesReportData = [
  {
    id: 1,
    title: 'rpt_ScratchSales',
    dataIndex: 'scratchSales',
  },
  {
    id: 2,
    title: 'rpt_ScratchSalesReportShiftReport',
    dataIndex: 'scratchSalesReport',
  },
  {
    id: 3,
    title: 'rpt_LottoSalesReportShiftReport',
    dataIndex: 'lottoSalesShiftReport',
  },
  {
    id: 4,
    title: 'rpt_LottoSalesReportLotteryMachines',
    dataIndex: 'lottoSalesLotteryMachineReport',
  },
  {
    id: 5,
    title: 'rpt_PrepaidSalesBatchTotal',
    dataIndex: 'prepaidSales',
  },
  {
    id: 6,
    title: 'rpt_PrepaidSalesReportShiftReport',
    dataIndex: 'prepaidSalesReport',
  },
  {
    id: 7,
    title: 'rpt_TotalScratchDifference',
    dataIndex: 'totalScratchDifference',
  },
  {
    id: 8,
    title: 'rpt_TotalLottoDifference',
    dataIndex: 'totalLottoDifference',
  },
  {
    id: 9,
    title: 'rpt_TotalPrepaidDifference',
    dataIndex: 'totalPrepaidDifference',
  },
  {
    id: 10,
    title: 'rpt_SalesDifference',
    dataIndex: 'salesDifference',
  },
]

const finalReportData = [
  { id: 1, title: 'rpt_ShiftSalesReport', dataIndex: 'shiftSalesReport' },
  { id: 2, title: 'rpt_CashReport', dataIndex: 'cashReport' },
  { id: 3, title: 'rpt_PaymentInReport', dataIndex: 'paymentInReport' },
  { id: 4, title: 'rpt_TotalCash', dataIndex: 'totalCash' },
  { id: 5, title: 'rpt_PaymentOutReport', dataIndex: 'paymentOutReport' },
  { id: 6, title: 'rpt_PayoutDifference', dataIndex: 'payoutDifference' },
  { id: 15, title: 'rpt_JohnsTubesTotal', dataIndex: 'johnsTubesTotal' },
  {
    id: 7,
    title: 'rpt_SafeTubesDifference',
    dataIndex: 'safeTubesDifference',
  },
  { id: 8, title: 'rpt_Balance', dataIndex: 'balance' },
]

const queenReportData = [
  { id: 9, title: 'rpt_QueenCashIn1', dataIndex: 'queenCashIn1' },
  { id: 10, title: 'rpt_QueenCashIn2', dataIndex: 'queenCashIn2' },
  { id: 11, title: 'rpt_QueenCashOut3', dataIndex: 'queenCashOut3' },
  { id: 12, title: 'rpt_TotalQueenCashIn', dataIndex: 'totalQueenCashIn' },
]

const banillaReportData = [
  { id: 13, title: 'rpt_BanillaCashIn', dataIndex: 'banillaCashIn' },
  { id: 14, title: 'rpt_BanillaCashOut', dataIndex: 'banillaCashOut' },
  { id: 16, title: 'rpt_BanillaDifference', dataIndex: 'banillaDifference' },
]

const frontierReportData = [
  { id: 1, title: 'rpt_FrontierCashIn', dataIndex: 'frontierCashIn' },
  { id: 2, title: 'rpt_FrontierCashOut', dataIndex: 'frontierCashOut' },
  { id: 3, title: 'rpt_FrontierBalance', dataIndex: 'frontierBalance' },
]

export {
  allPayoutData,
  salesReportData,
  finalReportData,
  queenReportData,
  banillaReportData,
  frontierReportData,
}
