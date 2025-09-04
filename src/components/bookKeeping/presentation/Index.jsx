import '../bookKeeping.scss'

import Cashback from './Cashback'
import JohnTubes from './JohnTubes'
import Machines from './Machines'
import ScratchTicketTracking from './ScratchTicketTracking'
import VendorPayout from './VendorPayout'
import withRouteAuth from '../../../hoc/withRouteAuth'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import {
  BOOK_KEEPING_TXT,
  CASHBACK,
  JOHN_TUBES,
  MACHINES,
  SCRATCH_TICKET_TRACKING,
  SHIFT,
  VENDOR_PAYOUT,
} from '../../../routing/pathName.constant'
import { isEqual } from '../../../utils/javascript'
import StoreSelect from '../../common/presentation/StoreSelect'
import { sidebarMenus } from '../../layout/sidebar.description'
import PageNotFound from '../../PageNotFound'
import ShiftReport from '../../report/presentation/ShiftReport'

const BookKeeping = () => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const { type } = params

  const bookKeepingType = {
    [SCRATCH_TICKET_TRACKING]: {
      title: 'menu_ScratchTicketTracking',
      render: <ScratchTicketTracking />,
    },
    [JOHN_TUBES]: {
      title: 'menu_JohnTubes',
      render: <JohnTubes />,
    },
    [MACHINES]: {
      title: 'menu_Machines',
      render: <Machines />,
    },
    [CASHBACK]: {
      title: 'menu_Cashback',
      render: <Cashback />,
    },
    [VENDOR_PAYOUT]: {
      title: 'menu_VendorPayout',
      render: <VendorPayout />,
    },
    [SHIFT]: {
      title: 'menu_ShiftReport',
      render: <ShiftReport key="shift-report" />,
    },
  }

  const currentBookKeeping = bookKeepingType[type] || {
    title: '',
    render: <PageNotFound />,
  }

  return (
    <>
      <div className="d-flex flex-wrap space-between">
        <h2 className="page-title">{t(currentBookKeeping.title)}</h2>
        <StoreSelect />
      </div>
      {currentBookKeeping.render}
    </>
  )
}

const validRoles = sidebarMenus.find(({ key }) =>
  isEqual(key, BOOK_KEEPING_TXT),
)?.sidebar

export default withRouteAuth(BookKeeping, validRoles)
