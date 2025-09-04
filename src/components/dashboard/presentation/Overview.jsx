import { useMemo } from 'react'

import DiscrepanciesTable from './DiscrepanciesTable'
import NumberTiles from './NumberTiles'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import { LinkJumpIcon } from '../../../utils/icons'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import StoreSelect from '../../common/presentation/StoreSelect'
import ShiftReportTable from '../../report/presentation/ShiftReportTable'
import overview from '../container/overview.container'

const Overview = () => {
  const {
    t,
    tiles,
    viewModel,
    // discrepanciesChart,
    discrepanciesTable,
    onViewModelClose,
    onViewShiftReportClick,
  } = overview()

  // const { handleTabChange } = useContext(DashboardContext)

  const financeTileList = useMemo(
    () => [
      // {
      //   title: t('dash_Revenue'),
      //   key: 'revenue',
      //   color: '#7ff896',
      //   decimals: 2,
      //   prefix: '$',
      //   onClick: () => handleTabChange(tabKeys.revenue),
      // },
      // {
      //   title: t('dash_CostOfGoodsSold'),
      //   key: 'costOfGoodsSold',
      //   color: '#7fb0f8',
      //   decimals: 2,
      //   prefix: '$',
      //   onClick: () => handleTabChange(tabKeys.costOfGoodsSold),
      // },
      // {
      //   title: t('menu_ProfitLoss'),
      //   key: 'profitLoss',
      //   color: '#e4ae52',
      //   count: tiles?.profitLoss,
      //   decimals: 2,
      //   prefix: '$',
      //   suffixElement: (
      //     <>
      //       {tiles?.profitLoss > 0 ? (
      //         <ArrowUpOutlined
      //           style={{ color: 'green', fontSize: 24, marginTop: 0 }}
      //         />
      //       ) : (
      //         <ArrowDownOutlined
      //           style={{ color: 'red', fontSize: 24, marginTop: 0 }}
      //         />
      //       )}
      //     </>
      //   ),
      //   onClick: () => handleTabChange(tabKeys.profitLoss),
      // },
    ],
    [tiles],
  )

  return (
    <>
      <div className="d-flex flex-end">
        <FiscalYearSelect className="ml-auto" setDefault={false} />
      </div>
      <div className="dashboard-number-tiles mb-10">
        {financeTileList.map((value, i) => {
          return (
            <div className="tiles-wrapper" key={value?.key}>
              <div className="link-jump fs-18">
                <LinkJumpIcon onClick={value?.onClick} />
              </div>
              <NumberTiles
                title={t(value?.title)}
                count={tiles?.[value?.key] || value?.count}
                decimals={value?.decimals}
                color={value?.color}
                disabled={value?.disabled}
                footerTitle={t(value?.footerTitle)}
                suffix={value?.suffix}
                suffixElement={value?.suffixElement}
                prefix={value?.prefix}
                onClick={value?.onClick}
              />
            </div>
          )
        })}
      </div>

      {/* <div className="mt-10">
        <LineCharts
          {...{
            max: totalOverviewChart?.maxValue,
            title: 'dash_RevenueCostOfGoodsSoldSalesProfitLoss',
            categories: totalOverviewChart?.monthYear,
            series: totalOverviewChart?.series,
            yAxisTitle: '$',
          }}
        />
      </div> */}

      <div>
        <StoreSelect />
        <ANTDButton
          type="primary"
          className="mb-10 ml-10"
          onClick={onViewShiftReportClick}
        >
          {t('btn_ViewShiftReport')}
        </ANTDButton>
      </div>

      <ANTDModal
        title={t('menu_ShiftReport')}
        centered
        open={viewModel?.open}
        onCancel={onViewModelClose}
        footer={false}
        width={1100}
        destroyOnClose
      >
        <ShiftReportTable
          readOnly={true}
          dataSource={viewModel?.data}
          loader={viewModel?.loader}
        />
      </ANTDModal>

      <ANTDRow gutter={10}>
        <ANTDColumn xs={24}>
          <ANTDCard className="mb-10" bordered={false}>
            <h3 className="dashboard-error-code mb-10">
              {t('dash_Discrepancies')}
            </h3>
            <DiscrepanciesTable data={discrepanciesTable} />
          </ANTDCard>
        </ANTDColumn>
      </ANTDRow>
      {/* <div className="mt-10">
        <LineCharts
          {...{
            max: discrepanciesChart?.maxValue,
            title: 'dash_Discrepancies',
            categories: discrepanciesChart?.monthYear,
            series: discrepanciesChart?.series,
            yAxisTitle: '$',
          }}
        />
      </div> */}
    </>
  )
}

export default Overview
