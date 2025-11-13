import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { USER_TXT } from '../../../routing/pathName.constant'
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
  handleAssignInspectionOfficerRandomly,
  showAssignInspectionOfficer,
  columnFilter,
}) => {
  const { t } = useTranslations()
  const { location } = useRouter()
  const userData = JSON.parse(getItem('userData'))
  const { roleId: loginUserRoleId } = { ...userData }

  const isChildUser = include(childUsers, roleId)
  const { inspectionOfficer, hostel, districtCollector } = userWiseRole
  const actionButtons = rowData => (
    <div
      className={showAssignInspectionOfficer ? 'py-5' : 'flex-nowrap d-flex'}
    >
      {showAssignInspectionOfficer && (
        <>
          <ANTDButton
            className="bg-assign-hostel-random"
            onClick={() => handleAssignInspectionOfficerRandomly({ rowData })}
          >
            {t('user_AssignInspectionOfficerRandomly')}
          </ANTDButton>
          <div className="mb-5" />
          <ANTDButton
            className="bg-assign-hostel"
            onClick={() => handleAssignInspectionOfficer({ rowData })}
          >
            {t('user_AssignInspectionOfficer')}
          </ANTDButton>
        </>
      )}
      {include(location.pathname, USER_TXT) &&
        include([inspectionOfficer], roleId) &&
        isEqual(loginUserRoleId, districtCollector) &&
        showAssignHostel && (
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
    {
      title: t('user_ID'),
      dataIndex: 'id',
      key: 'user_ID',
      hidden: include([inspectionOfficer, hostel], roleId),
    },
    {
      title: t('user_Image'),
      dataIndex: 'profile',
      className: 'img-td',
      key: 'user_Image',
      render: rowData => {
        return (
          <div className="small-img-wrap">
            <img src={rowData?.fileUrl || noImage} alt={'pic'} />
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
      title: t('user_Designation'),
      key: 'designation',
      dataIndex: 'designation',
      render: rowData => rowData || '-',
      hidden: notEqual(roleId, inspectionOfficer),
    },
    {
      title: t('user_Email'),
      dataIndex: 'emailId',
      key: 'user_Email',
      render: rowData => rowData || '-',
      hidden: isEqual(roleId, inspectionOfficer),
    },
    {
      title: t('user_Contact'),
      dataIndex: 'phoneNumber',
      key: 'user_Contact',
      render: rowData => <div className="w-nowrap">{rowData || '-'}</div>,
    },
    {
      title: isEqual(roleId, inspectionOfficer)
        ? t('user_PlaceOfPosting')
        : t('user_Address'),
      key: 'user_Address',
      width: '250px',
      className: 'address',
      render: rowData => {
        return addressFormat(rowData)
      },
    },
    {
      title: t('user_DOJ'),
      dataIndex: 'creationDate',
      key: 'user_DOJ',
      render: rowData => {
        const { newDate } = rowData ? dateFormat(rowData) : {}
        return <>{newDate ? newDate : '-'}</>
      },
      hidden: include([inspectionOfficer, hostel], roleId),
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
      fixed: 'right',
      render: rowData => {
        return <>{actionButtons(rowData)}</>
      },
    },
  ]

  const filteredColumn = length(columnFilter)
    ? columnFilter
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
        hidden: notEqual(roleId, inspectionOfficer),
      },
      {
        label: 'user_Email',
        value: emailId,
        hidden: isEqual(roleId, inspectionOfficer),
      },
      { label: 'user_Contact', value: phoneNumber },
      {
        label: isEqual(roleId, inspectionOfficer)
          ? 'user_PlaceOfPosting'
          : 'user_Address',
        value: addressFormat(user),
      },
      {
        label: 'user_DOJ',
        value: ternary(creationDate, dateFormat(creationDate)?.newDate, null),
        hidden: isEqual(roleId, inspectionOfficer),
      },
    ].filter(item => !item.hidden)

  return { column: filteredColumn, actionButtons, cardViewFn }
}

export default userColumns
