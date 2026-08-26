// import {
//   cityOptions,
//   countryOptions,
//   pincodeOptions,
//   stateOptions,
// } from './addressData'
import {
  ADMIN,
  STATE_HOSTEL_DEPARTMENT,
  STATE_ADMIN_OFFICER,
  DISTRICT_COLLECTOR,
  INSPECTION_OFFICER,
  HOSTEL,
  MANDAL_SPECIAL_OFFICER,
} from '../../routing/pathName.constant'
import { userWiseRole } from '../../utils/constant'

const userRelationKey = {
  associate: 'ASSOCIATE',
  nonAssociate: 'NON_ASSOCIATE',
  childAssociate: 'CHILD_AND_ASSOCIATE',
}

const associateKey = {
  user_StateHostelDepartment: 'user_AssociatedStateHostelDepartment',
  user_DistrictCollector: 'user_AssociatedDistrictCollector',
  user_Hostel: 'user_AssociatedHostel',
}

const {
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  inspectionOfficer,
  hostel,
  mandalSpecialOfficer,
} = userWiseRole

const userTranslationKey = {
  [admin]: 'user_Admin',
  [stateHostelDepartment]: 'user_StateHostelDepartment',
  [stateAdminOfficer]: 'user_StateAdminOfficer',
  [districtCollector]: 'user_DistrictCollector',
  [inspectionOfficer]: 'user_InspectionOfficer',
  [hostel]: 'user_Hostel',
  [mandalSpecialOfficer]: 'user_MandalSpecialOfficer',
}

const roleIdByPath = {
  [ADMIN]: admin,
  [STATE_HOSTEL_DEPARTMENT]: stateHostelDepartment,
  [STATE_ADMIN_OFFICER]: stateAdminOfficer,
  [DISTRICT_COLLECTOR]: districtCollector,
  [INSPECTION_OFFICER]: inspectionOfficer,
  [HOSTEL]: hostel,
  [MANDAL_SPECIAL_OFFICER]: mandalSpecialOfficer,
}

const commonForm = {
  address: {
    label: 'user_Address',
    validateTrigger: 'onChange',
    inputType: 'autoCompleteAddress',
    required: true,
    md: 24,
    xs: 24,
  },
  city: {
    label: 'user_City',
    validateTrigger: 'onChange',
    inputType: 'input',
    required: true,
    md: 12,
    xs: 24,
    // options: cityOptions,
    // inputType: 'select',
    // disabled: true,
  },
  state: {
    label: 'user_State',
    validateTrigger: 'onChange',
    inputType: 'input',
    required: true,
    md: 12,
    xs: 24,
    // inputType: 'select',
    // options: stateOptions,
    // disabled: true,
  },
  country: {
    label: 'txt_Country',
    validateTrigger: 'onChange',
    inputType: 'input',
    required: true,
    md: 24,
    xs: 24,
    // inputType: 'select',
    // disabled: true,
    // options: countryOptions,
  },
  pincode: {
    label: 'user_Pincode',
    validateTrigger: 'onChange',
    inputType: 'inputNumber',
    className: 'show-clear-icon w-100',
    required: true,
    allowClear: true,
    md: 24,
    xs: 24,
    // inputType: 'input',
    // options: pincodeOptions,
    // disabled: true,
  },
  emailId: {
    label: 'user_Email',
    validateTrigger: 'onChange',
    inputType: 'input',
    validateKey: 'emailId',
    addMore: true,
    maxField: 10,
    addMoreLabel: 'btn_AddMoreEmail',
    addMoreError: 'error_InvalidEmail',
    additionalLabel: 'user_AdditionalEmail',
    md: 24,
    xs: 24,
  },
  phoneNumber: {
    label: 'user_Contact',
    validateTrigger: 'onChange',
    inputType: 'input',
    md: 24,
    xs: 24,
  },
}

