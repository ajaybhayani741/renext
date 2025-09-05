import { useMemo } from 'react'

import NumberTiles from './NumberTiles'
import useTranslations from '../../../hooks/useTranslations'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'

const HealthAndSafetyMetrics = () => {
  const { t } = useTranslations()

  // const { handleTabChange } = useContext(DashboardContext)

  const tileList = useMemo(
    () => [
      {
        title: t('dash_SickBoardersNotRecorded'),
        key: '1',
        count: 103,
        color: '#7ff896',
        // decimals: 2,
        // prefix: '$',
      },
      {
        title: `${t('dash_HostelsWithStagnantWaterOrUnsafeSepticTankDistance')}`,
        key: '2',
        count: 23,
        color: '#7fb0f8',
        decimals: 2,
        // suffix: '%',
      },
      {
        title: t('dash_HostelsWithoutFirstAidKits'),
        key: '3',
        count: 12,
        color: '#e4ae52',
        // decimals: 2,
        // suffix: '%',
      },
      {
        title: t('dash_HostelsWithFewerFunctioningCCTVsThanInstalled'),
        key: '4',
        count: 65,
        color: '#ffbcbc',
        // decimals: 2,
        // suffix: '%',
      },
      {
        title: t('dash_HostelsReportingAnimalThreats'),
        key: '5',
        count: 34,
        color: '#fbd592ff',
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
    </>
  )
}

export default HealthAndSafetyMetrics
