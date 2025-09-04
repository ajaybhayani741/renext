import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { getInventoryListApi } from '../inventory.api'
import { inventoryPayload, tabKeys } from '../inventory.description'

const categories = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const [activeTab, setActiveTab] = useState(tabKeys.scratchTickets)
  const [activeMenu, setActiveMenu] = useState('1')
  const [dataSource, setDataSource] = useState({})

  useEffect(() => {
    if (storeId) {
      getInventoryCall({ state: 'AVAILABLE' })
      getInventoryCall({ state: 'USED' })
    }
  }, [activeTab, storeId])

  const getInventoryCall = async ({ pageNo = 1, state = 'AVAILABLE' }) => {
    const inventoryType = inventoryPayload[activeTab]
    if (!inventoryType) return
    setDataSource(prev => ({
      ...prev,
      [activeTab]: {
        ...prev?.[activeTab],
        [state]: {
          ...prev[state],
          loader: true,
        },
      },
    }))
    const response = await getInventoryListApi({
      pageNo,
      params: {
        storeId,
        type: inventoryType,
        state,
      },
    })

    setDataSource(prev => ({
      ...prev,
      [activeTab]: {
        ...prev?.[activeTab],
        [state]: {
          ...response?.data,
          loader: false,
        },
      },
    }))
  }

  const handleTableChange = (pagination, { state }) => {
    getInventoryCall({ pageNo: pagination.current, state })
  }

  const handleMenuChange = e => {
    setActiveMenu(e?.key)
  }

  const handleTabChange = tab => {
    setActiveTab(tab)
  }

  return {
    t,
    activeTab,
    activeMenu,
    dataSource,
    handleMenuChange,
    handleTabChange,
    handleTableChange,
  }
}

export default categories
