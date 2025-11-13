import React from 'react'

import useRouter from '../../../../hooks/useRouter'
import useTranslations from '../../../../hooks/useTranslations'
import { HOSTEL } from '../../../../routing/pathName.constant'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import PopUpConfirm from '../../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../../utils/constant'
import { include } from '../../../../utils/javascript'
import UserTable from '../../../userManagement/presentation/UserTable'
import unassignedHostels from '../../container/unassignedHostels.container'

const UnassignedHostels = () => {
  const { t } = useTranslations()
  const { inspectionOfficer, hostel } = userWiseRole
  const { location } = useRouter()

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
      {include(location.pathname, HOSTEL) ? (
        <h2 className="page-title">{t('job_UnassignedHostels')}</h2>
      ) : null}
      <UserTable
        userData={hostelData}
        handleTableChange={handleTableChange}
        handleView={handleViewClick}
        payload={{ roleId: hostel }}
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
