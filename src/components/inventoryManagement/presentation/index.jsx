import '../inventory.scss'

import Categories from './Categories'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import {
  CATEGORIES,
  INVENTORY_ACTION,
  STRUCTURE_SUGGESTION,
} from '../../../routing/pathName.constant'
import StoreSelect from '../../common/presentation/StoreSelect'
import PageNotFound from '../../PageNotFound'

const InventoryManagement = () => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const { type } = params

  const inventoryMenuType = {
    [CATEGORIES]: {
      title: 'menu_Categories',
      render: <Categories />,
    },
    [STRUCTURE_SUGGESTION]: {
      title: 'menu_StructureSuggestion',
      render: <></>,
    },
    [INVENTORY_ACTION]: {
      title: 'menu_InventoryAction',
      render: <></>,
    },
  }

  const currentType = inventoryMenuType[type] || {
    title: '',
    render: <PageNotFound />,
  }

  return (
    <>
      <div className="d-flex flex-wrap space-between">
        <h2 className="page-title">{t(currentType.title)}</h2>
        <StoreSelect />
      </div>
      {currentType.render}
    </>
  )
}

export default InventoryManagement
