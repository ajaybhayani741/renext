import ANTDCollapse from '../../../shared/antd/ANTDCollapse'
import ANTDTab from '../../../shared/antd/ANTDTab'
import categories from '../container/categories.container'
import { tabKeys } from '../inventory.description'
import MachineDetailView from './MachineDetailView'
import MachineSidebar from './MachineSidebar'
import ScratchTicketTable from './ScratchTicketTable'

const Categories = () => {
  const {
    t,
    activeTab,
    activeMenu,
    dataSource,
    handleMenuChange,
    handleTabChange,
    handleTableChange,
  } = categories()

  const machineList = Array.from({ length: 12 }, (_, i) => ({
    key: `${i + 1}`,
    label: `Machine ${i + 1}`,
  }))

  const activeMenuLabel = machineList.find(
    item => item.key === activeMenu,
  )?.label

  const tabList = [
    {
      label: 'stg_ScratchTickets',
      key: tabKeys.scratchTickets,
      children: (
        <>
          <ANTDCollapse
            {...{
              items: [
                {
                  key: '1',
                  label: t('inv_Available'),
                  className: 'coll collapse-header',
                  children: (
                    <ScratchTicketTable
                      {...{
                        type: 'available',
                        dataSource: dataSource?.[activeTab]?.AVAILABLE,
                        handleTableChange: pagination =>
                          handleTableChange(pagination, {
                            state: 'AVAILABLE',
                          }),
                      }}
                    />
                  ),
                },
                {
                  key: '2',
                  label: t('inv_Used'),
                  className: 'coll collapse-header mt-10',
                  children: (
                    <ScratchTicketTable
                      {...{
                        type: 'used',
                        dataSource: dataSource?.[activeTab]?.USED,
                        handleTableChange: pagination =>
                          handleTableChange(pagination, {
                            state: 'USED',
                          }),
                      }}
                    />
                  ),
                },
              ],
              defaultActiveKey: ['1', '2'],
              bordered: false,
            }}
          />
        </>
      ),
    },
    {
      label: 'menu_Machines',
      key: tabKeys.machines,
      children: (
        <>
          <div className="machine-wrapper-box">
            <MachineSidebar
              {...{ activeMenu, menuItems: machineList, handleMenuChange }}
            />
            <div className="machine-detail-box">
              <MachineDetailView title={activeMenuLabel} />
            </div>
          </div>
        </>
      ),
    },
    {
      label: 'stg_Products',
      key: tabKeys.products,
      children: (
        <>
          <ANTDCollapse
            {...{
              items: [
                {
                  key: '1',
                  label: t('inv_Available'),
                  className: 'coll collapse-header',
                  children: (
                    <ScratchTicketTable
                      {...{
                        type: 'available',
                        dataSource: { list: [] },
                      }}
                    />
                  ),
                },
                {
                  key: '2',
                  label: t('inv_Used'),
                  className: 'coll collapse-header mt-10',
                  children: (
                    <ScratchTicketTable
                      {...{
                        type: 'used',
                        dataSource: { list: [] },
                      }}
                    />
                  ),
                },
              ],
              defaultActiveKey: ['1', '2'],
              bordered: false,
            }}
          />
        </>
      ),
    },
  ]

  return (
    <>
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

export default Categories
