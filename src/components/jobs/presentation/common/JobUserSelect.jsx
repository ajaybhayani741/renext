import MultiTableUserSelect from './MultiTableUserSelect'
import { notifyMethod } from '../../../../App'
import useTranslations from '../../../../hooks/useTranslations'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../../shared/antd/ANTDCheckbox'
import { ANTDDatePicker } from '../../../../shared/antd/ANTDDatePicker'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../../utils/constant'
import { dayJs } from '../../../../utils/dayjs'
import { isEqual, keys, length, ternary } from '../../../../utils/javascript'
import AddUser from '../../../userManagement/presentation/AddUser'
import UserTable from '../../../userManagement/presentation/UserTable'
import {
  userRelationKey,
  userTranslationKey,
} from '../../../userManagement/user.description'
import jobUserSelect from '../../container/jobUserSelect.container'

const JobUserSelect = ({
  agreeDealer,
  onSelectUser,
  selectedUsers,
  roleId,
  userData,
  userIndex,
  apiPayload,
  selectTitle,
  onUserClear,
  addNewBuildData,
  onContractDealerChange,
  readOnly,
  disableSelect,
  showAdd,
  showSelf,
  onSelfUser,
  disableClear,
}) => {
  const { t } = useTranslations()
  const { customer, site } = userWiseRole

  const {
    buildingInfo,
    selectUserModal,
    setBuildingInfo,
    onModelClose,
    handleSelectUserPopup,
    handleCancelEdit,
  } = jobUserSelect({ roleId, apiPayload })

  return (
    <>
      <div className="mb-10 select-user-card">
        <div className="mb-10 d-flex space-between title">
          <h3>{t(selectTitle)}</h3>
          {!readOnly && (
            <ANTDButton
              type="primary"
              className="btn"
              disabled={disableSelect}
              onClick={() =>
                handleSelectUserPopup({
                  userId: roleId,
                  index: userIndex,
                  parent: true,
                })
              }
            >
              {t('btn_Select')}
            </ANTDButton>
          )}
        </div>
        {agreeDealer && (
          <>
            <p>
              <ANTDCheckbox
                className="mb-10"
                onChange={e => onContractDealerChange(e, userIndex)}
                checked={userData?.[0]?.contract || false}
              >
                {t('job_DealerAgreesToContractToDealer', {
                  first: userIndex,
                  second: userIndex + 1,
                })}
              </ANTDCheckbox>
            </p>
            <ANTDDatePicker
              className="mb-10"
              value={ternary(
                userData?.[0]?.date,
                dayJs(userData?.[0]?.date),
                '',
              )}
              onChange={(_, date) => onContractDealerChange(date, userIndex)}
            />
          </>
        )}
        <UserTable
          userData={{
            loader: false,
            list: length(keys(userData?.[0]))
              ? userData?.map(data => ({ ...data, key: data?.id }))
              : [],
          }}
          isBuilding={isEqual(roleId, site)}
          // customerInfo={customerInfo}
          permission={false}
          pagination={false}
          removeEditBtn={true}
          payload={{ roleId }}
          // searchByEmail={searchByEmail}
          // isCardView={isCardView}
          className="user-card"
        />
        {showSelf ? (
          <div className="mt-10">
            <ANTDButton
              type="link"
              onClick={() => onSelfUser(roleId, userIndex)}
            >
              {t('user_Self')}
            </ANTDButton>
          </div>
        ) : (
          !readOnly && (
            <div className="mt-10">
              <ANTDButton
                type="primary"
                className="btn"
                onClick={() => onUserClear(roleId, userIndex)}
                disabled={disableClear}
              >
                {t('txt_Clear')}
              </ANTDButton>
            </div>
          )
        )}
      </div>
      {selectUserModal?.isOpen && (
        <ANTDModal
          title={t('btn_Select')}
          open={selectUserModal?.isOpen}
          onCancel={onModelClose}
          footer={null}
          width={1000}
        >
          <MultiTableUserSelect
            removeEditBtn={true}
            roleId={roleId}
            userId={isEqual(roleId, customer) && apiPayload?.userId}
            onSelectConfirm={data => {
              if (!length(data))
                return notifyMethod.warning({ message: 'msg_SelectUser' })
              onSelectUser({ data, userIndex, roleId })
              onModelClose()
            }}
            preSelectedUser={selectedUsers}
            selectedCustomer={selectedUsers?.[customer]}
            setBuildingInfo={setBuildingInfo}
            showAdd={showAdd}
            dataList={[
              {
                userData: selectUserModal?.parent || [],
                handleTableChange: e =>
                  handleSelectUserPopup({
                    pageNo: e?.current,
                    parent: true,
                  }),
                title: null,
              },
              {
                userData: selectUserModal?.associated || [],
                handleTableChange: e =>
                  handleSelectUserPopup({
                    pageNo: e?.current,
                    associated: true,
                  }),
                title: 'user_Associate',
                type: userRelationKey.associate,
                // hidden: include([recycler, transporter, smelter], roleId),
                hidden: true,
              },
            ].filter(item => !item?.hidden)}
          />
        </ANTDModal>
      )}
      {buildingInfo?.flag && (
        <ANTDModal
          title={t(userTranslationKey[roleId])}
          centered
          open={buildingInfo?.flag}
          onCancel={handleCancelEdit}
          footer={false}
          width={1000}
        >
          <AddUser
            {...{
              editInfo: {},
              userRoleId: buildingInfo?.data?.roleId,
              setEditInfo: setBuildingInfo,
              handleCancelEdit,
              isBuilding: isEqual(roleId, site),
              userDetails: selectedUsers?.[customer]?.[0],
              addNewBuildData: args => {
                addNewBuildData(args)
                onModelClose()
              },
            }}
          />
        </ANTDModal>
      )}
    </>
  )
}

export default JobUserSelect
