import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { USER_TXT } from '../../../routing/pathName.constant'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import { addressFormat } from '../../../utils'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { dateFormat } from '../../../utils/dateFormat'
import { noImage } from '../../../utils/icons'
import { include, length, ternary } from '../../../utils/javascript'

const userColumns = ({
  showAssignHostel,
  permission,
  handleView,
  selectedUsers,
  handleSelectChange,
  handleDAssociate,
  roleId,
  handleEdit,
  isBuilding,
  removeEditBtn,
  handleAssignHostelConfirmation,
  handleAssignInspectionOfficer,
  showAssignInspectionOfficer,
  columnFilter,
}) => {
  const { t } = useTranslations()
  const { location } = useRouter()

  const isChildUser = include(childUsers, roleId)
  const { inspectionOfficer } = userWiseRole
  const actionButtons = rowData => (
    <div className="flex-nowrap d-flex">
      {showAssignInspectionOfficer && (
        <ANTDButton
          className="bg-assign-hostel"
          onClick={() => handleAssignInspectionOfficer({ rowData })}
        >
          {t('user_AssignInspectionOfficer')}
        </ANTDButton>
      )}
      {include(location.pathname, USER_TXT) &&
        include([inspectionOfficer], roleId) &&
        showAssignHostel && (
          <ANTDButton
            className="bg-assign-hostel"
            onClick={() => handleAssignHostelConfirmation({ rowData })}
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
      {handleDAssociate && !isBuilding && (
        <ANTDButton
          className="bg-danger"
          onClick={() => handleDAssociate(rowData)}
        >
          {t('btn_DisAssociate')}
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
      title: t('user_Email'),
      dataIndex: 'emailId',
      key: 'user_Email',
      render: rowData => rowData || '-',
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
    },
    {
      title: t('user_DOJ'),
      dataIndex: 'creationDate',
      key: 'user_DOJ',
      render: rowData => {
        const { newDate } = rowData ? dateFormat(rowData) : {}
        return <>{newDate ? newDate : '-'}</>
      },
    },
    {
      title: t('user_LastInspectionDate'),
      dataIndex: 'lastInspectionDate',
      key: 'user_LastInspectionDate',
      render: rowData => rowData || '-',
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
        label: 'user_Email',
        value: emailId,
      },
      { label: 'user_Contact', value: phoneNumber },
      {
        label: 'user_Address',
        value: addressFormat(user),
      },
      {
        label: 'user_DOJ',
        value: ternary(creationDate, dateFormat(creationDate)?.newDate, null),
      },
    ].filter(item => !item.hidden)

  return { column: filteredColumn, actionButtons, cardViewFn }
}

export default userColumns