const commonWithUserNamePassword = {
  sameAsParentBtn: {
    inputType: 'button',
    type: 'primary',
    style: { float: 'right' },
    hidden: true,
    xs: 24,
  },
  ...commonForm,
  inchargeName: {
    label: 'user_InChargeName',
    validateTrigger: 'onChange',
    inputType: 'input',
    md: 24,
    xs: 24,
  },
  username: {
    label: 'auth_UserName',
    validateTrigger: 'onChange',
    inputType: 'input',
    autoComplete: 'off',
    required: true,
    md: 24,
    xs: 24,
  },
  password: {
    label: 'auth_Password',
    validateTrigger: 'onChange',
    inputType: 'password',
    required: true,
    autoComplete: 'new-password',
    md: 24,
    xs: 24,
  },
}

const addUserForm = {
  profile: {
    validateTrigger: 'onChange',
    inputType: 'formUpload',
    uploadSingle: true,
    acceptFileTypes: '.png,.jpg,.jpeg,.webp',
    hasApiCall: false,
    filePath: ['profile'],
    disableGalleryUpload: false,
    md: 12,
    xs: 12,
  },
  businessName: {
    label: 'user_BusinessName',
    validateTrigger: 'onChange',
    inputType: 'input',
    md: 24,
    xs: 24,
    required: true,
  },
  lastName: {
    label: 'user_Name',
    validateTrigger: 'onChange',
    inputType: 'input',
    md: 24,
    xs: 24,
    required: true,
  },
  designation: {
    label: 'user_Designation',
    validateTrigger: 'onChange',
    inputType: 'input',
    md: 24,
    xs: 24,
    required: false,
  },
  ...commonWithUserNamePassword,
}

const mandalSpecialOfficerDesignation = 'Mandal special officer (MSO)'

const inspectionOfficerDesignationOptions = [
  // 'inspectionOfficer_Designation_Tahsildar',
  'inspectionOfficer_Designation_MAO',
  'inspectionOfficer_Designation_MEO',
  'inspectionOfficer_Designation_MPDO',
  'inspectionOfficer_Designation_MRO',
  'inspectionOfficer_Designation_MPO',
  'inspectionOfficer_Designation_MSO',
  'inspectionOfficer_Designation_APMDRDA',
  'text_Other',
]

const hostelDepartmentOptions = [
  'hostel_DepartmentUnit_BCWelfare',
  'hostel_DepartmentUnit_SCWelfare',
  'hostel_DepartmentUnit_STWelfare',
  'hostel_DepartmentUnit_MinorityDepartment',
  'KGVB',
  'text_Other',
]

const hostelTypeOptions = [
  { label: 'hostel_ResidentialSchool', value: 'RESIDENTIAL_HOSTEL' },
  { label: 'user_Hostel', value: 'NON_RESIDENTIAL_HOSTEL' },
]

const mandalField = options => {
  return {
    mandal: {
      label: 'mso_Mandal',
      validateTrigger: 'onChange',
      inputType: 'select',
      required: true,
      options,
      md: 24,
      xs: 24,
    },
  }
}

const inspectionOfficerForm = (t, formValues, mandals) => ({
  profile: addUserForm.profile,
  lastName: addUserForm.lastName,
  designation: {
    ...addUserForm.designation,
    inputType: 'select',
    required: true,
    options: inspectionOfficerDesignationOptions.map(v => ({
      label: t(v),
      value: t(v),
    })),
  },
  customDesignation: {
    label: 'user_OtherDesignation',
    validateTrigger: 'onChange',
    inputType: 'input',
    required: true,
    hidden: formValues?.designation !== 'OTHER',
    md: 24,
    xs: 24,
  },
  ...mandalField(mandals),
  phoneNumber: {
    ...commonForm.phoneNumber,
    required: true,
  },
  emailId: {
    ...commonForm.emailId,
    addMore: false,
    required: true,
  },
  username: {
    ...commonWithUserNamePassword.username,
  },
  password: {
    ...commonWithUserNamePassword.password,
  },
})

