import {
  cityOptions,
  countryOptions,
  pincodeOptions,
  stateOptions,
} from './addressData'
import {
  ADMIN,
  STORE_OWNER,
  STORE_MANAGER,
  STORE_EMPLOYEE,
  VENDOR,
  CUSTOMER,
  MANUFACTURER,
  STORE,
} from '../../routing/pathName.constant'
import { userWiseRole } from '../../utils/constant'

const userRelationKey = {
  associate: 'ASSOCIATE',
  nonAssociate: 'NON_ASSOCIATE',
  childAssociate: 'CHILD_AND_ASSOCIATE',
}

const associateKey = {
  user_Customer: 'user_AssociatedCustomerList',
  user_Store: 'user_AssociatedStore',
  user_StoreManager: 'user_AssociatedStoreManager',
  user_StoreEmployee: 'user_AssociatedStoreEmployee',
  user_Vendor: 'user_AssociatedVendor',
}

const {
  admin,
  storeOwner,
  storeManager,
  storeEmployee,
  vendor,
  customer,
  manufacturer,
  store,
} = userWiseRole

const userTranslationKey = {
  [admin]: 'user_Admin',
  [customer]: 'user_Customer',
  [storeOwner]: 'user_StoreOwner',
  [storeManager]: 'user_StoreManager',
  [storeEmployee]: 'user_StoreEmployee',
  [vendor]: 'user_Vendor',
  [manufacturer]: 'user_Manufacturer',
  [store]: 'user_Store',
}

const roleIdByPath = {
  [ADMIN]: admin,
  [STORE_OWNER]: storeOwner,
  [STORE_MANAGER]: storeManager,
  [STORE_EMPLOYEE]: storeEmployee,
  [VENDOR]: vendor,
  [CUSTOMER]: customer,
  [MANUFACTURER]: manufacturer,
  [STORE]: store,
}

const addUserInitial = {
  businessName: '',
  lastName: '',
  pincode: null,
  country: '',
  state: '',
  city: '',
  address: '',
  emailId: '',
  emailId1: '',
  emailId2: '',
  emailId3: '',
  emailId4: '',
  emailId5: '',
  emailId6: '',
  emailId7: '',
  emailId8: '',
  emailId9: '',
  emailId10: '',
  phoneNumber: '',
  departmentName: '',
  inchargeName: '',
}

const addBuildingInitial = {
  name: '',
  pincode: null,
  country: '',
  state: '',
  city: '',
  address: '',
  emailId: '',
  emailId1: '',
  emailId2: '',
  emailId3: '',
  emailId4: '',
  emailId5: '',
  emailId6: '',
  emailId7: '',
  emailId8: '',
  emailId9: '',
  emailId10: '',
  phoneNumber: '',
}

const smeltingTypeOptions = [
  { value: 'Blast', label: 'Blast' },
  { value: 'EAF', label: 'EAF' },
  { value: 'IF', label: 'IF' },
]

const materialTypeOptions = [
  { label: 'job_Aluminium', value: 'Aluminium' },
  { label: 'job_Battery', value: 'Battery' },
  { label: 'inv_CastIron', value: 'Cast Iron' },
  { label: 'job_Copper', value: 'Copper' },
  { label: 'job_EWaste', value: 'E-Waste' },
  { label: 'job_Glass', value: 'Glass' },
  { label: 'job_Paper', value: 'Paper' },
  { label: 'job_Plastic', value: 'Plastic' },
  { label: 'job_Rubber', value: 'Rubber' },
  { label: 'job_Steel', value: 'Steel' },
  { label: 'job_Textile', value: 'Textile' },
  { label: 'job_UsedOil', value: 'Used Oil' },
]

const periodOptions = [
  { label: 'bkm_Weekly', value: 'Weekly' },
  { label: 'bkm_BiWeekly', value: 'Bi-weekly' },
  { label: 'bkm_Monthly', value: 'Monthly' },
  { label: 'bkm_Quarterly', value: 'Quarterly' },
  { label: 'bkm_Yearly', value: 'Yearly' },
]

const energyOptions = [
  {
    value: 'Combination of Fossil fuel and Renewable',
    label: 'Combination of Fossil fuel and Renewable',
  },
  { value: 'Fossil Fuel Only', label: 'Fossil Fuel Only' },
  { value: 'Hydrogen', label: 'Hydrogen' },
  { value: 'Renewable Only', label: 'Renewable Only' },
]

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

