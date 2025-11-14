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
}

const {
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  inspectionOfficer,
  hostel,
} = userWiseRole

const userTranslationKey = {
  [admin]: 'user_Admin',
  [stateHostelDepartment]: 'user_StateHostelDepartment',
  [stateAdminOfficer]: 'user_StateAdminOfficer',
  [districtCollector]: 'user_DistrictCollector',
  [inspectionOfficer]: 'user_InspectionOfficer',
  [hostel]: 'user_Hostel',
}

const roleIdByPath = {
  [ADMIN]: admin,
  [STATE_HOSTEL_DEPARTMENT]: stateHostelDepartment,
  [STATE_ADMIN_OFFICER]: stateAdminOfficer,
  [DISTRICT_COLLECTOR]: districtCollector,
  [INSPECTION_OFFICER]: inspectionOfficer,
  [HOSTEL]: hostel,
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

const userFormByRoleId = {}

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
}
