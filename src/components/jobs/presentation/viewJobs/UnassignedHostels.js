import React from 'react'

import useRouter from '../../../../hooks/useRouter'
import useTranslations from '../../../../hooks/useTranslations'
import { HOSTEL } from '../../../../routing/pathName.constant'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import ANTDTab from '../../../../shared/antd/ANTDTab'
import PopUpConfirm from '../../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../../utils/constant'
import { include, isEqual, notEqual } from '../../../../utils/javascript'
import { getItem } from '../../../../utils/localstorage'
import UserTable from '../../../userManagement/presentation/UserTable'
import { userRelationKey } from '../../../userManagement/user.description'
import unassignedHostels from '../../container/unassignedHostels.container'

const UnassignedHostels = () => {
  const { t } = useTranslations()
  const { districtCollector, inspectionOfficer, hostel, mandalSpecialOfficer } =
    userWiseRole
  const { location } = useRouter()
  const userData = JSON.parse(getItem('userData') || '{}')
  const isDistrictCollector = isEqual(userData?.roleId, districtCollector)

  const {
    hostelData,
    inspectionOfficerModal,
    handleViewClick = () => {},
    handleTableChange,
    handleAssignInspectionOfficer,
    handleAssignToSelf,
    handleCloseAssignToSelfModal,
    handleCloseInspectionOfficerModal,
    inspectionOfficerData,
    handleInspectionOfficerTableChange,
    mandalSpecialOfficerData,
    handleMandalSpecialOfficerTableChange,
    onAssignInspectionOfficer,
    confirmAssignToSelfModal,
    onAssignToSelf,
  } = unassignedHostels()
  return (
    <>
      {include(location.pathname, HOSTEL) ? (
        <h2 className="page-title">{t('job_UnassignedHostels')}</h2>
      ) : null}
      <UserTable
        className="unassigned-hostel-list"
        userData={hostelData}
        handleTableChange={handleTableChange}
        handleView={handleViewClick}
        payload={{
          roleId: hostel,
          relationType: userRelationKey.nonAssociate,
        }}
        isSearch
        removeEditBtn={notEqual(location.pathname, `/${HOSTEL}`)}
        isCardView={false}
        pagination={true}
        handleAssignInspectionOfficer={handleAssignInspectionOfficer}
        handleAssignToSelf={handleAssignToSelf}
        showAssignInspectionOfficer={true}
        columnFilter={[
          'user_Name',
          'mso_Mandal',
          'hostel_TypeOfHostel',
          'hostel_DepartmentUnit',
          'user_LastInspectionDate',
          'txt_Action',
        ]}
        permission={isEqual(location.pathname, `/${HOSTEL}`)}
      />
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
    </>
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

export default UnassignedHostels