const getRefurbisherMachineFields = title => ({
  // title: 'user_SmeltingMachineDetails',
  title: title,
  child: {
    type: {
      label: 'user_Type',
      validateTrigger: 'onChange',
      inputType: 'select',
      required: true,
      options: smeltingTypeOptions,
      className: 'show-clear-icon',
      allowClear: true,
      md: 8,
      xs: 24,
    },
    energy: {
      label: 'user_Energy',
      validateTrigger: 'onChange',
      inputType: 'select',
      required: true,
      options: energyOptions,
      className: 'show-clear-icon',
      allowClear: true,
      md: 8,
      xs: 24,
    },
    capacity: {
      label: 'user_CapacityPerHit',
      validateTrigger: 'onChange',
      inputType: 'input',
      required: true,
      // options: energyOptions,
      className: 'show-clear-icon',
      allowClear: true,
      md: 8,
      xs: 24,
      divider: true,
    },
  },
})

const commonWithUserNamePassword = {
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

const { consumerType, ...userFormFields } = addUserForm
const { businessName, ...childUserFormFields } = userFormFields

const userFormByRoleId = {
  [customer]: addUserForm,
  [manufacturer]: {
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
    ...commonForm,
    inchargeName: {
      label: 'user_InChargeName',
      validateTrigger: 'onChange',
      inputType: 'input',
      md: 24,
      xs: 24,
    },
    modelNames: {
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
  },
  [storeOwner]: {
    profile: {
      validateTrigger: 'onChange',
      inputType: 'formUpload',
      uploadSingle: true,
      acceptFileTypes: '.png,.jpg,.jpeg,.webp',
    },
    businessName: {
      ...businessName,
      label: 'job_CompanyName',
    },
    companyCode: {
      label: 'user_CompanyCode',
      validateTrigger: 'onChange',
      inputType: 'input',
      md: 24,
      xs: 24,
      required: true,
      rules: [
        {
          max: 5,
          message: 'Maximum 5 characters allowed',
        },
      ],
    },
    ...childUserFormFields,
  },
  [store]: {
    profile: {
      validateTrigger: 'onChange',
      inputType: 'formUpload',
      uploadSingle: true,
      acceptFileTypes: '.png,.jpg,.jpeg,.webp',
    },
    businessName,
    storeCode: {
      label: 'user_StoreCode',
      validateTrigger: 'onChange',
      inputType: 'input',
      md: 24,
      xs: 24,
      required: true,
      rules: [
        {
          max: 5,
          message: 'Maximum 5 characters allowed',
        },
      ],
    },
    ...commonWithUserNamePassword,
  },
  [storeEmployee]: {
    profile: {
      validateTrigger: 'onChange',
      inputType: 'formUpload',
      uploadSingle: true,
      acceptFileTypes: '.png,.jpg,.jpeg,.webp',
    },
    employeeId: {
      label: 'user_EmployeeID',
      validateTrigger: 'onChange',
      inputType: 'input',
      md: 24,
      xs: 24,
      required: true,
      rules: [
        {
          max: 5,
          message: 'Maximum 5 characters allowed',
        },
      ],
    },
    ...childUserFormFields,
  },
}

//based on material selection
const refurbisherMachineTitle = {
  Steel: 'user_SteelMachineDetails',
  Rubber: 'user_RubberMachineDetails',
  Aluminium: 'user_AluminiumMachineDetails',
  Copper: 'user_CopperMachineDetails',
  Plastic: 'user_PlasticMachineDetails',
  Glass: 'user_GlassMachineDetails',
  Paper: 'user_PaperMachineDetails',
  Textile: 'user_TextileMachineDetails',
  'E-Waste': 'user_EWasteMachineDetails',
  Battery: 'user_BatteryMachineDetails',
  'Used Oil': 'user_UsedOilMachineDetails',
}

const fuelTypeOptions = [
  { label: 'ful_CNG', value: 'CNG' },
  { label: 'ful_Diesel', value: 'Diesel' },
  { label: 'ful_EV', value: 'EV' },
  { label: 'ful_Hybrid', value: 'Hybrid' },
  { label: 'ful_Petrol', value: 'Petrol' },
]

const RATING_LENGTH = 5

export {
  periodOptions,
  fuelTypeOptions,
  RATING_LENGTH,
  addUserInitial,
  roleIdByPath,
  userTranslationKey,
  addBuildingForm,
  addBuildingInitial,
  userRelationKey,
  associateKey,
  userFormByRoleId,
  userFormFields,
  childUserFormFields,
  materialTypeOptions,
  refurbisherMachineTitle,
  getRefurbisherMachineFields,
}
