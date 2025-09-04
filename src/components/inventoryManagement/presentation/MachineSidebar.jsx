import useTranslations from '../../../hooks/useTranslations'
import ANTDMenu from '../../../shared/antd/ANTDMenu'
import ANTDToolTip from '../../../shared/antd/ANTDTooltip'

const MachineSidebar = ({ activeMenu, menuItems, handleMenuChange }) => {
  const { t } = useTranslations()

  return (
    <ANTDMenu
      className="machine-sidebar-menu mr-10"
      theme="light"
      mode="inline"
      selectedKeys={[activeMenu]}
      items={menuItems.map(val => ({
        ...val,
        label: (
          <div className="ellipsify" style={{ width: 'calc(100% - 25px)' }}>
            <ANTDToolTip>{t(val?.label)}</ANTDToolTip>
          </div>
        ),
      }))}
      onSelect={handleMenuChange}
    />
  )
}

export default MachineSidebar
