import useTranslations from '../../../hooks/useTranslations'
import ANTDTab from '../../../shared/antd/ANTDTab'
import profile from '../container/profile'
import { tabList } from '../profile.description'

function Profile() {
  const { t } = useTranslations()
  const { currentTab, handleTabChange } = profile()

  return (
    <div>
      <ANTDTab
        activeKey={currentTab}
        items={tabList.map(({ Component, ...subList }) => ({
          ...subList,
          label: t(subList?.label),
          children: <Component />,
        }))}
        centered
        onChange={handleTabChange}
      />
    </div>
  )
}

export default Profile
