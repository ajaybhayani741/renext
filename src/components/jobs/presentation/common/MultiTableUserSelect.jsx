import { useState } from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import { userWiseRole } from '../../../../utils/constant'
import { isEqual, notEqual, ternary } from '../../../../utils/javascript'
import UserTable from '../../../userManagement/presentation/UserTable'

const MultiTableUserSelect = ({
  dataList,
  roleId,
  userId,
  multiSelect,
  preSelectedUser,
  selectedCustomer,
  onSelectConfirm,
  setBuildingInfo,
  removeEditBtn,
  searchByEmail,
  showAdd,
}) => {
  const { t } = useTranslations()
  const [selectedUsers, setSelectedUsers] = useState([])

  const { site } = userWiseRole

  const controlledSelectChange = e => {
    const { checked, value } = e.target
    let tempList = [...selectedUsers]
    if (checked) {
      tempList = ternary(multiSelect, [...tempList, value], [value])
    } else {
      tempList = tempList.filter(v => notEqual(v?.id, value?.id))
    }
    setSelectedUsers(tempList)
  }

  const disableRowFn = record => {
    const isAlreadySelected = preSelectedUser?.[roleId]?.some(user =>
      isEqual(user?.id, record?.id),
    )
    return ternary(isAlreadySelected, 'disabled-row ', '')
  }

  return (
    <>
      <div className="d-flex space-between">
        <ANTDButton
          className="btn mb-10"
          type="primary"
          onClick={() => onSelectConfirm(selectedUsers)}
        >
          {t('msg_OK')}
        </ANTDButton>
        {showAdd && (
          <ANTDButton
            className="btn"
            type="primary"
            onClick={() =>
              setBuildingInfo({ flag: true, data: { roleId: roleId } })
            }
          >
            {`${t('btn_Add')} +`}
          </ANTDButton>
        )}
      </div>
      {dataList?.map((props, i) => (
        <UserTable
          key={i}
          {...{
            isSearch: true,
            permission: false,
            payload: {
              ...ternary(
                isEqual(roleId, site),
                {
                  customerId: selectedCustomer?.[0]?.id,
                },
                { roleId },
              ),
              relationType: props?.type,
              userId,
            },
            rowClassNameFn: disableRowFn,
            isBuilding: isEqual(roleId, site),
            customerInfo: selectedCustomer?.[0],
            onSelect: controlledSelectChange,
            selectedList: selectedUsers,
            removeEditBtn,
            searchByEmail,
            ...props,
          }}
        />
      ))}
    </>
  )
}

export default MultiTableUserSelect
