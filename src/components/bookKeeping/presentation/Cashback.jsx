import { PlusOutlined } from '@ant-design/icons'

import ANTDButton from '../../../shared/antd/ANTDButton'
import { ANTDTableCell, ANTDTableRow } from '../../../shared/antd/ANTDTable'
import EditableTable from '../../common/presentation/EditableTable'
import cashback from '../container/cashback.container'

const Cashback = ({ readOnly, shiftId }) => {
  const {
    t,
    columns,
    dataSource,
    totalValues,
    PAGE_SIZE,
    onAddClick,
    handleSave,
    handleTableChange,
  } = cashback({ readOnly, shiftId })

  const { list, loader, pageNo, lastPage } = dataSource

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '650px',
        margin: '0 auto',
        marginTop: '10px',
      }}
    >
      <div className="mb-10 text-end">
        {!readOnly && (
          <ANTDButton
            type="primary"
            className="btn ml-10"
            onClick={onAddClick}
            icon={<PlusOutlined />}
          />
        )}
      </div>

      <EditableTable
        {...{
          loader,
          dataSource: list,
          defaultColumns: columns,
          handleSave,
          size: 'small',
          pagination: {
            lastFetched: pageNo,
            current: pageNo,
            pageSize: PAGE_SIZE,
            total: lastPage * PAGE_SIZE,
            responsive: true,
            hideOnSinglePage: true,
          },
          scroll: {
            x: 350,
          },
          handleTableChange,
          summary: () => {
            return (
              <>
                <ANTDTableRow>
                  <ANTDTableCell align="center"></ANTDTableCell>
                  <ANTDTableCell align="center">
                    <b>{t('txt_TotalAmount')}</b>
                  </ANTDTableCell>
                  <ANTDTableCell align="center">
                    <b>{totalValues?.cashbackAmount}</b>
                  </ANTDTableCell>
                </ANTDTableRow>
              </>
            )
          },
        }}
      />
    </div>
  )
}

export default Cashback
