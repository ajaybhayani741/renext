import { PlusOutlined } from '@ant-design/icons'

import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import { ANTDTableCell, ANTDTableRow } from '../../../shared/antd/ANTDTable'
import EditableTable from '../../common/presentation/EditableTable'
import vendorPayout from '../container/vendorPayout.container'

const VendorPayout = ({ readOnly, shiftId }) => {
  const {
    t,
    columns,
    dataSource,
    totalValues,
    PAGE_SIZE,
    handleSave,
    onAddClick,
    handleTableChange,
  } = vendorPayout({
    readOnly,
    shiftId,
  })

  const { list, loader, pageNo, lastPage } = dataSource

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '750px',
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
            x: 370,
          },
          handleTableChange,
          summary: () => {
            return (
              <>
                <ANTDTableRow>
                  <ANTDTableCell align="center" colSpan={2}></ANTDTableCell>
                  <ANTDTableCell align="center">
                    <b>{t('txt_TotalAmount')}</b>
                  </ANTDTableCell>
                  <ANTDTableCell align="center">
                    <b>{totalValues?.vendorPayoutAmount}</b>
                  </ANTDTableCell>
                </ANTDTableRow>
              </>
            )
          },
          mobViewSummary: () => {
            const totalDataView = [
              {
                label: 'bkm_AmountDollar',
                value: totalValues?.vendorPayoutAmount,
              },
            ]

            return (
              <ANTDCard>
                <h3 level={5}>
                  <b>{t('dvz_Total')}</b>
                </h3>
                <table style={{ lineHeight: 'normal' }}>
                  {totalDataView.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <b>{t(item.label)}</b>
                      </td>
                      <td>
                        <b> : {item.value}</b>
                      </td>
                    </tr>
                  ))}
                </table>
              </ANTDCard>
            )
          },
          responsive: true,
          collapseLabelFn: (item, index) => (
            <div className="d-flex align-center space-between">
              <div>
                {t('inv_SrNo')} :{' '}
                {(pageNo ? pageNo - 1 : 0) * PAGE_SIZE + index + 1}
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
    </div>
  )
}

export default VendorPayout
