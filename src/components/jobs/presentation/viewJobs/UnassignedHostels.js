import React from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import PopUpConfirm from '../../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../../utils/constant'
import UserTable from '../../../userManagement/presentation/UserTable'
import unassignedHostels from '../../container/unassignedHostels.container'

const UnassignedHostels = () => {
  const { t } = useTranslations()
  const { inspectionOfficer } = userWiseRole

  const {
    hostelData,
    inspectionOfficerModal,
    handleViewClick = () => {},
    handleTableChange,
    handleAssignInspectionOfficer,
    handleAssignInspectionOfficerRandomly,
    handleCloseInspectionOfficerModal,
    inspectionOfficerData,
    handleInspectionOfficerTableChange,
    onAssignInspectionOfficer,
    confirmAssignInspectionRandomModal,
    confirmAssignInspectionOfficer,
  } = unassignedHostels()
  return (
    <>
      <UserTable
        userData={hostelData}
        handleTableChange={handleTableChange}
        handleView={handleViewClick}
        payload={{ roleId: inspectionOfficer }}
        removeEditBtn={true}
        isCardView={false}
        pagination={true}
        handleAssignInspectionOfficer={handleAssignInspectionOfficer}
        handleAssignInspectionOfficerRandomly={
          handleAssignInspectionOfficerRandomly
        }
        showAssignInspectionOfficer={true}
        columnFilter={[
          'user_Image',
          'user_Name',
          'user_Address',
          'user_Contact',
          'user_LastInspectionDate',
          'txt_Action',
        ]}
      />
      {inspectionOfficerModal?.open && (
        <ANTDModal
          title={t('user_InspectionOfficer')}
          centered
          open={inspectionOfficerModal?.open}
          onCancel={handleCloseInspectionOfficerModal}
          footer={false}
          width={1000}
        >
          <UserTable
            className="mb-15"
            userData={inspectionOfficerData}
            payload={{
              roleId: inspectionOfficer,
              relationType: 'nonAssociate',
            }}
            isSearch
            handleTableChange={handleInspectionOfficerTableChange}
            handleSelect={onAssignInspectionOfficer}
            // multiSelect
          />
        </ANTDModal>
      )}
      {confirmAssignInspectionRandomModal?.open && (
        <PopUpConfirm
          isOpen={confirmAssignInspectionRandomModal?.open}
          onCancelModel={handleAssignInspectionOfficerRandomly}
          onAccept={confirmAssignInspectionOfficer}
          onReject={handleAssignInspectionOfficerRandomly}
          description={t('msg_AreYouSureWantToAssign')}
        />
      )}
    </>
  )
}

export default UnassignedHostels
