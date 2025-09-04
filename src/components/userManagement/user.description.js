import {
  cityOptions,
  countryOptions,
  pincodeOptions,
  stateOptions,
} from './addressData'
import {
  ADMIN,
  STATE_HOSTEL_DEPARTMENT,
  STATE_ADMIN_OFFICER,
  DISTRICT_COLLECTOR,
  DISTRICT_COLLECTOR_ADMIN,
  DISTRICT_HOSTEL_DEPARTMENT,
  DISTRICT_ADMIN_OFFICER,
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
  user_DistrictHostelDepartment: 'user_AssociatedDistrictHostelDepartment',
  user_DistrictCollector: 'user_AssociatedDistrictCollector',
}

const {
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  districtCollectorAdmin,
  districtHostelDepartment,
  districtAdminOfficer,
  inspectionOfficer,
  hostel,
} = userWiseRole

const userTranslationKey = {
  [admin]: 'user_Admin',
  [stateHostelDepartment]: 'user_StateHostelDepartment',
  [stateAdminOfficer]: 'user_StateAdminOfficer',
  [districtCollector]: 'user_DistrictCollector',
  [districtCollectorAdmin]: 'user_DistrictCollectorAdmin',
  [districtHostelDepartment]: 'user_DistrictHostelDepartment',
  [districtAdminOfficer]: 'user_DistrictAdminOfficer',
  [inspectionOfficer]: 'user_InspectionOfficer',
  [hostel]: 'user_Hostel',
}

const roleIdByPath = {
  [ADMIN]: admin,
  [STATE_HOSTEL_DEPARTMENT]: stateHostelDepartment,
  [STATE_ADMIN_OFFICER]: stateAdminOfficer,
  [DISTRICT_COLLECTOR]: districtCollector,
  [DISTRICT_COLLECTOR_ADMIN]: districtCollectorAdmin,
  [DISTRICT_HOSTEL_DEPARTMENT]: districtHostelDepartment,
  [DISTRICT_ADMIN_OFFICER]: districtAdminOfficer,
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
    inputType: 'select',
    options: cityOptions,
    required: true,
    md: 12,
    xs: 24,
    disabled: true,
  },
  state: {
    label: 'user_State',
    validateTrigger: 'onChange',
    inputType: 'select',
    required: true,
    md: 12,
    xs: 24,
    options: stateOptions,
    disabled: true,
  },
  country: {
    label: 'txt_Country',
    validateTrigger: 'onChange',
    inputType: 'select',
    disabled: true,
    required: true,
    options: countryOptions,
    md: 24,
    xs: 24,
  },
  pincode: {
    label: 'user_Pincode',
    validateTrigger: 'onChange',
    inputType: 'select',
    options: pincodeOptions,
    className: 'show-clear-icon',
    required: true,
    allowClear: true,
    md: 24,
    xs: 24,
    disabled: true,
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
}
