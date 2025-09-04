import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm, {
  ANTDFormItem,
  ANTDFormList,
  useFormFn,
} from '../../../shared/antd/ANTDForm'
import ANTDInput from '../../../shared/antd/ANTDInput'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDPagination from '../../../shared/antd/ANTDPagination'
import ANTDRow from '../../../shared/antd/ANTDRow'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../utils/constant'
import { validationTag } from '../../../utils/customFunctions'
import { include, notEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'

const ProductList = ({
  handleSaveModel,
  handleDeleteModel,
  vehicleModels,
  onPageChange,
  pageSize = 15,
  total,
}) => {
  const { t } = useTranslations()
  const [showInputForm, setShowInputForm] = useState(false)
  const [confirmModel, setConfirmModel] = useState({ open: false })
  const form = useFormFn()
  const lang = getItem('lang')
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = userData || {}

  const { admin } = userWiseRole
  const addDeletePermission = include([admin], roleId)

  const onSaveClick = async () => {
    try {
      await form.validateFields()
      const vehicleModels = form.getFieldValue('vehicleModels')
      handleSaveModel(vehicleModels)
      handleFormClose()
    } catch (error) {}
  }

  const onDeleteClick = id => {
    setConfirmModel({ open: true, id })
  }

  const onConfirmDelete = () => {
    handleDeleteModel(confirmModel?.id)
    setConfirmModel({ open: false })
  }

  const onConfirmModelClose = () => {
    setConfirmModel({ open: false })
  }

  const handleFormClose = () => {
    form.resetFields()
    setShowInputForm(false)
  }

  return (
    <ANTDCard
      title={t('user_Product')}
      className="add-user-card mb-20 vehicle-model-card"
      extra={
        addDeletePermission ? (
          <ANTDButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowInputForm(true)}
          >
            {t('btn_AddProduct')}
          </ANTDButton>
        ) : null
      }
    >
      <div className="model-list-container">
        <ANTDRow gutter={16}>
          {vehicleModels?.map(model => (
            <ANTDColumn key={model.id} md={8} sm={12} xs={24}>
              <div className="model-list-item">
                <p>{model.name}</p>
                {addDeletePermission ? (
                  <DeleteOutlined onClick={() => onDeleteClick(model.id)} />
                ) : null}
              </div>
            </ANTDColumn>
          ))}
        </ANTDRow>

        <div className="d-flex justify-content-end mt-15 align-center">
          <ANTDPagination
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            responsive
            hideOnSinglePage
            onChange={current => {
              onPageChange && onPageChange(current)
            }}
          />
        </div>

        <ANTDModal
          title={t('user_Product')}
          open={showInputForm}
          onCancel={handleFormClose}
          destroyOnClose
          width={500}
          footer={false}
        >
          <ANTDForm form={form} layout="vertical">
            <ANTDFormList name="vehicleModels" initialValue={['']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="d-flex align-center">
                      <ANTDFormItem
                        {...restField}
                        label={t('user_ProductName')}
                        name={name}
                        className={classNames(validationTag(lang), 'w-100')}
                        rules={[
                          {
                            required: true,
                            message: t('error_FieldISRequire'),
                          },
                        ]}
                      >
                        <ANTDInput />
                      </ANTDFormItem>
                      {notEqual(fields.length, index + 1) ? (
                        <ANTDButton
                          type="primary"
                          className="btn ml-10"
                          onClick={() => remove(name)}
                          icon={<MinusOutlined />}
                        />
                      ) : (
                        <ANTDButton
                          type="primary"
                          className="btn ml-10"
                          onClick={() => add(null)}
                          icon={<PlusOutlined />}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </ANTDFormList>
            <div className="text-center mt-20">
              <ANTDButton type="primary" className="btn " onClick={onSaveClick}>
                {t('btn_Save')}
              </ANTDButton>
            </div>
          </ANTDForm>
        </ANTDModal>

        {confirmModel?.open && (
          <PopUpConfirm
            isOpen={confirmModel?.open}
            onCancelModel={onConfirmModelClose}
            onAccept={onConfirmDelete}
            onReject={onConfirmModelClose}
            description={t('msg_AreYouSureYouWantToDeleteThisProduct')}
          />
        )}
      </div>
    </ANTDCard>
  )
}

export default ProductList

export const ProductListUserForm = ({
  onSaveModel,
  onDeleteModel,
  modelList,
}) => {
  const [vehicleModels, setVehicleModels] = useState(modelList || [])
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15

  return (
    <ProductList
      vehicleModels={vehicleModels?.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
      )}
      handleSaveModel={modelNames => {
        setVehicleModels(prev => [
          ...(prev || []),
          ...(modelNames || [])?.map((model, ind) => ({
            id: `temp-${(prev?.length || 0) + ind + 1}`,
            name: model,
          })),
        ])
        onSaveModel(modelNames)
      }}
      handleDeleteModel={id => {
        if (!id?.toString()?.startsWith('temp-')) {
          onDeleteModel(id)
        }
        setVehicleModels(prev => prev.filter(model => model.id !== id))
      }}
      onPageChange={setPage}
      total={vehicleModels?.length}
      pageSize={PAGE_SIZE}
    />
  )
}
