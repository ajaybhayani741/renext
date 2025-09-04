import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDModal from '../../../shared/antd/ANTDModal'
import AddUser from '../../userManagement/presentation/AddUser'
import ViewUser from '../../userManagement/presentation/ViewUser'
import basinInformation from '../container/basinInformation'

function BasicInformation() {
  const { t } = useTranslations()
  const { editInfo, userDetails, handleEdit, handleCancelEdit } =
    basinInformation()

  return (
    <div className="basic-info-container">
      <ANTDCard className="info-card">
        <div className="header-line responsive-header">
          <div>
            <ANTDButton
              type="primary"
              className="btn mr-15 bg-edit"
              onClick={handleEdit}
            >
              {t('btn_Edit')}
            </ANTDButton>
            <ANTDButton type="primary" className="btn bg-danger">
              {t('btn_Delete')}
            </ANTDButton>
          </div>
        </div>
        <ViewUser userDetails={userDetails} hasAction={true} />
      </ANTDCard>
      {editInfo?.flag && (
        <ANTDModal
          title={t('txt_Details')}
          centered
          open={editInfo?.flag}
          onCancel={handleCancelEdit}
          footer={false}
          width={1000}
          className="responsive-modal"
        >
          <AddUser {...{ editInfo, handleCancelEdit }} />
        </ANTDModal>
      )}
    </div>
  )
}

export default BasicInformation
