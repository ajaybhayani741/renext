import { addressFormat } from '../../../utils'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { entries, include, isEqual, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { userChildrenList } from '../../layout/sidebar.description'
import {
  hostelTypeOptions,
  inspectionOfficerMandalOptions,
} from '../user.description'

const viewUser = ({ userDetails }) => {
  const {
    businessName,
    emailId,
    phoneNumber,
    mandal,
    designation,
    roleId,
    lastName,
    name,
    parent,
    parentDetails,
    employeeId,
    companyCode,
    storeCode,
    departmentName,
    typeOfHostel,
  } = {
    ...userDetails,
  }
  const parentData = parent || parentDetails
  const mandalLabel =
    inspectionOfficerMandalOptions.find(option => option.value === mandal)
      ?.label || mandal
  const hostelTypeLabel =
    hostelTypeOptions.find(option => option.value === typeOfHostel)?.label ||
    typeOfHostel
  const currentUser = userChildrenList.find(val => isEqual(val.userId, roleId))
  const userListView = currentUser?.userView
  const loginUserRoleId = JSON.parse(getItem('userData'))?.roleId
  const {
    admin,
    storeOwner,
    store,
    storeManager,
    storeEmployee,
    vendor,
    manufacturer,
    customer,
    inspectionOfficer,
    mandalSpecialOfficer,
    hostel,
  } = userWiseRole
  const allUser = [
    admin,
    storeOwner,
    store,
    storeManager,
    storeEmployee,
    vendor,
    manufacturer,
    customer,
  ]

  const getEmailList = () => {
    const emailList = {}
    entries(userDetails).forEach(([key, value]) => {
      if (include(key, 'email') && value) {
        emailList[key] = value
      }
    })
    delete emailList.emailId
    return emailList
  }

  const basicInfoData = [
    // {
    //   label: 'user_ID',
    //   value: id,
    //   hidden: include([inspectionOfficer, hostel], loginUserRoleId),
    // },
    {
      label: isEqual(roleId, storeOwner)
        ? 'job_CompanyName'
        : 'user_BusinessName',
      value: businessName,
      hidden: include([...childUsers, storeEmployee], roleId) || !roleId,
    },
    {
      label: 'user_CompanyCode',
      value: companyCode,
      hidden: !include([storeOwner], roleId),
    },
    {
      label: 'user_EmployeeID',
      value: employeeId,
      hidden: !include([storeEmployee], roleId),
    },
    {
      label: 'user_StoreCode',
      value: storeCode,
      hidden: !include([store], roleId),
    },
    {
      label: 'user_Name',
      value: ternary(roleId, lastName, name),
      hidden: include([store], roleId),
    },
    ...(include([inspectionOfficer, mandalSpecialOfficer], roleId)
      ? [
          {
            label: 'user_Designation',
            value: designation,
          },
        ]
      : []),
    ...(include([inspectionOfficer, mandalSpecialOfficer, hostel], roleId)
      ? [
          {
            label: 'mso_Mandal',
            value: mandalLabel,
          },
        ]
      : []),
    ...(isEqual(roleId, hostel)
      ? [
          {
            label: 'hostel_TypeOfHostel',
            value: hostelTypeLabel,
            translateValue: true,
        },
         {
            label: 'hostel_DepartmentUnit',
            value: departmentName,
          },
        ]
      : []),
    {
      label: 'user_Email',
      value: emailId,
      type: 'email',
      hidden: include(
        [inspectionOfficer, mandalSpecialOfficer, hostel],
        roleId,
      ),
    },
    { label: 'user_Contact', value: phoneNumber },
    {
      label: 'user_Address',
      value: addressFormat(userDetails),
      hidden: include([inspectionOfficer, mandalSpecialOfficer], roleId),
      isBottomLine: true,
    },
  ]

  const parentInfoData = [
    { label: 'user_ID', value: parentData?.id },
    {
      label: 'user_BusinessName',
      value: parentData?.businessName,
    },
    { label: 'user_Name', value: parentData?.lastName },
    {
      label: 'user_Email',
      value: parentData?.emailId,
      type: 'email',
    },
    { label: 'user_Contact', value: parentData?.phoneNumber },
    {
      label: 'user_Address',
      value: addressFormat(parentData),
    },
  ]
  const otherDetail = [
    {
      label: 'user_DepartmentName',
      value: '',
      permission: allUser,
    },
    {
      label: 'user_InChargeName',
      value: '',
      className: 'border-bottom',
    },
  ]

  return {
    parentData,
    otherDetail,
    userListView,
    basicInfoData,
    parentInfoData,
    loginUserRoleId,
    getEmailList,
  }
}

export default viewUser



