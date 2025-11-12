import '../user.scss'

import AddUser from './AddUser'
import UserTable from './UserTable'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../utils/constant'
import { include, isEqual, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import userList from '../container/userList.container'
import { userRelationKey } from '../user.description'

function UserList({
  permission = false,
  subTitle,
  showAdd,
  payload,
  isSearch,
  isBuilding,
  userDetails,
  className,
  showAssignHostel = true,
  userKey,
}) {
  const {
    model,
    userData,
    modelTitle,
    disAssociated,
    associatedData,
    buildingInfo,
    apiCall,
    setBuildingInfo,
    onAddAssociate,
    handleCancelEdit,
    handleCloseModel,
    handleDAssociate,
    handleTableChange,
    removeAssociateUser,
    handleNonAssociateUser,
    handleAssociatedTableChange,
  } = userList({ payload, isBuilding })
  const { t } = useTranslations()
  const { inspectionOfficer, hostel, admin } = userWiseRole
  const loginUserRoleId = JSON.parse(getItem('userData'))

  return (
    <div className={className}>
      <div
        className={`d-flex ${
          showAdd && subTitle ? 'space-between' : showAdd ? 'flex-end' : ''
        }`}
      >
        {subTitle && (
          <h3
            style={{
              marginTop: '10px',
              marginBottom: '5px',
              padding: '5px',
            }}
          >
            {t(subTitle)}
          </h3>
        )}
        {showAdd &&
          (isEqual(loginUserRoleId?.roleId, admin)
            ? !isEqual(payload?.roleId, hostel)
            : !include([inspectionOfficer], payload?.roleId)) && (
            <div className="d-flex flex-end mt-10">
              <ANTDButton
                type="primary"
                className="btn text-end"
                onClick={handleNonAssociateUser}
              >
                {t('btn_Add') + ' +'}
              </ANTDButton>
            </div>
          )}
      </div>
      <UserTable
        {...{
          isSearch,
          isBuilding,
          customerInfo: isBuilding && userDetails,
          userData,
          permission: ternary(
            isEqual(payload?.relationType, userRelationKey.associate),
            false,
            permission,
          ),
          handleTableChange,
          handleDAssociate: showAdd && handleDAssociate,
          payload,
          apiCall,
          showAssignHostel,
          handleAssignHostel: handleNonAssociateUser,
        }}
      />

      {disAssociated?.open && (
        <PopUpConfirm
          isOpen={disAssociated?.open}
          onCancelModel={handleCloseModel}
          onAccept={removeAssociateUser}
          onReject={handleCloseModel}
          description={t('msg_disassociateUser')}
        />
      )}

      {model && (
        <ANTDModal
          title={t(modelTitle)}
          centered
          open={model}
          onCancel={handleCloseModel}
          footer={false}
          width={1000}
        >
          <UserTable
            className="mb-15"
            userData={associatedData}
            payload={{ ...payload, relationType: userRelationKey.nonAssociate }}
            isSearch
            handleTableChange={handleAssociatedTableChange}
            handleSelect={onAddAssociate}
            multiSelect
          />
        </ANTDModal>
      )}
      {buildingInfo?.flag && (
        <ANTDModal
          title={t('user_Site')}
          centered
          open={buildingInfo?.flag}
          onCancel={handleCancelEdit}
          footer={false}
          width={1000}
        >
          <AddUser
            {...{
              editInfo: buildingInfo,
              setEditInfo: setBuildingInfo,
              handleCancelEdit,
              isBuilding: true,
              userDetails,
              apiCall,
            }}
          />
        </ANTDModal>
      )}
    </div>
  )
}

export default UserList
