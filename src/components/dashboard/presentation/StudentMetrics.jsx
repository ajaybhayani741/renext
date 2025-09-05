import { useMemo } from 'react'

import NumberTiles from './NumberTiles'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import DonutChartRace from '../../charts/DonutChartRace'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import studentMetrics from '../container/studentMetrics.container'

const StudentMetrics = () => {
  const {
    t,
    tiles,
    // viewModel,
    // discrepanciesChart,
    // discrepanciesTable,
    // onViewModelClose,
    // onViewShiftReportClick,
  } = studentMetrics()

  // const { handleTabChange } = useContext(DashboardContext)

  const financeTileList = useMemo(
    () => [
      {
        title: t('dash_TotalNumberOfHostelsInspected'),
        key: '1',
        count: 195,
        color: '#7ff896',
        // decimals: 2,
        // prefix: '$',
      },
      {
        title: `${t('dash_Attendance')} %`,
        key: '2',
        count: 85,
        color: '#7fb0f8',
        decimals: 2,
        suffix: '%',
      },
      {
        title: t('dash_HostelsWith80AttendanceFlagged'),
        key: '3',
        count: 32,
        color: '#e4ae52',
        // decimals: 2,
        // suffix: '%',
      },
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
              {/* <div className="link-jump fs-18">
                <LinkJumpIcon onClick={value?.onClick} />
              </div> */}
              <NumberTiles
                key={new Date()}
                title={t(value?.title)}
                count={value?.count}
                decimals={value?.decimals}
                color={value?.color}
                disabled={value?.disabled}
                footerTitle={t(value?.footerTitle)}
                suffix={value?.suffix}
                suffixElement={value?.suffixElement}
                prefix={value?.prefix}
                onClick={value?.onClick}
                showStock={value?.showStock}
                data={value?.data}
              />
            </div>
          )
        })}
      </div>

      <ANTDRow gutter={10}>
        <ANTDColumn xs={24}>
          <DonutChartRace
            data={{ enrolled: 2000, present: 1700 }}
            key={new Date()}
          />
        </ANTDColumn>
      </ANTDRow>
    </>
  )
}

export default StudentMetrics
