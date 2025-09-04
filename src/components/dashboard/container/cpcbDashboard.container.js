import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'

const cpcbDashboard = () => {
  const { t } = useTranslations()
  const [tableModel, setTableModel] = useState({ open: false, roleId: null })
  const [targetModel, setTargetModel] = useState({ open: false })

  const onJumpLinkClick = ({ roleId } = {}) => {
    setTableModel(prev => ({ ...prev, open: !prev?.open, roleId: roleId }))
  }

  const onTargetModelToggle = () => {
    setTargetModel(prev => ({ ...prev, open: !prev?.open }))
  }

  const dataSource = [
    {
      businessName: 'Maruti Suzuki India Limited',
      address: 'C-11, Sector-6, Panchkula, Haryana - 134109, Haryana',
      picName: 'Hisashi Takeuchi',
    },
  ]
  const columns = [
    {
      title: t('user_BusinessName'),
      dataIndex: 'businessName',
      key: 'userBusinessName',
    },
    {
      title: t('user_Address'),
      dataIndex: 'address',
      key: 'user_Address',
    },
    {
      title: t('dash_PICName'),
      dataIndex: 'picName',
      key: 'dash_PICName',
    },
    {
      title: t('txt_Details'),
      key: 'txt_Details',
      render: () => (
        <ANTDButton type="link" onClick={onTargetModelToggle}>
          {t('btn_View')}
        </ANTDButton>
      ),
    },
  ]

  return {
    tableModel,
    dataSource,
    columns,
    targetModel,
    onJumpLinkClick,
    onTargetModelToggle,
  }
}

export default cpcbDashboard
