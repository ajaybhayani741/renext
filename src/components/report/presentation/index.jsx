import '../report.scss'

import FlexibleReport from './FlexibleReport'
import ShiftReport from './ShiftReport'
import withRouteAuth from '../../../hoc/withRouteAuth'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import {
  DAILY_CLOSING,
  FLEXIBLE,
  REPORTING_TXT,
  SALES,
  STOCK,
  TALLY,
} from '../../../routing/pathName.constant'
import { isEqual } from '../../../utils/javascript'
import StoreSelect from '../../common/presentation/StoreSelect'
import { sidebarMenus } from '../../layout/sidebar.description'
import PageNotFound from '../../PageNotFound'

const Report = () => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const { type } = params

  const reportMenuType = {
    [DAILY_CLOSING]: {
      title: `${t('menu_DailyClosingReport')}`,
      render: <ShiftReport isDailyReport key="daily-closing" readOnly={true} />,
    },
    [FLEXIBLE]: {
      title: 'menu_FlexibleReport',
      render: <FlexibleReport />,
    },
    [SALES]: {
      title: 'menu_SalesReport',
      render: <></>,
    },
    [STOCK]: {
      title: 'menu_StockReport',
      render: <></>,
    },
    [TALLY]: {
      title: 'menu_TallyReport',
      render: <></>,
    },
  }

  const currentType = reportMenuType[type] || {
    title: '',
    render: <PageNotFound />,
  }

  return (
    <>
      <div className="d-flex flex-wrap space-between mb-10">
        <h2 className="page-title">{t(currentType.title)}</h2>
        <StoreSelect />
      </div>
      {currentType.render}
    </>
  )
}

const validRoles = sidebarMenus.find(({ key }) =>
  isEqual(key, REPORTING_TXT),
)?.sidebar

export default withRouteAuth(Report, validRoles)
