import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import '../setting.scss'
import ANTDTab from '../../../shared/antd/ANTDTab'
import { tabKeys } from '../setting.description'
import JohnsTubes from './JohnsTubes'
import ScratchTickets from './ScratchTickets'
import useRedux from '../../../hooks/useRedux'
import { userWiseRole } from '../../../utils/constant'
import { include } from '../../../utils/javascript'
import StoreSelect from '../../common/presentation/StoreSelect'

const Settings = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { roleId: loginRoleId } =
    selector(state => state.user?.profile_details) || {}
  const [activeTab, setActiveTab] = useState(tabKeys.scratchTickets)

  const { storeOwner } = userWiseRole

  const handleTabChange = tab => {
    setActiveTab(tab)
  }

  const tabList = [
    {
      label: 'stg_ScratchTickets',
      key: tabKeys.scratchTickets,
      children: <ScratchTickets />,
      hidden: !include([storeOwner], loginRoleId),
    },
    {
      label: 'stg_JohnsTubes',
      key: tabKeys.johnsTubes,
      children: <JohnsTubes />,
      hidden: !include([storeOwner], loginRoleId),
    },
  ].filter(({ hidden }) => !hidden)

  return (
    <>
      <div className="d-flex flex-wrap space-between">
        <h2 className="page-title">{t('txt_Settings')}</h2>
        <StoreSelect />
      </div>

      <ANTDTab
        activeKey={activeTab}
        items={tabList.map(({ key, children, ...item }) => ({
          ...item,
          key,
          label: t(item.label),
          children,
        }))}
        centered
        onChange={handleTabChange}
      />
    </>
  )
}

export default Settings
