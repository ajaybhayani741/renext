import { useMemo } from 'react'

import NumberTiles from './NumberTiles'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import HCDonutRace from '../../charts/HCDonutRace'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'

const StaffMetrics = () => {
  const { t } = useTranslations()

  // const { handleTabChange } = useContext(DashboardContext)

  const tileList = useMemo(
    () => [
      {
        title: t('dash_HostelsWithoutFullTimeRegularHWOPrincipal'),
        key: '1',
        count: 32,
        color: '#7ff896',
        // decimals: 2,
        // prefix: '$',
      },
      {
        title: t('dash_HostelsLackingANurseOrMedicalOfficerVisits'),
        key: '2',
        count: 29,
        color: '#7fb0f8',
        // decimals: 2,
        // suffix: '%',
      },
    ],
    [],
  )

  return (
    <>
      <div className="d-flex flex-end">
        <FiscalYearSelect className="ml-auto" setDefault={false} />
      </div>
      <div className="dashboard-number-tiles mb-10">
        {tileList.map((value, i) => {
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
          <HCDonutRace
            title="dash_StaffAbsenteeism"
            subTitle=""
            total="14%"
            optionsProps={{
              colors: ['#a4704a', '#f0f0f0'],
              series: [
                {
                  type: 'pie',
                  name: '',
                  data: [
                    ['', 14],
                    ['', 86],
                  ],
                  showInLegend: false,
                },
              ],
            }}
          />
        </ANTDColumn>
      </ANTDRow>
    </>
  )
}

export default StaffMetrics
