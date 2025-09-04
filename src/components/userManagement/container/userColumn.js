import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import { addressFormat } from '../../../utils'
import { childUsers } from '../../../utils/constant'
import { dateFormat } from '../../../utils/dateFormat'
import { noImage } from '../../../utils/icons'
import { include, ternary } from '../../../utils/javascript'

const userColumns = ({
  permission,
  handleView,
  selectedUsers,
  handleSelectChange,
  handleDAssociate,
  roleId,
  handleEdit,
  isBuilding,
  removeEditBtn,
}) => {
  const { t } = useTranslations()

  const isChildUser = include(childUsers, roleId)

  const actionButtons = rowData => (
    <div className="flex-nowrap d-flex">
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
      title: t('txt_Action'),
      key: 'txt_Action',
      render: rowData => {
        return <>{actionButtons(rowData)}</>
      },
    },
  ]

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

  return { column, actionButtons, cardViewFn }
}

export default userColumns
