import '../user.scss'

import UserTable from './UserTable'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDForm from '../../../shared/antd/ANTDForm'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import { keys, length, ternary } from '../../../utils/javascript'
import FormLayout from '../../common/presentation/FormLayout'
import addUser from '../container/addUser.container'

function AddUser({
  editInfo,
  setEditInfo,
  handleCancelEdit,
  isBuilding,
  userDetails,
  apiCall,
  addNewBuildData,
  userRoleId,
  successCallback,
}) {
  const { t } = useTranslations()
  const {
    form,
    userForm,
    handleValuesChange,
    onFinish,
    currentUserDescription,
    handleSelectClick,
    selectUser,
    handleSelectCancel,
    handleTableChange,
    onSelectUser,
    isSelect,
    loader,
    handleSameAsParent,
    popup,
    handleClosePopup,
    getAddressData,
    currentAddress,
  } = addUser({
    t,
    editInfo,
    setEditInfo,
    handleCancelEdit,
    isBuilding,
    selectedUserDetails: userDetails,
    userRoleId,
    addNewBuildData,
    apiCall,
    successCallback,
  })

  return (
    <div className="m-3-percent">
      {!isBuilding && (
        <h2 className="mb-15">{t(currentUserDescription?.label)}</h2>
      )}
      <div>
        {currentUserDescription &&
        currentUserDescription?.parent &&
        !isBuilding &&
        !editInfo?.data?.id ? (
          <div>
            <h3 className="mb-10">
              {t(currentUserDescription?.parent?.label)}
            </h3>
            <UserTable
              {...{
                userData: {
                  loader: false,
                  list: length(keys(selectUser?.data))
                    ? [selectUser?.data]
                    : [],
                },
                permission: false,
                pagination: false,
                payload: { roleId: selectUser?.data?.roleId },
              }}
            />
            {isSelect && (
              <h3
                className="text-end  mr-15 cursor-pointer primary-color"
                onClick={handleSelectClick}
              >
                {t('btn_Select')}
              </h3>
            )}
          </div>
        ) : null}

        {isBuilding && (
          <div className="text-end">
            <ANTDButton
              type="primary"
              className="btn mb-15"
              onClick={() => handleSameAsParent(userDetails)}
            >
              {t('btn_SameAsCustomer')}
            </ANTDButton>
          </div>
        )}
        <ANTDForm
          name="add-user"
          form={form}
          onValuesChange={handleValuesChange}
          onFinish={onFinish}
          layout="vertical"
        >
          <FormLayout
            form={form}
            formFieldAttributes={userForm}
            getAddressData={getAddressData}
            currentAddress={currentAddress}
          />
          <ANTDRow className="">
            <ANTDColumn md={24} className="text-center">
              <ANTDButton
                loading={loader}
                type="primary"
                htmlType="submit"
                className="submit-btn"
              >
                {t(
                  ternary(
                    length(keys(editInfo?.data)),
                    'btn_Update',
                    'btn_Register',
                  ),
                )}
              </ANTDButton>
            </ANTDColumn>
          </ANTDRow>
        </ANTDForm>
      </div>
      <ANTDModal
        title={t('btn_Select')}
        open={selectUser?.flag}
        onCancel={handleSelectCancel}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <UserTable
          {...{
            isSearch: true,
            userData: selectUser?.list,
            permission: false,
            handleTableChange,
            payload: { roleId: currentUserDescription?.parent?.id },
            handleSelect: onSelectUser,
          }}
        />
      </ANTDModal>
      <PopUpConfirm
        isOpen={popup?.open}
        onCancelModel={handleClosePopup}
        description={popup?.message}
      />
    </div>
  )
}
export default AddUser
