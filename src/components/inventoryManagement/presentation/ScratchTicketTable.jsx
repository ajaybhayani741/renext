import ViewInventory from './ViewInventory'
import { ANTDFormItem } from '../../../shared/antd/ANTDForm'
import { ANTDSearch } from '../../../shared/antd/ANTDInput'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { QrCode } from '../../../utils/icons'
import { length } from '../../../utils/javascript'
import scratchTicketTable from '../container/scratchTicketTable.container'

const ScratchTicketTable = ({
  type,
  hideSearch,
  dataSource,
  handleTableChange,
}) => {
  const { t, columns, viewSingleInventory, handleView } = scratchTicketTable({
    type,
  })
  const { list, loader, pageNo, lastPage } = dataSource || {}

  return (
    <>
      {!hideSearch && (
        <div className="d-flex space-between mb-10 scanner-search-wrapper">
          <span className="pointer" /* onClick={startScanner} */>
            <img src={QrCode} alt="" height="80" width="80" />
            <h4 className="text-center">{t('job_Scan')}</h4>
          </span>
          <div className="d-flex align-end">
            <ANTDFormItem
              key={'search'}
              label={t('txt_Search')}
              name={'search'}
            >
              <ANTDSearch />
            </ANTDFormItem>
          </div>
        </div>
      )}
      <ANTDTable
        loading={loader}
        dataSource={
          length(list) ? list?.map(item => ({ ...item, key: item?.id })) : []
        }
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          lastFetched: pageNo,
          current: pageNo,
          pageSize: 10,
          total: lastPage * 10,
          responsive: true,
          hideOnSinglePage: true,
        }}
        scroll={{ x: 1100 }}
      />
      {viewSingleInventory?.open && (
        <ViewInventory
          {...{
            viewSingleInventory,
            handleView,
            column: columns,
          }}
        />
      )}
    </>
  )
}

export default ScratchTicketTable
