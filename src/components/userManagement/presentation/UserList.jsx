import '../user.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../utils/constant'
import { include, isEqual, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import userList from '../container/userList.container'
import { userRelationKey, userTranslationKey } from '../user.description'
import AddUser from './AddUser'
import UserTable from './UserTable'

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
    associatedData,
    buildingInfo,
    apiCall,
    setBuildingInfo,
    onAddAssociate,
    handleCancelEdit,
    handleCloseModel,
    handleTableChange,
    handleNonAssociateUser,
    handleAssociatedTableChange,
    modelData,
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
          payload,
          apiCall,
          showAssignHostel,
          handleAssignHostel: handleNonAssociateUser,
          userKey,
          getUsersData: apiCall,
        }}
      />

      {model && (
        <ANTDModal
          title={
            modelData?.roleId
              ? t(userTranslationKey?.[modelData?.roleId])
              : t(modelTitle)
          }
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
            searchPayload={{
              roleId: modelData?.roleId,
              relationType: userRelationKey.associate,
            }}
            isSearch
            handleTableChange={handleAssociatedTableChange}
            handleSelect={onAddAssociate}
            multiSelect
            showAssignHostel={false}
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
