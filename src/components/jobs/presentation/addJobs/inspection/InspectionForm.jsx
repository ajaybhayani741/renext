import { CloseOutlined } from '@ant-design/icons'
import { useMemo } from 'react'

import InspectionFormField from './InspectionFormField'
import useRedux from '../../../../../hooks/useRedux'
import useRouter from '../../../../../hooks/useRouter'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDButton from '../../../../../shared/antd/ANTDButton'
import ANTDCollapse from '../../../../../shared/antd/ANTDCollapse'
import ANTDModal from '../../../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../../../utils/constant'
import { include, isEqual, length } from '../../../../../utils/javascript'
import { getItem } from '../../../../../utils/localstorage'
import { userRelationKey } from '../../../../userManagement/user.description'
import JobUserSelect from '../../common/JobUserSelect'

const InspectionForm = ({
  fields,
  index,
  remove,
  name,
  removeMaterialClick,
  inspectionFormFieldsAttr,
  onSaveClick,
  activeKeys,
  onActiveKeysChange,
  onSelectUser,
  selectedUsers,
  onUserClear,
  activeFormField,
  handleActiveFieldModal,
  formFieldPercentage,
  apiCall,
}) => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = userData || {}
  const { selector } = useRedux()
  const isMobile = selector(state => state.app.isMobile)

  const { districtHostelDepartment, inspectionOfficer, hostel } = userWiseRole

  const allPermissionRoles = [districtHostelDepartment, inspectionOfficer]

  const {
    administrationAttrFn,
    foodNutritionAttrFn,
    accommodationAttrFn,
    sanitationDrainageAttrFn,
    electricityLightingAttrFn,
    healthMedicalCareAttrFn,
    educationAcademicEnvironmentAttrFn,
    safetySecurityAttrFn,
    studentFeedbackAttrFn,
    overallAssessmentAttrFn,
    inspectingOfficerFeedbackAttrFn,
    // administrationAttrFn,
    // hostelInfraRoomsAttrFn,
    // hostelInfraSanitationAttrFn,
    // medicalCareAttrFn,
    // educationFacilitiesAttrFn,
    // foodProvisionAttrFn,
    // safetyAndSecurityAttrFn,
    // conductionMeetingsAttrFn,
    // feedbackAttrFn,
    // curricularActivitiesAttrFn,
  } = inspectionFormFieldsAttr

  const hostelAdministrationAttr = useMemo(() => {
    return administrationAttrFn()
  }, [index])
  const foodNutritionAttr = useMemo(() => {
    return foodNutritionAttrFn()
  }, [index])
  const accommodationAttr = useMemo(() => {
    return accommodationAttrFn()
  }, [index])
  const sanitationDrainageAttr = useMemo(() => {
    return sanitationDrainageAttrFn()
  }, [index])
  const electricityLightingAttr = useMemo(() => {
    return electricityLightingAttrFn()
  }, [index])
  const healthMedicalCareAttr = useMemo(() => {
    return healthMedicalCareAttrFn()
  }, [index])
  const educationAcademicEnvironmentAttr = useMemo(() => {
    return educationAcademicEnvironmentAttrFn()
  }, [index])
  const safetySecurityAttr = useMemo(() => {
    return safetySecurityAttrFn()
  }, [index])
  const studentFeedbackAttr = useMemo(() => {
    return studentFeedbackAttrFn()
  }, [index])
  const overallAssessmentAttr = useMemo(() => {
    return overallAssessmentAttrFn()
  }, [index])
  const inspectingOfficerFeedbackAttr = useMemo(() => {
    return inspectingOfficerFeedbackAttrFn()
  }, [index])
  // const hostelAdministrationAttr = useMemo(() => {
  //   return administrationAttrFn()
  // }, [index])
  // const hostelInfraRoomsAttr = useMemo(() => {
  //   return hostelInfraRoomsAttrFn()
  // }, [index])
  // const hostelInfraSanitationAttr = useMemo(() => {
  //   return hostelInfraSanitationAttrFn()
  // }, [index])
  // const medicalCareAttr = useMemo(() => {
  //   return medicalCareAttrFn()
  // }, [index])
  // const educationFacilitiesAttr = useMemo(() => {
  //   return educationFacilitiesAttrFn()
  // }, [index])
  // const foodProvisionAttr = useMemo(() => {
  //   return foodProvisionAttrFn()
  // }, [index])
  // const safetyAndSecurityAttr = useMemo(() => {
  //   return safetyAndSecurityAttrFn()
  // }, [index])
  // const conductionMeetingsAttr = useMemo(() => {
  //   return conductionMeetingsAttrFn()
  // }, [index])
  // const feedbackAttr = useMemo(() => {
  //   return feedbackAttrFn()
  // }, [index])
  // const curricularActivitiesAttr = useMemo(() => {
  //   return curricularActivitiesAttrFn()
  // }, [index])

  const commonCollapseProps = {
    className: 'coll collapse-header',
    forceRender: true,
  }

  const collapseItemHeader = ({ label, key }) => {
    return (
      <div className="d-flex space-between">
        <p>{t(label)}</p>
        <div>
          {/* <ANTDProgress
            type="circle"
            trailColor="#fff2ea"
            strokeWidth={15}
            size={20}
            showInfo={false}
            percent={formFieldPercentage?.[key] || 0}
          /> */}
          <p>{`${formFieldPercentage?.[key] || 0}% ${t('dash_Completed')}`}</p>
          {/* <span className="ml-15 text-center">
            {isEqual(formFieldPercentage?.[key], 100) ? (
              <CheckCircleFilled
                style={{
                  color: '#fff2ea',
                  fontSize: 16,
                  minWidth: '34px',
                  justifyContent: 'center',
                }}
              />
            ) : (
              `${formFieldPercentage?.[key] || 0}%`
            )}
          </span> */}
        </div>
      </div>
    )
  }

  const collapseItems = [
    {
      label: collapseItemHeader({
        label: 'job_AdministrationGovernance',
        key: 'hostelAdministrationRequestDto',
      }),
      header: t('job_AdministrationGovernance'),
      key: 'hostelAdministrationRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: hostelAdministrationAttr,
            index,
            name,
            nestedKey: 'hostelAdministrationRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_FoodNutritionSection',
        key: 'foodNutritionRequestDto',
      }),
      header: t('job_FoodNutritionSection'),
      key: 'foodNutritionRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: foodNutritionAttr,
            index,
            name,
            nestedKey: 'foodNutritionRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_AccommodationSection',
        key: 'accommodationRequestDto',
      }),
      header: t('job_AccommodationSection'),
      key: 'accommodationRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: accommodationAttr,
            index,
            name,
            nestedKey: 'accommodationRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_SanitationDrainageSection',
        key: 'sanitationDrainageRequestDto',
      }),
      header: t('job_SanitationDrainageSection'),
      key: 'sanitationDrainageRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: sanitationDrainageAttr,
            index,
            name,
            nestedKey: 'sanitationDrainageRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_ElectricityLightingSection',
        key: 'electricityLightingRequestDto',
      }),
      header: t('job_ElectricityLightingSection'),
      key: 'electricityLightingRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: electricityLightingAttr,
            index,
            name,
            nestedKey: 'electricityLightingRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_HealthMedicalCareSection',
        key: 'healthMedicalCareRequestDto',
      }),
      header: t('job_HealthMedicalCareSection'),
      key: 'healthMedicalCareRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: healthMedicalCareAttr,
            index,
            name,
            nestedKey: 'healthMedicalCareRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_EducationAcademicEnvironmentSection',
        key: 'educationAcademicEnvironmentRequestDto',
      }),
      header: t('job_EducationAcademicEnvironmentSection'),
      key: 'educationAcademicEnvironmentRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: educationAcademicEnvironmentAttr,
            index,
            name,
            nestedKey: 'educationAcademicEnvironmentRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_SafetySecuritySection',
        key: 'safetySecurityRequestDto',
      }),
      header: t('job_SafetySecuritySection'),
      key: 'safetySecurityRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: safetySecurityAttr,
            index,
            name,
            nestedKey: 'safetySecurityRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_StudentFeedbackSection',
        key: 'studentFeedbackRequestDto',
      }),
      header: t('job_StudentFeedbackSection'),
      key: 'studentFeedbackRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: studentFeedbackAttr,
            index,
            name,
            nestedKey: 'studentFeedbackRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_OverallAssessmentSection',
        key: 'overallAssessmentRequestDto',
      }),
      header: t('job_OverallAssessmentSection'),
      key: 'overallAssessmentRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: overallAssessmentAttr,
            index,
            name,
            nestedKey: 'overallAssessmentRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
    {
      label: collapseItemHeader({
        label: 'job_Feedback',
        key: 'inspectingOfficerFeedbackRequestDto',
      }),
      header: t('job_Feedback'),
      key: 'inspectingOfficerFeedbackRequestDto',
      ...commonCollapseProps,
      children: (
        <InspectionFormField
          {...{
            attrList: inspectingOfficerFeedbackAttr,
            index,
            name,
            nestedKey: 'inspectingOfficerFeedbackRequestDto',
            showSaveBtn: include([...allPermissionRoles], roleId),
            disabledAll: !include([...allPermissionRoles], roleId),
            onSaveClick,
            apiCall,
          }}
        />
      ),
    },
  ].filter(({ hidden }) => !hidden)

  //  const collapseItems = [
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_AdministrationGovernance',
  //        key: 'hostelAdministrationRequestDto',
  //      }),
  //      header: t('job_AdministrationGovernance'),
  //      key: 'hostelAdministrationRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: hostelAdministrationAttr,
  //            index,
  //            name,
  //            nestedKey: 'hostelAdministrationRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_HostelInfraRooms',
  //        key: 'hostelInfraRoomsRequestDto',
  //      }),
  //      header: t('job_HostelInfraRooms'),
  //      key: 'hostelInfraRoomsRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: hostelInfraRoomsAttr,
  //            index,
  //            name,
  //            nestedKey: 'hostelInfraRoomsRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_HostelInfraSanitation',
  //        key: 'hostelInfraSanitationRequestDto',
  //      }),
  //      header: t('job_HostelInfraSanitation'),
  //      key: 'hostelInfraSanitationRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <>
  //          <InspectionFormField
  //            {...{
  //              attrList: hostelInfraSanitationAttr,
  //              index,
  //              name,
  //              nestedKey: 'hostelInfraSanitationRequestDto',
  //              showSaveBtn: include([...allPermissionRoles], roleId),
  //              disabledAll: !include([...allPermissionRoles], roleId),
  //              onSaveClick,
  //              apiCall,
  //            }}
  //          />
  //        </>
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_MedicalCare',
  //        key: 'medicalCareRequestDto',
  //      }),
  //      header: t('job_MedicalCare'),
  //      key: 'medicalCareRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: medicalCareAttr,
  //            index,
  //            name,
  //            nestedKey: 'medicalCareRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_EducationFacilities',
  //        key: 'educationFacilitiesRequestDto',
  //      }),
  //      header: t('job_EducationFacilities'),
  //      key: 'educationFacilitiesRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: educationFacilitiesAttr,
  //            index,
  //            name,
  //            nestedKey: 'educationFacilitiesRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_ExtraCurricularActivities',
  //        key: 'activitiesRequestDto',
  //      }),
  //      header: t('job_ExtraCurricularActivities'),
  //      key: 'activitiesRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: curricularActivitiesAttr,
  //            index,
  //            name,
  //            nestedKey: 'activitiesRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_FoodProvisions',
  //        key: 'foodProvisionRequestDto',
  //      }),
  //      header: t('job_FoodProvisions'),
  //      key: 'foodProvisionRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: foodProvisionAttr,
  //            index,
  //            name,
  //            nestedKey: 'foodProvisionRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_SafetyAndSecurity',
  //        key: 'safetyAndSecurityRequestDto',
  //      }),
  //      header: t('job_SafetyAndSecurity'),
  //      key: 'safetyAndSecurityRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: safetyAndSecurityAttr,
  //            index,
  //            name,
  //            nestedKey: 'safetyAndSecurityRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_ConductionMeetings',
  //        key: 'conductionMeetingsRequestDto',
  //      }),
  //      header: t('job_ConductionMeetings'),
  //      key: 'conductionMeetingsRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: conductionMeetingsAttr,
  //            index,
  //            name,
  //            nestedKey: 'conductionMeetingsRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //    {
  //      label: collapseItemHeader({
  //        label: 'job_Feedback',
  //        key: 'feedbackRequestDto',
  //      }),
  //      header: t('job_Feedback'),
  //      key: 'feedbackRequestDto',
  //      ...commonCollapseProps,
  //      children: (
  //        <InspectionFormField
  //          {...{
  //            attrList: feedbackAttr,
  //            index,
  //            name,
  //            nestedKey: 'feedbackRequestDto',
  //            showSaveBtn: include([...allPermissionRoles], roleId),
  //            disabledAll: !include([...allPermissionRoles], roleId),
  //            onSaveClick,
  //            apiCall,
  //          }}
  //        />
  //      ),
  //    },
  //  ].filter(({ hidden }) => !hidden)

  const currentActive = collapseItems?.find(v =>
    isEqual(v?.key, activeFormField?.key),
  )

  return (
    <div>
      <div className="d-flex space-between align-start">
        {/* <h3 className="mb-10 primary-color">
          {t('job_ELV')} {index + 1}
        </h3> */}
        {length(fields) > 1 && (
          <CloseOutlined
            className="cursor-pointer"
            onClick={() => removeMaterialClick({ remove, name, index })}
          />
        )}
      </div>

      <JobUserSelect
        {...{
          selectTitle: 'job_SelectHostel',
          roleId: hostel,
          apiPayload: {
            roleId: hostel,
            relationType: userRelationKey.associate,
          },
          userData: selectedUsers?.[hostel],
          onSelectUser,
          selectedUsers,
          onUserClear,
          readOnly: params?.jobId,
        }}
      />
      <ANTDCollapse
        bordered={false}
        activeKey={isMobile ? [] : activeKeys}
        onChange={keys => onActiveKeysChange(keys, index)}
        items={collapseItems}
      />
      {isMobile && (
        <ANTDModal
          open={activeFormField?.isOpen}
          footer={null}
          onCancel={() => handleActiveFieldModal(currentActive?.key, index)}
          title={
            <div className="d-flex space-between">
              <p>{currentActive?.header}</p>
              <ANTDButton
                // type="primary"
                className="btn save-button"
                onClick={() => onSaveClick({ key: currentActive?.key, index })}
              >
                {t('btn_Save')}
              </ANTDButton>
            </div>
          }
          destroyOnClose
          className="active-form-modal"
          // width={include(imageType, 'pdf') ? 800 : 500}
        >
          {currentActive?.children}
        </ANTDModal>
      )}
    </div>
  )
}

export default InspectionForm
