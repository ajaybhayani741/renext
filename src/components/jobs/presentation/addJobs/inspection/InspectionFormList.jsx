import InspectionForm from './InspectionForm'
import ANTDCard from '../../../../../shared/antd/ANTDCard'
import { ANTDFormList } from '../../../../../shared/antd/ANTDForm'

const InspectionFormList = ({
  removeMaterialClick,
  onDownloadTemplate,
  inspectionFormFieldsAttr,
  onSaveClick,
  activeKeys,
  onActiveKeysChange,
  onSelectUser,
  selectedUsers,
  onUserClear,
}) => {
  // const { t } = useTranslations()

  // const maxFields = length(materialTypeOptions)

  // const bulkUploadInstruction = () => {
  //   return (
  //     <ul style={{ marginLeft: '18px' }}>
  //       <li>{t('job_BulkUploadInstruction1')}</li>
  //       <li>{t('job_BulkUploadInstruction2')}</li>
  //       <li>{t('job_BulkUploadInstruction3')}</li>
  //     </ul>
  //   )
  // }

  return (
    <ANTDCard>
      {/* <div className="text-end d-flex justify-center"></div>
      <ANTDCard className="mt-20">
        <div className="bulk-upload-instruction">
          <div>
            <h3>{t('job_Instructions')}</h3>
            {bulkUploadInstruction()}
            <div className="d-flex mt-20">
              <ANTDButton
                type="primary"
                className="btn mr-10"
                onClick={onDownloadTemplate}
              >
                {t('job_DownloadTemplate')}
              </ANTDButton>
              <ANTDFormItem>
                <FormUpload
                  takePhotoFlag={false}
                  // value={value}
                  showUploadList={{ showRemoveIcon: false }}
                  listType="text"
                  className="form-upload-btn btn ant-btn-primary"
                  acceptFileTypes=".xlsx"
                  isPreview={false}
                  uploadText="job_BulkUpload"
                />
              </ANTDFormItem>
            </div>
          </div>
        </div>
      </ANTDCard>
      <ANTDDivider /> */}
      <ANTDFormList name={'inspectionList'} initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }, index) => (
              <InspectionForm
                key={key}
                fields={fields}
                index={index}
                name={name}
                remove={remove}
                removeMaterialClick={removeMaterialClick}
                inspectionFormFieldsAttr={inspectionFormFieldsAttr}
                onSaveClick={onSaveClick}
                activeKeys={activeKeys?.[index]}
                onActiveKeysChange={onActiveKeysChange}
                onSelectUser={onSelectUser}
                selectedUsers={selectedUsers}
                onUserClear={onUserClear}
              />
            ))}
            {/* {length(fields) < maxFields && (
              <ANTDFormItem className="d-flex justify-center mb-10">
                <ANTDButton
                  type="primary"
                  className="btn"
                  onClick={() =>
                    addMaterialClick({
                      addMore: add,
                    })
                  }
                  icon={<PlusOutlined />}
                  block
                >
                  {t('job_AddMore')}
                </ANTDButton>
              </ANTDFormItem>
            )} */}
          </>
        )}
      </ANTDFormList>
    </ANTDCard>
  )
}

export default InspectionFormList
