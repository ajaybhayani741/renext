import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm from '../../../shared/antd/ANTDForm'
import { ANTDSearch } from '../../../shared/antd/ANTDInput'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import { ANTDTableCell, ANTDTableRow } from '../../../shared/antd/ANTDTable'
import EditableTable from '../../common/presentation/EditableTable'
import FormLayout from '../../common/presentation/FormLayout'
import johnTubes from '../container/johnTubes.container'

const JohnTubes = ({ readOnly, shiftId }) => {
  const {
    t,
    form,
    dataSource,
    totalValues,
    columns,
    loader,
    addModel,
    refillFormFields,
    PAGE_SIZE,
    handleSave,
    onAddModelClose,
    onRefillFinish,
    onSearch,
    handleTableChange,
  } = johnTubes({ readOnly, shiftId })

  const { list, loader: tubeLoader, pageNo, lastPage } = dataSource

  return (
    <>
      <ANTDSearch
        className="w-100 mb-10 mt-10"
        placeholder={t('bkm_SearchForTubeNo')}
        onChange={onSearch}
      />
      <EditableTable
        {...{
          loader: tubeLoader,
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
          summary: () => {
            const {
              totalNumberOfTubes,
              totalTubesAmount,
              totalTubesAmountAdded,
            } = totalValues

            return (
              <>
                <ANTDTableRow>
                  <ANTDTableCell colSpan={4}></ANTDTableCell>
                  <ANTDTableCell>
                    <b>{t('dvz_Total')}</b>
                  </ANTDTableCell>
                  <ANTDTableCell>
                    <b>{totalNumberOfTubes}</b>
                  </ANTDTableCell>
                  <ANTDTableCell>
                    <b>{totalTubesAmount}</b>
                  </ANTDTableCell>
                  <ANTDTableCell></ANTDTableCell>
                  <ANTDTableCell>
                    <b>{totalTubesAmountAdded}</b>
                  </ANTDTableCell>
                </ANTDTableRow>
              </>
            )
          },
          mobViewSummary: () => {
            const {
              totalNumberOfTubes,
              totalTubesAmount,
              totalTubesAmountAdded,
            } = totalValues

            const totalDataView = [
              { label: 'bkm_NoOfTubes', value: totalNumberOfTubes },
              { label: 'bkm_Amount', value: totalTubesAmount },
              { label: 'bkm_AmountAdded', value: totalTubesAmountAdded },
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
                {t('bkm_SafeNo')} :{' '}
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

      {addModel?.open && (
        <ANTDModal
          title={t('btn_Add')}
          centered
          open={addModel?.open}
          onCancel={onAddModelClose}
          footer={false}
          width={500}
        >
          <ANTDForm
            name="add-john's-tube"
            form={form}
            // onValuesChange={handleValuesChange}
            onFinish={onRefillFinish}
            layout="vertical"
          >
            <FormLayout formFieldAttributes={refillFormFields} />
            <ANTDRow>
              <ANTDColumn xs={24} className="text-center">
                <ANTDButton
                  loading={loader}
                  type="primary"
                  htmlType="submit"
                  className="submit-btn"
                >
                  {t('btn_Save')}
                </ANTDButton>
              </ANTDColumn>
            </ANTDRow>
          </ANTDForm>
        </ANTDModal>
      )}
    </>
  )
}

export default JohnTubes
