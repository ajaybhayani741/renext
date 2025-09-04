import SettingsTableCard from './SettingsTableCard'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm from '../../../shared/antd/ANTDForm'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDTable from '../../../shared/antd/ANTDTable'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import FormLayout from '../../common/presentation/FormLayout'
import johnsTubes from '../container/johnsTubes.container'

const JohnsTubes = () => {
  const {
    t,
    form,
    loader,
    PAGE_SIZE,
    dataSource,
    confirmModel,
    columns,
    addModel,
    tubesFormFieldsAttr,
    handleConfirmDelete,
    handleTableChange,
    onConfirmModelClose,
    onAddModelToggle,
    onSaveClick,
    isDesktop,
    onEditClick,
    onDeleteClick,
  } = johnsTubes()

  return (
    <>
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div className="add-btn">
          <ANTDButton type="primary" className="btn" onClick={onAddModelToggle}>
            {t('btn_Add')}
          </ANTDButton>
        </div>
        {isDesktop ? (
          <ANTDTable
            bordered
            loading={dataSource?.loader}
            dataSource={dataSource?.list}
            columns={columns}
            pagination={{
              current: dataSource?.pageNo || 1,
              pageSize: PAGE_SIZE,
              total: dataSource?.lastPage * PAGE_SIZE,
              responsive: true,
            }}
            onChange={handleTableChange}
          />
        ) : (
          <SettingsTableCard
            data={dataSource}
            actionButtons={item => (
              <div className="flex-nowrap d-flex">
                <ANTDButton
                  className="bg-edit"
                  onClick={() => onEditClick(item)}
                >
                  {t('btn_Edit')}
                </ANTDButton>
                <ANTDButton
                  className="bg-danger"
                  onClick={() => onDeleteClick(item)}
                >
                  {t('btn_Delete')}
                </ANTDButton>
              </div>
            )}
            // cardViewFn={cardViewFn}
            cardViewFn={item => [
              { label: t('bkm_SafeNumber'), value: item?.safeNumber },
              { label: t('bkm_SafeTypeDollar'), value: item?.safeType },
              { label: t('bkm_Value'), value: item?.value },
            ]}
            pageSize={PAGE_SIZE}
            onChange={handleTableChange}
            loader={dataSource?.loader}
          />
        )}
      </div>

      {confirmModel?.open && (
        <PopUpConfirm
          isOpen={confirmModel?.open}
          onCancelModel={onConfirmModelClose}
          onAccept={handleConfirmDelete}
          onReject={onConfirmModelClose}
          description={t('msg_AreYouSureYouWantToDeleteThisTube')}
        />
      )}

      {addModel?.open && (
        <ANTDModal
          title={t('btn_Add')}
          centered
          open={addModel?.open}
          onCancel={onAddModelToggle}
          footer={false}
          width={700}
        >
          <ANTDForm
            name="add-john's-tube"
            form={form}
            // onValuesChange={handleValuesChange}
            onFinish={onSaveClick}
            layout="vertical"
          >
            <FormLayout formFieldAttributes={tubesFormFieldsAttr} />
            <ANTDRow>
              <ANTDColumn sm={24} className="text-center">
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

export default JohnsTubes
