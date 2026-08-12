import '../user.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDTab from '../../../shared/antd/ANTDTab'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../utils/constant'
import { isEqual, ternary } from '../../../utils/javascript'
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
  viewDepth = 0,
  maxViewDepth = 2,
}) {
  const {
    model,
    userData,
    modelTitle,
    associatedData,
    buildingInfo,
    inspectionOfficerModal,
    inspectionOfficerData,
    mandalSpecialOfficerData,
    confirmAssignToSelfModal,
    showAssignInspectionOfficer,
    apiCall,
    setBuildingInfo,
    onAddAssociate,
    handleCancelEdit,
    handleCloseModel,
    handleTableChange,
    handleNonAssociateUser,
    handleAssociatedTableChange,
    handleAssignInspectionOfficer,
    handleAssignToSelf,
    handleCloseAssignToSelfModal,
    handleCloseInspectionOfficerModal,
    handleInspectionOfficerTableChange,
    handleMandalSpecialOfficerTableChange,
    onAssignInspectionOfficer,
    onAssignToSelf,
    modelData,
  } = userList({ payload, isBuilding })
  const { t } = useTranslations()
  const { districtCollector, hostel, inspectionOfficer, mandalSpecialOfficer } =
    userWiseRole
  const loginUser = JSON.parse(localStorage.getItem('userData') || '{}')
  const isDistrictCollector = isEqual(loginUser?.roleId, districtCollector)

  return (
    <div className={className}>
      <div
        className={`d-flex align-items-center mb-5 ${
          showAdd && subTitle
            ? 'justify-content-between'
            : showAdd
              ? 'justify-content-end'
              : ''
        }`}
        style={{ flexWrap: 'wrap', gap: '10px' }}
      >
        {subTitle && <h3 style={{ margin: 0, padding: 0 }}>{t(subTitle)}</h3>}
        {showAdd && (
          /*  (isEqual(loginUserRoleId?.roleId, admin)
            ? !isEqual(payload?.roleId, hostel)
            : !include([inspectionOfficer], payload?.roleId)) &&  */ <div className="d-flex justify-content-end">
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
          showAssignInspectionOfficer,
          handleAssignInspectionOfficer,
          handleAssignToSelf,
          handleAssignHostel: handleNonAssociateUser,
          userKey,
          getUsersData: apiCall,
          viewDepth,
          maxViewDepth,
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
              relationType: isEqual(modelData?.roleId, hostel)
                ? userRelationKey.nonAssociate
                : userRelationKey.associate,
            }}
            roleId={modelData?.roleId || payload?.roleId}
            isSearch
            handleTableChange={handleAssociatedTableChange}
            handleSelect={onAddAssociate}
            multiSelect
            showAssignHostel={false}
            showSearchBySection={false}
            columnFilter={
              isEqual(modelData?.roleId, hostel)
                ? [
                    'select',
                    'user_Name',
                    'mso_Mandal',
                    'hostel_TypeOfHostel',
                    'hostel_DepartmentUnit',
                    'user_LastInspectionDate',
                    'txt_Action',
                  ]
                : null
            }
          />
        </ANTDModal>
      )}

      {inspectionOfficerModal?.open && (
        <ANTDModal
          title={
            isDistrictCollector
              ? t('user_AssignIOAndMSO')
              : t('user_InspectionOfficer')
          }
          centered
          open={inspectionOfficerModal?.open}
          onCancel={handleCloseInspectionOfficerModal}
          footer={false}
          width={1000}
        >
          {isDistrictCollector ? (
            <ANTDTab
              centered
              className="assignment-user-tabs"
              destroyOnHidden
              items={[
                {
                  key: inspectionOfficer,
                  label: t('user_InspectionOfficer'),
                  children: (
                    <AssignmentUserTable
                      roleId={inspectionOfficer}
                      userData={inspectionOfficerData}
                      handleTableChange={handleInspectionOfficerTableChange}
                      handleSelect={onAssignInspectionOfficer}
                    />
                  ),
                },
                {
                  key: mandalSpecialOfficer,
                  label: t('user_MandalSpecialOfficer'),
                  children: (
                    <AssignmentUserTable
                      roleId={mandalSpecialOfficer}
                      userData={mandalSpecialOfficerData}
                      handleTableChange={handleMandalSpecialOfficerTableChange}
                      handleSelect={onAssignInspectionOfficer}
                    />
                  ),
                },
              ]}
            />
          ) : (
            <AssignmentUserTable
              roleId={inspectionOfficer}
              userData={inspectionOfficerData}
              handleTableChange={handleInspectionOfficerTableChange}
              handleSelect={onAssignInspectionOfficer}
            />
          )}
        </ANTDModal>
      )}
      {confirmAssignToSelfModal?.open && (
        <PopUpConfirm
          isOpen={confirmAssignToSelfModal?.open}
          onCancelModel={handleCloseAssignToSelfModal}
          onAccept={onAssignToSelf}
          onReject={handleCloseAssignToSelfModal}
          description={t('msg_AreYouSureWantToAssign')}
        />
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

const AssignmentUserTable = ({
  roleId,
  userData,
  handleTableChange,
  handleSelect,
}) => (
  <UserTable
    className="assignment-user-table"
    userData={userData}
    payload={{ roleId, relationType: userRelationKey.nonAssociate }}
    searchPayload={{ roleId, relationType: userRelationKey.associate }}
    handleTableChange={handleTableChange}
    handleSelect={handleSelect}
    columnFilter={[
      'select',
      'user_Name',
      'designation',
      'mso_Mandal',
      'user_Contact',
      'txt_Action',
    ]}
    tableScroll={{ x: 1050 }}
  />
)

export default UserList
