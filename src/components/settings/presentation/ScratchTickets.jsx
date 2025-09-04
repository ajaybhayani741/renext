import SettingsTableCard from './SettingsTableCard'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm from '../../../shared/antd/ANTDForm'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDTable from '../../../shared/antd/ANTDTable'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import FormLayout from '../../common/presentation/FormLayout'
import scratchTickets from '../container/scratchTickets.container'

const ScratchTickets = () => {
  const {
    t,
    form,
    loader,
    PAGE_SIZE,
    dataSource,
    confirmModel,
    columns,
    addModel,
    boxFormFieldsAttr,
    // companyCode,
    // storeCode,
    handleDeleteBox,
    handleTableChange,
    onConfirmModelClose,
    onAddModelToggle,
    onSaveClick,
    onValuesChange,
    isDesktop,
    // cardViewFn,
    onEditClick,
    onDeleteClick,
  } = scratchTickets()

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
              { label: t('bkm_BoxNo'), value: item?.sequentialId },
              { label: t('bkm_GameNumber'), value: item?.gameNumber },
              { label: t('bkm_BookNumber'), value: item?.bookNumber },
              { label: t('bkm_Amount'), value: item?.amount },
              { label: t('bkm_EndTicket'), value: item?.ticketCount },
              { label: t('bkm_NumberOfBooks'), value: item?.numberOfBooks },
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
          onAccept={handleDeleteBox}
          onReject={onConfirmModelClose}
          description={t('msg_AreYouSureYouWantToDeleteThisBox')}
        />
      )}

      <ANTDModal
        title={t('bkm_AddBox')}
        centered
        open={addModel?.open}
        onCancel={onAddModelToggle}
        footer={false}
        width={1000}
        destroyOnClose
      >
        <ANTDForm
          name="add-box"
          form={form}
          onValuesChange={onValuesChange}
          onFinish={onSaveClick}
          layout="vertical"
        >
          <FormLayout formFieldAttributes={boxFormFieldsAttr} />
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
    </>
  )
}

export default ScratchTickets
