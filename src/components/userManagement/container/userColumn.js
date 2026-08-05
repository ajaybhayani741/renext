import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import { addressFormat } from '../../../utils'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { dateFormat } from '../../../utils/dateFormat'
import { noImage } from '../../../utils/icons'
import {
  include,
  isEqual,
  length,
  notEqual,
  ternary,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import {
  hostelTypeOptions,
  inspectionOfficerMandalOptions,
} from '../user.description'
// import { getItem } from '../../../utils/localstorage'

const userColumns = ({
  showAssignHostel,
  permission,
  handleView,
  selectedUsers,
  handleSelectChange,
  roleId,
  handleEdit,
  isBuilding,
  removeEditBtn,
  handleAssignHostel,
  handleAssignInspectionOfficer,
  handleAssignToSelf,
  showAssignInspectionOfficer,
  columnFilter,
  userKey,
}) => {
  const { t } = useTranslations()
  const userData = JSON.parse(getItem('userData') || '{}')
  const { roleId: loginUserRoleId } = userData

  const isChildUser = include(childUsers, roleId)
  const { inspectionOfficer, hostel, mandalSpecialOfficer } = userWiseRole
  const showAssignHostelAction =
    showAssignHostel &&
    isEqual(roleId, inspectionOfficer) &&
    isEqual(loginUserRoleId, mandalSpecialOfficer)

  const actionButtons = rowData => (
    <div className="card-extra-buttons">
      {showAssignInspectionOfficer && (
        <>
          <ANTDButton
            className="bg-assign-hostel"
            onClick={() => handleAssignInspectionOfficer({ rowData })}
          >
            {t('user_AssignInspectionOfficer')}
          </ANTDButton>
          <ANTDButton
            className="bg-assign-hostel-random"
            onClick={() => handleAssignToSelf({ rowData })}
          >
            {t('user_AssignToSelf')}
          </ANTDButton>
        </>
      )}
      {showAssignHostelAction && (
        <ANTDButton
          className="bg-assign-hostel"
          onClick={() => handleAssignHostel({ rowData, roleId: hostel })}
        >
          {t('user_AssignHostelRandomly')}
        </ANTDButton>
      )}
      <ANTDButton className="bg-view" onClick={() => handleView(rowData)}>
        {t('btn_View')}
      </ANTDButton>
      {!removeEditBtn && (permission || isBuilding) && (
        <ANTDButton className="bg-edit" onClick={() => handleEdit(rowData)}>
          {t('btn_Edit')}
        </ANTDButton>
      )}
    </div>
  )

  const column = [
    {
      title: null,
      key: 'select',
      width: 60,
      fixed: 'left',
      className: 'select-column',
      render: rowData => {
        const usersList = selectedUsers?.map(v => v?.id)
        return (
          <ANTDCheckbox
            value={rowData}
            onChange={handleSelectChange}
            checked={include(usersList, rowData?.id)}
          />
        )
      },
      hidden: !handleSelectChange,
    },
    // {
    //   title: t('user_ID'),
    //   dataIndex: 'id',
    //   key: 'user_ID',
    //   hidden: include([inspectionOfficer, hostel, mandalSpecialOfficer, districtCollector], roleId),
    // },
    {
      title: t('user_Image'),
      dataIndex: 'profile',
      className: 'img-td',
      key: 'user_Image',
      render: rowData => {
        return (
          <div className="small-img-wrap">
            <img
              src={rowData?.fileUrl || noImage}
              alt="profile"
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
        )
      },
      hidden: isBuilding,
    },
    {
      title: t('user_BusinessName'),
      dataIndex: 'businessName',
      key: 'user_BusinessName',
      className: 'business-name',
      render: rowData => {
        return rowData || '-'
      },
      hidden: isChildUser,
    },
    {
      title: t('user_Name'),
      key: 'user_Name',
      render: rowData => {
        return isBuilding ? rowData?.name : rowData?.lastName
      },
    },
    {
      title: t('mso_Mandal'),
      key: 'mso_Mandal',
      render: rowData => {
        return (
          inspectionOfficerMandalOptions.find(
            option => option.value === rowData?.mandal,
          )?.label ??
          rowData?.mandal ??
          '-'
        )
      },
      hidden: !include(
        [inspectionOfficer, hostel, mandalSpecialOfficer],
        roleId,
      ),
    },
    {
      title: t('hostel_TypeOfHostel'),
      dataIndex: 'typeOfHostel',
      key: 'hostel_TypeOfHostel',
      render: rowData => {
        const typeLabel =
          hostelTypeOptions.find(option => option.value === rowData)?.label ||
          rowData
        return typeLabel ? t(typeLabel) : '-'
      },
      hidden: notEqual(roleId, hostel),
    },
    {
      title: t('hostel_DepartmentUnit'),
      dataIndex: 'departmentName',
      key: 'hostel_DepartmentUnit',
      render: rowData => rowData || '-',
      hidden: notEqual(roleId, hostel),
    },
    {
      title: t('user_Designation'),
      key: 'designation',
      dataIndex: 'designation',
      render: rowData => rowData || '-',
      hidden: !include([inspectionOfficer, mandalSpecialOfficer], roleId),
    },
    {
      title: t('user_Email'),
      dataIndex: 'emailId',
      key: 'user_Email',
      render: rowData => rowData || '-',
      hidden: include(
        [inspectionOfficer, hostel, mandalSpecialOfficer],
        roleId,
      ),
    },
    {
      title: t('user_Contact'),
      dataIndex: 'phoneNumber',
      key: 'user_Contact',
      render: rowData => <div className="w-nowrap">{rowData || '-'}</div>,
    },
    {
      title: t('user_Address'),
      key: 'user_Address',
      width: '250px',
      className: 'address',
      render: rowData => {
        return addressFormat(rowData)
      },
      hidden: include([inspectionOfficer, mandalSpecialOfficer], roleId),
    },
    {
      title: t('user_DOJ'),
      dataIndex: 'creationDate',
      key: 'user_DOJ',
      render: rowData => {
        const { newDate } = rowData ? dateFormat(rowData) : {}
        return <>{newDate ? newDate : '-'}</>
      },
      hidden: include(
        [inspectionOfficer, hostel, mandalSpecialOfficer],
        roleId,
      ),
    },
    {
      title: t('user_LastInspectionDate'),
      dataIndex: 'lastInspectionDate',
      key: 'user_LastInspectionDate',
      render: rowData => rowData || '-',
      hidden: notEqual(roleId, hostel),
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: 170,
      className: 'action-column',
      fixed: 'right',
      render: rowData => {
        return <>{actionButtons(rowData)}</>
      },
      hidden: isEqual(userKey, 'user_AssignedHostelsForInspection'),
    },
  ]

  const mandalSpecialOfficerColumnOrder = [
    'user_Name',
    'designation',
    'mso_Mandal',
    'user_Contact',
    'txt_Action',
  ]

  const inspectionOfficerColumnOrder = [
    'user_Name',
    'designation',
    'mso_Mandal',
    'user_Contact',
    'txt_Action',
  ]

  const hostelColumnOrder = [
    'user_Name',
    'mso_Mandal',
    'hostel_TypeOfHostel',
    'hostel_DepartmentUnit',
    'user_LastInspectionDate',
    'txt_Action',
  ]

  const roleColumnOrder = isEqual(roleId, mandalSpecialOfficer)
    ? mandalSpecialOfficerColumnOrder
    : isEqual(roleId, inspectionOfficer)
      ? inspectionOfficerColumnOrder
      : isEqual(roleId, hostel)
        ? hostelColumnOrder
        : null

  const filteredColumn = length(columnFilter)
    ? columnFilter
        .map(filterKey => column.find(item => item.key === filterKey))
        .filter(Boolean)
    : roleColumnOrder
      ? roleColumnOrder
          .map(filterKey => column.find(item => item.key === filterKey))
          .filter(Boolean)
      : column

  const cardViewFn = ({
    lastName,
    emailId,
    phoneNumber,
    creationDate,
    businessName,
    employeeId,
    companyCode,
    storeCode,
    designation = '',
    ...user
  }) =>
    [
      {
        label: 'user_BusinessName',
        value: businessName,
        hidden: isChildUser,
      },
      { label: 'user_Name', value: lastName },
      {
        label: 'user_Designation',
        value: designation,
        hidden: !include([inspectionOfficer, mandalSpecialOfficer], roleId),
      },
      {
        label: 'user_Email',
        value: emailId,
        hidden: include(
          [inspectionOfficer, hostel, mandalSpecialOfficer],
          roleId,
        ),
      },
      { label: 'user_Contact', value: phoneNumber },
      {
        label: 'user_Address',
        value: addressFormat(user),
        hidden: include([inspectionOfficer, mandalSpecialOfficer], roleId),
      },
      {
        label: 'user_DOJ',
        value: ternary(creationDate, dateFormat(creationDate)?.dmyDate, null),
        hidden: include(
          [inspectionOfficer, hostel, mandalSpecialOfficer],
          roleId,
        ),
      },
    ].filter(item => !item.hidden)

  return { column: filteredColumn, actionButtons, cardViewFn }
}

export default userColumns
