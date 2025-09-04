import { ANTDSearch } from '../../../shared/antd/ANTDInput'
import EditableTable from '../../common/presentation/EditableTable'
import scratchTicketTracking from '../container/scratchTicketTracking.container'

const ScratchTicketTracking = ({ readOnly, shiftId }) => {
  const {
    t,
    PAGE_SIZE,
    columns,
    dataSource,
    totalValues,
    onSearch,
    handleSave,
    handleTableChange,
  } = scratchTicketTracking({ readOnly, shiftId })

  const { list, loader, pageNo, lastPage } = dataSource

  return (
    <>
      <div className="d-flex align-center">
        <div className="flex-1">
          <ANTDSearch
            className="w-100 mb-10 mt-10"
            placeholder={t('bkm_SearchForBoxNo')}
            onChange={onSearch}
          />
        </div>
      </div>

      <EditableTable
        {...{
          loader,
          dataSource: list,
          defaultColumns: columns,
          handleSave,
          pagination: {
            lastFetched: pageNo,
            current: pageNo,
            pageSize: PAGE_SIZE,
            total: lastPage * PAGE_SIZE,
            responsive: true,
            hideOnSinglePage: true,
          },
          handleTableChange,
          scroll: {
            x: 1200,
          },
          responsive: true,
          collapseLabelFn: item => (
            <div className="d-flex align-center space-between">
              <div>
                {t('bkm_BoxNo')} : {item?.sequentialId}
              </div>
              <div onClick={e => e.stopPropagation()}>
                {columns
                  .find(col => col.key === 'txt_Action' && !col.hidden)
                  ?.render(item)}
              </div>
            </div>
          ),
        }}
      />
      <div className="d-flex space-evenly flex-wrap">
        <p className="page-title">
          {t('bkm_TotalNumberOfTicketsSold')} : {totalValues?.totalTicketSold}
        </p>
        <p className="page-title">
          {t('bkm_TotalScratchAmount')} : {totalValues?.totalScratchAmount}
        </p>
      </div>
    </>
  )
}

export default ScratchTicketTracking
