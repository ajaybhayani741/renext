import { CloseOutlined } from '@ant-design/icons'
import { useMemo } from 'react'

import InspectionFormField from './InspectionFormField'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDCollapse from '../../../../../shared/antd/ANTDCollapse'
import { userWiseRole } from '../../../../../utils/constant'
import { include, length } from '../../../../../utils/javascript'
import { getItem } from '../../../../../utils/localstorage'
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
}) => {
  const { t } = useTranslations()

  const userData = JSON.parse(getItem('userData'))
  const { roleId } = userData || {}

  const { districtHostelDepartment, inspectionOfficer, hostel } = userWiseRole

  const allPermissionRoles = [districtHostelDepartment, inspectionOfficer]

  const {
    hostelAdministrationAttrFn,
    hostelInfraRoomsAttrFn,
    hostelInfraSanitationAttrFn,
    medicalCareAttrFn,
    educationFacilitiesAttrFn,
    foodProvisionAttrFn,
    safetyAndSecurityAttrFn,
    conductionMeetingsAttrFn,
    feedbackAttrFn,
  } = inspectionFormFieldsAttr

  const hostelAdministrationAttr = useMemo(() => {
    return hostelAdministrationAttrFn()
  }, [index])
  const hostelInfraRoomsAttr = useMemo(() => {
    return hostelInfraRoomsAttrFn()
  }, [index])
  const hostelInfraSanitationAttr = useMemo(() => {
    return hostelInfraSanitationAttrFn()
  }, [index])
  const medicalCareAttr = useMemo(() => {
    return medicalCareAttrFn()
  }, [index])
  const educationFacilitiesAttr = useMemo(() => {
    return educationFacilitiesAttrFn()
  }, [index])
  const foodProvisionAttr = useMemo(() => {
    return foodProvisionAttrFn()
  }, [index])
  const safetyAndSecurityAttr = useMemo(() => {
    return safetyAndSecurityAttrFn()
  }, [index])
  const conductionMeetingsAttr = useMemo(() => {
    return conductionMeetingsAttrFn()
  }, [index])
  const feedbackAttr = useMemo(() => {
    return feedbackAttrFn()
  }, [index])

  const commonCollapseProps = {
    className: 'coll collapse-header',
    forceRender: true,
  }

  return (
    <div className="grey-card-body mb-20">
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
          apiPayload: { roleId: hostel },
          // userData: selectedUsers?.[val?.roleId],
          userData: [],
          // onSelectUser,
          // selectedUsers,
          // onUserClear,
        }}
      />

      <ANTDCollapse
        bordered={false}
        activeKey={activeKeys}
        onChange={keys => onActiveKeysChange(keys, index)}
        items={[
          {
            label: t('job_HostelAdministration'),
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
                }}
              />
            ),
          },
          {
            label: t('job_HostelInfraRooms'),
            key: 'hostelInfraRoomsRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: hostelInfraRoomsAttr,
                  index,
                  name,
                  nestedKey: 'hostelInfraRoomsRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
          {
            label: t('job_HostelInfraSanitation'),
            key: 'hostelInfraSanitationRequestDto',
            ...commonCollapseProps,
            children: (
              <>
                <InspectionFormField
                  {...{
                    attrList: hostelInfraSanitationAttr,
                    index,
                    name,
                    nestedKey: 'hostelInfraSanitationRequestDto',
                    showSaveBtn: include([...allPermissionRoles], roleId),
                    disabledAll: !include([...allPermissionRoles], roleId),
                    onSaveClick,
                  }}
                />
              </>
            ),
          },
          {
            label: t('job_MedicalCare'),
            key: 'medicalCareRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: medicalCareAttr,
                  index,
                  name,
                  nestedKey: 'medicalCareRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
          {
            label: t('job_EducationFacilities'),
            key: 'educationFacilitiesRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: educationFacilitiesAttr,
                  index,
                  name,
                  nestedKey: 'educationFacilitiesRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
          {
            label: t('job_FoodProvisions'),
            key: 'foodProvisionRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: foodProvisionAttr,
                  index,
                  name,
                  nestedKey: 'foodProvisionRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
          {
            label: t('job_SafetyAndSecurity'),
            key: 'safetyAndSecurityRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: safetyAndSecurityAttr,
                  index,
                  name,
                  nestedKey: 'safetyAndSecurityRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
          {
            label: t('job_ConductionMeetings'),
            key: 'conductionMeetingsRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: conductionMeetingsAttr,
                  index,
                  name,
                  nestedKey: 'conductionMeetingsRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
          {
            label: t('job_Feedback'),
            key: 'feedbackRequestDto',
            ...commonCollapseProps,
            children: (
              <InspectionFormField
                {...{
                  attrList: feedbackAttr,
                  index,
                  name,
                  nestedKey: 'feedbackRequestDto',
                  showSaveBtn: include([...allPermissionRoles], roleId),
                  disabledAll: !include([...allPermissionRoles], roleId),
                  onSaveClick,
                }}
              />
            ),
          },
        ].filter(({ hidden }) => !hidden)}
      />
    </div>
  )
}

export default InspectionForm