const mandalSpecialOfficerForm = mandals => ({
  profile: addUserForm.profile,
  lastName: addUserForm.lastName,
  designation: {
    ...addUserForm.designation,
    // initialValue: mandalSpecialOfficerDesignation,
    // disabled: true,
  },
  ...mandalField(mandals),
  phoneNumber: {
    ...commonForm.phoneNumber,
    required: true,
  },
  emailId: {
    ...commonForm.emailId,
    addMore: false,
    required: true,
  },
  username: {
    ...commonWithUserNamePassword.username,
  },
  password: {
    ...commonWithUserNamePassword.password,
  },
})

const hostelForm = (t, formValues, mandals) => ({
  lastName: addUserForm.lastName,
  departmentName: {
    label: 'hostel_DepartmentUnit',
    validateTrigger: 'onChange',
    inputType: 'select',
    required: true,
    options: hostelDepartmentOptions.map(v => ({ label: t(v), value: t(v) })),
    md: 24,
    xs: 24,
  },
  customDepartmentName: {
    label: 'user_OtherDepartment',
    validateTrigger: 'onChange',
    inputType: 'input',
    required: true,
    hidden: formValues?.departmentName !== 'OTHER',
    md: 24,
    xs: 24,
  },
  typeOfHostel: {
    label: 'hostel_TypeOfHostel',
    validateTrigger: 'onChange',
    inputType: 'select',
    required: true,
    options: hostelTypeOptions.map(({ label, value }) => ({
      label: t(label),
      value,
    })),
    md: 24,
    xs: 24,
  },
  ...mandalField(mandals),
  address: {
    ...commonForm.address,
    required: true,
  },
  state: {
    ...commonForm.state,
    required: true,
  },
  pincode: {
    ...commonForm.pincode,
    required: true,
    md: 12,
  },
  phoneNumber: {
    ...commonForm.phoneNumber,
  },
  inchargeName: {
    ...commonWithUserNamePassword.inchargeName,
  },
})
const addBuildingForm = {
  name: {
    label: 'user_Name',
    validateTrigger: 'onChange',
    inputType: 'input',
    md: 24,
    xs: 24,
  },
  ...commonForm,
}

const { ...userFormFields } = addUserForm
const { businessName, ...childUserFormFields } = userFormFields

const districtCollectorForm = Object.entries(childUserFormFields).reduce(
  (fields, [key, attributes]) => ({
    ...fields,
    ...(key === 'city'
      ? {
          district: {
            label: 'user_District',
            validateTrigger: 'onChange',
            inputType: 'input',
            required: true,
            disabled: true,
            md: 8,
            xs: 24,
          },
        }
      : {}),
    [key]: ['city', 'state'].includes(key)
      ? { ...attributes, md: 8 }
      : attributes,
  }),
  {},
)

const userFormByRoleId = (t, formValues, mandals = []) => {
  return {
    [districtCollector]: districtCollectorForm,
    [inspectionOfficer]: inspectionOfficerForm(t, formValues, mandals),
    [mandalSpecialOfficer]: mandalSpecialOfficerForm(mandals),
    [hostel]: hostelForm(t, formValues, mandals),
  }
}

const RATING_LENGTH = 5

const countriesList = {
  India: 'in',
  Japan: 'jp',
  China: 'cn',
  NewZealand: 'nz',
  'United States': 'us',
  Canada: 'ca',
  Thailand: 'th',
}

export {
  RATING_LENGTH,
  roleIdByPath,
  userTranslationKey,
  addBuildingForm,
  userRelationKey,
  associateKey,
  userFormByRoleId,
  userFormFields,
  childUserFormFields,
  countriesList,
  hostelDepartmentOptions,
  hostelTypeOptions,
  inspectionOfficerDesignationOptions,
  mandalSpecialOfficerDesignation,
}
