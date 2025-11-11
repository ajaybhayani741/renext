import { addressFormat } from '../../../utils'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { entries, include, isEqual, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { userChildrenList } from '../../layout/sidebar.description'

const viewUser = ({ userDetails }) => {
  const {
    id,
    businessName,
    emailId,
    phoneNumber,
    roleId,
    lastName,
    name,
    parent,
    parentDetails,
    employeeId,
    companyCode,
    storeCode,
  } = {
    ...userDetails,
  }
  const parentData = parent || parentDetails
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
    {
      label: 'user_ID',
      value: id,
      hidden: include([inspectionOfficer, hostel], loginUserRoleId),
    },
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
    {
      label: 'user_Email',
      value: emailId,
      type: 'email',
    },
    { label: 'user_Contact', value: phoneNumber },
    {
      label: 'user_Address',
      value: addressFormat(userDetails),
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
