import { PlusOutlined } from '@ant-design/icons'

import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import { ANTDTableCell, ANTDTableRow } from '../../../shared/antd/ANTDTable'
import Label from '../../../shared/Label'
import EditableTable from '../../common/presentation/EditableTable'
import machines from '../container/machines.container'

const Machines = ({ readOnly, shiftId }) => {
  const {
    t,
    // PAGE_SIZE,
    machineList,
    dataSource,
    columns,
    selected,
    totalValues,
    handleSave,
    onAddClick,
    handleTableChange,
    handleSelectChange,
  } = machines({ readOnly, shiftId })

  const { list, loader } = dataSource

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '650px',
        margin: '0 auto',
      }}
    >
      <div className="mb-10 d-flex align-end gap-10">
        <div className="flex-1">
          <Label text={t('txt_SelectMachine')} />
          <ANTDSelect
            className="w-100"
            loading={machineList?.loader}
            value={selected}
            options={machineList?.list?.map(val => ({
              label: val?.name,
              value: val?.id,
            }))}
            onChange={handleSelectChange}
          />
        </div>
        {!readOnly && (
          <ANTDButton
            type="primary"
            className="btn"
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
          // pagination: {
          //   current: pageNo,
          //   pageSize: PAGE_SIZE,
          //   responsive: true,
          // },
          scroll: {
            x: 350,
          },
          handleTableChange,
          summary: () => {
            return (
              <>
                <ANTDTableRow>
                  <ANTDTableCell align="center">
                    <b>{t('txt_TotalAmount')}</b>
                  </ANTDTableCell>
                  <ANTDTableCell align="center">
                    <b>{totalValues?.queensPayout}</b>
                  </ANTDTableCell>
                  <ANTDTableCell align="center"></ANTDTableCell>
                </ANTDTableRow>
              </>
            )
          },
        }}
      />
      <h2 className="page-title text-start">
        {t('txt_QueenPayout')} : {`$${totalValues?.totalQueensPayout ?? 0}`}
      </h2>
    </div>
  )
}

export default Machines
